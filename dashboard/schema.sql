-- Create table for tracks
CREATE TABLE spotify_tracks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    album VARCHAR(255),
    artist_id INTEGER,
    duration_ms INTEGER,
    popularity INTEGER
);

-- Create table for artists
CREATE TABLE spotify_artists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    popularity INTEGER
);

-- Create table for genres
CREATE TABLE spotify_genres (
    id SERIAL PRIMARY KEY,
    genre VARCHAR(255) NOT NULL,
    track_id INTEGER
);

-- Create table for listening history
CREATE TABLE spotify_listening_history (
    id SERIAL PRIMARY KEY,
    track_id INTEGER,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
