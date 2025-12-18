from backend.database import SessionLocal
from backend.models import User
from backend.routers.auth import login, LoginRequest

db = SessionLocal()
print("--- Checking Admin User ---")
user = db.query(User).filter(User.login == "admin").first()
if user:
    print(f"User found: {user.login}, Role: {user.role}, OwnerID: {user.owner_id}")
    try:
        print("--- Attempting Login Logic ---")
        creds = LoginRequest(username="admin", password="admin123")
        response = login(creds, db)
        print("Login Success!")
        print(response)
    except Exception as e:
        print("CRASHED:")
        print(e)
        import traceback
        traceback.print_exc()
else:
    print("Admin user NOT FOUND in DB.")
