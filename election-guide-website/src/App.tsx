import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppShell } from './components';
import {
  HomePage,
  TimelinePage,
  MapPage,
  GuidePage,
  StepDetailPage,
  PMHistoryPage,
  PresidentHistoryPage,
  SearchPage,
  FAQPage,
  ElectionResultsHistoryPage,
  AdminPage,
  NotFoundPage,
} from './pages';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'timeline/:type', element: <TimelinePage /> },
      { path: 'map', element: <MapPage /> },
      { path: 'guide', element: <GuidePage /> },
      { path: 'guide/:stepId', element: <StepDetailPage /> },
      { path: 'pm-history', element: <PMHistoryPage /> },
      { path: 'president-history', element: <PresidentHistoryPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'faq', element: <FAQPage /> },
      { path: 'election-history', element: <ElectionResultsHistoryPage /> },
      { path: 'admin', element: <AdminPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
