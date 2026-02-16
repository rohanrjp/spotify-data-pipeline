import { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const artists = await query('SELECT * FROM spotify_artists ORDER BY popularity DESC LIMIT 20');
        res.status(200).json(artists.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch artists' });
    }
}
