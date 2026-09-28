import { useEffect, useState } from 'react';

export default function BookingPage() {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    patientName: '',
    doctorName: '',
    date: '',
    timeSlot: '',
    reason: 'General consultation',
  });
  const [status, setStatus] = useState({
    type: 'idle',
    message: '',
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/doctors');
        if (!response.ok) {
          throw new Error('Unable to load doctors');
        }

        const result = await response.json();
        setDoctors(Array.isArray(result.data) ? result.data : []);
      } catch (error) {
        setStatus({
          type: 'error',
          message: error.message || 'Unable to load doctors right now.',
        });
      }
    };

    fetchDoctors();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      patientName: formData.patientName.trim(),
      doctorName: formData.doctorName,
      date: formData.date,
      timeSlot: formData.timeSlot.trim(),
      status: 'pending',
      reason: formData.reason.trim() || 'General consultation',
    };

    if (!payload.patientName || !payload.doctorName || !payload.date || !payload.timeSlot) {
      setStatus({
        type: 'error',
        message: 'Please complete all booking details before submitting.',
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/v1/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Unable to create appointment.');
      }

      setStatus({
        type: 'success',
        message: result.message || 'Appointment created successfully.',
      });

      setFormData({
        patientName: '',
        doctorName: '',
        date: '',
        timeSlot: '',
        reason: 'General consultation',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message,
      });
    }
  };

  return (
    <section className="page-section">
      <div className="section-heading">
        <p className="eyebrow">Appointments</p>
        <h2>Book a Consultation</h2>
      </div>

      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            Patient Name
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              placeholder="Enter patient name"
            />
          </label>
          <label>
            Doctor Name
            <select
              name="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
            >
              <option value="">Select doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.name}>
                  {doctor.name} - {doctor.specialisation}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="form-row">
          <label>
            Date
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </label>
          <label>
            Time Slot
            <input
              type="text"
              name="timeSlot"
              value={formData.timeSlot}
              onChange={handleChange}
              placeholder="e.g. 10:30 AM"
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            Reason for visit
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows="3"
              placeholder="Brief reason for the appointment"
            />
          </label>
        </div>

        <div className="booking-preview">
          <h3>Selected Appointment</h3>
          {status.type === 'success' ? (
            <>
              <p>
                <strong>Patient:</strong> {formData.patientName || 'Aarav Patel'}
              </p>
              <p>
                <strong>Doctor:</strong> {formData.doctorName || 'Dr. Ananya Sharma'}
              </p>
              <p>
                <strong>Date:</strong> {formData.date || '2026-10-05'}
              </p>
              <p>
                <strong>Time:</strong> {formData.timeSlot || '11:00 AM'}
              </p>
              <div className="confirmation-box">
                <strong>Appointment booked successfully.</strong>
                <span>Your consultation request has been confirmed with MedCare Plus.</span>
              </div>
            </>
          ) : (
            <>
              <p>
                <strong>Patient:</strong> {formData.patientName || 'Not entered yet'}
              </p>
              <p>
                <strong>Doctor:</strong> {formData.doctorName || 'Not selected yet'}
              </p>
              <p>
                <strong>Date:</strong> {formData.date || 'Not selected yet'}
              </p>
              <p>
                <strong>Time:</strong> {formData.timeSlot || 'Not selected yet'}
              </p>
            </>
          )}
        </div>

        {status.message && (
          <div className={`form-status ${status.type}`}>
            {status.type === 'success' ? '✅' : '⚠️'} {status.message}
          </div>
        )}

        <button type="submit" className="submit-btn">
          Confirm Booking
        </button>
      </form>
    </section>
  );
}
