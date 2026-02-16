import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Play, Music, Clock, TrendingUp } from 'lucide-react';

// Static data for charts (mocked for now as per plan, can be extended later)
const weeklyData = [
  { day: 'Mon', minutes: 142 },
  { day: 'Tue', minutes: 198 },
  { day: 'Wed', minutes: 165 },
  { day: 'Thu', minutes: 223 },
  { day: 'Fri', minutes: 287 },
  { day: 'Sat', minutes: 356 },
  { day: 'Sun', minutes: 312 },
];

const monthlyTrend = [
  { month: 'Aug', plays: 2340 },
  { month: 'Sep', plays: 2567 },
  { month: 'Oct', plays: 2890 },
  { month: 'Nov', plays: 3124 },
  { month: 'Dec', plays: 3456 },
  { month: 'Jan', plays: 3789 },
  { month: 'Feb', plays: 3234 },
];

const COLORS = ['#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'];

export function Overview() {
  const [stats, setStats] = useState({
    totalTracks: 0,
    totalArtists: 0,
    topGenre: 'Loading...',
    totalPlaytime: 0
  });

  const [topArtists, setTopArtists] = useState<any[]>([]);
  const [genreDistribution, setGenreDistribution] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, artistsRes, genresRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/artists'),
          fetch('/api/genres')
        ]);

        const statsData = await statsRes.json();
        const artistsData = await artistsRes.json();
        const genresData = await genresRes.json();

        setStats(statsData);
        setTopArtists(artistsData.slice(0, 5).map((artist: any) => ({
          name: artist.name,
          plays: artist.popularity * 10, // Mock plays based on popularity
          change: '+0%' // No historical data yet
        })));
        setGenreDistribution(genresData.slice(0, 5).map((g: any) => ({
          name: g.genre,
          value: parseInt(g.count)
        })));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6 text-white">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          title="Total Listening Time"
          value={`${Math.round(stats.totalPlaytime / 1000 / 60 / 60).toLocaleString()} hrs`}
          subtitle="All time"
          trend=""
          color="from-purple-500 to-purple-600"
        />
        <StatCard
          icon={<Play className="w-6 h-6" />}
          title="Total Tracks"
          value={stats.totalTracks.toLocaleString()}
          subtitle="Saved tracks"
          trend=""
          color="from-green-500 to-green-600"
        />
        <StatCard
          icon={<Music className="w-6 h-6" />}
          title="Total Artists"
          value={stats.totalArtists.toLocaleString()}
          subtitle="In library"
          trend=""
          color="from-pink-500 to-pink-600"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          title="Top Genre"
          value={stats.topGenre}
          subtitle="Most played"
          trend=""
          color="from-orange-500 to-orange-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Listening */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl text-white mb-6">Weekly Listening</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="minutes" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Genre Distribution */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl text-white mb-6">Genre Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={genreDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {genreDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {genreDistribution.map((genre, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-sm text-gray-400">{genre.name}</span>
                <span className="text-sm text-white ml-auto">{genre.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-xl text-white mb-6">Monthly Listening Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
            />
            <Line type="monotone" dataKey="plays" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Artists Quick View */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl text-white">Top Artists This Month</h3>
          <a href="/artists" className="text-sm text-green-400 hover:text-green-300">View All →</a>
        </div>
        <div className="space-y-4">
          {topArtists.map((artist, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                {index + 1}
              </div>
              <div className="flex-1">
                <h4 className="text-white">{artist.name}</h4>
                <p className="text-sm text-gray-400">{artist.plays} plays (est.)</p>
              </div>
              <div className={`text-sm px-3 py-1 rounded-full ${artist.change.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                {artist.change}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, subtitle, trend, color }: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  trend: string;
  color: string;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-sm text-gray-400 mb-1">{title}</h3>
      <p className="text-3xl text-white mb-1">{value}</p>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">{subtitle}</span>
        <span className="text-sm text-green-400">{trend}</span>
      </div>
    </div>
  );
}
