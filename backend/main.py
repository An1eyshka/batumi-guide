from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from .routers import public, auth, admin, events, stats
from . import models, database

# Create DB tables (simplest way for MVP, though Alembic is better)
# models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Batumi Guide API")

# CORS (Allow frontend to communicate)
# CORS (Allow frontend to communicate)
allowed_origins_env = os.getenv("ALLOWED_ORIGINS")
if allowed_origins_env:
    allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]
else:
    allowed_origins = ["http://127.0.0.1:5500", "http://localhost:5500"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(public.router)
app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(events.router)
app.include_router(stats.router)

# Mount static files (images)
# Assuming 'uploads' folder calls specific path or just mapping root 'img' for now if using existing images
# For MVP, let's map the existing 'img' folder to serve static files
import os
# Mount static files (images)
img_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "img")
if os.path.exists(img_path):
    app.mount("/img", StaticFiles(directory=img_path), name="img")

# Mount Admin Panel
admin_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "admin")
if not os.path.exists(admin_path):
    os.makedirs(admin_path) # Ensure it exists
app.mount("/admin", StaticFiles(directory=admin_path, html=True), name="admin")

@app.get("/")
def read_root():
    return {"message": "Batumi Guide API is running"}
