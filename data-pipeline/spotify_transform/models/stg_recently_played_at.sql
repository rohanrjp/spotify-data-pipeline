{{ config(materialized='incremental', unique_key='play_id') }}

WITH raw_data AS (
    SELECT * FROM {{ source('spotify_bronze', 'bronze_raw_tracks') }}
),

flattened_and_cleaned AS (
    SELECT
        md5(track_id || played_at) AS play_id,
        track_id,
        played_at::timestamp AS played_at_ts,
        date_trunc('day', played_at::timestamp) AS play_day,
        date_trunc('week', played_at::timestamp) AS play_week,
        date_trunc('month', played_at::timestamp) AS play_month,
        date_trunc('year', played_at::timestamp) AS play_year,
        raw_json->'track'->>'name' AS song_name,
        (raw_json->'track'->'artists'->0->>'name') AS artist_name,
        raw_json->'track'->'album'->>'name' AS album_name,
        (raw_json->'track'->>'duration_ms')::int AS duration_ms
    FROM
        raw_data
)

SELECT * FROM flattened_and_cleaned

{% if is_incremental() %}
    WHERE played_at_ts > (SELECT max(played_at_ts) FROM {{ this }})
{% endif %}