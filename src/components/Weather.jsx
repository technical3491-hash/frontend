import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeather } from '../redux/features/weatherSlice';

const Weather = () => {
  const [city, setCity] = useState('');
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.weather);

  const handleSearch = () => {
    if (city) {
      dispatch(fetchWeather(city));
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Weather App</h1>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city name"
        style={{ padding: '10px', marginRight: '10px' }}
      />
      <button onClick={handleSearch} style={{ padding: '10px' }}>Get Weather</button>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <div style={{ marginTop: '20px' }}>
          <h2>{data.nearest_area[0].areaName[0].value}, {data.nearest_area[0].country[0].value}</h2>
          <p>Temperature: {data.current_condition[0].temp_C}°C</p>
          <p>Weather: {data.current_condition[0].weatherDesc[0].value}</p>
          <p>Humidity: {data.current_condition[0].humidity}%</p>
          <p>Wind Speed: {data.current_condition[0].windspeedKmph} km/h</p>
        </div>
      )}
    </div>
  );
};

export default Weather;