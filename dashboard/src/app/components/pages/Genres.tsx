import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const COLORS = ['#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4', '#ef4444', '#84cc16', '#f97316'];

const genresByTime = [
  { time: '00:00', Pop: 45, HipHop: 20, RnB: 15, Alternative: 10, Latin: 10 },
  { time: '04:00', Pop: 20, HipHop: 15, RnB: 25, Alternative: 20, Latin: 20 },
  { time: '08:00', Pop: 80, HipHop: 60, RnB: 40, Alternative: 30, Latin: 35 },
  { time: '12:00', Pop: 120, HipHop: 90, RnB: 60, Alternative: 45, Latin: 50 },
  { time: '16:00', Pop: 150, HipHop: 110, RnB: 75, Alternative: 55, Latin: 60 },
  { time: '20:00', Pop: 180, HipHop: 130, RnB: 90, Alternative: 70, Latin: 75 },
];

const genreAttributes = [
  { attribute: 'Energy', value: 78 },
  { attribute: 'Danceability', value: 85 },
  { attribute: 'Valence', value: 72 },
  { attribute: 'Acousticness', value: 35 },
  { attribute: 'Instrumentalness', value: 15 },
];

export function Genres() {
  const [genresData, setGenresData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGenres() {
      try {
        const res = await fetch('/api/genres');
        const data = await res.json();
        const mappedData = data.slice(0, 8).map((g: any, index: number) => ({
          name: g.genre,
          plays: parseInt(g.count),
          hours: Math.round(parseInt(g.count) * 0.05), // Mocking
          color: COLORS[index % COLORS.length]
        }));
        setGenresData(mappedData);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchGenres();
  }, []);

  if (loading) return <div className="p-6 text-white">Loading genres...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl text-white mb-2">Your Music Genres</h2>
        <p className="text-gray-400">Explore your genre preferences and listening patterns</p>
      </div>

      {/* Genre Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {genresData.map((genre, index) => (
          <div
            key={genre.name}
            className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all"
          >
            <div
              className="w-full h-24 rounded-lg mb-4 flex items-center justify-center"
              style={{ backgroundColor: genre.color }}
            >
              <span className="text-4xl text-white">#{index + 1}</span>
            </div>
            <h3 className="text-xl text-white mb-2">{genre.name}</h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Plays</span>
                <span className="text-sm text-white">{genre.plays.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Hours</span>
                <span className="text-sm text-white">{genre.hours}h</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Genre Distribution Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl text-white mb-6">Genre Plays</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={genresData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis dataKey="name" type="category" stroke="#9ca3af" width={100} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="plays" radius={[0, 8, 8, 0]}>
                {genresData.map((entry, index) => (
                  <Bar key={`bar-${index}`} dataKey="plays" fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Audio Features Radar */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl text-white mb-6">Audio Features</h3>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={genreAttributes}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="attribute" stroke="#9ca3af" />
              <PolarRadiusAxis stroke="#9ca3af" />
              <Radar name="Your Music" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              />
            </RadarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {genreAttributes.map((attr) => (
              <div key={attr.attribute} className="flex items-center justify-between">
                <span className="text-sm text-gray-400">{attr.attribute}</span>
                <span className="text-sm text-white">{attr.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Listening by Time of Day */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-xl text-white mb-6">Genre Listening by Time of Day</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={genresByTime}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
            />
            <Bar dataKey="Pop" stackId="a" fill="#10b981" />
            <Bar dataKey="HipHop" stackId="a" fill="#8b5cf6" />
            <Bar dataKey="RnB" stackId="a" fill="#f59e0b" />
            <Bar dataKey="Alternative" stackId="a" fill="#ec4899" />
            <Bar dataKey="Latin" stackId="a" fill="#06b6d4" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
