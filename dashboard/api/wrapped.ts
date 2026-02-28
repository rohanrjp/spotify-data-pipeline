import { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './db.js';

const grainMap: Record<string, string> = {
  weekly: 'week',
  monthly: 'month',
  yearly: 'year',
};

const dayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const grainParam = (req.query.grain as string) || 'weekly';
  const dateParam = req.query.date as string;

  if (!dateParam) {
    res.status(400).json({ error: 'Missing required date parameter.' });
    return;
  }

  const dbGrain = grainMap[grainParam] || 'week';

  try {
    const [songsResult, artistsResult, listeningResult, genreResult, topDayResult] = await Promise.all([
      query(
        `
          SELECT song_name, artist_name, play_count, minutes_played
          FROM analytics.mart_song_stats_pivot
          WHERE grain = $1 AND period_date::DATE = $2::DATE
          ORDER BY play_count DESC
          LIMIT 5
        `,
        [dbGrain, dateParam],
      ),
      query(
        `
          SELECT artist_name, play_count
          FROM analytics.mart_artist_stats_pivot
          WHERE grain = $1 AND period_date::DATE = $2::DATE
          ORDER BY play_count DESC
          LIMIT 5
        `,
        [dbGrain, dateParam],
      ),
      query(
        `
          SELECT
            COALESCE(SUM(minutes_played), 0)::float AS total_minutes,
            COUNT(DISTINCT song_name)::int AS total_songs
          FROM analytics.mart_song_stats_pivot
          WHERE grain = $1 AND period_date::DATE = $2::DATE
        `,
        [dbGrain, dateParam],
      ),
      query(
        `
          SELECT g.genre, COUNT(*)::int AS play_count
          FROM spotify_listening_history h
          JOIN spotify_tracks t ON t.id = h.track_id
          JOIN spotify_genres g ON g.track_id = t.id
          WHERE h.played_at >= date_trunc($1, $2::date)
            AND h.played_at < date_trunc($1, $2::date) + ('1 ' || $1)::interval
          GROUP BY g.genre
          ORDER BY play_count DESC
          LIMIT 5
        `,
        [dbGrain, dateParam],
      ),
      query(
        `
          SELECT EXTRACT(DOW FROM h.played_at)::int AS dow, COUNT(*)::int AS plays
          FROM spotify_listening_history h
          WHERE h.played_at >= date_trunc($1, $2::date)
            AND h.played_at < date_trunc($1, $2::date) + ('1 ' || $1)::interval
          GROUP BY dow
          ORDER BY plays DESC
          LIMIT 1
        `,
        [dbGrain, dateParam],
      ),
    ]);

    const topSongs = songsResult.rows.map((row: any) => ({
      name: row.song_name,
      artist: row.artist_name,
      plays: Number(row.play_count || 0),
    }));

    const topArtists = artistsResult.rows.map((row: any) => ({
      name: row.artist_name,
      plays: Number(row.play_count || 0),
      imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(row.artist_name)}&background=1f2937&color=ffffff&size=256`,
    }));

    const totalMinutes = Number(listeningResult.rows[0]?.total_minutes || 0);
    const totalSongs = Number(listeningResult.rows[0]?.total_songs || 0);
    const totalArtists = artistsResult.rows.length;

    const topGenres = genreResult.rows.map((row: any) => row.genre);
    const topDayDow = Number(topDayResult.rows[0]?.dow ?? 0);
    const topDay = dayLabels[topDayDow] || 'N/A';

    const listeningPersonality = totalArtists > 30 ? 'The Explorer' : totalMinutes > 1000 ? 'The Binger' : 'The Curator';

    res.status(200).json({
      weekLabel: `${grainParam} of ${dateParam}`,
      totalMinutes: Math.round(totalMinutes),
      topArtists,
      topSongs,
      topGenres,
      listeningPersonality,
      totalArtists,
      totalSongs,
      topDay,
    });
  } catch (error: any) {
    console.error('[WRAPPED API] Failed:', error);
    res.status(500).json({ error: error.message });
  }
}
