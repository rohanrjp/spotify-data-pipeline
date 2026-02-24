import { Outlet, Link, useLocation } from 'react-router';
import { Home, Music, Disc3, Palette, TrendingUp, Sparkles, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Settings, Crown,} from 'lucide-react';
import { ModeToggle } from './mode-toggle';

const navigation = [
  { name: 'Overview', href: '/', icon: Home },
  { name: 'Artists', href: '/artists', icon: Music },
  { name: 'Songs', href: '/songs', icon: Disc3 },
  { name: 'Albums', href: '/albums', icon: Palette },
  { name: 'Timeline', href: '/timeline', icon: TrendingUp },
  { name: 'Weekly Wrapped', href: '/weekly-wrapped', icon: Sparkles },
];

export function DashboardLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 p-6 border-b border-sidebar-border">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-sidebar-foreground">Spotify Analytics</h1>
              <p className="text-xs text-sidebar-foreground/70">Your Music Insights</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-white/5 bg-gradient-to-t from-white/[0.02] to-transparent">
  <div className="group relative flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 hover:bg-white/[0.05] border border-transparent hover:border-white/10">
    
    {/* Avatar with Status Glow */}
    <div className="relative">
      <div className="w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 animate-gradient-xy">
        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden border-2 border-slate-900">
           {/* If you have an image, use it here, otherwise this gradient looks premium */}
           <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-cyan-400" />
        </div>
      </div>
      {/* Online Status Indicator */}
      <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0b0e14] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
    </div>

    {/* Identity */}
    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
        Rohan Paul
      </p>
      <div className="flex items-center gap-1.5">
        <Crown size={12} className="text-amber-400 fill-amber-400/20" />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-400">
          Premium
        </span>
      </div>
    </div>

    {/* Action Button */}
    <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-lg transition-all text-slate-500 hover:text-white">
      <Settings size={16} />
    </button>
  </div>
</div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-foreground p-2 hover:bg-accent rounded-lg"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground">
              {navigation.find((item) => item.href === location.pathname)?.name || 'Overview'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-accent/50 rounded-lg border border-border">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">Last synced: 2 hours ago</span>
            </div>
            <ModeToggle />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
