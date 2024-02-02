const express = require('express')
const app = express();
const fs = require('fs');

app.use(express.json());

app.post('/blogs', (req, res) => {
  const { title, content } = req.body;
    if (!title || !content) {
        res.status(400).send('Title and content are required.');
        return;
    }
  fs.writeFileSync(title, content);
  res.end('ok')
})
 

// YOUR CODE GOES IN HERE
app.get('/', function (req, res) {
  res.send('Hello World')
})
 
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});