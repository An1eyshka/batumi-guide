import uuid
from sqlalchemy import Column, String, Boolean, Integer, Text, ForeignKey, TIMESTAMP, CHAR, BigInteger
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class Owner(Base):
    __tablename__ = "owners"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug = Column(String, unique=True, index=True, nullable=False)
    display_name = Column(String, nullable=True)
    primary_language = Column(String(2), default="ru", nullable=False)
    contact_url = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)

    users = relationship("User", back_populates="owner")
    cards = relationship("Card", back_populates="owner")
    blocks = relationship("Block", back_populates="owner")

class Block(Base):
    __tablename__ = "blocks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("owners.id"), nullable=False)
    key = Column(String, nullable=False) # eat, city, nature, street
    sort_order = Column(Integer, default=0, nullable=False)
    
    title_ru = Column(String, nullable=True)
    title_en = Column(String, nullable=True)
    subtitle_ru = Column(String, nullable=True)
    subtitle_en = Column(String, nullable=True)

    owner = relationship("Owner", back_populates="blocks")

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("owners.id"), nullable=True)
    role = Column(String, nullable=False)  # 'owner' or 'superadmin'
    login = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    must_change_password = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
    last_login_at = Column(TIMESTAMP(timezone=True), nullable=True)

    owner = relationship("Owner", back_populates="users")

class Card(Base):
    __tablename__ = "cards"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("owners.id"), nullable=False)
    block_key = Column(String, nullable=False)  # 'eat', 'city', 'nature', 'street'
    sort_order = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    kind = Column(String, nullable=False)  # 'venue' or 'service'
    action_url = Column(Text, nullable=False)
    
    title_ru = Column(String, nullable=True)
    title_en = Column(String, nullable=True)
    type_ru = Column(String, nullable=True)
    type_en = Column(String, nullable=True)
    desc_ru = Column(Text, nullable=True)
    desc_en = Column(Text, nullable=True)
    
    img_dark_path = Column(Text, nullable=True)
    img_light_path = Column(Text, nullable=True)
    
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    owner = relationship("Owner", back_populates="cards")

class ClickEvent(Base):
    __tablename__ = "click_events"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("owners.id"), nullable=False)
    card_id = Column(UUID(as_uuid=True), ForeignKey("cards.id"), nullable=False)
    block_key = Column(String, nullable=False)
    kind = Column(String, nullable=False)
    action_type = Column(String, nullable=False)  # 'open_on_map' or 'contacts'
    lang = Column(String(2), nullable=True)
    fingerprint_hash = Column(CHAR(64), nullable=False)
    ts = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
