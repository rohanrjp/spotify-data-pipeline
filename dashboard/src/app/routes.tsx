import { createBrowserRouter } from 'react-router';
import { DashboardLayout } from './components/DashboardLayout';
import { Overview } from './components/pages/Overview';
import { Artists } from './components/pages/Artists';
import { Songs } from './components/pages/Songs';
import { Albums } from './components/pages/Albums';
import { Timeline } from './components/pages/Timeline';
import { WeeklyWrapped } from './components/pages/WeeklyWrapped';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: DashboardLayout,
    children: [
      { index: true, Component: Overview },
      { path: 'artists', Component: Artists },
      { path: 'songs', Component: Songs },
      { path: 'albums', Component: Albums },
      { path: 'timeline', Component: Timeline },
      { path: 'weekly-wrapped', Component: WeeklyWrapped },
    ],
  },
]);
