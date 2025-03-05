# web-game

## Description

Real-time multiplayer web game using React for menus and vanilla JavaScript for the game logic. The game does not use canvas.

## Stack

Node.js, Express, WebSocket, JavaScript, HTML, CSS.

## Project Structure

```
web-game
├── backend/   
│   ├── config.js         # Configuration (port, network settings)       
│   ├── gameState.js      # Rules, scoring, and updates
│   ├── README.md         # Backend documentation
│   ├── server.js         # WebSocket server, game state management
│
├── docs/          
│   ├── logic.txt         # Logic of the game
│   ├── review_kohdat.txt # Everything must be implemented and working properly
│
├── frontend/
│   ├── node_modules/
│   ├── public/
│   │   ├── app.js        # Initializes the game and handles WebSocket messages
│   │   ├── game.js       # Contains the game logic and rendering
│   │   ├── websocket.js  # Handles WebSocket connections
│   ├── src/
│   │   ├── components/
│   │   │   ├── collectables/
│   │   │   │   ├── collectable.jsx
│   │   │   ├── gameinfo/
│   │   │   │   ├── fps.jsx
│   │   │   │   ├── scoreboard.jsx  # Displays the scoreboard
│   │   │   │   ├── timer.jsx       # Displays the game timer
│   │   │   ├── pausescreen/
│   │   │   │   ├── pausescreen.jsx # Displays the pause screen
│   │   │   ├── startscreen/
│   │   │   │   ├── howToPlay.jsx
│   │   │   │   ├── multiplayer.jsx # Handles multiplayer start screen
│   │   │   │   ├── singleplayer.jsx# Handles singleplayer start screen
│   │   │   │   ├── startscreen.jsx # Displays the start screen
│   ├── images/
│   │   ├── App.jsx                 # Main React component
│   │   ├── GameWrapper.jsx         # Wraps the game area and loads the game script
│   │   ├── main.css                # Main CSS file
│   │   ├── main.jsx                # Entry point for the React application
│   ├── .gitignore                  # Ignore node_modules
│   ├── eslint.config.js            # ESLint configuration
│   ├── index.html                  # HTML template
│   ├── package-lock.json           # Lock file for npm dependencies
│   ├── package.json                # Project metadata and dependencies
│   ├── postcss.config.mjs          # PostCSS configuration
│   ├── README.md                   # Frontend documentation
│   ├── tailwind.config.js          # Tailwind CSS configuration
│   ├── vite.config.js              # Vite configuration
│
├── node_modules/
├── .gitignore                       # Ignore node_modules
├── package-lock.json                # Lock file for npm dependencies
├── package.json                     # Project metadata and dependencies
├── README.md                        # Project documentation
```

## How to Run

1. Install the dependencies in `/web-game/` and in `/web-game/frontend`:
    ```sh
    npm install
    ```

2. Start frontend and backend servers in `/web-game/`:
    ```sh
    npm start
    ```

2. Open your web browser and navigate to `http://localhost:5173/` to start the game.

## Game Flow

1. **Opening Page**: Multi mode, player name, choose game room button.
2. **Single Mode**: Added later, start game button.
3. **Join Game Room**: User joins a game room, session starts for the current user.
4. **Game Room Page**: Lists all players in the game room, max 4 players. When all players click start game, the game screen opens. Game room page has start game and leave game room buttons.
5. **Game Screen Page**: Timer shows on top with game control buttons. Game arena where the players are is smaller than the browser window/game screen page.
6. **Multiple Games**: User can play many games with players in the current game room during the session. If someone leaves the game room, another can join, max 4. List of players updates, and the session ends for the player who leaves. Game room page lists a scoreboard that lists all current players in the game room and their score. When a user leaves the game room, points go to zero for that player.
7. **Start Game Button**: Game screen opens when all players have clicked the button. 2-4 players play with arrow buttons. User can click leave game - it redirects to the game room page, start game button is not showing, other players can continue the game until the end. When all players have come back to the game room, the start button appears again.
8. **Game End**: Timer goes to zero or all players quit the game - game ends, player who has left the game gets zero points. Scoreboard shows all current players in the game room page. User can start a new game. New game cannot start when there is an ongoing game. New game can start when all players are back in the game room, only then the start game button is visible.
9. **Leave Game Room**: User clicks leave game room, opening page opens. Another new user can take their place in the game room, game room session ends for the current user. Scoreboard updates with the players that are still inside the game room.
10. **Join Another Game Room**: User can now join another game room.

## Developers

Aki Heiskanen       
Jonathan Dahl       
Laura Levistö       

3/2025


ngrok

start ngrok:
ngrok http 8080

EVERYONE!!!
copy ngrok adress in websocket.js
window.__ws = new WebSocket('wss://6948-2001-999-788-5b98-d52a-5ae4-a5ed-78c7.ngrok-free.app');

player with server:
/root npm start

other players:
/frontend npm start
