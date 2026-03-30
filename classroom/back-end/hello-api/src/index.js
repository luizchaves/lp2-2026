import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(morgan('tiny'));

// static files
app.use(express.static('public'));

// dynamic content
// API endpoint/route (method + path)
// Method: GET, POST, PUT, DELETE
app.get('/api/hello', (req, res) => {
  return res.send('Hello, World!');
});

app.get('/api/ola', (req, res) => {
  return res.send('Olá, Mundo!');
});

app.listen(3000, () => console.log('Server is running on port 3000'));
