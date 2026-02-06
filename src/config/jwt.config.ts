export default {
  secret: process.env.JWT_SECRET || 'super-secret-key',
  expiresIn: '1d',
};
