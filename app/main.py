from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from configs import models
from configs.database import engine
from features import router

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# app.mount("/assets", StaticFiles(directory="assets", html=True), name="media")


origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix='/api')


@app.get("/api/healthchecker")
async def root():
    return {"message": "Welcome to FastAPI with SQLAlchemy"}
