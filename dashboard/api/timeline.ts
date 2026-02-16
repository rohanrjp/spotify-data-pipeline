import { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        // Assuming a simplified timeline query grouping by date
        const timeline = await query("SELECT date_trunc('day', played_at) as date, count(*) as count FROM spotify_listening_history GROUP BY date ORDER BY date ASC LIMIT 30");
        res.status(200).json(timeline.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch timeline' });
    }
}
