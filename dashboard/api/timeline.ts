import { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const monthly = await query(`
            SELECT
                period_date,
                SUM(play_count)::int AS plays,
                ROUND(SUM(minutes_played), 2) AS hours
            FROM mart_song_stats_pivot
            WHERE grain = 'month'
            GROUP BY period_date
            ORDER BY period_date ASC
        `);

        const weekly = await query(`
            WITH latest_year AS (
                SELECT MAX(EXTRACT(YEAR FROM period_date)) AS year
                FROM mart_song_stats_pivot
                WHERE grain = 'week'
            ),
            current_year AS (
                SELECT
                    EXTRACT(WEEK FROM period_date)::int AS week_num,
                    SUM(play_count)::int AS this_year
                FROM mart_song_stats_pivot
                WHERE grain = 'week'
                    AND EXTRACT(YEAR FROM period_date) = (SELECT year FROM latest_year)
                GROUP BY EXTRACT(WEEK FROM period_date)
            ),
            previous_year AS (
                SELECT
                    EXTRACT(WEEK FROM period_date)::int AS week_num,
                    SUM(play_count)::int AS last_year
                FROM mart_song_stats_pivot
                WHERE grain = 'week'
                    AND EXTRACT(YEAR FROM period_date) = ((SELECT year FROM latest_year) - 1)
                GROUP BY EXTRACT(WEEK FROM period_date)
            )
            SELECT
                CONCAT('Week ', cy.week_num) AS week,
                cy.this_year,
                COALESCE(py.last_year, 0) AS last_year
            FROM current_year cy
            LEFT JOIN previous_year py ON cy.week_num = py.week_num
            ORDER BY cy.week_num ASC
            LIMIT 8
        `);

        const artistDiscovery = await query(`
            SELECT
                period_date,
                COUNT(DISTINCT artist_name)::int AS artists
            FROM mart_song_stats_pivot
            WHERE grain = 'month'
            GROUP BY period_date
            ORDER BY period_date ASC
        `);

        res.status(200).json({
            monthly: monthly.rows,
            weekly: weekly.rows,
            artistDiscovery: artistDiscovery.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch timeline' });
    }
}
