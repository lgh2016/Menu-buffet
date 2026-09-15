import os
import uuid
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field

from seed_data import TRADITIONAL_BUFFET, SEPT15_BUFFET, DRINKS_CATALOG

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

client = AsyncIOMotorClient(os.environ["MONGO_URL"])
db = client[os.environ["DB_NAME"]]

app = FastAPI()
api_router = APIRouter(prefix="/api")

UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

logger = logging.getLogger(__name__)


class Product(BaseModel):
    name: str
    price: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    hidden: bool = False


class Category(BaseModel):
    id: str
    name: str
    short: Optional[str] = None
    time: Optional[str] = None
    sharedPrice: Optional[str] = None
    group: str = "cocina"
    hidden: bool = False
    products: List[Product] = Field(default_factory=list)


class Theme(BaseModel):
    template: str = "classic"  # "classic" | "mexican-independence" — define la plantilla visual del menú público
    title: str = "BUFFET"
    subtitle: str = "MAR Y TIERRA"
    primaryColor: str = "#1a58b0"
    secondaryColor: str = "#c1440e"
    backgroundColor: str = "#fffdf9"
    heroImage: Optional[str] = None
    backgroundImage: Optional[str] = None
    banner: Optional[str] = None
    decorativeImage: Optional[str] = None


class BuffetCreate(BaseModel):
    name: str
    sourceId: Optional[str] = None  # si viene, el buffet nuevo nace como copia independiente de ese buffet


class BuffetUpdate(BaseModel):
    name: str
    theme: Theme
    categories: List[Category]


class DuplicateRequest(BaseModel):
    name: str


class DrinksUpdate(BaseModel):
    categories: List[Category]


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def with_id(doc):
    doc["id"] = doc.pop("_id")
    return doc


def only_visible(categories):
    # El menú público omite categorías y platillos marcados como ocultos.
    result = []
    for cat in categories:
        if cat.get("hidden"):
            continue
        cat = dict(cat)
        cat["products"] = [p for p in cat.get("products", []) if not p.get("hidden")]
        result.append(cat)
    return result


@api_router.get("/")
async def root():
    return {"message": "Los Andariegos API"}


@api_router.get("/menu/public")
async def public_menu():
    # El cliente siempre recibe el buffet ACTIVO + el catálogo global de bebidas.
    buffet = await db.buffets.find_one({"active": True})
    if not buffet:
        buffet = await db.buffets.find_one(sort=[("updatedAt", -1)])
    if not buffet:
        raise HTTPException(status_code=404, detail="No hay buffets registrados")
    drinks = await db.drinks.find_one({"_id": "global"})
    buffet = with_id(buffet)
    buffet["categories"] = only_visible(buffet.get("categories", []))
    drink_cats = only_visible(drinks.get("categories", [])) if drinks else []
    return {"buffet": buffet, "drinks": drink_cats}


@api_router.get("/buffets")
async def list_buffets():
    docs = await db.buffets.find({}, {"categories": 0}).sort("createdAt", 1).to_list(200)
    return [with_id(d) for d in docs]


@api_router.post("/buffets", status_code=201)
async def create_buffet(payload: BuffetCreate):
    categories = []
    theme = Theme().model_dump()
    if payload.sourceId:
        source = await db.buffets.find_one({"_id": payload.sourceId})
        if not source:
            raise HTTPException(status_code=404, detail="Buffet origen no encontrado")
        categories = source.get("categories", [])
        theme = source.get("theme", theme)
    doc = {
        "_id": uuid.uuid4().hex,
        "name": payload.name,
        "active": False,
        "categories": categories,
        "theme": theme,
        # Campos reservados para vigencias automáticas y sucursales (futuro).
        "validFrom": None,
        "validTo": None,
        "branch": None,
        "createdAt": now_iso(),
        "updatedAt": now_iso(),
    }
    await db.buffets.insert_one(doc)
    return with_id(doc)


