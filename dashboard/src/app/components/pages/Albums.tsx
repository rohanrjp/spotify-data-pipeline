import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Album, Clock, ListMusic, Search, TrendingUp } from 'lucide-react';

export function Albums() {
  const [albumsData, setAlbumsData] = useState<any[]>([]);
  const [periods, setPeriods] = useState<any[]>([]);
  const [grain, setGrain] = useState('weekly');
  const [selectedDate, setSelectedDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPeriods() {
      const res = await fetch(`/api/periods?source=albums&grain=${grain}`);
      const data = await res.json();
      setPeriods(data);
      if (data.length > 0) setSelectedDate(data[0].period_date);
    }
    loadPeriods();
  }, [grain]);

  useEffect(() => {
    if (!selectedDate) return;
    async function loadAlbums() {
      setLoading(true);
      const cleanDate = selectedDate.split(' ')[0];
      const res = await fetch(`/api/albums?grain=${grain}&date=${cleanDate}`);
      const data = await res.json();
      setAlbumsData(Array.isArray(data) ? data : []);
      setLoading(false);
    }
    loadAlbums();
  }, [grain, selectedDate]);

  const stats = useMemo(() => {
    if (!albumsData.length) return { totalPlays: 0, totalMins: 0, uniqueTracks: 0 };
    return {
      totalPlays: albumsData.reduce((acc, row) => acc + Number(row.play_count), 0),
      totalMins: albumsData.reduce((acc, row) => acc + Number(row.minutes_played), 0),
      uniqueTracks: albumsData.reduce((acc, row) => acc + Number(row.unique_tracks_played), 0),
    };
  }, [albumsData]);

  const filtered = albumsData.filter((a) =>
    a.album_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.artist_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatRawDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split(' ')[0].split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (grain === 'yearly') return parts[0];
    if (grain === 'monthly') return `${months[parseInt(parts[1]) - 1]} ${parts[0]}`;
    return `Week of ${months[parseInt(parts[1]) - 1]} ${parts[2]}`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h2 className="text-3xl text-white">Top Albums • {formatRawDate(selectedDate)}</h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search albums or artists" className="pl-10 pr-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white" />
          </div>
          <div className="flex bg-gray-900 p-1 rounded-lg border border-gray-700">
            {['weekly', 'monthly', 'yearly'].map((g) => (
              <button key={g} onClick={() => setGrain(g)} className={`px-3 py-1 rounded text-xs uppercase ${grain === g ? 'bg-green-500 text-white' : 'text-gray-400'}`}>{g}</button>
            ))}
          </div>
          <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white">
            {periods.map((p, i) => <option key={i} value={p.period_date}>{formatRawDate(p.period_date)}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={<TrendingUp className="text-green-400" />} label="Total Plays" value={stats.totalPlays.toLocaleString()} />
        <StatCard icon={<Clock className="text-blue-400" />} label="Minutes Played" value={Math.round(stats.totalMins).toLocaleString()} />
        <StatCard icon={<ListMusic className="text-purple-400" />} label="Unique Tracks" value={stats.uniqueTracks.toLocaleString()} />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="text-gray-400 text-xs uppercase border-b border-gray-800">
            <tr>
              <th className="px-6 py-4">#</th>
              <th className="px-6 py-4">Album</th>
              <th className="px-6 py-4">Artist</th>
              <th className="px-6 py-4 text-right">Plays</th>
              <th className="px-6 py-4 text-right">Minutes</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400">Loading albums...</td></tr>
            ) : filtered.map((album, i) => (
              <tr key={`${album.album_name}-${album.artist_name}-${i}`} className="border-b border-gray-800/80 hover:bg-gray-800/40">
                <td className="px-6 py-4 text-gray-400">{i + 1}</td>
                <td className="px-6 py-4 text-white font-medium flex items-center gap-2"><Album size={14} className="text-green-400" /> {album.album_name}</td>
                <td className="px-6 py-4 text-gray-300">{album.artist_name}</td>
                <td className="px-6 py-4 text-right text-white">{Number(album.play_count).toLocaleString()}</td>
                <td className="px-6 py-4 text-right text-gray-300">{Math.round(Number(album.minutes_played)).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center gap-2 text-sm text-gray-400">{icon}{label}</div>
      <div className="text-2xl text-white mt-2">{value}</div>
    </div>
  );
}
