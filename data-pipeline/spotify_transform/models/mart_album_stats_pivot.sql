{{ config(
    materialized='table',
    post_hook=[
      'CREATE INDEX IF NOT EXISTS idx_grain ON {{ this }} (grain)',
      'CREATE INDEX IF NOT EXISTS idx_period ON {{ this }} (period_date)'
    ]
) }}

WITH weekly_stats AS (
    SELECT 
        album_name, 
        artist_name, 
        play_week as period_date, 
        'week' as grain,
        COUNT(*) as play_count, 
        ROUND(SUM(duration_ms) / 60000.0, 2) as minutes_played,
        COUNT(DISTINCT track_id) as unique_tracks_played,
        ARRAY_AGG(DISTINCT song_name) as track_list 
    FROM {{ ref('stg_recently_played_at') }}
    GROUP BY 1, 2, 3, 4 
),
monthly_stats AS (
    SELECT 
        album_name, 
        artist_name, 
        play_month as period_date, 
        'month' as grain,
        COUNT(*) as play_count, 
        ROUND(SUM(duration_ms) / 60000.0, 2) as minutes_played,
        COUNT(DISTINCT track_id) as unique_tracks_played,
        ARRAY_AGG(DISTINCT song_name) as track_list
    FROM {{ ref('stg_recently_played_at') }}
    GROUP BY 1, 2, 3, 4
),
yearly_stats AS (
    SELECT 
        album_name, 
        artist_name, 
        play_year as period_date, 
        'year' as grain,
        COUNT(*) as play_count, 
        ROUND(SUM(duration_ms) / 60000.0, 2) as minutes_played,
        COUNT(DISTINCT track_id) as unique_tracks_played,
        ARRAY_AGG(DISTINCT song_name) as track_list
    FROM {{ ref('stg_recently_played_at') }}
    GROUP BY 1, 2, 3, 4
)

SELECT * FROM weekly_stats
UNION ALL
SELECT * FROM monthly_stats
UNION ALL
SELECT * FROM yearly_stats
ORDER BY period_date DESC, play_count DESC