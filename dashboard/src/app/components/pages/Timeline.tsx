import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format } from 'date-fns';
import { Skeleton } from '@/app/components/ui/skeleton';

const grainLabelMap: Record<string, string> = {
  weekly: 'Week',
  monthly: 'Month',
  yearly: 'Year',
};

export function Timeline() {
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [topMonths, setTopMonths] = useState<any[]>([]);
  const [grain, setGrain] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTimeline() {
      setLoading(true);
      try {
        const res = await fetch(`/api/timeline?grain=${grain}`);
        const data = await res.json();

        const sortedMonths = (Array.isArray(data) ? data : []).map((item: any) => {
          const rawDate = new Date(item.date);
          const label = grain === 'weekly'
            ? format(rawDate, 'dd MMM yyyy')
            : grain === 'monthly'
              ? format(rawDate, 'MMM yyyy')
              : format(rawDate, 'yyyy');

          return {
            rawDate,
            month: label,
            plays: Number(item.count || 0),
            hours: Number(item.hours || 0),
            artists: Number(item.artists || 0),
          };
        }).sort((a: any, b: any) => a.rawDate - b.rawDate);

        setTimelineData(sortedMonths);

        // Determine top months
        const sortedByPlays = [...sortedMonths].sort((a: any, b: any) => b.plays - a.plays).slice(0, 3);
        setTopMonths(sortedByPlays.map((m: any, idx: number) => ({
          month: format(m.rawDate, 'MMMM'),
          year: format(m.rawDate, 'yyyy'),
          plays: m.plays,
          hours: m.hours,
          highlight: idx === 0
        })));

      } catch (error) {
        console.error('Failed to fetch timeline:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTimeline();
  }, [grain]);

  const comparisonData = timelineData.slice(-8).map((entry: any, index: number) => {
    const previousIndex = index - 1;
    return {
      period: entry.month,
      current: entry.plays,
      previous: previousIndex >= 0 ? timelineData[timelineData.length - 8 + previousIndex]?.plays || 0 : 0,
    };
  });

  if (loading) return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>

      <Skeleton className="h-[400px] rounded-xl" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-[300px] rounded-xl" />
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl text-white mb-2">Listening Timeline</h2>
        <p className="text-gray-400">Track your music journey over time</p>
        <div className="mt-4 inline-flex bg-white/5 p-1 rounded-xl border border-white/10">
          {(['weekly', 'monthly', 'yearly'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setGrain(option)}
              className={`px-3 py-2 rounded-lg text-xs font-black uppercase ${grain === option ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Top Months */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topMonths.map((month, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${month.highlight ? 'from-purple-900 to-pink-900 border-purple-500' : 'from-gray-900 to-gray-800 border-gray-800'
              } border rounded-xl p-6`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-lg ${month.highlight ? 'bg-purple-500' : 'bg-gray-700'
                } flex items-center justify-center text-white`}>
                {index + 1}
              </div>
              <div>
                <h3 className="text-xl text-white">{month.month}</h3>
                <p className="text-sm text-gray-400">{month.year}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl text-green-400">{month.plays}</p>
                <p className="text-xs text-gray-400">Plays</p>
              </div>
              <div>
                <p className="text-2xl text-purple-400">{month.hours}h</p>
                <p className="text-xs text-gray-400">Hours</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Trend */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl text-white">Monthly Listening Activity</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-gray-400">Plays</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-sm text-gray-400">Hours</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9ca3af" angle={-45} textAnchor="end" height={80} />
            <YAxis yAxisId="left" stroke="#9ca3af" />
            <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
            />
            <Line yAxisId="left" type="monotone" dataKey="plays" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} />
            <Line yAxisId="right" type="monotone" dataKey="hours" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly Comparison */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-xl text-white mb-6">{grainLabelMap[grain]}-to-{grainLabelMap[grain]} Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="period" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
            />
            <Area type="monotone" dataKey="previous" stroke="#6b7280" fill="#6b7280" fillOpacity={0.3} />
            <Area type="monotone" dataKey="current" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-8 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            <span className="text-sm text-gray-400">Previous {grainLabelMap[grain].toLowerCase()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-gray-400">Current {grainLabelMap[grain].toLowerCase()}</span>
          </div>
        </div>
      </div>

      {/* Artist Discovery Timeline */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-xl text-white mb-6">Artist Discovery Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9ca3af" angle={-45} textAnchor="end" height={80} />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
            />
            <Area type="monotone" dataKey="artists" stroke="#ec4899" fill="#ec4899" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
