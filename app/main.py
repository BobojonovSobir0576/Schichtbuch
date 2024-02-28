
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError
from fastapi.staticfiles import StaticFiles

from configs import models
from features import router
from configs.database import engine, engine_db2, get_db, get_db2
from fastapi.responses import JSONResponse

app = FastAPI()

app.mount("/assets", StaticFiles(directory="assets", html=True), name="media")

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

models.Base.metadata.create_all(bind=engine)
models.BaseDB2.metadata.create_all(bind=engine_db2)

@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    return JSONResponse(
        status_code=400,
        content={"message": "An error occurred while processing your request."},
    )

@app.get("/api/healthchecker")
async def health_check(db: Session = Depends(get_db), db2: Session = Depends(get_db2)):
    try:
        db.execute("SELECT 1")
        db2.execute("SELECT 1")
        return {"message": "Both databases are operational"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
