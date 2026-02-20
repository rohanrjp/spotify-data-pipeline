import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format } from 'date-fns';
import { Skeleton } from '@/app/components/ui/skeleton';

interface TimelineMonth {
  month: string;
  rawDate: Date;
  plays: number;
  hours: number;
}

interface TopMonth {
  month: string;
  year: string;
  plays: number;
  hours: number;
  highlight: boolean;
}

interface WeeklyComparison {
  week: string;
  thisYear: number;
  lastYear: number;
}

interface ArtistDiscovery {
  month: string;
  artists: number;
}

export function Timeline() {
  const [timelineData, setTimelineData] = useState<TimelineMonth[]>([]);
  const [topMonths, setTopMonths] = useState<TopMonth[]>([]);
  const [weeklyComparison, setWeeklyComparison] = useState<WeeklyComparison[]>([]);
  const [artistDiscoveryData, setArtistDiscoveryData] = useState<ArtistDiscovery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTimeline() {
      try {
        const res = await fetch('/api/timeline');
        const data = await res.json();

        const monthly = (data.monthly ?? []).map((item: any) => {
          const date = new Date(item.period_date);
          return {
            month: format(date, 'MMM yyyy'),
            rawDate: date,
            plays: Number(item.plays),
            hours: Math.round((Number(item.hours) || 0) / 60)
          };
        });

        setTimelineData(monthly);

        const sortedByPlays = [...monthly].sort((a, b) => b.plays - a.plays).slice(0, 3);
        setTopMonths(sortedByPlays.map((m, idx) => ({
          month: format(m.rawDate, 'MMMM'),
          year: format(m.rawDate, 'yyyy'),
          plays: m.plays,
          hours: m.hours,
          highlight: idx === 0
        })));

        setWeeklyComparison((data.weekly ?? []).map((item: any) => ({
          week: item.week,
          thisYear: Number(item.this_year),
          lastYear: Number(item.last_year)
        })));

        setArtistDiscoveryData((data.artistDiscovery ?? []).map((item: any) => ({
          month: format(new Date(item.period_date), 'MMM yyyy'),
          artists: Number(item.artists)
        })));
      } catch (error) {
        console.error('Failed to fetch timeline:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTimeline();
  }, []);

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
      <div>
        <h2 className="text-3xl text-white mb-2">Listening Timeline</h2>
        <p className="text-gray-400">Track your music journey over time</p>
      </div>

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

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-xl text-white mb-6">This Year vs Last Year</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={weeklyComparison}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="week" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
            />
            <Area type="monotone" dataKey="lastYear" stroke="#6b7280" fill="#6b7280" fillOpacity={0.3} />
            <Area type="monotone" dataKey="thisYear" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-xl text-white mb-6">Artist Discovery Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={artistDiscoveryData}>
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
