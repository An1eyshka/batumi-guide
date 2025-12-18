from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

# --- Shared Models ---

class Translation(BaseModel):
    ru: Optional[str] = None
    en: Optional[str] = None

class ImageVariants(BaseModel):
    dark: Optional[str] = None
    light: Optional[str] = None

# --- Card Models ---

class CardBase(BaseModel):
    block_key: str
    sort_order: int = 0
    is_active: bool = True
    kind: str
    action_url: str
    
    title_ru: Optional[str] = None
    title_en: Optional[str] = None
    type_ru: Optional[str] = None
    type_en: Optional[str] = None
    desc_ru: Optional[str] = None
    desc_en: Optional[str] = None
    
    img_dark_path: Optional[str] = None
    img_light_path: Optional[str] = None

class CardCreate(CardBase):
    pass

class CardUpdate(CardBase):
    pass

class CardResponse(CardBase):
    id: UUID
    owner_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# --- Block Models ---

class BlockBase(BaseModel):
    key: str
    sort_order: int = 0
    title_ru: Optional[str] = None
    title_en: Optional[str] = None
    subtitle_ru: Optional[str] = None
    subtitle_en: Optional[str] = None

class BlockCreate(BlockBase):
    pass

class BlockUpdate(BlockBase):
    pass

class BlockResponse(BlockBase):
    id: UUID
    owner_id: UUID
    
    class Config:
        from_attributes = True

# --- Owner Models ---

class OwnerBase(BaseModel):
    slug: str
    display_name: Optional[str] = None
    primary_language: str = "ru"
    contact_url: Optional[str] = None
    is_active: bool = True

class OwnerCreate(OwnerBase):
    pass

class OwnerResponse(OwnerBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# --- Public API Response Models ---

class PublicCard(BaseModel):
    # Simplified model for frontend consumption
    id: UUID
    kind: str
    url: str # Maps to action_url
    title: Translation
    type: Translation
    desc: Translation
    tags: Optional[Translation] = None # tags handled as "type" or separate field? TS says type/desc/tags. 
    # NOTE: In DB we have type_ru/en. We will map this to 'tags' or 'type' in frontend. 
    # TS has 'type' AND 'tags' in json. DB schema has type_ru/en. Let's assume type -> type, and maybe we need to add tags to DB or map type to cards.type and something else to cards.tags. 
    # For MVP 1.5 let's map DB `type` -> Frontend `type`. Frontend `tags` might be merged or added to DB later. 
    # Let's stick to DB schema: type_ru/en. 
    
    image: Optional[ImageVariants] = None 

class PublicBlock(BaseModel):
    key: str
    title: Translation
    subtitle: Translation
    items: List[PublicCard]

class PublicRepository(BaseModel):
    meta: dict
    translations: dict
    blocks: List[PublicBlock]
    contact_url: Optional[str] = None
    primary_language: str

class ClickEventRequest(BaseModel):
    card_id: UUID
    action_type: str # 'open_on_map' or 'contacts'
    lang: Optional[str] = "ru"

# --- Stats Models ---

class CardStats(BaseModel):
    card_id: UUID
    title_ru: Optional[str]
    title_en: Optional[str]
    click_count: int

class StatsResponse(BaseModel):
    total_clicks: int
    top_cards: List[CardStats]
