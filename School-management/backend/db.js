// Import mongoose to handle MongoDB connections
import mongoose from 'mongoose';

// Async function to connect to MongoDB
const connectDB = async () => {
  try {
    // Connect to the MongoDB URL from environment variables
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,       // Use the new MongoDB connection string parser
      useUnifiedTopology: true,    // Use the new Server Discovery and Monitoring engine
    });

    // Log successful connection
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    // Log error and exit process if connection fails
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Exit the application with failure
  }
};

// Export the connection function to be used in server.js
export default connectDB;
