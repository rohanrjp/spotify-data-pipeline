import { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const genres = await query('SELECT genre, count(*) as count FROM spotify_genres GROUP BY genre ORDER BY count DESC LIMIT 20');
        res.status(200).json(genres.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch genres' });
    }
}
