import { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const songs = await query(`
            WITH latest_month AS (
                SELECT MAX(period_date) AS period_date
                FROM mart_song_stats_pivot
                WHERE grain = 'month'
            )
            SELECT
                ROW_NUMBER() OVER (ORDER BY m.play_count DESC, m.minutes_played DESC, m.song_name) AS id,
                m.song_name AS name,
                m.artist_name AS artist,
                NULL::text AS album,
                m.play_count AS plays,
                ROUND(m.minutes_played * 60000)::int AS duration_ms
            FROM mart_song_stats_pivot m
            INNER JOIN latest_month lm ON m.period_date = lm.period_date
            WHERE m.grain = 'month'
            ORDER BY m.play_count DESC, m.minutes_played DESC, m.song_name
            LIMIT 50
        `);

        res.status(200).json(songs.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch songs' });
    }
}
