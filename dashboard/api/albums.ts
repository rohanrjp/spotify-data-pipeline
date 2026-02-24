import { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const grainParam = (req.query.grain as string) || 'weekly';
  const dateParam = req.query.date as string;

  const grainMap: Record<string, string> = {
    weekly: 'week',
    monthly: 'month',
    yearly: 'year',
  };
  const dbGrain = grainMap[grainParam] || 'week';

  try {
    let sqlQuery = `
      SELECT * FROM analytics.mart_album_stats_pivot
      WHERE grain = $1
    `;
    const params: any[] = [dbGrain];

    if (dateParam) {
      sqlQuery += ` AND period_date::DATE = $2::DATE`;
      params.push(dateParam);
    }

    sqlQuery += ` ORDER BY play_count DESC LIMIT 50`;
    const result = await query(sqlQuery, params);

    res.status(200).json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
