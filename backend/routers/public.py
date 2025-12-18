from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import database, models, schemas
from typing import List

router = APIRouter(
    prefix="/api/public",
    tags=["public"]
)

@router.get("/{slug}", response_model=schemas.PublicRepository)
def get_public_repository(slug: str, lang: str = "ru", db: Session = Depends(database.get_db)):
    owner = db.query(models.Owner).filter(models.Owner.slug == slug, models.Owner.is_active == True).first()
    if not owner:
        raise HTTPException(status_code=404, detail="Owner not found")

    # Fetch cards
    cards = db.query(models.Card).filter(models.Card.owner_id == owner.id, models.Card.is_active == True).order_by(models.Card.sort_order).all()
    
    # Fetch blocks from DB
    blocks_db = db.query(models.Block).filter(models.Block.owner_id == owner.id).order_by(models.Block.sort_order).all()

    output_blocks = []
    
    # helper to process cards by block
    cards_by_block = {}
    for card in cards:
        if card.block_key not in cards_by_block:
            cards_by_block[card.block_key] = []
        cards_by_block[card.block_key].append(card)

    for block in blocks_db:
        # Get cards for this block key
        block_cards = cards_by_block.get(block.key, [])
        # Provide items even if empty (frontend handles it?) 
        # Actually user said "4 block disappeared". If it's empty, and we loop over blocks, it will appear now.

        items = []
        for c in block_cards:
            img_variants = schemas.ImageVariants(dark=c.img_dark_path, light=c.img_light_path)
            
            items.append(schemas.PublicCard(
                id=c.id,
                kind=c.kind,
                url=c.action_url,
                title=schemas.Translation(ru=c.title_ru, en=c.title_en),
                type=schemas.Translation(ru=c.type_ru, en=c.type_en),
                desc=schemas.Translation(ru=c.desc_ru, en=c.desc_en),
                image=img_variants
            ))

        output_blocks.append(schemas.PublicBlock(
            key=block.key,
            title=schemas.Translation(ru=block.title_ru, en=block.title_en),
            subtitle=schemas.Translation(ru=block.subtitle_ru, en=block.subtitle_en),
            items=items
        ))

    return schemas.PublicRepository(
        meta={"title": "Our Places in Batumi", "description": "Guide"},
        translations={
            "en": {"contact_us": "Contact us", "open_map": "Open on map", "contacts": "Contacts", "switch_theme": "Switch theme", "switch_lang": "Switch language"},
            "ru": {"contact_us": "Связаться", "open_map": "Открыть на карте", "contacts": "Контакты", "switch_theme": "Сменить тему", "switch_lang": "Сменить язык"}
        },
        blocks=output_blocks,
        contact_url=owner.contact_url,
        primary_language=owner.primary_language
    )
