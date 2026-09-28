import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppointmentCard from '../components/AppointmentCard';

export default function HomePage() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        const [appointmentsResponse, doctorsResponse] = await Promise.all([
          fetch('http://localhost:5000/api/v1/appointments'),
          fetch('http://localhost:5000/api/v1/doctors'),
        ]);

        if (!appointmentsResponse.ok || !doctorsResponse.ok) {
          throw new Error('Unable to load dashboard data.');
        }

        const appointmentsResult = await appointmentsResponse.json();
        const doctorsResult = await doctorsResponse.json();

        setAppointments(Array.isArray(appointmentsResult.data) ? appointmentsResult.data : []);
        setDoctors(Array.isArray(doctorsResult.data) ? doctorsResult.data : []);
      } catch (err) {
        setError(err.message || 'Unable to load appointments right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const availableDoctors = doctors.filter((doctor) => doctor.available).length;
  const pendingRequests = appointments.filter((appointment) => appointment.status === 'pending').length;

  return (
    <section className="page-section">
      <div className="hero-panel">
        <div className="hero-copy">
          <span className="hero-badge">24/7 patient-first care</span>
          <h2>Healthcare that feels personal, proactive, and reassuring.</h2>
          <p>
            MedCare Plus brings together verified specialists, flexible appointment booking,
            and a calmer patient journey designed to make every visit feel easier.
          </p>

          <div className="hero-actions">
            <Link to="/booking" className="primary-btn">
              Book Appointment
            </Link>
            <Link to="/doctors" className="secondary-btn">
              View Doctors
            </Link>
          </div>

          <div className="quality-row" aria-label="Care highlights">
            <span className="quality-pill">Same-day consults</span>
            <span className="quality-pill">Digital check-in</span>
            <span className="quality-pill">Trusted specialists</span>
          </div>
        </div>

        <div className="hero-metrics">
          <div className="metric-box highlight">
            <strong>1,248</strong>
            <span>Patients cared for</span>
          </div>
          <div className="metric-box">
            <strong>24</strong>
            <span>Specialists</span>
          </div>
          <div className="metric-box">
            <strong>4.9/5</strong>
            <span>Patient satisfaction</span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Today's Visits</span>
          <strong>{appointments.length}</strong>
        </div>
        <div className="stat-card">
          <span>Available Doctors</span>
          <strong>{availableDoctors}</strong>
        </div>
        <div className="stat-card">
          <span>Pending Requests</span>
          <strong>{pendingRequests}</strong>
        </div>
      </div>

      <div className="care-feature-strip" aria-label="Care advantages">
        <article className="care-card">
          <span className="care-icon">✚</span>
          <h4>Smart triage</h4>
          <p>Fast prioritization for urgent consultations and routine checkups.</p>
        </article>
        <article className="care-card">
          <span className="care-icon">🩺</span>
          <h4>Expert teams</h4>
          <p>Specialists across cardiology, family medicine, and preventive care.</p>
        </article>
        <article className="care-card">
          <span className="care-icon">⏱</span>
          <h4>On-time experience</h4>
          <p>Clear scheduling updates that keep patients informed at every step.</p>
        </article>
      </div>

      <div className="section-heading">
        <p className="eyebrow">Overview</p>
        <h3>Recent Appointments</h3>
      </div>

      {loading ? (
        <p>Loading appointments...</p>
      ) : error ? (
        <p className="error-message">Error: {error}</p>
      ) : (
        <div className="appointments-list">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment._id || `${appointment.patientName}-${appointment.date}`}
              patientName={appointment.patientName}
              doctorName={appointment.doctorName}
              date={appointment.date}
              timeSlot={appointment.timeSlot}
              status={appointment.status}
            />
          ))}
        </div>
      )}
    </section>
  );
}
