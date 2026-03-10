from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class AppSettings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', extra='ignore')

    postgres_db: str = Field('platformdb', alias='POSTGRES_DB')
    postgres_user: str = Field('platformuser', alias='POSTGRES_USER')
    postgres_password: str = Field('platformpass', alias='POSTGRES_PASSWORD')
    postgres_host: str = Field('localhost', alias='POSTGRES_HOST')
    postgres_port: int = Field(5432, alias='POSTGRES_PORT')

    database_url: str | None = Field(default=None, alias='DATABASE_URL')
    redis_url: str | None = Field(default='redis://localhost:6379/0', alias='REDIS_URL')

    django_secret_key: str = Field('replace-me', alias='DJANGO_SECRET_KEY')
    django_debug: bool = Field(False, alias='DJANGO_DEBUG')
    django_allowed_hosts: str = Field('localhost,127.0.0.1', alias='DJANGO_ALLOWED_HOSTS')
    jwt_signing_key: str = Field('replace-with-long-random-string', alias='JWT_SIGNING_KEY')

    @property
    def sqlalchemy_database_uri(self) -> str:
        if self.database_url:
            return self.database_url
        return (
            f"postgresql+psycopg://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    @property
    def django_database(self) -> dict:
        return {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': self.postgres_db,
            'USER': self.postgres_user,
            'PASSWORD': self.postgres_password,
            'HOST': self.postgres_host,
            'PORT': str(self.postgres_port),
        }

    @property
    def allowed_hosts(self) -> list[str]:
        return [item.strip() for item in self.django_allowed_hosts.split(',') if item.strip()]


@lru_cache
def get_settings() -> AppSettings:
    return AppSettings()
