import { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const songs = await query('SELECT * FROM spotify_tracks ORDER BY popularity DESC LIMIT 20');
        res.status(200).json(songs.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch songs' });
    }
}