@api_router.get("/buffets/{buffet_id}")
async def get_buffet(buffet_id: str):
    doc = await db.buffets.find_one({"_id": buffet_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Buffet no encontrado")
    return with_id(doc)


@api_router.put("/buffets/{buffet_id}")
async def update_buffet(buffet_id: str, payload: BuffetUpdate):
    result = await db.buffets.update_one(
        {"_id": buffet_id},
        {"$set": {
            "name": payload.name,
            "theme": payload.theme.model_dump(),
            "categories": [c.model_dump() for c in payload.categories],
            "updatedAt": now_iso(),
        }},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Buffet no encontrado")
    doc = await db.buffets.find_one({"_id": buffet_id})
    return with_id(doc)


@api_router.post("/buffets/{buffet_id}/duplicate", status_code=201)
async def duplicate_buffet(buffet_id: str, payload: DuplicateRequest):
    source = await db.buffets.find_one({"_id": buffet_id})
    if not source:
        raise HTTPException(status_code=404, detail="Buffet no encontrado")
    doc = {
        "_id": uuid.uuid4().hex,
        "name": payload.name,
        "active": False,
        "categories": source.get("categories", []),
        "theme": source.get("theme", Theme().model_dump()),
        "validFrom": None,
        "validTo": None,
        "branch": None,
        "createdAt": now_iso(),
        "updatedAt": now_iso(),
    }
    await db.buffets.insert_one(doc)
    return with_id(doc)


@api_router.post("/buffets/{buffet_id}/activate")
async def activate_buffet(buffet_id: str):
    # Solo un buffet activo: todos pasan a INACTIVO (sin borrarse) y luego se activa el elegido.
    result = await db.buffets.update_one(
        {"_id": buffet_id}, {"$set": {"active": True, "updatedAt": now_iso()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Buffet no encontrado")
    await db.buffets.update_many({"_id": {"$ne": buffet_id}}, {"$set": {"active": False}})
    return {"ok": True, "active": buffet_id}


@api_router.post("/buffets/{buffet_id}/deactivate")
async def deactivate_buffet(buffet_id: str):
    await db.buffets.update_one({"_id": buffet_id}, {"$set": {"active": False, "updatedAt": now_iso()}})
    return {"ok": True}


@api_router.get("/drinks")
async def get_drinks():
    doc = await db.drinks.find_one({"_id": "global"})
    if not doc:
        raise HTTPException(status_code=404, detail="Catálogo de bebidas no encontrado")
    return {"id": "global", "categories": doc.get("categories", [])}


@api_router.put("/drinks")
async def update_drinks(payload: DrinksUpdate):
    # Catálogo global: las bebidas existen una sola vez y se comparten entre todos los buffets.
    await db.drinks.update_one(
        {"_id": "global"},
        {"$set": {"categories": [c.model_dump() for c in payload.categories], "updatedAt": now_iso()}},
        upsert=True,
    )
    return {"ok": True}


ALLOWED_IMAGE_TYPES = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}


@api_router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    ext = ALLOWED_IMAGE_TYPES.get(file.content_type)
    if not ext:
        raise HTTPException(status_code=400, detail="Formato no soportado (usa jpg, png o webp)")
    filename = f"{uuid.uuid4().hex}{ext}"
    (UPLOAD_DIR / filename).write_bytes(await file.read())
    return {"url": f"/api/uploads/{filename}"}


@app.on_event("startup")
async def seed_database():
    # Siembra inicial: solo si la base está vacía. Después todo se administra desde el panel.
    if await db.buffets.count_documents({}) == 0:
        await db.buffets.insert_many([TRADITIONAL_BUFFET, SEPT15_BUFFET])
        logger.info("Buffets sembrados: Tradicional (activo) y 15 de Septiembre")
    if not await db.drinks.find_one({"_id": "global"}):
        await db.drinks.insert_one(DRINKS_CATALOG)
        logger.info("Catálogo global de bebidas sembrado")


app.include_router(api_router)
app.mount("/api/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()