import { useEffect, useState, useMemo } from 'react';
import { 
  BarChart2, ChevronDown, Hash, Music, Clock, 
  TrendingUp, Search, Mic2, Headphones 
} from 'lucide-react';

export function Songs() {
  const [songsData, setSongsData] = useState<any[]>([]);
  const [periods, setPeriods] = useState<any[]>([]);
  const [grain, setGrain] = useState('weekly');
  const [selectedDate, setSelectedDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPeriods() {
      const res = await fetch(`/api/periods?grain=${grain}`);
      const data = await res.json();
      setPeriods(data);
      if (data.length > 0) setSelectedDate(data[0].period_date);
    }
    loadPeriods();
  }, [grain]);

  useEffect(() => {
    if (!selectedDate) return;
    async function loadSongs() {
      setLoading(true);
      const cleanDate = selectedDate.split(' ')[0]; 
      const res = await fetch(`/api/songs?grain=${grain}&date=${cleanDate}`);
      const data = await res.json();
      setSongsData(Array.isArray(data) ? data : []);
      setLoading(false);
    }
    loadSongs();
  }, [grain, selectedDate]);

  // Derived Analytics
  const stats = useMemo(() => {
    if (!songsData.length) return { totalPlays: 0, totalMins: 0, topArtist: 'N/A' };
    const totalPlays = songsData.reduce((acc, s) => acc + Number(s.play_count), 0);
    const totalMins = songsData.reduce((acc, s) => acc + Number(s.minutes_played), 0);
    const topArtist = songsData[0]?.artist_name;
    return { totalPlays, totalMins, topArtist };
  }, [songsData]);

  const filteredSongs = songsData.filter(s => 
    s.song_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.artist_name.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 text-slate-100 min-h-screen bg-[#050505]">
      
      {/* --- HEADER & FILTERS --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-[#111] p-6 rounded-3xl border border-white/5 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500 rounded-lg"><Headphones size={20} /></div>
            <h1 className="text-2xl font-black tracking-tight uppercase">Listening Lab</h1>
          </div>
          <p className="text-slate-500 text-sm font-medium">Analyzing {formatRawDate(selectedDate)}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search tracks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm w-full md:w-64"
            />
          </div>
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            {['weekly', 'monthly', 'yearly'].map((g) => (
              <button
                key={g}
                onClick={() => setGrain(g)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                  grain === g ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
          <select 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 text-sm font-bold outline-none cursor-pointer"
          >
            {periods.map((p, i) => (
              <option key={i} value={p.period_date}>{formatRawDate(p.period_date)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={<TrendingUp className="text-emerald-400" />} label="Total Streams" value={stats.totalPlays.toLocaleString()} color="emerald" />
        <StatCard icon={<Clock className="text-indigo-400" />} label="Time Listened" value={`${Math.round(stats.totalMins).toLocaleString()}m`} color="indigo" />
        <StatCard icon={<Mic2 className="text-amber-400" />} label="Top Artist" value={stats.topArtist} color="amber" />
      </div>

      {/* --- TABLE CONTENT --- */}
      <div className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <th className="px-8 py-6">#</th>
                <th className="px-8 py-6">Track Info</th>
                <th className="px-8 py-6 text-right">Plays</th>
                <th className="px-8 py-6 text-right">Time</th>
                <th className="px-8 py-6 text-right hidden md:table-cell">Popularity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={5} className="py-32 text-center text-indigo-400 font-bold animate-pulse">Syncing Neon Records...</td></tr>
              ) : filteredSongs.map((song, i) => {
                const maxPlays = Number(songsData[0].play_count);
                const popularity = (Number(song.play_count) / maxPlays) * 100;
                
                return (
                  <tr key={i} className="hover:bg-white/[0.02] transition-all group">
                    <td className="px-8 py-6 font-mono text-slate-600 text-sm">{i + 1}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded flex items-center justify-center text-white font-black shadow-lg">
                          {song.song_name[0]}
                        </div>
                        <div>
                          <div className="text-white font-bold group-hover:text-indigo-400 transition-colors">{song.song_name}</div>
                          <div className="text-slate-500 text-xs mt-0.5">{song.artist_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-white font-black">{Number(song.play_count).toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-6 text-right text-slate-400 font-medium">
                      {Math.round(song.minutes_played)}<span className="text-[10px] ml-1 opacity-50">m</span>
                    </td>
                    <td className="px-8 py-6 text-right hidden md:table-cell w-48">
                      <div className="flex items-center justify-end gap-3">
                        <div className="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500 rounded-full" 
                            style={{ width: `${popularity}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600">{Math.round(popularity)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Helper Component for Stats
function StatCard({ icon, label, value, color }: any) {
  const colors: any = {
    emerald: 'bg-emerald-500/10 border-emerald-500/20',
    indigo: 'bg-indigo-500/10 border-indigo-500/20',
    amber: 'bg-amber-500/10 border-amber-500/20',
  };
  return (
    <div className={`p-6 rounded-3xl border ${colors[color]} flex flex-col gap-3 shadow-xl`}>
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-xs font-black uppercase tracking-tighter text-slate-400">{label}</span>
      </div>
      <div className="text-3xl font-black text-white truncate">{value}</div>
    </div>
  );
}