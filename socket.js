import * as React from 'react'
import { io } from 'socket.io-client';

const socket = io('https://1098-104-28-225-117.ngrok-free.app/auth'); 
export const SocketContext = React.createContext(socket)