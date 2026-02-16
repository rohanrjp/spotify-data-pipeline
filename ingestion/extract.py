from spotipy import SpotifyOAuth,Spotify
from config import settings
import logging
from database import Session
from models import BronzeRawTracks


spotify_auth_manager = SpotifyOAuth(
    client_id=settings.SPOTIFY_CLIENT_ID,
    client_secret=settings.SPOTIFY_CLIENT_SECRET,
    scope="user-read-recently-played user-top-read user-library-read",
    redirect_uri=settings.SPOTIFY_REDIRECT_URL,
    cache_path=".spotify_cache"
)

spotify_client = Spotify(auth_manager=spotify_auth_manager)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

#test endpoint last 5 tracks
def last_5_tracks():
    try:
        results = spotify_client.current_user_recently_played(limit=5)
        print("--- Success! Connection Established ---")
        for idx, item in enumerate(results['items']):
            track = item['track']
            print(f"{idx + 1}: {track['name']} - {track['artists'][0]['name']}")
    except Exception as e:
        print(f"--- Connection Failed --- \n{e}")
        
def ingest_recently_played():
    """Fetches recently played tracks and saves them to Bronze layer."""
    db = Session()
    try:
        logger.info("Fetching recently played tracks...")
        results = spotify_client.current_user_recently_played(limit=50)
        items = results.get('items', [])

        if not items:
            logger.info("No new tracks found.")
            return

        new_records = []
        for item in items:
            record = BronzeRawTracks(
                track_id=item['track']['id'],
                played_at=item['played_at'],
                raw_json=item
            )
            new_records.append(record)

        db.add_all(new_records)
        db.commit()
        logger.info(f"Successfully ingested {len(new_records)} tracks into Neon.")

    except Exception as e:
        logger.error(f"Ingestion failed: {e}")
        db.rollback()
    finally:
        db.close()