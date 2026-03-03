import { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './db';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const result = await query(`
      SELECT last_synced_at
      FROM analytics.mart_last_synced_at
      ORDER BY transformation_run_at DESC
      LIMIT 1
    `);

    const lastSyncedAt = result.rows[0]?.last_synced_at;

    if (!lastSyncedAt) {
      res.status(200).json({ lastSyncedAt: null });
      return;
    }

    res.status(200).json({ lastSyncedAt });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch last synced timestamp' });
  }
}
