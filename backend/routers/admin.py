from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from .. import database, models, schemas
from typing import List
import uuid
import shutil
import os

router = APIRouter(
    prefix="/api/admin",
    tags=["admin"] # Should require auth dependency
)

# --- Owners ---

@router.get("/owners", response_model=List[schemas.OwnerResponse])
def get_owners(db: Session = Depends(database.get_db)):
    # Validate SuperAdmin permission here
    return db.query(models.Owner).all()

@router.post("/owners", response_model=schemas.OwnerResponse)
def create_owner(owner: schemas.OwnerCreate, db: Session = Depends(database.get_db)):
    db_owner = models.Owner(**owner.dict())
    db.add(db_owner)
    db.commit()
    db.refresh(db_owner)
    return db_owner

# --- Cards ---

@router.get("/owners/{owner_id}/cards", response_model=List[schemas.CardResponse])
def get_owner_cards(owner_id: uuid.UUID, db: Session = Depends(database.get_db)):
    return db.query(models.Card).filter(models.Card.owner_id == owner_id).order_by(models.Card.sort_order).all()

@router.put("/owners/{owner_id}/cards")
def update_owner_cards(owner_id: uuid.UUID, cards: List[schemas.CardUpdate], db: Session = Depends(database.get_db)):
    # 1. Get existing cards to know what to update/delete
    existing_cards = db.query(models.Card).filter(models.Card.owner_id == owner_id).all()
    existing_map = {c.id: c for c in existing_cards}
    
    # Track IDs processed from the input list
    processed_ids = set()
    
    for card_data in cards:
        # If card has an ID and it exists in DB -> Update
        if card_data.id and card_data.id in existing_map:
            db_card = existing_map[card_data.id]
            # Update fields
            for field, value in card_data.dict(exclude={'id'}).items():
                setattr(db_card, field, value)
            processed_ids.add(card_data.id)
        else:
            # Create new card
            # (Remove id from dict if it's None to avoid issues, though Pydantic handles it)
            new_data = card_data.dict(exclude={'id'})
            db_card = models.Card(owner_id=owner_id, **new_data)
            db.add(db_card)
    
    # 3. Delete cards that were not in the input list
    start_delete = False
    for c in existing_cards:
        if c.id not in processed_ids:
            db.delete(c)
            
    db.commit()
    return {"status": "ok"}

# --- Blocks ---

@router.get("/owners/{owner_id}/blocks", response_model=List[schemas.BlockResponse])
def get_owner_blocks(owner_id: uuid.UUID, db: Session = Depends(database.get_db)):
    return db.query(models.Block).filter(models.Block.owner_id == owner_id).order_by(models.Block.sort_order).all()

@router.put("/owners/{owner_id}/blocks")
def update_owner_blocks(owner_id: uuid.UUID, blocks: List[schemas.BlockUpdate], db: Session = Depends(database.get_db)):
    # 1. Get existing
    existing = db.query(models.Block).filter(models.Block.owner_id == owner_id).all()
    existing_map = {b.key: b for b in existing}
    
    # 2. Update or Add
    for b_data in blocks:
        if b_data.key in existing_map:
            # Update
            db_block = existing_map[b_data.key]
            for field, value in b_data.dict().items():
                setattr(db_block, field, value)
        else:
            # Create (should handle default ID generation in DB or Pydantic)
            db_block = models.Block(owner_id=owner_id, **b_data.dict())
            db.add(db_block)
            
    db.commit()
    return {"status": "ok"}

# --- Uploads ---

@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    # 1. Validate file (size, extension)
    # 2. Save to /img/uploads/
    
    upload_dir = os.path.join("img", "uploads")
    os.makedirs(upload_dir, exist_ok=True)
    
    file_path = os.path.join(upload_dir, file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"url": f"img/uploads/{file.filename}"}
