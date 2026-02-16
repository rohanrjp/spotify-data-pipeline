import { useEffect, useState } from 'react';
import { Play, Heart, Clock } from 'lucide-react';

export function Songs() {
  const [songsData, setSongsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSongs() {
      try {
        const res = await fetch('/api/songs');
        const data = await res.json();
        const mappedData = data.map((song: any) => ({
          id: song.id,
          name: song.name,
          artist: song.artist || 'Unknown Artist',
          album: song.album || 'Single',
          plays: song.plays || 0,
          duration: formatDuration(song.duration_ms),
          liked: Math.random() > 0.5 // Mock liked status
        }));
        setSongsData(mappedData);
      } catch (error) {
        console.error('Failed to fetch songs:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSongs();
  }, []);

  const recentlyPlayed = songsData.slice(0, 5);

  function formatDuration(ms: number) {
    if (!ms) return '0:00';
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
  }

  if (loading) return <div className="p-6 text-white">Loading songs...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl text-white mb-2">Your Top Songs</h2>
        <p className="text-gray-400">Your most played tracks and listening history</p>
      </div>

      {/* Recently Played */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-xl text-white mb-6">Recently Played</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {recentlyPlayed.map((song) => (
            <div
              key={song.id}
              className="group bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800 transition-all cursor-pointer"
            >
              <div className="aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm rounded-full p-1">
                  <Heart className={`w-4 h-4 ${song.liked ? 'fill-green-400 text-green-400' : 'text-white'}`} />
                </div>
              </div>
              <h4 className="text-white text-sm mb-1 truncate">{song.name}</h4>
              <p className="text-gray-400 text-xs truncate">{song.artist}</p>
            </div>
          ))}
        </div>
      </div>

      {/* All Songs Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-xl text-white">All Songs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="text-left text-xs text-gray-400 px-6 py-3 w-12">#</th>
                <th className="text-left text-xs text-gray-400 px-6 py-3">Title</th>
                <th className="text-left text-xs text-gray-400 px-6 py-3">Album</th>
                <th className="text-left text-xs text-gray-400 px-6 py-3">Plays</th>
                <th className="text-left text-xs text-gray-400 px-6 py-3">
                  <Clock className="w-4 h-4" />
                </th>
                <th className="text-left text-xs text-gray-400 px-6 py-3 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {songsData.map((song, index) => (
                <tr
                  key={song.id}
                  className="hover:bg-gray-800/50 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="text-gray-400 group-hover:hidden">{index + 1}</div>
                    <Play className="w-4 h-4 text-white hidden group-hover:block" />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white">{song.name}</p>
                      <p className="text-sm text-gray-400">{song.artist}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{song.album}</td>
                  <td className="px-6 py-4">
                    <span className="text-green-400">{song.plays}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{song.duration}</td>
                  <td className="px-6 py-4">
                    <Heart
                      className={`w-5 h-5 ${song.liked ? 'fill-green-400 text-green-400' : 'text-gray-400'
                        }`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
