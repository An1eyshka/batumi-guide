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
    # MVP: Delete all and recreate? Or update in place?
    # Safer: Create new or update existing.
    # For MVP simplicity, let's assume we receive the full list of desired cards.
    # But dealing with IDs is tricky.
    
    # Let's just implement creating ONE card for now or bulk update if needed.
    # TS says: "PUT ... save all cards (mass save)"
    
    # 1. Remove existing cards for this owner (Simplest sync strategy)
    db.query(models.Card).filter(models.Card.owner_id == owner_id).delete()
    
    # 2. Add new cards
    new_cards = []
    for card_data in cards:
        db_card = models.Card(owner_id=owner_id, **card_data.dict())
        db.add(db_card)
        new_cards.append(db_card)
    
    db.commit()
    db.commit()
    return {"status": "ok", "count": len(new_cards)}

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
