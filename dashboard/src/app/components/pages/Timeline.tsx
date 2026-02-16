import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format } from 'date-fns';

const weeklyComparison = [
  { week: 'Week 1', thisYear: 845, lastYear: 723 },
  { week: 'Week 2', thisYear: 923, lastYear: 812 },
  { week: 'Week 3', thisYear: 1012, lastYear: 856 },
  { week: 'Week 4', thisYear: 1098, lastYear: 934 },
];

export function Timeline() {
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [topMonths, setTopMonths] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTimeline() {
      try {
        const res = await fetch('/api/timeline');
        const data = await res.json();

        // Aggregate daily data to monthly for the chart
        const monthlyAggregation: Record<string, any> = {};

        data.forEach((item: any) => {
          const date = new Date(item.date);
          const monthKey = format(date, 'MMM yyyy');

          if (!monthlyAggregation[monthKey]) {
            monthlyAggregation[monthKey] = {
              month: monthKey,
              rawDate: date,
              plays: 0,
              hours: 0,
              artists: Math.floor(Math.random() * 100) + 50 // Mocking
            };
          }
          monthlyAggregation[monthKey].plays += parseInt(item.count);
          monthlyAggregation[monthKey].hours += Math.round(parseInt(item.count) * 0.05); // Mock hours
        });

        const sortedMonths = Object.values(monthlyAggregation).sort((a: any, b: any) => a.rawDate - b.rawDate);
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
  }, []);

  if (loading) return <div className="p-6 text-white">Loading timeline...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl text-white mb-2">Listening Timeline</h2>
        <p className="text-gray-400">Track your music journey over time</p>
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
        <h3 className="text-xl text-white mb-6">This Month vs Last Year</h3>
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
        <div className="flex justify-center gap-8 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            <span className="text-sm text-gray-400">Feb 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-gray-400">Feb 2026</span>
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
