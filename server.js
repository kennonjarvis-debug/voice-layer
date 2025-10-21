import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { config } from './config.js';
import axios from 'axios';
const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server,{cors:{origin:'*'}});
app.get('/health',(_,res)=>res.send({status:'ok'}));
io.on('connection',s=>{
  console.log('🎤 Client connected');
  s.on('command',async t=>{
    console.log('User said:',t);
    const r=await axios.post(config.dawgUrl,{text:t}).catch(e=>({data:e.message}));
    s.emit('response',r.data);
  });
  s.on('disconnect',()=>console.log('❌ Client disconnected'));
});
server.listen(0.0.0.0, config.port,()=>console.log());
