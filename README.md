# 🧊 Rubik's Cube Simulator - Pro Dashboard

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

A high-performance, fully interactive 3D Rubik's Cube simulator built entirely from scratch using Vanilla Web Technologies. This project pushes the boundaries of CSS 3D transforms and Vanilla JavaScript to deliver a production-grade speedcubing environment complete with analytics, algorithmic macros, and gamification.

![Rubik's Cube Preview](screenshot.png)

## ✨ Key Features

* **Advanced 3D Matrix Engine:** Flawless middle-layer slice execution and outer-face compensation math, completely eliminating spatial rendering drift and face depth-sorting bugs.
* **Speedrunning Analytics Deck:** Live stopwatch timer, Turns-Per-Second (TPS) monitor, and an active move counter.
* **Persistent Personal Bests (PB):** Utilizes `localStorage` to save and track your fastest solve times across browser sessions.
* **WCA Scramble Generator:** Generates and asynchronously auto-plays official 20-move World Cube Association scramble sequences.
* **Pro Keyboard Bindings:** Solve the puzzle at lightning speed without a mouse using official speedcubing notation (U, D, F, B, L, R).
* **Gamification & Algorithmic Art:** Instantly generate mathematical permutations (Checkerboard, Cube-in-a-Cube) or challenge yourself with the pitch-black Blindfolded Mode.
* **Dynamic Theme Shop:** Toggle between Classic high-contrast colors, eye-friendly Pastel palettes, Dark Studio, and Neon Synth gradient backgrounds via dynamic CSS injection.

## 📁 Repository Structure

```text
├── index.html      # Core DOM structure, 3D viewport, and Dashboard UI
├── styles.css      # 3D CSS transform geometry, visual themes, and grid layouts
├── shuffle.js      # Mathematical matrix engine, WCA scrambles, and 3D coordinate tracker
├── deck.js         # Dashboard controller: PB caching, macros, stopwatch, and keybindings
└── README.md       # Project documentation
🚀 Live Demo👉 Play the Simulator Here!🛠️ Installation & SetupBecause this project is architected with pure Vanilla HTML, CSS, and JavaScript, there are no heavy dependencies, node modules, or build steps required.1. Clone the repository:Bashgit clone [https://github.com/abaranwal03/rubiks-cube-simulator.git](https://github.com/abaranwal03/rubiks-cube-simulator.git)
2. Navigate to the directory:Bashcd rubiks-cube-simulator
3. Run the app:Simply open index.html in any modern web browser (Chrome, Firefox, Safari, Edge).🎮 Controls & Interactions🖱️ Mouse ControlsRotate Camera: Click and drag anywhere in the empty background space.Rotate Face (Clockwise): Click any outer edge piece.Rotate Face (Counter-Clockwise): Hold SHIFT + Click any outer edge piece.Middle Slice: Click and drag any center piece in the desired direction.⌨️ Keyboard Bindings (Standard Notation)KeyActionURotate Top FaceDRotate Bottom FaceFRotate Front FaceBRotate Back FaceLRotate Left FaceRRotate Right Face💡 Note: Hold SHIFT while pressing any key to execute the "Prime" (Counter-Clockwise) version of the move.🔮 Future Roadmap[ ] Migrate the 3D CSS rendering engine to Three.js (WebGL) for dynamic lighting, shadows, and realistic plastic textures.[ ] Implement an official WCA 15-second pre-solve inspection timer.[ ] Add interactive data visualization charts (Ao5, Ao12) to track solve consistency over time.🤝 ContributingContributions, issues, and feature requests are highly welcome! Feel free to check the issues page if you want to contribute.📝 LicenseThis project is open-source and available under the MIT License.
