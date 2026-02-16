import { ListMusic, Play, Clock, TrendingUp } from 'lucide-react';

const playlistsData = [
  {
    id: 1,
    name: 'Daily Mix',
    tracks: 50,
    duration: '3h 24m',
    plays: 1247,
    lastPlayed: '2 hours ago',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 2,
    name: 'Workout Energy',
    tracks: 42,
    duration: '2h 45m',
    plays: 982,
    lastPlayed: '1 day ago',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 3,
    name: 'Chill Vibes',
    tracks: 67,
    duration: '4h 12m',
    plays: 876,
    lastPlayed: '3 hours ago',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 4,
    name: 'Focus Flow',
    tracks: 38,
    duration: '2h 18m',
    plays: 743,
    lastPlayed: '5 hours ago',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 5,
    name: 'Night Drive',
    tracks: 55,
    duration: '3h 47m',
    plays: 621,
    lastPlayed: '2 days ago',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    id: 6,
    name: 'Party Hits',
    tracks: 73,
    duration: '4h 56m',
    plays: 587,
    lastPlayed: '1 week ago',
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 7,
    name: 'Acoustic Sessions',
    tracks: 31,
    duration: '2h 5m',
    plays: 543,
    lastPlayed: '6 hours ago',
    color: 'from-amber-500 to-yellow-500',
  },
  {
    id: 8,
    name: 'Summer Vibes',
    tracks: 61,
    duration: '3h 58m',
    plays: 498,
    lastPlayed: '3 days ago',
    color: 'from-teal-500 to-cyan-500',
  },
];

export function Playlists() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl text-white mb-2">Your Playlists</h2>
        <p className="text-gray-400">Manage and explore your music collections</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <ListMusic className="w-8 h-8 text-purple-400 mb-3" />
          <p className="text-3xl text-white mb-1">8</p>
          <p className="text-sm text-gray-400">Total Playlists</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <Play className="w-8 h-8 text-green-400 mb-3" />
          <p className="text-3xl text-white mb-1">417</p>
          <p className="text-sm text-gray-400">Total Tracks</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <Clock className="w-8 h-8 text-blue-400 mb-3" />
          <p className="text-3xl text-white mb-1">27h</p>
          <p className="text-sm text-gray-400">Total Duration</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <TrendingUp className="w-8 h-8 text-pink-400 mb-3" />
          <p className="text-3xl text-white mb-1">6,097</p>
          <p className="text-sm text-gray-400">Total Plays</p>
        </div>
      </div>

      {/* Playlists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {playlistsData.map((playlist) => (
          <div
            key={playlist.id}
            className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all group cursor-pointer"
          >
            <div className={`aspect-square bg-gradient-to-br ${playlist.color} relative flex items-center justify-center`}>
              <ListMusic className="w-16 h-16 text-white/50" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-6 h-6 text-white fill-white ml-1" />
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg text-white mb-2 truncate">{playlist.name}</h3>
              <div className="space-y-1 text-sm text-gray-400">
                <p>{playlist.tracks} tracks • {playlist.duration}</p>
                <p>{playlist.plays} plays</p>
                <p className="text-xs">Last played {playlist.lastPlayed}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Most Played Playlists */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-xl text-white mb-6">Most Played Playlists</h3>
        <div className="space-y-4">
          {playlistsData.slice(0, 5).map((playlist, index) => (
            <div
              key={playlist.id}
              className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${playlist.color} flex items-center justify-center flex-shrink-0`}>
                <span className="text-2xl text-white">{index + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white mb-1">{playlist.name}</h4>
                <p className="text-sm text-gray-400">{playlist.tracks} tracks • {playlist.duration}</p>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-lg text-green-400">{playlist.plays}</p>
                <p className="text-xs text-gray-400">plays</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center hover:bg-green-500 transition-colors group">
                <Play className="w-5 h-5 text-green-400 group-hover:text-white fill-current ml-0.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
