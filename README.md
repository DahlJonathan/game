# web-game

## Description

Real-time multiplayer web game 

## Stack
Node.js, Express, WebSocket.io, JavaScript, HTML, CSS, Tailwind, Vite....

## Project Structure
```
web-game
├── backend/          
        node_modules/
│   ├── config.js      # Configuration (port, network settings)
│   ├── idGenerator.js
        package-lock.json
        package.json
│   ├── README.md      # Backend documentation
│   ├── server.js      # WebSocket server, game state management
│   ├── socket.js
│
├── docs/          
│   ├── logic.txt      # Logic of the game
│   ├── plan.txt       # What needs to be done
│   ├── review_kohdat.txt # Everything must be implemented and working properly
│
├── frontend/
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── gameArea.jsx
                gameLogic.jsx
│   │   │   ├── Platform.jsx
│   │   │   ├── platformLogic.jsx
│   │   │   ├── Player.jsx
│   │   ├── App.jsx
│   │   ├── main.css
│   │   ├── main.jsx
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
        postcss.config.js
│   ├── README.md      # Frontend documentation
│   ├── styles.css
│   ├── tailwind.config.js
│   └── vite.config.js
    node_modules/
├── .gitignore         # Ignore node_modules
├── package-lock.json  
├── package.json       
└──README.md          # Project documentation
```


## Installation

1. Clone the repository:
    ```sh
    git clone https://gitea.koodsisu.fi/akiheiskanen/web-game.git
    cd web-game
    ```

2. Mitkä näistä nyt pitää asentaa??
   ```sh
    npm install express ws
    npm install
    npm install vite --save-dev
    npm install concurrently --save-dev
    npm install mime

   ```

## How to Run

1. Start both servers `/web-game`:
    ```sh
    npm start
    ```

2. Open your web browser and navigate to `http://localhost:5137` to start the game.

## Developers

Aki Heiskanen       
Jonathan Dahl       
Laura Levistö       

3/2025