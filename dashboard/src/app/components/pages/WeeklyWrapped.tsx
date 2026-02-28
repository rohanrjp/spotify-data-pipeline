import { useEffect, useState } from 'react';
import { Calendar, Wand2 } from 'lucide-react';
import { SpotifyWrapped, WrappedData } from '../SpotifyWrapped';

type Period = { period_date: string };

const defaultWrapped: WrappedData = {
  weekLabel: '',
  totalMinutes: 0,
  topArtists: [],
  topSongs: [],
  topGenres: [],
  listeningPersonality: 'The Curator',
  totalArtists: 0,
  totalSongs: 0,
  topDay: 'N/A',
};

export function WeeklyWrapped() {
  const [grain, setGrain] = useState('weekly');
  const [periods, setPeriods] = useState<Period[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [wrappedData, setWrappedData] = useState<WrappedData>(defaultWrapped);
  const [showWrapped, setShowWrapped] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadPeriods() {
      const res = await fetch(`/api/periods?source=songs&grain=${grain}`);
      const data = await res.json();
      const nextPeriods = Array.isArray(data) ? data : [];
      setPeriods(nextPeriods);
      setSelectedDate(nextPeriods[0]?.period_date?.split(' ')[0] || '');
      setShowWrapped(false);
    }
    loadPeriods();
  }, [grain]);

  const formatPeriod = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const generateWrapped = async () => {
    if (!selectedDate) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/wrapped?grain=${grain}&date=${selectedDate}`);
      const data = await res.json();
      setWrappedData({ ...defaultWrapped, ...data });
      setShowWrapped(true);
    } catch (error) {
      console.error('Failed to generate wrapped:', error);
    } finally {
      setLoading(false);
    }
  };

  if (showWrapped) {
    return (
      <div className="relative h-full min-h-[70vh]">
        <button onClick={() => setShowWrapped(false)} className="absolute top-4 left-4 z-50 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20">
          ← Back to Wrapped Builder
        </button>
        <SpotifyWrapped data={wrappedData} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl text-white mb-2">Wrapped Builder</h2>
        <p className="text-gray-400">Choose your time period and generate a personalized slideshow from your data.</p>
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Time Grain</label>
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
              {['weekly', 'monthly', 'yearly'].map((option) => (
                <button
                  key={option}
                  onClick={() => setGrain(option)}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-black uppercase ${grain === option ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Period Date</label>
            <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium text-white">
              {periods.map((p, idx) => {
                const normalized = p.period_date.split(' ')[0];
                return (
                  <option key={idx} value={normalized}>
                    {formatPeriod(normalized)}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex items-end">
            <button onClick={generateWrapped} disabled={!selectedDate || loading} className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 flex items-center justify-center gap-2">
              <Wand2 className="w-4 h-4" />
              {loading ? 'Generating…' : 'Generate Wrapped'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-xl text-white mb-4">Available Periods</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {periods.slice(0, 8).map((p, index) => {
            const normalized = p.period_date.split(' ')[0];
            return (
              <button
                key={`${normalized}-${index}`}
                onClick={() => setSelectedDate(normalized)}
                className={`text-left p-4 rounded-lg border transition-colors ${selectedDate === normalized ? 'border-purple-500 bg-purple-500/10' : 'border-gray-800 hover:border-gray-700 bg-gray-900/70'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white">{formatPeriod(normalized)}</p>
                    <p className="text-xs text-gray-400 uppercase">{grain}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
