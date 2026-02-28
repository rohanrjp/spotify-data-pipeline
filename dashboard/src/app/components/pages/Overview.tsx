import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Play, Music, Clock, TrendingUp } from 'lucide-react';

type Period = { period_date: string };

type SongRow = {
  song_name: string;
  artist_name: string;
  play_count: number | string;
  minutes_played: number | string;
};

type ArtistRow = {
  artist_name: string;
  play_count: number | string;
  minutes_played: number | string;
};

type AlbumRow = {
  album_name: string;
  play_count: number | string;
};

const COLORS = ['#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'];

export function Overview() {
  const [currentWeek, setCurrentWeek] = useState('');
  const [songsData, setSongsData] = useState<SongRow[]>([]);
  const [artistsData, setArtistsData] = useState<ArtistRow[]>([]);
  const [albumsData, setAlbumsData] = useState<AlbumRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeeklyData() {
      setLoading(true);
      try {
        const periodRes = await fetch('/api/periods?source=songs&grain=weekly');
        const periods: Period[] = await periodRes.json();
        const latestPeriod = periods[0]?.period_date?.split(' ')[0];

        if (!latestPeriod) {
          setLoading(false);
          return;
        }

        setCurrentWeek(latestPeriod);

        const [songsRes, artistsRes, albumsRes] = await Promise.all([
          fetch(`/api/songs?grain=weekly&date=${latestPeriod}`),
          fetch(`/api/artists?grain=weekly&date=${latestPeriod}`),
          fetch(`/api/albums?grain=weekly&date=${latestPeriod}`),
        ]);

        const [songs, artists, albums] = await Promise.all([
          songsRes.json(),
          artistsRes.json(),
          albumsRes.json(),
        ]);

        setSongsData(Array.isArray(songs) ? songs : []);
        setArtistsData(Array.isArray(artists) ? artists : []);
        setAlbumsData(Array.isArray(albums) ? albums : []);
      } catch (error) {
        console.error('Failed to fetch weekly overview data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWeeklyData();
  }, []);

  const stats = useMemo(() => {
    const totalPlays = songsData.reduce((acc, row) => acc + Number(row.play_count || 0), 0);
    const totalMinutes = songsData.reduce((acc, row) => acc + Number(row.minutes_played || 0), 0);

    return {
      totalPlaytimeHours: Math.round(totalMinutes / 60),
      totalTracks: songsData.length,
      totalArtists: artistsData.length,
      topArtist: artistsData[0]?.artist_name || 'N/A',
      totalPlays,
    };
  }, [songsData, artistsData]);

  const topSongsChart = useMemo(
    () =>
      songsData.slice(0, 7).map((song) => ({
        name: song.song_name.length > 16 ? `${song.song_name.slice(0, 16)}…` : song.song_name,
        minutes: Math.round(Number(song.minutes_played || 0)),
      })),
    [songsData],
  );

  const topArtists = useMemo(
    () =>
      artistsData.slice(0, 5).map((artist, index) => ({
        name: artist.artist_name,
        plays: Number(artist.play_count || 0),
        change: index === 0 ? '🔥' : '',
      })),
    [artistsData],
  );

  const albumDistribution = useMemo(
    () =>
      albumsData.slice(0, 5).map((album) => ({
        name: album.album_name,
        value: Number(album.play_count || 0),
      })),
    [albumsData],
  );

  const weeklyPlaysTrend = useMemo(
    () =>
      songsData.slice(0, 10).map((song, idx) => ({
        slot: `#${idx + 1}`,
        plays: Number(song.play_count || 0),
      })),
    [songsData],
  );

  if (loading) {
    return <div className="p-6 text-white">Loading weekly dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="text-gray-400 text-sm">Current week: {currentWeek || 'N/A'}</div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Clock className="w-6 h-6" />} title="Listening Time" value={`${stats.totalPlaytimeHours.toLocaleString()} hrs`} subtitle="This week" trend="" color="from-purple-500 to-purple-600" />
        <StatCard icon={<Play className="w-6 h-6" />} title="Total Plays" value={stats.totalPlays.toLocaleString()} subtitle="This week" trend="" color="from-green-500 to-green-600" />
        <StatCard icon={<Music className="w-6 h-6" />} title="Active Artists" value={stats.totalArtists.toLocaleString()} subtitle="This week" trend="" color="from-pink-500 to-pink-600" />
        <StatCard icon={<TrendingUp className="w-6 h-6" />} title="Top Artist" value={stats.topArtist} subtitle="This week" trend="" color="from-orange-500 to-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl text-white mb-6">Top Songs by Minutes (Current Week)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topSongsChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} labelStyle={{ color: '#fff' }} />
              <Bar dataKey="minutes" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl text-white mb-6">Top Albums (Current Week)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={albumDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                {albumDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {albumDistribution.map((album, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-sm text-gray-400 truncate">{album.name}</span>
                <span className="text-sm text-white ml-auto">{album.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-xl text-white mb-6">Top Song Play Counts (Current Week)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weeklyPlaysTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="slot" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} labelStyle={{ color: '#fff' }} />
            <Line type="monotone" dataKey="plays" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl text-white">Top Artists This Week</h3>
          <a href="/artists" className="text-sm text-green-400 hover:text-green-300">View All →</a>
        </div>
        <div className="space-y-4">
          {topArtists.map((artist, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">{index + 1}</div>
              <div className="flex-1">
                <h4 className="text-white">{artist.name}</h4>
                <p className="text-sm text-gray-400">{artist.plays.toLocaleString()} plays</p>
              </div>
              <div className="text-sm px-3 py-1 rounded-full bg-green-500/20 text-green-400">{artist.change || '•'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, subtitle, trend, color }: { icon: React.ReactNode; title: string; value: string; subtitle: string; trend: string; color: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white mb-4`}>{icon}</div>
      <h3 className="text-sm text-gray-400 mb-1">{title}</h3>
      <p className="text-3xl text-white mb-1">{value}</p>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">{subtitle}</span>
        <span className="text-sm text-green-400">{trend}</span>
      </div>
    </div>
  );
}
