import dotenv from 'dotenv';

dotenv.config();
export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://mongo:27017/clean-node-api',
  port: process.env.PORT || 5050,
  secret: process.env.JWT_SECRET || 'ef3ebcff-a148-4473-b141-b77fc9853b91',
  salt: Number(process.env.SALT) || 12
};
