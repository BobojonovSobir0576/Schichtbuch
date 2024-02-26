from pydantic import BaseSettings


class Settings(BaseSettings):
    db_host: str = "localhost"
    db_password: str
    db_port: int
    db_user: str
    db_name: str

    class Config:
        env_file = ".env"
