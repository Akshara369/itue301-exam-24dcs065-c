import express from 'express';
import dotenv from 'dotenv';
import { requestLogger, errorHandler } from './middleware.js';
import { connectMongo } from './db/connectMongo.js';
import { Patient } from './models/patient.model.js';
import { Doctor } from './models/doctor.model.js';
import { Appointment } from './models/appointment.model.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});
app.use(requestLogger);

app.get('/api/v1/appointments', async (req, res, next) => {
  try {
    await connectMongo();

    const appointmentDocs = await Appointment.find()
      .populate({ path: 'patientId', select: 'name email' })
      .populate({ path: 'doctorId', select: 'name specialisation' })
      .sort({ createdAt: -1 });

    const data = appointmentDocs.map((appointment) => ({
      _id: appointment._id,
      patientName: appointment.patientId?.name || 'Patient',
      doctorName: appointment.doctorId?.name || 'Doctor',
      date: appointment.date,
      timeSlot: appointment.timeSlot,
      status: appointment.status,
      reason: appointment.reason,
    }));

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/v1/appointments', async (req, res, next) => {
  try {
    const {
      patientId,
      doctorId,
      patientName,
      doctorName,
      date,
      timeSlot,
      status,
      reason,
    } = req.body;

    if (!date || !timeSlot) {
      const error = new Error('Appointment date and time are required');
      error.statusCode = 400;
      throw error;
    }

    const validStatuses = ['pending', 'confirmed', 'cancelled'];
    const normalizedStatus = (status || 'pending').toLowerCase();

    if (!validStatuses.includes(normalizedStatus)) {
      const error = new Error('Appointment status must be pending, confirmed, or cancelled');
      error.statusCode = 400;
      throw error;
    }

    const cleanedReason = reason || 'General consultation';
    const hasPatientRecord = Boolean(patientId || patientName);
    const hasDoctorRecord = Boolean(doctorId || doctorName);

    if (!hasPatientRecord || !hasDoctorRecord) {
      const error = new Error('Patient and doctor information are required');
      error.statusCode = 400;
      throw error;
    }

    let mongoAppointment = null;

    try {
      await connectMongo();

      const patientFilter = patientId
        ? { _id: patientId }
        : { name: { $regex: `^${patientName.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } };

      const doctorFilter = doctorId
        ? { _id: doctorId }
        : { name: { $regex: `^${doctorName.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } };

      let patient = patientId ? await Patient.findById(patientId) : await Patient.findOne(patientFilter);
      if (!patient) {
        patient = await Patient.create({
          name: patientName || 'New Patient',
          email: `${(patientName || 'newpatient').toLowerCase().replace(/[^a-z0-9]+/g, '.')}.example.com`,
          phone: '0000000000',
          bloodGroup: 'O+',
          age: 30,
        });
      }

      let doctor = doctorId ? await Doctor.findById(doctorId) : await Doctor.findOne(doctorFilter);
      if (!doctor) {
        doctor = await Doctor.create({
          name: doctorName || 'Dr. Unknown',
          email: `${(doctorName || 'doctor').toLowerCase().replace(/[^a-z0-9]+/g, '.')}.medcareplus.com`,
          specialisation: 'General Medicine',
          available: true,
        });
      }

      mongoAppointment = await Appointment.create({
        patientId: patient._id,
        doctorId: doctor._id,
        date,
        timeSlot,
        status: normalizedStatus,
        reason: cleanedReason,
      });

      const populatedAppointment = await mongoAppointment.populate([
        { path: 'patientId', select: 'name email bloodGroup age' },
        { path: 'doctorId', select: 'name specialisation available' },
      ]);

      return res.status(201).json({
        success: true,
        message: 'Appointment created successfully in MongoDB.',
        data: populatedAppointment,
      });
    } catch (mongoError) {
      if (mongoError?.message?.includes('ECONNREFUSED') || mongoError?.message?.includes('MongoDB')) {
        const databaseError = new Error('Database connection unavailable. Please ensure MongoDB is running.');
        databaseError.statusCode = 503;
        throw databaseError;
      }

      throw mongoError;
    }
  } catch (error) {
    next(error);
  }
});

app.get('/api/v1/doctors', async (req, res, next) => {
  try {
    await connectMongo();

    const doctorDocs = await Doctor.find().sort({ createdAt: -1 });

    const data = doctorDocs.map((doctor) => ({
      id: doctor._id.toString(),
      _id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      specialisation: doctor.specialisation,
      available: doctor.available,
    }));

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
});

const normalizeMongoError = (error) => {
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((item) => item.message);
    return messages.join('; ');
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || 'field';
    return `Duplicate value detected for ${field}. Please use a unique value.`;
  }

  if (error.name === 'CastError') {
    return `Invalid value for ${error.path}.`;
  }

  if (error.message) {
    return error.message;
  }

  return 'Database operation failed.';
};

app.get('/api/v1/mongo-demo', async (req, res) => {
  try {
    await connectMongo();

    const patient = await Patient.create({
      name: 'Amit Kumar',
      email: 'amit.kumar@example.com',
      phone: '9876543210',
      bloodGroup: 'A+',
      age: 29,
    });

    const doctor = await Doctor.create({
      name: 'Dr. Kavya Rao',
      email: 'kavya.rao@medcareplus.com',
      specialisation: 'Neurology',
      available: true,
    });

    const appointment = await Appointment.create({
      patientId: patient._id,
      doctorId: doctor._id,
      date: '2026-11-20',
      timeSlot: '10:30 AM',
      status: 'pending',
      reason: 'Follow-up consultation for migraine management.',
    });

    const populatedAppointment = await appointment.populate([
      { path: 'patientId', select: 'name email bloodGroup age' },
      { path: 'doctorId', select: 'name specialisation available' },
    ]);

    res.status(201).json({
      success: true,
      message: 'MongoDB schemas are working and the demo record was created successfully.',
      data: {
        patient,
        doctor,
        appointment: populatedAppointment,
      },
    });
  } catch (error) {
    const message = normalizeMongoError(error);
    res.status(400).json({
      success: false,
      message,
    });
  }
});

app.get('/api/v1/mongo-demo/validation', async (req, res) => {
  try {
    await connectMongo();

    await Appointment.create({
      patientId: 'invalid-object-id',
      doctorId: 'invalid-object-id',
      date: '2026-11-20',
      timeSlot: '10:30 AM',
      status: 'rejected',
      reason: 'x'.repeat(500),
    });

    res.status(201).json({
      success: true,
      message: 'Unexpected success for invalid appointment data.',
    });
  } catch (error) {
    const message = normalizeMongoError(error);
    res.status(400).json({
      success: false,
      message,
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use(errorHandler);

const seedBaseData = async () => {
  await connectMongo();

  const doctorCount = await Doctor.countDocuments();
  if (doctorCount === 0) {
    await Doctor.insertMany([
      {
        name: 'Dr. Ananya Sharma',
        email: 'ananya.sharma@medcareplus.com',
        specialisation: 'Cardiology',
        available: true,
      },
      {
        name: 'Dr. Rohan Mehta',
        email: 'rohan.mehta@medcareplus.com',
        specialisation: 'Dermatology',
        available: true,
      },
      {
        name: 'Dr. Nisha Iyer',
        email: 'nisha.iyer@medcareplus.com',
        specialisation: 'Pediatrics',
        available: true,
      },
    ]);
  }

  const patientCount = await Patient.countDocuments();
  if (patientCount === 0) {
    await Patient.create({
      name: 'Aarav Patel',
      email: 'aarav.patel@example.com',
      phone: '9876543210',
      bloodGroup: 'O+',
      age: 30,
    });
  }

  const appointmentCount = await Appointment.countDocuments();
  if (appointmentCount === 0) {
    const firstDoctor = await Doctor.findOne({ name: 'Dr. Ananya Sharma' });
    const firstPatient = await Patient.findOne({ name: 'Aarav Patel' });

    if (firstDoctor && firstPatient) {
      await Appointment.create({
        patientId: firstPatient._id,
        doctorId: firstDoctor._id,
        date: '2026-10-05',
        timeSlot: '11:00 AM',
        status: 'pending',
        reason: 'Follow-up consultation',
      });
    }
  }
};

const startServer = async () => {
  try {
    await seedBaseData();
    console.log('MongoDB connection established.');
  } catch (error) {
    console.warn('MongoDB connection not available. Please start MongoDB to use the app with database data.');
  }

  app.listen(PORT, () => {
    console.log(`MedCare Plus API running on http://localhost:${PORT}`);
  });
};

startServer();
