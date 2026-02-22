import { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const grainParam = (req.query.grain as string) || 'weekly';
  const grainMap: Record<string, string> = { 
    'weekly': 'week', 
    'monthly': 'month', 
    'yearly': 'year' 
  };
  const dbGrain = grainMap[grainParam] || 'week';

  try {
    // We cast to TEXT to prevent the JS driver from shifting the timezone
    const result = await query(`
      SELECT DISTINCT period_date::TEXT as period_date 
      FROM analytics.mart_song_stats_pivot 
      WHERE grain = $1 
      ORDER BY period_date DESC
    `, [dbGrain]);
    
    console.log(`[PERIODS API] Fetched ${result.rows.length} strings for grain: ${dbGrain}`);
    res.status(200).json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}