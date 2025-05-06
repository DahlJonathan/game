// frontend/public/websocket.js
if (!window.__ws) {
    window.__ws = new WebSocket('wss://game-production-ed1c.up.railway.app');

    window.__ws.onopen = () => {
        console.log('WebSocket connection established');
    };

    window.__ws.onmessage = (event) => {
        // console.log(`WebSocket message received: ${event}`);
    };

    window.__ws.onclose = () => {
        console.log('WebSocket connection closed');
        // Re-establish the connection if it's closed
        window.__ws = new WebSocket('wss://game-production-ed1c.up.railway.app');
    };

    window.__ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        // Re-establish the connection if there's an error
        window.__ws = new WebSocket('wss://game-production-ed1c.up.railway.app');
    };
}

const ws = window.__ws;
export default ws;