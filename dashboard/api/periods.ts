import { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './db.js';

const sourceTableMap: Record<string, string> = {
  songs: 'analytics.mart_song_stats_pivot',
  artists: 'analytics.mart_artist_stats_pivot',
  albums: 'analytics.mart_album_stats_pivot',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const grainParam = (req.query.grain as string) || 'weekly';
  const sourceParam = (req.query.source as string) || 'songs';
  const tableName = sourceTableMap[sourceParam] || sourceTableMap.songs;

  const grainMap: Record<string, string> = {
    weekly: 'week',
    monthly: 'month',
    yearly: 'year',
  };
  const dbGrain = grainMap[grainParam] || 'week';

  try {
    const result = await query(
      `
      SELECT DISTINCT period_date::TEXT as period_date
      FROM ${tableName}
      WHERE grain = $1
      ORDER BY period_date DESC
      `,
      [dbGrain],
    );

    res.status(200).json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
