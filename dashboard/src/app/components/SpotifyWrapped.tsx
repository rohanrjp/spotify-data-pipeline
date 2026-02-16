import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Music, TrendingUp, Heart, Calendar, Clock, ChevronRight, ChevronLeft } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Mock data - replace with your actual data source
const getWeeklyData = (weekLabel?: string) => ({
  weekLabel: weekLabel || 'Week of Feb 9 - Feb 15, 2026',
  totalMinutes: 1683,
  topArtists: [
    { name: 'Taylor Swift', plays: 342, imageUrl: 'https://images.unsplash.com/photo-1767755254671-ea10b27552f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
    { name: 'The Weeknd', plays: 289, imageUrl: 'https://images.unsplash.com/photo-1767755254671-ea10b27552f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
    { name: 'Drake', plays: 234, imageUrl: 'https://images.unsplash.com/photo-1767755254671-ea10b27552f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
    { name: 'Billie Eilish', plays: 198, imageUrl: 'https://images.unsplash.com/photo-1767755254671-ea10b27552f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
    { name: 'Bad Bunny', plays: 167, imageUrl: 'https://images.unsplash.com/photo-1767755254671-ea10b27552f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  ],
  topSongs: [
    { name: 'Anti-Hero', artist: 'Taylor Swift', plays: 87 },
    { name: 'Blinding Lights', artist: 'The Weeknd', plays: 76 },
    { name: 'One Dance', artist: 'Drake', plays: 68 },
    { name: 'bad guy', artist: 'Billie Eilish', plays: 61 },
    { name: 'Tití Me Preguntó', artist: 'Bad Bunny', plays: 54 },
  ],
  topGenres: ['Pop', 'Hip-Hop', 'R&B', 'Alternative', 'Latin'],
  listeningPersonality: 'The Adventurer',
  totalArtists: 87,
  totalSongs: 243,
  topDay: 'Saturday',
});

const slides = [
  'intro',
  'minutes',
  'top-artist',
  'top-songs',
  'genres',
  'personality',
  'summary',
];

export function SpotifyWrapped({ weekLabel }: { weekLabel?: string }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const wrappedData = getWeeklyData(weekLabel);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(currentSlide - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-purple-900 via-black to-green-900">
      {/* Navigation */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentSlide ? 1 : -1);
              setCurrentSlide(index);
            }}
            className={`h-1 rounded-full transition-all ${
              index === currentSlide ? 'w-8 bg-white' : 'w-1 bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      {currentSlide > 0 && (
        <button
          onClick={prevSlide}
          className="absolute left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}
      {currentSlide < slides.length - 1 && (
        <button
          onClick={nextSlide}
          className="absolute right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Slides */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {slides[currentSlide] === 'intro' && <IntroSlide data={wrappedData} />}
          {slides[currentSlide] === 'minutes' && <MinutesSlide data={wrappedData} />}
          {slides[currentSlide] === 'top-artist' && <TopArtistSlide data={wrappedData} />}
          {slides[currentSlide] === 'top-songs' && <TopSongsSlide data={wrappedData} />}
          {slides[currentSlide] === 'genres' && <GenresSlide data={wrappedData} />}
          {slides[currentSlide] === 'personality' && <PersonalitySlide data={wrappedData} />}
          {slides[currentSlide] === 'summary' && <SummarySlide data={wrappedData} />}
        </motion.div>
      </AnimatePresence>

      {/* Tap to continue hint */}
      {currentSlide < slides.length - 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm"
        >
          Click arrow or use keyboard →
        </motion.div>
      )}
    </div>
  );
}

function IntroSlide({ data }: { data: ReturnType<typeof getWeeklyData> }) {
  return (
    <div className="text-center px-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <Music className="w-24 h-24 text-green-400 mx-auto mb-8" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-5xl mb-4 text-white"
      >
        {data.weekLabel}
      </motion.h1>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-4xl text-green-400"
      >
        Your Weekly Wrapped
      </motion.h2>
    </div>
  );
}

function MinutesSlide({ data }: { data: ReturnType<typeof getWeeklyData> }) {
  const [count, setCount] = useState(0);
  const targetMinutes = data.totalMinutes;

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = targetMinutes / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setCount(Math.floor(increment * currentStep));
      } else {
        setCount(targetMinutes);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Clock className="w-16 h-16 text-purple-400 mx-auto mb-8" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl text-white/80 mb-4"
      >
        You listened to
      </motion.p>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.4 }}
        className="text-8xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
      >
        {count.toLocaleString()}
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-3xl text-white"
      >
        minutes of music
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-xl text-white/60 mt-8"
      >
        That's {Math.round(targetMinutes / 60)} hours this week
      </motion.p>
    </div>
  );
}

function TopArtistSlide({ data }: { data: ReturnType<typeof getWeeklyData> }) {
  const topArtist = data.topArtists[0];

  return (
    <div className="text-center px-8 max-w-2xl mx-auto">
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl text-white/80 mb-8"
      >
        Your #1 Artist
      </motion.p>
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="w-64 h-64 mx-auto mb-8 rounded-full overflow-hidden border-4 border-green-400 shadow-2xl"
      >
        <ImageWithFallback
          src={topArtist.imageUrl}
          alt={topArtist.name}
          className="w-full h-full object-cover"
        />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-6xl mb-4 text-white"
      >
        {topArtist.name}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-2xl text-white/70"
      >
        {topArtist.plays.toLocaleString()} plays
      </motion.p>

      {/* Other top artists */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-12 flex justify-center gap-4"
      >
        {data.topArtists.slice(1, 5).map((artist, index) => (
          <div key={index} className="text-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-2">
              <span className="text-white/60">#{index + 2}</span>
            </div>
            <p className="text-sm text-white/60">{artist.name}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function TopSongsSlide({ data }: { data: ReturnType<typeof getWeeklyData> }) {
  return (
    <div className="text-center px-8 max-w-3xl mx-auto">
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl text-white/80 mb-12"
      >
        Your Top Songs
      </motion.p>
      <div className="space-y-6">
        {data.topSongs.map((song, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
            className="flex items-center gap-6 bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-colors"
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl text-white">{index + 1}</span>
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-2xl text-white mb-1">{song.name}</h3>
              <p className="text-lg text-white/60">{song.artist}</p>
            </div>
            <div className="text-right">
              <p className="text-xl text-green-400">{song.plays}</p>
              <p className="text-sm text-white/40">plays</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function GenresSlide({ data }: { data: ReturnType<typeof getWeeklyData> }) {
  return (
    <div className="text-center px-8 max-w-4xl mx-auto">
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl text-white/80 mb-12"
      >
        Your Top Genres
      </motion.p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        {data.topGenres.map((genre, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.1, type: 'spring', stiffness: 200, damping: 15 }}
            className="aspect-square rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center p-8 hover:scale-105 transition-transform"
            style={{
              backgroundImage: `linear-gradient(135deg, ${getGenreColors(index)})`,
            }}
          >
            <div className="text-center">
              <div className="text-5xl mb-2">#{index + 1}</div>
              <div className="text-2xl">{genre}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PersonalitySlide({ data }: { data: ReturnType<typeof getWeeklyData> }) {
  return (
    <div className="text-center px-8 max-w-2xl mx-auto">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <Heart className="w-24 h-24 text-pink-400 mx-auto mb-8" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl text-white/80 mb-8"
      >
        Your Listening Vibe This Week
      </motion.p>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 150, damping: 15, delay: 0.5 }}
        className="text-7xl mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"
      >
        {data.listeningPersonality}
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-xl text-white/70 leading-relaxed"
      >
        You're always exploring new sounds and discovering fresh artists. Your playlist is a journey through diverse musical landscapes.
      </motion.p>
    </div>
  );
}

function SummarySlide({ data }: { data: ReturnType<typeof getWeeklyData> }) {
  return (
    <div className="text-center px-8 max-w-4xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl mb-16 text-white"
      >
        Your Week in Review
      </motion.h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-8"
        >
          <Clock className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <div className="text-4xl mb-2 text-white">{Math.round(data.totalMinutes / 60)}</div>
          <div className="text-white/60">Hours</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-8"
        >
          <Music className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <div className="text-4xl mb-2 text-white">{data.totalArtists}</div>
          <div className="text-white/60">Artists</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-8"
        >
          <Play className="w-12 h-12 text-pink-400 mx-auto mb-4" />
          <div className="text-4xl mb-2 text-white">{data.totalSongs}</div>
          <div className="text-white/60">Songs</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-8"
        >
          <Calendar className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <div className="text-4xl mb-2 text-white">{data.topDay}</div>
          <div className="text-white/60">Top Day</div>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-16"
      >
        <div className="text-2xl text-white/80 mb-4">See you next week!</div>
        <div className="text-lg text-white/60">Keep discovering great music 🎵</div>
      </motion.div>
    </div>
  );
}

function getGenreColors(index: number): string {
  const colors = [
    '#8B5CF6, #EC4899',
    '#06B6D4, #3B82F6',
    '#F59E0B, #EF4444',
    '#10B981, #06B6D4',
    '#EC4899, #F59E0B',
  ];
  return colors[index % colors.length];
}