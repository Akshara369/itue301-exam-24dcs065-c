export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${req.method}] ${req.originalUrl} [${timestamp}]`);
  next();
};

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    message: err.message || 'Internal Server Error',
    error: {
      code: statusCode,
      details: err.details || null,
    },
  };

  res.status(statusCode).json(response);
};
