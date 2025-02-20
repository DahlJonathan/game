# Backend Documentation

## Overview

The backend of this project is responsible for handling real-time communication between clients, managing game state, and serving static files. It is built using Node.js, Express, and WebSocket.

## Project Structure

```
├── backend/          
        node_modules/
│   ├── config.js      # Configuration (port, network settings)
│   ├── idGenerator.js
        package-lock.json
        package.json
│   ├── README.md      # Backend documentation
│   ├── server.js      # WebSocket server, game state management
│   ├── socket.js
```

## Configuration

### `config.js`

This file contains configuration settings for the backend server.

## ID Generation

### idGenerator.js

This file contains the logic for generating unique IDs.

## WebSocket Server

### server.js

This file sets up the WebSocket server using Express and WebSocket. It handles client connections, updates the game state, and broadcasts the updated state to all connected clients.

## How to Run

1. Ensure you are in the `web-game` directory:
    ```sh
    cd web-game
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Start the backend server:
    ```sh
    npm start
    ```

The backend server will start on the port specified in config.js (default is 3000). You can then open your web browser and navigate to `http://localhost:3000` to start the game.

## Dependencies

- `express`: A minimal and flexible Node.js web application framework.
- `ws`: A simple to use, blazing fast, and thoroughly tested WebSocket client and server for Node.js.