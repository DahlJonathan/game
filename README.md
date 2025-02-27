### Root README.md

# web-game

## Description

Real-time multiplayer web game using React for menus and vanilla JavaScript for the game logic. The game does not use canvas.

## Stack
Node.js, Express, WebSocket, JavaScript, HTML, CSS....

## Project Structure

```
web-game
├── backend/   
│   ├── config.js         # Configuration (port, network settings)       
│   ├── gameState.js      # Rules, scoring, and updates
│   ├── idGenerator.js    # Unique ID generation logic
│   ├── README.md         # Backend documentation
│   ├── server.js         # WebSocket server, game state management
│
├── docs/          
│   ├── logic.txt         # Logic of the game
│   ├── plan.txt          # What needs to be done
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
                collectables/
                collectable.jsx
│   │   │   ├── gameinfo/
│   │   │   │   ├── scoreboard.jsx  # Displays the scoreboard
│   │   │   │   ├── timer.jsx       # Displays the game timer
│   │   │   ├── pausescreen/
│   │   │   │   ├── pausescreen.jsx # Displays the pause screen
│   │   │   ├── startscreen/
│   │   │   │   ├── multiplayer.jsx # Handles multiplayer start screen
│   │   │   │   ├── singleplayer.jsx# Handles singleplayer start screen
│   │   │   │   ├── startscreen.jsx # Displays the start screen
│   │   │   ├── GameArea.jsx        # Renders the game area
│   │   │   ├── GameWrapper.jsx     # Wraps the game area and loads the game script
│   │   ├── App.jsx                 # Main React component
│   │   ├── main.css                # Main CSS file
│   │   ├── main.jsx                # Entry point for the React application
│   │   ├── styles.css              # Additional styles
│   ├── .gitignore                  # Ignore node_modules
│   ├── eslint.config.js            # ESLint configuration
│   ├── index.html                  # HTML template
│   ├── main.css                    # Main CSS file
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

## Installation

1. Clone the repository:
    ```sh
    git clone https://gitea.koodsisu.fi/akiheiskanen/web-game.git
    cd web-game
    ```

2. Install the dependencies in the root directory:
    ```sh
    npm install
    ```

3. Install the dependencies in the frontend directory:
    ```sh
    cd frontend
    npm install
    cd ..
    ```

## How to Run

1. Start the backend server from the root directory:
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