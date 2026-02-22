import { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const grainParam = (req.query.grain as string) || 'weekly';
  const dateParam = req.query.date as string; // Will receive "2026-02-16"
  
  const grainMap: Record<string, string> = { 
    'weekly': 'week', 
    'monthly': 'month', 
    'yearly': 'year' 
  };
  const dbGrain = grainMap[grainParam] || 'week';

  try {
    console.log(`[SONGS API] Filtering for Grain: ${dbGrain}, Date: ${dateParam}`);

    let sqlQuery = `
      SELECT * FROM analytics.mart_song_stats_pivot 
      WHERE grain = $1
    `;
    const params: any[] = [dbGrain];

    if (dateParam) {
      sqlQuery += ` AND period_date::DATE = $2::DATE`;
      params.push(dateParam);
    }

    sqlQuery += ` ORDER BY play_count DESC LIMIT 50`;
    const result = await query(sqlQuery, params);
    
    console.log(`[SONGS API] Found ${result.rows.length} rows`);
    res.status(200).json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}