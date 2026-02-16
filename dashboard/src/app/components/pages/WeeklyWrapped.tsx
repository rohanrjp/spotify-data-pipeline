import { useState } from 'react';
import { SpotifyWrapped } from '../SpotifyWrapped';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const weeks = [
  { id: 1, label: 'Week of Feb 9 - Feb 15', date: 'Feb 9, 2026' },
  { id: 2, label: 'Week of Feb 2 - Feb 8', date: 'Feb 2, 2026' },
  { id: 3, label: 'Week of Jan 26 - Feb 1', date: 'Jan 26, 2026' },
  { id: 4, label: 'Week of Jan 19 - Jan 25', date: 'Jan 19, 2026' },
  { id: 5, label: 'Week of Jan 12 - Jan 18', date: 'Jan 12, 2026' },
];

export function WeeklyWrapped() {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [showWrapped, setShowWrapped] = useState(false);

  const handlePrevWeek = () => {
    if (selectedWeek < weeks.length - 1) {
      setSelectedWeek(selectedWeek + 1);
      setShowWrapped(false);
    }
  };

  const handleNextWeek = () => {
    if (selectedWeek > 0) {
      setSelectedWeek(selectedWeek - 1);
      setShowWrapped(false);
    }
  };

  if (showWrapped) {
    return (
      <div className="relative h-full">
        <button
          onClick={() => setShowWrapped(false)}
          className="absolute top-4 left-4 z-50 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-colors"
        >
          ← Back to Week Selection
        </button>
        <SpotifyWrapped weekLabel={weeks[selectedWeek].label} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl text-white mb-2">Weekly Wrapped</h2>
        <p className="text-gray-400">View your listening highlights for each week</p>
      </div>

      {/* Week Selector */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handlePrevWeek}
            disabled={selectedWeek >= weeks.length - 1}
            className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          
          <div className="text-center flex-1">
            <Calendar className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <h3 className="text-2xl text-white mb-1">{weeks[selectedWeek].label}</h3>
            <p className="text-gray-400">{weeks[selectedWeek].date}</p>
          </div>

          <button
            onClick={handleNextWeek}
            disabled={selectedWeek <= 0}
            className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>

        <button
          onClick={() => setShowWrapped(true)}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white text-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
        >
          View This Week's Wrapped
        </button>
      </div>

      {/* All Weeks List */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-xl text-white">Recent Weeks</h3>
        </div>
        <div className="divide-y divide-gray-800">
          {weeks.map((week, index) => (
            <div
              key={week.id}
              onClick={() => {
                setSelectedWeek(index);
                setShowWrapped(true);
              }}
              className={`flex items-center justify-between p-6 hover:bg-gray-800/50 transition-colors cursor-pointer ${
                index === selectedWeek ? 'bg-gray-800/30' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white mb-1">{week.label}</h4>
                  <p className="text-sm text-gray-400">{week.date}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Stats Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-900 to-pink-900 border border-purple-500/50 rounded-xl p-6">
          <h4 className="text-lg text-white/80 mb-2">This Week</h4>
          <p className="text-4xl text-white mb-1">1,683 min</p>
          <p className="text-sm text-white/60">Listening time</p>
        </div>
        <div className="bg-gradient-to-br from-green-900 to-emerald-900 border border-green-500/50 rounded-xl p-6">
          <h4 className="text-lg text-white/80 mb-2">Top Artist</h4>
          <p className="text-4xl text-white mb-1">Taylor Swift</p>
          <p className="text-sm text-white/60">342 plays</p>
        </div>
        <div className="bg-gradient-to-br from-orange-900 to-red-900 border border-orange-500/50 rounded-xl p-6">
          <h4 className="text-lg text-white/80 mb-2">Top Genre</h4>
          <p className="text-4xl text-white mb-1">Pop</p>
          <p className="text-sm text-white/60">45% of listening</p>
        </div>
      </div>
    </div>
  );
}
