import { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const grainParam = (req.query.grain as string) || 'monthly';
    const grainMap: Record<string, string> = {
      weekly: 'week',
      monthly: 'month',
      yearly: 'year',
    };
    const dbGrain = grainMap[grainParam] || 'month';

    try {
        const timeline = await query(
          `
            SELECT
              date_trunc($1, h.played_at)::date as date,
              COUNT(*)::int as count,
              ROUND(COUNT(*) * 0.05)::int as hours,
              COUNT(DISTINCT t.artist_id)::int as artists
            FROM spotify_listening_history h
            LEFT JOIN spotify_tracks t ON t.id = h.track_id
            GROUP BY 1
            ORDER BY 1 ASC
          `,
          [dbGrain],
        );
        res.status(200).json(timeline.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch timeline' });
    }
}
