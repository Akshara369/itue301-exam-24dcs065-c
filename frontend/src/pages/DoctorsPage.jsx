import { useEffect, useState } from 'react';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch('http://localhost:5000/api/v1/doctors');

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const result = await response.json();
        setDoctors(Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        setError(err.message || 'Unable to load doctors right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <section className="page-section">
        <div className="section-heading">
          <p className="eyebrow">Team</p>
          <h2>Available Doctors</h2>
        </div>
        <p>Loading doctors...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page-section">
        <div className="section-heading">
          <p className="eyebrow">Team</p>
          <h2>Available Doctors</h2>
        </div>
        <p className="error-message">Error: {error}</p>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="section-heading">
        <p className="eyebrow">Team</p>
        <h2>Available Doctors</h2>
      </div>

      <div className="doctors-grid">
        {doctors.map((doctor) => (
          <article key={doctor.id || doctor._id} className="doctor-card">
            <div className="doctor-avatar">{doctor.name?.charAt(0) || 'D'}</div>
            <h3>{doctor.name}</h3>
            <p>{doctor.specialisation}</p>
            <p>{doctor.email}</p>
            <small>{doctor.available ? 'Available today' : 'Currently unavailable'}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
