# Morpheus Pills Website

## Overview
The Morpheus Pills Website is an interactive web application inspired by the Matrix movie. It features a user interface with two vertical pills, a background image of Morpheus, and engaging functionalities that allow users to choose between a game and motivational messages.

## Features
- **Interactive Pills**: Users can click on the red or blue pill to trigger different actions.
- **Game Launch**: Clicking the red pill prompts a confirmation pop-up. Upon confirmation, a Dino-like game set in a Stone Age environment is launched.
- **Motivational Messages**: Clicking the blue pill displays a column of green hex text with motivational quotes about waking up and achieving goals.
- **Stylish Design**: The website is designed with a Matrix theme, featuring visually appealing styles and animations.

## Project Structure
```
morpheus-pills-website
├── src
│   ├── index.html          # Main entry point for the website
│   ├── basic.html         # Alternative version for testing or demonstration
│   ├── css
│   │   ├── styles.css     # Main styles for the website
│   │   └── game.css       # Styles for the Dino-like game
│   ├── js
│   │   ├── main.js        # Main JavaScript logic for the website
│   │   ├── pills.js       # Logic related to the pills
│   │   └── game
│   │       ├── engine.js  # Game engine logic
│   │       └── entities.js # Game entities and interactions
│   └── assets
│       ├── audio          # Audio files for sound effects and music
│       ├── sprites        # Sprite images for game characters and obstacles
│       └── fonts          # Custom font files for typography
├── package.json           # npm configuration file
├── .gitignore             # Files and directories to ignore in version control
└── README.md              # Documentation for the project
```

## Setup Instructions
1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies using npm:
   ```
   npm install
   ```
4. Open `src/index.html` in your web browser to view the website.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.