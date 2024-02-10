const express = require('express')
const app = express();
 


app.get('/', function (req, res) {
  res.send('Hello World')
})
 
const usersDatabase = [];

app.post('/register', (req, res) => {
  // Extract the information from the request body
  // const newUser = { 
  //   username: req.body.username,
  //   password: req.body.password
  // };
  console.log(req.body)
    // Check if user is valid
  // if(!isValidUser(newUser)) {
  //   res.status(400).send("Invalid user").end();
  //   return;
  // }
  // Add the new user to the database
  //usersDatabase.push(newUser);

  // Send HTTP 201 with the newly created user. We do not send the password
  //res.status(201).send({ username: newUser.username }).end();
});

const isValidUser = (user) => {
  if(!user.username || !user.password || !user.email) {
    return false;
  }
  return true;
};

app.listen(3000, () => {
  console.log('listening on port 3000');
});