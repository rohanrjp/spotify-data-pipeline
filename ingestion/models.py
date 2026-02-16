from sqlalchemy import Column, String, DateTime, JSON, Integer
from sqlalchemy.sql import func
from database import Base


class BronzeRawTracks(Base):
    __tablename__ = 'bronze_raw_tracks'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    inserted_at = Column(DateTime(timezone=True), server_default=func.now())
    
    track_id = Column(String)
    played_at = Column(DateTime)  
    raw_json = Column(JSON)      