from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import dishes

app = FastAPI(
    title="Dish Management API",
    description="API for managing dishes and their ingredients",
    version="0.1.0"
)

# CORS配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # 本地开发
        "https://your-vercel-domain.vercel.app",  # 生产环境
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 包含路由
app.include_router(dishes.router, prefix="/api", tags=["dishes"])

@app.get("/")
def read_root():
    return {"message": "Dish Management API is running"}