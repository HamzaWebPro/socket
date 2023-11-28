import React, { useCallback, useEffect, useState } from 'react'
import  io from "socket.io-client"
const socket = io('http://localhost:8000', {
  transports: ['websocket'], // Use only websockets to avoid CORS issues
  cors: {
    origin: 'http://localhost:5173', // Replace this with your frontend URL
    methods: ['GET', 'POST'],
  },
});



const App = () => {
  let [name , setName] = useState("")
  let [description , setDescription] = useState("")

// Inside the useEffect hook
useEffect(() => {
  socket.on("connected", (message) => {
    console.log(message);
  });

  // Handle the "read" event here
  socket.on("read", (items) => {
    console.log(items); // This will log the items received from the backend
    // Further processing or updating the state can be done here
  });
}, []);


  let handleCreate = async () =>{
    console.log('====================================');
    console.log(name,description);
    console.log('====================================');

     socket.emit("create",{name,description})
    setName("")
    setDescription("")
  }
  return (
    <div>
      <input value={name} onChange={(e)=>setName(e.target.value)} type="text" name="" id="" />
      <input value={description} onChange={(e)=>setDescription(e.target.value)} type="text" name="" id="" />
      <button onClick={handleCreate}>Send</button>
    </div>
  )
}

export default App