from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from .. import database, models, schemas
import uuid

router = APIRouter(
    prefix="/api/admin",
    tags=["admin-stats"] 
)

@router.get("/owners/{owner_id}/stats", response_model=schemas.StatsResponse)
def get_owner_stats(owner_id: uuid.UUID, db: Session = Depends(database.get_db)):
    # 1. Total Clicks
    total_clicks = db.query(models.ClickEvent).filter(models.ClickEvent.owner_id == owner_id).count()

    # 2. Top Cards (Aggregation)
    # SELECT card_id, COUNT(*) as count FROM click_events WHERE owner_id=... GROUP BY card_id ORDER BY count DESC LIMIT 10
    top_clicks = db.query(
        models.ClickEvent.card_id, 
        func.count(models.ClickEvent.id).label('count')
    ).filter(
        models.ClickEvent.owner_id == owner_id
    ).group_by(
        models.ClickEvent.card_id
    ).order_by(
        desc('count')
    ).limit(10).all()
    
    # 3. Enrich with Card Details (Title)
    # We could do a JOIN, but for MVP it's okay to query cards or map them.
    # Let's map IDs to Titles.
    
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
