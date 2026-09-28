export default function AppointmentCard({
  patientName,
  doctorName,
  date,
  timeSlot,
  status,
}) {
  const normalizedStatus = (status || '').toLowerCase();

  return (
    <div className="appointment-card">
      <div className="card-header">
        <h3>{patientName}</h3>
        <span className={`status-badge ${normalizedStatus}`}>
          {status}
        </span>
      </div>

      <div className="card-body">
        <p>
          <strong>Doctor:</strong> {doctorName}
        </p>
        <p>
          <strong>Date:</strong> {date}
        </p>
        <p>
          <strong>Time:</strong> {timeSlot}
        </p>
        <p>
          <strong>Status:</strong> {status}
        </p>
      </div>
    </div>
  );
}
