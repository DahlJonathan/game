# Frontend readme

## Overview

The frontend of this project is responsible for rendering the game UI and handling user interactions. It is built using React.

## Project Structure

```
frontend/
├── node_modules/
├── public/
│   ├── app.js
│   ├── game.js
│   ├── websocket.js
├── src/
│   ├── components/
│   │   ├── gameinfo/
│   │   │   ├── scoreboard.jsx
│   │   │   ├── timer.jsx
│   │   ├── pausescreen/
│   │   │   ├── pausescreen.jsx
│   │   ├── startscreen/
│   │   │   ├── multiplayer.jsx
│   │   │   ├── singleplayer.jsx
│   │   │   ├── startscreen.jsx
│   │   ├── GameArea.jsx
│   │   ├── GameWrapper.jsx
│   ├── App.jsx
│   ├── main.css
│   ├── main.jsx
│   ├── styles.css
├── .gitignore
├── eslint.config.js
├── index.html
├── main.css
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md          # Frontend documentation
├── tailwind.config.js
├── vite.config.js
```

## How to Run

1. Ensure you are in the `web-game` directory:
    ```sh
    cd web-game
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Start the frontend development server:
    ```sh
    npm run dev
    ```

The frontend development server will start on the port specified in the configuration (default is 5173). You can then open your web browser and navigate to `http://localhost:5173/` to start the game.

## Dependencies

- `react`: A JavaScript library for building user interfaces.
- `react-dom`: Provides DOM-specific methods that can be used at the top level of your app.
- `vite`: A build tool that aims to provide a faster and leaner development experience for modern web projects.