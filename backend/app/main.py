from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://58-hackathon-five.vercel.app",  # 本番URLに変更
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.get("/health")
def health_check():
    return {"status": "ok"}
