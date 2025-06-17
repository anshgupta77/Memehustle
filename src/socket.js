import { io } from 'socket.io-client';

const socket = io(`${backendUrl}`); // use actual backend URL in production

export default socket;