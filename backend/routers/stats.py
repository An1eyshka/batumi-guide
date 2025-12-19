from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta, timezone
import csv
import io
from .. import database, models, schemas
import uuid
from . import auth

router = APIRouter(
    prefix="/api/admin",
    tags=["admin-stats"] 
)

def ensure_owner_access(owner_id: uuid.UUID, user: models.User):
    if user.role == "superadmin":
        return
    if not user.owner_id or str(user.owner_id) != str(owner_id):
        raise HTTPException(status_code=403, detail="Forbidden")

# ... imports ...

@router.get("/owners/{owner_id}/stats", response_model=schemas.StatsResponse)
def get_owner_stats(
    owner_id: uuid.UUID, 
    period: str = Query("all", enum=["7d", "30d", "all"]),
    db: Session = Depends(database.get_db),
    user: models.User = Depends(auth.get_current_user)
):
    ensure_owner_access(owner_id, user)
    query = db.query(models.ClickEvent).filter(models.ClickEvent.owner_id == owner_id)
    
    # Apply Time Filter
    if period == "7d":
        since = datetime.now(timezone.utc) - timedelta(days=7)
        query = query.filter(models.ClickEvent.ts >= since)
    elif period == "30d":
        since = datetime.now(timezone.utc) - timedelta(days=30)
        query = query.filter(models.ClickEvent.ts >= since)
        
    # 1. Total Clicks
    total_clicks = query.count()

    # 2. Top Cards (Aggregation)
    top_clicks = db.query(
        models.ClickEvent.card_id, 
        func.count(models.ClickEvent.id).label('count')
    ).filter(
        models.ClickEvent.owner_id == owner_id
    )
    
    if period == "7d":
        since = datetime.now(timezone.utc) - timedelta(days=7)
        top_clicks = top_clicks.filter(models.ClickEvent.ts >= since)
    elif period == "30d":
        since = datetime.now(timezone.utc) - timedelta(days=30)
        top_clicks = top_clicks.filter(models.ClickEvent.ts >= since)
        
    top_clicks = top_clicks.group_by(
        models.ClickEvent.card_id
    ).order_by(
        desc('count')
    ).limit(10).all()
    
    # 3. Enrich
    card_ids = [c.card_id for c in top_clicks]
    cards = db.query(models.Card).filter(models.Card.id.in_(card_ids)).all()
    card_map = {c.id: c for c in cards}
    
    top_cards_data = []
    for c_id, count in top_clicks:
        card = card_map.get(c_id)
        if card:
            top_cards_data.append(schemas.CardStats(
                card_id=c_id,
                title_ru=card.title_ru or "No Title",
                title_en=card.title_en,
                click_count=count
            ))
            
    return schemas.StatsResponse(
        total_clicks=total_clicks,
        top_cards=top_cards_data
    )

@router.get("/owners/{owner_id}/stats/export")
def export_owner_stats(
    owner_id: uuid.UUID,
    db: Session = Depends(database.get_db),
    user: models.User = Depends(auth.get_current_user)
):
    ensure_owner_access(owner_id, user)
    # Fetch all events (raw data for CSV)
    events = db.query(models.ClickEvent).filter(models.ClickEvent.owner_id == owner_id).order_by(models.ClickEvent.ts.desc()).all()
    
    # Fetch cards for titles
    cards = db.query(models.Card).filter(models.Card.owner_id == owner_id).all()
    card_map = {c.id: (c.title_ru or c.title_en or "Untitled") for c in cards}
    
    # Create CSV in memory
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Timestamp (UTC)", "Card Title", "Action Type", "Language", "IP Fingerprint"])
    
    for e in events:
        title = card_map.get(e.card_id, "Unknown Card")
        writer.writerow([e.ts, title, e.action_type, e.lang, e.fingerprint_hash])
        
    output.seek(0)
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=stats_export_{owner_id}.csv"}
    )
