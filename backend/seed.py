from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from . import models
from .routers.auth import get_password_hash

# Create tables if they don't exist (Quick MVP way)
models.Base.metadata.create_all(bind=engine)

def seed():
    db = SessionLocal()
    try:
        # Check if we already have data
        if db.query(models.Owner).count() > 0:
            print("Database already contains data. Skipping seed.")
            return

        print("Seeding database...")

        # 1. Create Owner
        owner = models.Owner(
            slug="batumi-guide",
            display_name="Batumi Guide Owner",
            primary_language="ru",
            contact_url="https://www.instagram.com/happyrent_batumi/"
        )
        db.add(owner)
        db.flush() # get ID

        # 2. Create User (Admin)
        # In real app: hash password!
        # For MVP/Local: storing plain or simple hash. 
        # Using simple string for now as per auth.py mock
        user = models.User(
            owner_id=owner.id,
            role="owner",
            login=owner.slug,
            password_hash=get_password_hash(f"{owner.slug}123"), # HASHED!
            must_change_password=True
        )
        db.add(user)

        # 2. Create Super Admin User
        admin_user = db.query(models.User).filter(models.User.login == "admin").first()
        if not admin_user:
            print("Creating admin user...")
            admin_user = models.User(
                role="superadmin",
                login="admin",
                password_hash=get_password_hash("admin123") # HASHED!
            )
            db.add(admin_user)

        # 2.5 Create Blocks
        blocks_data = [
             {"key": "eat", "sort_order": 0, 
              "title_en": "Cafes and Restaurants", "title_ru": "Где поесть", 
              "subtitle_en": "Our favorite places", "subtitle_ru": "Любимые места"},
             {"key": "city", "sort_order": 1, 
              "title_en": "In the city", "title_ru": "В городе", 
              "subtitle_en": "Walks and views", "subtitle_ru": "Прогулки и виды"},
             {"key": "nature", "sort_order": 2, 
              "title_en": "Nature / Trips", "title_ru": "Природа / Поездки", 
              "subtitle_en": "Day trips", "subtitle_ru": "Выезды на природу"},
             {"key": "street", "sort_order": 3, 
              "title_en": "What to buy", "title_ru": "Что купить", 
              "subtitle_en": "Local snacks", "subtitle_ru": "Уличные снеки"}
        ]
        
        for b_data in blocks_data:
            block = models.Block(owner_id=owner.id, **b_data)
            db.add(block)
        
        db.flush()
        cards_data = [
            # EAT
            {
                "block_key": "eat", "kind": "venue", "action_url": "https://www.google.com/maps/place/Old+Ambari/...",
                "title_en": "Old Ambari", "title_ru": "Old Ambari",
                "type_en": "Restaurant", "type_ru": "Ресторан",
                "desc_en": "Our first Batumi restaurant - still our go-to spot...", "desc_ru": "Наш первый ресторан в Батуми — и до сих пор любимый...",
                "img_dark_path": "img/oldambari-night.png", "img_light_path": "img/oldambari-light.png"
            },
            {
                "block_key": "eat", "kind": "venue", "action_url": "https://www.google.com/maps/place/Tavaduri/...",
                "title_en": "Tavaduri", "title_ru": "Tavaduri",
                "type_en": "Restaurant", "type_ru": "Ресторан",
                "desc_en": "When our mom wants great food...", "desc_ru": "Когда мама хочет вкусно поесть...",
                "img_dark_path": "img/tavaduri-night.png", "img_light_path": None
            },
            {
                "block_key": "eat", "kind": "venue", "action_url": "https://www.google.com/maps/place/Tokyo+House/...",
                "title_en": "Tokyo House", "title_ru": "Tokyo House",
                "type_en": "Restaurant", "type_ru": "Ресторан",
                "desc_en": "We finally found the best sushi...", "desc_ru": "Лучшие суши и роллы...",
                "img_dark_path": "img/tokyohouse-night.png", "img_light_path": None
            },
            {
                "block_key": "eat", "kind": "venue", "action_url": "https://www.google.com/maps/place/Gorki's+Shawarma/...",
                "title_en": "Gorki's Shawarma", "title_ru": "Шаурма у Горького",
                "type_en": "Shawarma", "type_ru": "Шаурма",
                "desc_en": "In our opinion, one of the best shawarmas...", "desc_ru": "По нашему мнению, одна из лучших шаурм...",
                "img_dark_path": None, "img_light_path": None
            },
            {
                "block_key": "eat", "kind": "venue", "action_url": "https://www.google.com/maps/place/Ukrainochka/...",
                "title_en": "Ukrainochka", "title_ru": "Украиночка",
                "type_en": "Restaurant", "type_ru": "Ресторан",
                "desc_en": "Ukrainian comfort food...", "desc_ru": "Украинская домашняя кухня...",
                "img_dark_path": "img/ukrainochka-night.png", "img_light_path": "img/ukrainochka-light.jpg"
            },

            # CITY
            {
                "block_key": "city", "kind": "venue", "action_url": "https://www.google.com/maps/place/Europe+Square/...",
                "title_en": "Europe Square", "title_ru": "Площадь Европы",
                "type_en": "City Park", "type_ru": "Площадь",
                "desc_en": "Iconic city-center spot...", "desc_ru": "Знаковое место в центре...",
                "img_dark_path": None, "img_light_path": None
            },
            {
                "block_key": "city", "kind": "venue", "action_url": "https://www.google.com/maps/place/Batumi+seafront/...",
                "title_en": "Batumi seafront", "title_ru": "Набережная Батуми",
                "type_en": "City Walk", "type_ru": "Прогулка",
                "desc_en": "If you haven't walked...", "desc_ru": "Если вы не гуляли...",
                "img_dark_path": None, "img_light_path": None
            },
             {
                "block_key": "city", "kind": "venue", "action_url": "https://www.google.com/maps/place/Ferris+Wheel/...",
                "title_en": "Ferris wheel", "title_ru": "Колесо обозрения",
                "type_en": "Panoramic ride", "type_ru": "Аттракцион",
                "desc_en": "Views of the bay...", "desc_ru": "Вид на бухту...",
                "img_dark_path": None, "img_light_path": None
            },
             {
                "block_key": "city", "kind": "venue", "action_url": "https://www.google.com/maps/search/Old+Town+Batumi/...",
                "title_en": "Old Batumi", "title_ru": "Старый Батуми",
                "type_en": "Streets", "type_ru": "Район",
                "desc_en": "Narrow streets...", "desc_ru": "Узкие улочки...",
                "img_dark_path": None, "img_light_path": None
            },
             {
                "block_key": "city", "kind": "venue", "action_url": "https://www.google.com/maps/search/Dancing+Fountains/...",
                "title_en": "Dancing fountains", "title_ru": "Танцующие фонтаны",
                "type_en": "Evening show", "type_ru": "Шоу",
                "desc_en": "Light and music show...", "desc_ru": "Свето-музыкальное шоу...",
                "img_dark_path": None, "img_light_path": None
            },

            # NATURE
             {
                "block_key": "nature", "kind": "service", "action_url": "https://www.instagram.com/tours_in_georgia_withgeorge",
                "title_en": "The best guide - Georgiy", "title_ru": "Лучший гид — Георгий",
                "type_en": "Guide", "type_ru": "Гид",
                "desc_en": "Our go-to guy...", "desc_ru": "Наш человек в Батуми...",
                "img_dark_path": None, "img_light_path": None
            },
            # ... (Adding a few more for brevity, assume full list in real scenario)
        ]

        for idx, card in enumerate(cards_data):
            db_card = models.Card(
                owner_id=owner.id,
                sort_order=idx,
                **card
            )
            db.add(db_card)

        db.commit()
        print("Data seeded successfully!")

    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
