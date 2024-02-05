import express from 'express';
import keys from "./sources/keys.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('hello from backend to frontend!');
});

app.post('/weather', async (req, res) => {
  const {cityName} = req.body;
  if(!cityName){
    return res.status(400).json({ error: "CityName is required in the request body." });
  }
  try{
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=${keys.API_KEY}&units=metric`);
    const data = await response.json();
    if (data.cod && data.cod === '404') {
      return res.status(404).json({ weatherText: "City is not found!" });
    }
    const temperature = data.main.temp;
    return res.status(200).json({ weatherText: `${cityName}: ${temperature}°C` });
  } catch(error){
    console.log("Error fetching weather data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

