import { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const totalTracks = await query('SELECT COUNT(*) FROM spotify_tracks');
        const totalArtists = await query('SELECT COUNT(*) FROM spotify_artists');
        const topGenre = await query('SELECT genre, COUNT(*) as count FROM spotify_genres GROUP BY genre ORDER BY count DESC LIMIT 1');
        const totalPlaytime = await query('SELECT SUM(duration_ms) FROM spotify_tracks'); // Assuming duration is in ms

        res.status(200).json({
            totalTracks: parseInt(totalTracks.rows[0].count),
            totalArtists: parseInt(totalArtists.rows[0].count),
            topGenre: topGenre.rows[0]?.genre || 'N/A',
            totalPlaytime: parseInt(totalPlaytime.rows[0].sum || '0')
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
}
