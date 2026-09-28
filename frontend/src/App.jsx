import { BrowserRouter, NavLink, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DoctorsPage from './pages/DoctorsPage';
import BookingPage from './pages/BookingPage';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/doctors', label: 'Doctors' },
  { to: '/booking', label: 'Booking' },
];

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="topbar">
          <div className="brand-block">
            <div className="brand-mark">+</div>
            <div>
              <p className="brand-kicker">Hospital Appointment System</p>
              <h1>MedCare Plus</h1>
            </div>
          </div>

          <nav className="nav-bar" aria-label="Main navigation">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  isActive ? 'nav-btn active' : 'nav-btn'
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="page-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/booking" element={<BookingPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
