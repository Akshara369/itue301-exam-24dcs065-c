export const doctors = [
  {
    id: 1,
    name: 'Dr. Ananya Sharma',
    email: 'ananya.sharma@medcareplus.com',
    specialisation: 'Cardiology',
    available: 'Mon - Fri, 9:00 AM - 4:00 PM',
  },
  {
    id: 2,
    name: 'Dr. Rohan Mehta',
    email: 'rohan.mehta@medcareplus.com',
    specialisation: 'Dermatology',
    available: 'Tue - Sat, 10:00 AM - 5:00 PM',
  },
  {
    id: 3,
    name: 'Dr. Nisha Iyer',
    email: 'nisha.iyer@medcareplus.com',
    specialisation: 'Pediatrics',
    available: 'Mon, Wed, Fri, 8:30 AM - 2:30 PM',
  },
];

export const appointments = [
  {
    patientName: 'Aarav Patel',
    doctorName: 'Dr. Ananya Sharma',
    date: '2026-10-02',
    timeSlot: '10:30 AM',
    status: 'confirmed',
  },
  {
    patientName: 'Meera Nair',
    doctorName: 'Dr. Rohan Mehta',
    date: '2026-10-03',
    timeSlot: '2:00 PM',
    status: 'pending',
  },
  {
    patientName: 'Karan Singh',
    doctorName: 'Dr. Nisha Iyer',
    date: '2026-10-04',
    timeSlot: '11:15 AM',
    status: 'cancelled',
  },
];
