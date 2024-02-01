import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('hello from backend to frontend!');
});

app.post('/weather', (req, res) => {
  const {cityName} = req.body;
  if(!cityName){
    res.send('City Name is required!');
  } else {
    res.send(`You submitted: ${cityName}`);
  }
});

app.listen(PORT, () => {
  console.log('Server is listening on port 3000');
});

