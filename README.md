# web-game

## Description

Real-time multiplayer web game 

## Stack
Node.js, Express, WebSocket, JavaScript, HTML, CSS....

## Project Structure
```
web-game
├── backend/          
│   ├── server.js      # WebSocket server, game state management
│   ├── gameLogic.js   # Rules, scoring, and updates
│   ├── config.js      # Configuration (port, network settings)
│   ├── README.md      # Backend documentation
│
├── docs/          
│   ├── logic.txt      # Logic of the game?
│   ├── plan.txt        # What needs to be done?
│   ├── review_kohdat.txt # Everything must be implemented and working properly
│
├── frontend/
│   ├── player.js
│   ├── startScreen.js
│   ├── app.js
│   ├── game.js
│   ├── index.html
│   ├── README.md      # Frontend documentation
│
├── public/            # Static assets
│   ├── sounds/        # Game sound effects
│   ├── images/        # Player avatars, background elements
│
├── .gitignore         # Ignore node_modules
├── package-lock.json  # 
├── package.json       # 
├── README.md          # Project documentation
```

## Installation

1. Clone the repository:
    ```sh
    git clone https://gitea.koodsisu.fi/akiheiskanen/web-game.git
    cd web-game
    ```

2. Install the dependencies:
    ```sh
    npm install express ws
    ```

## How to Run

1. Start the backend server `/web-game/backend`:
    ```sh
    npm start
    ```

2. Open your web browser and navigate to `http://localhost:3000` to start the game.

## Developers

Aki Heiskanen       
Jonathan Dahl       
Laura Levistö       

3/2025