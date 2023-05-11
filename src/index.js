import express from 'express'
import cors from 'cors'

import { randomUUID } from 'node:crypto';

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

// Completeo
function checksExistsUserAccount(req, res, next) {
  const { username } = req.headers
  const user = users.find(user => user.username === username)
  console.log(user.username)
  
  if(!user) {
    return res.status(400).json({error: "User not found"})
  }
  req.username = username
  return next()
}
// Completo
app.post('/users', (req, res) => {
    const { name, username } = req.body
    
    const user = {
      id: randomUUID(),
      name, 
      username,
      todos: []
    }
    users.push(user)
    return res.writeHead(201).end()
  });
  // Completo
app.get('/todos', checksExistsUserAccount,(req, res) => {
  const { username } = req
  const user = users.find(user => user.username === username)


  if(user !== undefined){
    return res.end(JSON.stringify(user.todos))
  } else {
    return res.writeHead(404).end('User Not Found')
  }
});
// Completo
app.post('/todos', checksExistsUserAccount,(req, res) => {
  const { username } = req
  const { title, deadline } = req.body
  const user = users.find(user => user.username === username);

  if(user !== undefined){
    const todo = {
        id: randomUUID(),
        title,
        done : false, 
        deadline: new Date( deadline ),//ANO-MÊS-DIA
        created_at: new Date()
      }
      user.todos.push(todo)
      return res.end(JSON.stringify(todo))
  }else {
    return res.writeHead(404).end('User Not Found')
  }
});
// Completo
app.put('/todos/:id', checksExistsUserAccount,(req, res) => {
  const { username } = req
  const { title, deadline } = req.body
  const { id } = req.params

  const user = users.find(user => user.username === username);
  
  const { todos } = user 
  const index = todos.findIndex(todo => todo.id === id);

  const updatedUser = { 
    title, 
    deadline: new Date(deadline) 
  }
  if (index !== -1) {
    user.todos[index] = { ...user.todos[index], ...updatedUser };
    return res.writeHead(204).end("User updated successfully!");
  } else {
    return res.writeHead(404).end('User Not Found')
  }
});
// Completo
app.patch('/todos/:id/done', checksExistsUserAccount,(req, res) => {
  const { username } = req
  const { id } = req.params

  const user = users.find(user => user.username === username)

  const { todos } = user 
  const index = todos.findIndex(todo => todo.id === id);

  const updatedUser = { 
    done: true
  }

  if (index !== -1) {
    user.todos[index] = { ...user.todos[index], ...updatedUser };
    return res.writeHead(204).end("Todo updated successfully!");
  } else {
    return res.writeHead(404).end('User Not Founds')
  }
});
// Completo
app.delete('/todos/:id', checksExistsUserAccount,(req, res) => {
  const { username } = req
  const { id } = req.params

  const user = users.find(user => user.username === username)

  const { todos } = user 
  const index = todos.findIndex(todo => todo.id === id);

  todos.splice(index, 1)
  return res.writeHead(204).end("Todo deleted successfully!");
});

export default app