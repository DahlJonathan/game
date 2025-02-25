// ./frontend/public/websocket.js

const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
    console.log('websocket.js - WebSocket connection established');
};

ws.onmessage = (event) => {
    console.log('websocket.js - Received WebSocket message:', event.data);
};

ws.onclose = () => {
    console.log('websocket.js - WebSocket connection closed');
};

ws.onerror = (error) => {
    console.error('websocket.js - WebSocket error:', error);
};

export default ws;