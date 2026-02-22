{{ config(materialized='table') }}

SELECT
    MAX(played_at_ts) as last_synced_at,
    NOW() as transformation_run_at,
    COUNT(*) as total_records_processed
FROM {{ ref('stg_recently_played_at') }}