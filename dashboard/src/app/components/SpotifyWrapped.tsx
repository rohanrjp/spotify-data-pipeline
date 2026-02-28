import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Music, Heart, Calendar, Clock, ChevronRight, ChevronLeft } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export type WrappedData = {
  weekLabel: string;
  totalMinutes: number;
  topArtists: Array<{ name: string; plays: number; imageUrl?: string }>;
  topSongs: Array<{ name: string; artist: string; plays: number }>;
  topGenres: string[];
  listeningPersonality: string;
  totalArtists: number;
  totalSongs: number;
  topDay: string;
};

const slides = ['intro', 'minutes', 'top-artist', 'top-songs', 'genres', 'personality', 'summary'] as const;

export function SpotifyWrapped({ data }: { data: WrappedData }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

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

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-purple-900 via-black to-green-900">
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentSlide ? 1 : -1);
              setCurrentSlide(index);
            }}
            className={`h-1 rounded-full transition-all ${index === currentSlide ? 'w-8 bg-white' : 'w-1 bg-white/40'}`}
          />
        ))}
      </div>

      {currentSlide > 0 && (
        <button onClick={prevSlide} className="absolute left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}
      {currentSlide < slides.length - 1 && (
        <button onClick={nextSlide} className="absolute right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20">
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      )}

      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          initial={{ x: direction > 0 ? 1000 : -1000, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction < 0 ? 1000 : -1000, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {slides[currentSlide] === 'intro' && <IntroSlide data={data} />}
          {slides[currentSlide] === 'minutes' && <MinutesSlide data={data} />}
          {slides[currentSlide] === 'top-artist' && <TopArtistSlide data={data} />}
          {slides[currentSlide] === 'top-songs' && <TopSongsSlide data={data} />}
          {slides[currentSlide] === 'genres' && <GenresSlide data={data} />}
          {slides[currentSlide] === 'personality' && <PersonalitySlide data={data} />}
          {slides[currentSlide] === 'summary' && <SummarySlide data={data} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function IntroSlide({ data }: { data: WrappedData }) {
  return (
    <div className="text-center px-8">
      <h1 className="text-5xl mb-4 text-white">{data.weekLabel}</h1>
      <h2 className="text-4xl text-green-400">Your Spotify Wrapped</h2>
    </div>
  );
}

function MinutesSlide({ data }: { data: WrappedData }) {
  return (
    <div className="text-center px-8">
      <Clock className="w-16 h-16 text-purple-400 mx-auto mb-8" />
      <p className="text-2xl text-white/80 mb-4">You listened to</p>
      <div className="text-8xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{data.totalMinutes.toLocaleString()}</div>
      <p className="text-3xl text-white">minutes of music</p>
    </div>
  );
}

function TopArtistSlide({ data }: { data: WrappedData }) {
  const topArtist = data.topArtists[0];
  if (!topArtist) return null;

  return (
    <div className="text-center px-8 max-w-2xl mx-auto">
      <p className="text-2xl text-white/80 mb-8">Your #1 Artist</p>
      <div className="w-64 h-64 mx-auto mb-8 rounded-full overflow-hidden border-4 border-green-400 shadow-2xl">
        <ImageWithFallback src={topArtist.imageUrl || ''} alt={topArtist.name} className="w-full h-full object-cover" />
      </div>
      <h2 className="text-6xl mb-4 text-white">{topArtist.name}</h2>
      <p className="text-2xl text-white/70">{topArtist.plays.toLocaleString()} plays</p>
    </div>
  );
}

function TopSongsSlide({ data }: { data: WrappedData }) {
  return (
    <div className="text-center px-8 max-w-3xl mx-auto">
      <p className="text-2xl text-white/80 mb-8">Your Top Songs</p>
      <div className="space-y-4">
        {data.topSongs.map((song, index) => (
          <div key={`${song.name}-${index}`} className="flex items-center gap-6 bg-white/5 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">{index + 1}</div>
            <div className="flex-1 text-left">
              <h3 className="text-2xl text-white mb-1">{song.name}</h3>
              <p className="text-lg text-white/60">{song.artist}</p>
            </div>
            <div className="text-right text-green-400">{song.plays}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GenresSlide({ data }: { data: WrappedData }) {
  return (
    <div className="text-center px-8 max-w-4xl mx-auto">
      <p className="text-2xl text-white/80 mb-12">Your Top Genres</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        {data.topGenres.map((genre, index) => (
          <div key={index} className="aspect-square rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="text-5xl mb-2">#{index + 1}</div>
              <div className="text-2xl">{genre}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PersonalitySlide({ data }: { data: WrappedData }) {
  return (
    <div className="text-center px-8 max-w-2xl mx-auto">
      <Heart className="w-24 h-24 text-pink-400 mx-auto mb-8" />
      <p className="text-2xl text-white/80 mb-8">Your Listening Personality</p>
      <div className="text-7xl mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">{data.listeningPersonality}</div>
    </div>
  );
}

function SummarySlide({ data }: { data: WrappedData }) {
  return (
    <div className="text-center px-8 max-w-4xl mx-auto">
      <h2 className="text-5xl mb-16 text-white">Your Period in Review</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="bg-white/5 rounded-2xl p-8">
          <Clock className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <div className="text-4xl mb-2 text-white">{Math.round(data.totalMinutes / 60)}</div>
          <div className="text-white/60">Hours</div>
        </div>
        <div className="bg-white/5 rounded-2xl p-8">
          <Music className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <div className="text-4xl mb-2 text-white">{data.totalArtists}</div>
          <div className="text-white/60">Artists</div>
        </div>
        <div className="bg-white/5 rounded-2xl p-8">
          <Play className="w-12 h-12 text-pink-400 mx-auto mb-4" />
          <div className="text-4xl mb-2 text-white">{data.totalSongs}</div>
          <div className="text-white/60">Songs</div>
        </div>
        <div className="bg-white/5 rounded-2xl p-8">
          <Calendar className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <div className="text-4xl mb-2 text-white">{data.topDay}</div>
          <div className="text-white/60">Top Day</div>
        </div>
      </div>
    </div>
  );
}
