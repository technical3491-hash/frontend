import axios from 'axios';
import mongoose from 'mongoose';

// Define the Location model (assuming it's the same)
const locationSchema = new mongoose.Schema({
  city: String,
  weatherData: Object,
  lastUpdated: Date,
});

const LocationModel = mongoose.models.Location || mongoose.model('Location', locationSchema);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ message: 'City parameter is required' });
  }

  const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://sanjay45:Sanjay45@cluster0.smjq8zg.mongodb.net/weather_db?appName=Cluster0";

  try {
    // Connect to MongoDB if not connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGODB_URL);
    }

    // Check if data is cached in DB
    const cached = await LocationModel.findOne({ city });
    if (cached && (Date.now() - cached.lastUpdated) < 600000) { // 10 minutes cache
      return res.status(200).json(cached.weatherData);
    }

    // Fetch from API
    const url = `https://wttr.in/${city}?format=j1`;
    const response = await axios.get(url);
    const weatherData = response.data;

    // Cache in DB
    await LocationModel.findOneAndUpdate(
      { city },
      { weatherData, lastUpdated: new Date() },
      { upsert: true }
    );

    res.status(200).json(weatherData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching weather data', error: error.message });
  }
}
