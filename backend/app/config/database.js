const mongoose = require('mongoose');

const connectDB = async () => {
 try {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/eya-wafi");
  console.log('MongoDB Connected');
 } catch (err) {
  console.log(err);
 }
};

module.exports = connectDB;