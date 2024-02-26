from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# For SQLite, you just need the path to the database file. Use ":memory:" for an in-memory database.
SQLITE_DATABASE_URL = "sqlite:///./test.db"

# MYSQL_DATABASE_URL = f"mysql+pymysql://{settings.db_user}:{settings.db_password}@{settings.db_host}:{settings.db_port}/{settings.db_name}"
#
# engine = create_engine(
#     MYSQL_DATABASE_URL, echo=True, pool_recycle=3600
# )

engine = create_engine(
    SQLITE_DATABASE_URL, connect_args={"check_same_thread": False}, echo=True
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()