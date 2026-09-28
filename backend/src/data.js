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
    id: 1,
    patientId: 'P1001',
    doctorId: 1,
    date: '2026-10-02',
    timeSlot: '10:30 AM',
    status: 'confirmed',
    reason: 'Chest pain review',
  },
  {
    id: 2,
    patientId: 'P1002',
    doctorId: 2,
    date: '2026-10-03',
    timeSlot: '2:00 PM',
    status: 'pending',
    reason: 'Skin consultation',
  },
];
