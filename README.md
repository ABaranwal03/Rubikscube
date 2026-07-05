# 🧊 Rubik's Cube Simulator - Pro Dashboard

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&syntax=js&logoColor=%23F7DF1E)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

A high-performance, fully interactive 3D Rubik's Cube simulator built entirely from scratch using Vanilla Web Technologies. This project pushes the boundaries of CSS 3D transforms and Vanilla JavaScript to deliver a production-grade speedcubing environment complete with analytics, algorithmic macros, and gamification.


---

## ✨ Key Features

* **Advanced 3D Matrix Engine:** Flawless middle-layer slice execution and outer-face compensation math, completely eliminating spatial rendering drift and face depth-sorting bugs.
* **Speedrunning Analytics Deck:** Live stopwatch timer, Turns-Per-Second (TPS) monitor, and an active move counter.
* **Persistent Personal Bests (PB):** Utilizes `localStorage` to save and track your fastest solve times across browser sessions.
* **WCA Scramble Generator:** Generates and asynchronously auto-plays official 20-move World Cube Association scramble sequences.
* **Pro Keyboard Bindings:** Solve the puzzle at lightning speed without a mouse using official speedcubing notation (`U`, `D`, `F`, `B`, `L`, `R`). 
* **Gamification & Algorithmic Art:** Instantly generate mathematical permutations (Checkerboard, Cube-in-a-Cube) or challenge yourself with the pitch-black **Blindfolded Mode**.
* **Dynamic Theme Shop:** Toggle between Classic high-contrast colors, eye-friendly Pastel palettes, Dark Studio, and Neon Synth gradient backgrounds via dynamic CSS injection.

---

## 📁 Repository Structure

```text
├── cube.html       # Core DOM structure, 3D viewport, and Dashboard UI
├── styles.css      # 3D CSS transform geometry, visual themes, and grid layouts
├── shuffle.js      # Mathematical matrix engine, WCA scrambles, and 3D coordinate tracker
├── deck.js         # Dashboard controller: PB caching, macros, stopwatch, and keybindings
└── README.md       # Project documentation
🚀 Live Demo
👉 [Insert Link to Live GitHub Pages or Vercel Demo Here]

🛠️ Installation & Setup
Because this project is architected with pure Vanilla HTML, CSS, and JavaScript, there are no heavy dependencies, node modules, or build steps required.

Clone the repository:

Bash
git clone [https://github.com/yourusername/rubiks-cube-simulator.git](https://github.com/yourusername/rubiks-cube-simulator.git)
Navigate to the directory:

Bash
cd rubiks-cube-simulator
Run the app:
Simply open cube.html in any modern web browser (Chrome, Firefox, Safari, Edge).

🎮 Controls & Interactions
Mouse Controls
Rotate Camera: Click and drag anywhere in the empty background space.

Rotate Face (Clockwise): Click any outer edge piece.

Rotate Face (Counter-Clockwise): Hold SHIFT + Click any outer edge piece.

Middle Slice: Click and drag any center piece in the desired direction.

Keyboard Bindings (Standard Notation)
U - Rotate Top Face

D - Rotate Bottom Face

F - Rotate Front Face

B - Rotate Back Face

L - Rotate Left Face

R - Rotate Right Face

💡 Note: Hold SHIFT while pressing any key to execute the "Prime" (Counter-Clockwise) version of the move.

🔮 Future Roadmap
[ ] Migrate the 3D CSS rendering engine to Three.js (WebGL) for dynamic lighting, shadows, and realistic plastic textures.

[ ] Implement an official WCA 15-second pre-solve inspection timer.

[ ] Add interactive data visualization charts (Ao5, Ao12) to track solve consistency over time.

🤝 Contributing
Contributions, issues, and feature requests are highly welcome! Feel free to check the issues page if you want to contribute.

📝 License
This project is open-source and available under the MIT License.
