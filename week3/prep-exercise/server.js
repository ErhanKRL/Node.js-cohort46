const express = require('express')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { v4: generateUUID } = require('uuid');

const app = express();
app.use(express.json());

const JWT_SECRET_KEY = '4cba39b0806e0def0a7248ec75550485e93b5fb00dcd83f132693c1e8f9c3b3f';

const readUsers = () => {
  try{
    const usersData = fs.readFileSync('users.json', 'utf8');
    return JSON.parse(usersData);

  } catch(err){
    console.log("Can't read users");
    return [];
  }
}

const writeUsers = (users) => {
  fs.writeFileSync('users.json', JSON.stringify(users), 'utf8');
}

const registerUser = async (username, password) => {
  const users = readUsers();
  if(users.find(user => user.username === username)){
    throw new Error('User already registered');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: generateUUID(),
    username: username,
    password: hashedPassword
  }
  users.push(newUser);
  writeUsers(users);
  return newUser;
}

//Register User Endpoint
app.post('/register', async(req, res) => {
  const {username, password} = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  try{
    const newUser = await registerUser(username, password);
    res.status(201).json({message:`Successfully registered as ${newUser.username}`});
  } catch (error){
    res.status(400).json({ message: error.message });
  }
})

//Login User Endpoint
app.post('/login', async (req, res) => {
  const {username, password} = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  try{
    const users = readUsers();
    const user = users.find(user => user.username === username);
    if(!user || !(await bcrypt.compare( password, user.password))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const token = jwt.sign({id: user.id}, JWT_SECRET_KEY);
    res.status(200).json({ token: token, message: 'Login Successful' });
  } catch (error){
    res.status(500).json({message: 'Internal Server Error'});
  }
})

//Get Profile Endpoint
app.get('/profile', (req, res) => {
  const autHeader = req.headers.authorization;
  if(!autHeader || !autHeader.startsWith('Bearer ')){
    res.json(401).json({message: 'Invalid Token'});
  }
  const token = autHeader.substring(7);
  try{
    const decodedToken = jwt.verify(token, JWT_SECRET_KEY);
    const userId = decodedToken.id;
    const users = readUsers();
    const user = users.find(user => user.id === userId);
    if(!user){
      return res.status(404).json({message: 'User not found'});
    }
    res.status(200).json({user: user.username});
  } catch (error) {
    res.status(401).json({message:'invalid login credentials'});
  }
})

//Logout Endpoint
app.post('/logout', (req, res) => {
  res.status(204).end('Logged Out!');
})

app.get('/', function (req, res) {
  res.send('Hello World')
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});