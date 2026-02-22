{{config(materialized='table',post_hook=[
      'CREATE INDEX IF NOT EXISTS idx_grain ON {{ this }} (grain)',
      'CREATE INDEX IF NOT EXISTS idx_period ON {{ this }} (period_date)'
    ]) }}

WITH weekly_stats AS (
    SELECT 
        artist_name, play_week as period_date, 'week' as grain,
        COUNT(*) as play_count, ROUND(SUM(duration_ms) / 60000.0,2) as minutes_played,
        COUNT(DISTINCT song_name) as unique_songs_played
    FROM {{ ref('stg_recently_played_at') }}
    GROUP BY 1, 2, 3
),
monthly_stats AS (
    SELECT 
        artist_name, play_month as period_date, 'month' as grain,
        COUNT(*) as play_count, ROUND(SUM(duration_ms) / 60000.0,2) as minutes_played,
        COUNT(DISTINCT song_name) as unique_songs_played
    FROM {{ ref('stg_recently_played_at') }}
    GROUP BY 1, 2, 3
),
yearly_stats AS (
    SELECT 
        artist_name, play_year as period_date, 'year' as grain,
        COUNT(*) as play_count, ROUND(SUM(duration_ms) / 60000.0,2) as minutes_played,
        COUNT(DISTINCT song_name) as unique_songs_played
    FROM {{ ref('stg_recently_played_at') }}
    GROUP BY 1, 2, 3
)

SELECT * FROM weekly_stats
UNION ALL
SELECT * FROM monthly_stats
UNION ALL
SELECT * FROM yearly_stats
ORDER BY period_date DESC, play_count DESC