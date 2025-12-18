from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.orm import Session
from sqlalchemy import and_
from .. import models, schemas
from ..database import get_db
import hashlib
from datetime import datetime, timedelta, timezone
import uuid

router = APIRouter(
    prefix="/api/events",
    tags=["events"],
)

@router.post("/action_click", status_code=204)
def track_click(
    event_data: schemas.ClickEventRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    # 1. Generate Fingerprint
    user_agent = request.headers.get("user-agent", "")
    ip = request.client.host
    fingerprint_raw = f"{ip}|{user_agent}"
    fingerprint_hash = hashlib.sha256(fingerprint_raw.encode()).hexdigest()

    # 2. Check for duplicates (25 seconds window)
    # Deduplication key: (fingerprint_hash + card_id + action_type)
    time_threshold = datetime.now(timezone.utc) - timedelta(seconds=25)
    
    existing_event = db.query(models.ClickEvent).filter(
        models.ClickEvent.fingerprint_hash == fingerprint_hash,
        models.ClickEvent.card_id == event_data.card_id,
        models.ClickEvent.action_type == event_data.action_type,
        models.ClickEvent.ts > time_threshold
    ).first()

    if existing_event:
        # Duplicate - ignore
        return Response(status_code=204)

    # 3. Fetch Card details to populate other fields
    card = db.query(models.Card).filter(models.Card.id == event_data.card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    # 4. Save Event
    new_event = models.ClickEvent(
        owner_id=card.owner_id,
        card_id=card.id,
        block_key=card.block_key,
        kind=card.kind,
        action_type=event_data.action_type,
        lang=event_data.lang,
        fingerprint_hash=fingerprint_hash
    )
    
    db.add(new_event)
    db.commit()
    
    return Response(status_code=204)
