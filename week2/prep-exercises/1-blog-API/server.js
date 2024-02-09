const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');

app.use(express.json());

app.post('/posts', (req, res) => {
  const { title, content } = req.body;
    if (!title || !content) {
        res.status(400).send('Title and content are required.');
        return;
    }
    try {
      fs.writeFileSync(path.join(__dirname, `${title}.json`), JSON.stringify({title, content}));
    } catch (error) {
      res.status(500).send('Internal Server Error');
      return;
    }
  res.status(201).send('Blog post created successfully');
})

app.get('/posts/:title', (req, res) => {
  const {title} = req.params;
  if (!title) {
    res.status(400).send('Title is required.');
    return;
  }
  const isExist = fs.existsSync((path.join(__dirname, `${title}.json`)));
  if(isExist) {
    try {
    const postContent = fs.readFileSync(path.join(__dirname, `${title}.json`));
    res.status(200).send(postContent);
  } catch (error){
    res.status(500).send('Internal Server Error');
    return;
  }
  } else {
    res.status(404).send('Not Found');
  }
  
})

app.put('/posts/:title', (req, res) => {
  const {title} = req.params;
  const {content} = req.body;
  if (!content) {
    res.status(400).send('Content is required.');
    return;
}
  const isExist = fs.existsSync(`${title}.json`);
  if (isExist) {
    try {
      fs.writeFileSync(`${title}.json`, JSON.stringify({title, content}));
    } catch (error) {
      res.status(500).send('Internal Server Error');
      return;
    }
    res.status(200).send('Content is updated successfully');
  }
  else {
    res.status(404).send('This post does not exist!');
  }
})

app.delete('/posts/:title', (req, res) => {
  const {title} = req.params;
  const isExist = fs.existsSync(path.join(__dirname, `${title}.json`));
  if (isExist) {
    fs.unlinkSync(path.join(__dirname, `${title}.json`));
    res.end('ok')
  }
  else {
    res.status(404).send('This post does not exist!');
  }
})


app.get('/posts', (req, res) => {
  try {
    const files = fs.readdirSync(__dirname);
    const postFiles = files.filter((file) => path.extname(file) === ".json");
    const fileContents = [];

    postFiles.forEach((file) => {
      try {
        const postFilePath = path.join(__dirname, file);
        const data = fs.readFileSync(postFilePath, "utf-8");
        fileContents.push({ fileName: file, content: data });
      } catch (error) {
        res.status(500).send(`Error reading file: ${error}`);
      }
    });
    res.status(200).send(fileContents);
  } catch (error) {
    res.status(500).send(`Error reading directory: ${error}`);
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