import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: 'Too many requests, try again later.',
});

export default limiter;
