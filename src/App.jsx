import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import MapPage from './pages/MapPage';
import { mockShellfishData } from './data/mockShellfishData';

export default function App() {
  return (
    <BrowserRouter basename="/shellfish-farm-dashboard">
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
        <footer className="dashboard-footer">
          <p>
            Shellfish Farm Outplant Dashboard · Simulated data ·{' '}
            {mockShellfishData.length.toLocaleString()} total records
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}
