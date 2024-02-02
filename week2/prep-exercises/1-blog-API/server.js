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
  fs.writeFileSync(title.split(' ').join('-'), content);
  res.end('ok')
})

app.put('/posts/:title', (req, res) => {
  const {title} = req.params;
  const {content} = req.body;
  console.log(content, title);

  if (!title || !content) {
    res.status(400).send('Title and content are required.');
    return;
}
  if (fs.existsSync(title)) {
    fs.writeFileSync(title, content);
    res.end('ok')
  }
  else {
    res.status(404).send('This post does not exist!');
  }
})
 

// YOUR CODE GOES IN HERE
app.get('/', function (req, res) {
  res.send('Hello World')
})
 
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});