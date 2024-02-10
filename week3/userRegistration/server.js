const express = require('express')
const app = express();
const { v4: generateUUID } = require('uuid');
 
app.use(express.json());

app.get('/', function (req, res) {
  res.send('Hello World')
})
 
const usersDatabase = [];
const sessions = {};


app.post('/register', (req, res) => {
  // Extract the information from the request body
  const newUser = { 
    username: req.body.username,
    password: req.body.password
  };

    // Check if user is valid
  if(!isValidUser(newUser)) {
    res.status(400).send("Invalid user").end();
    return;
  }
  // Add the new user to the database
  usersDatabase.push(newUser);
  console.group(usersDatabase);
  // Send HTTP 201 with the newly created user. We do not send the password
  res.status(201).send({ username: newUser.username }).end();
});

app.post('/login', async (req, res) => {
  // 1. get login details from the body
  const { username, password } = req.body;
  
  // 2. Check if the username / password combination is correct.
  if(!checkPassword(username, password)) {
    res.status(401).json({ message: 'Invalid username / password combination' }).end();
    return;
  }

  // 3. The password is correct - create a new user session
  const sessionId = generateUUID();

  // 4. Add the new session to the session database
  sessions[sessionId] = username;
  console.log(sessions);

  // 5. Return the session ID to the client
  res.status(200).json({ sessionId }).end();
}); 

const isValidUser = (user) => {
  if(!user.username || !user.password) {
    return false;
  }
  return true;
};

function checkPassword(username, password) {
  for (const user of usersDatabase) {
    if (user.username === username) {
      // Compare the provided password with the stored password
      return user.password === password;
    }
  }
  return false; // Username not found
}

app.listen(3000, () => {
  console.log('listening on port 3000');
});