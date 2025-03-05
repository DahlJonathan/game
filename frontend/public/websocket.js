// frontend/public/websocket.js
if (!window.__ws) {
    //window.__ws = new WebSocket('wss://6948-2001-999-788-5b98-d52a-5ae4-a5ed-78c7.ngrok-free.app');
    window.__ws = new WebSocket('ws://localhost:8080');

    window.__ws.onopen = () => {
        console.log('WebSocket connection established');
    };
    window.__ws.onmessage = (event) => {
        // console.log(`WebSocket message received: ${event}`);
    };
    window.__ws.onclose = () => {
        console.log('WebSocket connection closed');
    };
    window.__ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
}

const ws = window.__ws;
export default ws;