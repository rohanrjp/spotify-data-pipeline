from pydantic_settings import BaseSettings,SettingsConfigDict

class Settings(BaseSettings):
    SPOTIFY_CLIENT_ID:str
    SPOTIFY_CLIENT_SECRET:str
    SPOTIFY_REDIRECT_URL:str
    DATABASE_URL:str
    DBT_PASSWORD:str
    DBT_HOST:str
    DBT_USER:str
    SPOTIFY_REFRESH_TOKEN:str
    
    model_config=SettingsConfigDict(env_file='.env',env_file_encoding='utf-8')

settings = Settings()