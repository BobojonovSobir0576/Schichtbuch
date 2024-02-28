from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# MYSQL_DATABASE_URL = f"mysql+pymysql://{settings.db_user}:{settings.db_password}@{settings.db_host}:{settings.db_port}/{settings.db_name}"
#
# engine = create_engine(
#     MYSQL_DATABASE_URL, echo=True, pool_recycle=3600
# )
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


""" Test Database """

SQLITE_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLITE_DATABASE_URL, connect_args={"check_same_thread": False}, echo=True
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


""" Alfaplus Database """

SQLITE_DATABASE_URL_DB2 = "sqlite:///./alfaplus.db"

engine_db2 = create_engine(
    SQLITE_DATABASE_URL_DB2, connect_args={"check_same_thread": False}, echo=True
)
SessionLocalDB2 = sessionmaker(autocommit=False, autoflush=False, bind=engine_db2)
BaseDB2 = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_db2():
    db2 = SessionLocalDB2()
    try:
        yield db2
    finally:
        db2.close()