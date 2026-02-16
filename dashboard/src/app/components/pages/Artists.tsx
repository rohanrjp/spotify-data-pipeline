import { useEffect, useState } from 'react';
import { Music, TrendingUp, TrendingDown } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

const timeRanges = ['This Week', 'This Month', 'Last 6 Months', 'All Time'];

export function Artists() {
  const [selectedRange, setSelectedRange] = useState('This Month');
  const [artistsData, setArtistsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArtists() {
      try {
        const res = await fetch('/api/artists');
        const data = await res.json();
        // Map API data to component structure
        const mappedData = data.map((artist: any, index: number) => ({
          id: artist.id,
          name: artist.name,
          plays: artist.popularity * 12, // Mocking based on popularity
          hours: Math.round(artist.popularity * 0.5), // Mocking
          change: Math.floor(Math.random() * 20) - 5, // Mocking change
          topSong: 'Loading...', // Would need another query or join
          imageUrl: artist.image_url || 'https://images.unsplash.com/photo-1767755254671-ea10b27552f2?w=400',
        }));
        setArtistsData(mappedData);
      } catch (error) {
        console.error('Failed to fetch artists:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchArtists();
  }, []);

  if (loading) return <div className="p-6 text-white">Loading artists...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl text-white mb-2">Your Top Artists</h2>
          <p className="text-gray-400">Discover your most played artists and their stats</p>
        </div>
        <div className="flex gap-2">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${selectedRange === range
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Artists Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {artistsData.slice(0, 3).map((artist, index) => (
          <div
            key={artist.id}
            className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 border border-gray-800 rounded-xl p-6 hover:border-green-500/50 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                }`}>
                #{index + 1}
              </div>
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${artist.change > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                {artist.change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {Math.abs(artist.change)}%
              </div>
            </div>
            <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-green-500/30">
              <ImageWithFallback
                src={artist.imageUrl}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-2xl text-white text-center mb-2">{artist.name}</h3>
            <p className="text-gray-400 text-center text-sm mb-4">Top Song: {artist.topSong}</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <p className="text-2xl text-green-400">{artist.plays}</p>
                <p className="text-xs text-gray-400">Plays</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <p className="text-2xl text-purple-400">{artist.hours}</p>
                <p className="text-xs text-gray-400">Hours</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* All Artists List */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-xl text-white">All Artists</h3>
        </div>
        <div className="divide-y divide-gray-800">
          {artistsData.map((artist, index) => (
            <div
              key={artist.id}
              className="flex items-center gap-6 p-6 hover:bg-gray-800/50 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl">
                {index + 1}
              </div>
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <ImageWithFallback
                  src={artist.imageUrl}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-lg text-white mb-1">{artist.name}</h4>
                <p className="text-sm text-gray-400">Top Song: {artist.topSong}</p>
              </div>
              <div className="hidden md:flex items-center gap-8">
                <div className="text-center">
                  <p className="text-xl text-white">{artist.plays}</p>
                  <p className="text-xs text-gray-400">Plays</p>
                </div>
                <div className="text-center">
                  <p className="text-xl text-white">{artist.hours}h</p>
                  <p className="text-xs text-gray-400">Hours</p>
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${artist.change > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                  {artist.change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {Math.abs(artist.change)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
