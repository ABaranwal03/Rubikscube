// =========================================================================
// 1. STABLE PRODUCTION CORE ENGINE & MATRIX MATH (Fully Optimized)
// =========================================================================

var colors = ["blue", "green", "white", "yellow", "orange", "red"],
  pieces = document.getElementsByClassName("piece");

const pivot = document.getElementById("pivot");
const scene = document.getElementById("scene");
const guide = document.getElementById("guide");
const cube = document.getElementById("cube");

let moveHistory = [];
let isSolving = false;

// Returns j-th adjacent face of i-th face
function mx(i, j) {
  return (
    ([2, 4, 3, 5][j % 4 | 0] +
      (i % 2) * (((j | 0) % 4) * 2 + 3) +
      2 * ((i / 2) | 0)) %
    6
  );
}

function getAxis(face) {
  return String.fromCharCode("X".charCodeAt(0) + face / 2); // X, Y or Z
}

// Moves each of 26 pieces to their places, assigns IDs and attaches stickers
function assembleCube() {
  pieces = document.getElementsByClassName("piece");
  
  // Clean sweep reset of any dirty inner DOM properties
  for (var k = 0; k < pieces.length; k++) {
    pieces[k].innerHTML = '<div class="element left"></div><div class="element right"></div><div class="element top"></div><div class="element bottom"></div><div class="element back"></div><div class="element front"></div>';
  }

  function moveto(face) {
    id = id + (1 << face);
    pieces[i].children[face]
      .appendChild(document.createElement("div"))
      .setAttribute("class", "sticker " + colors[face]);
    return "translate" + getAxis(face) + "(" + ((face % 2) * 4 - 2) + "em)";
  }
  for (var id, x, i = 0; (id = 0), i < 26; i++) {
    x = mx(i, i % 18);
    pieces[i].style.transform =
      "rotateX(0deg)" +
      moveto(i % 6) +
      (i > 5 ? moveto(x) + (i > 17 ? moveto(mx(x, x + 2)) : "") : "");
    pieces[i].setAttribute("id", "piece" + id);
  }
}

function getPieceBy(face, index, corner) {
  return document.getElementById(
    "piece" +
      ((1 << face) +
        (1 << mx(face, index)) +
        (1 << mx(face, index + 1)) * corner)
  );
}

// Swaps stickers of the face (by clockwise) stated times, thereby rotates the face
function swapPieces(face, times) {
  for (var i = 0; i < 6 * times; i++) {
    var piece1 = getPieceBy(face, i / 2, i % 2),
      piece2 = getPieceBy(face, i / 2 + 1, i % 2);
    for (var j = 0; j < 5; j++) {
      var sticker1 = piece1.children[j < 4 ? mx(face, j) : face].firstChild,
        sticker2 = piece2.children[j < 4 ? mx(face, j + 1) : face].firstChild,
        className = sticker1 ? sticker1.className : "";
      if (className)
        (sticker1.className = sticker2.className),
          (sticker2.className = className);
    }
  }
}

// Animates rotation of the face (by clockwise if cw), and then swaps stickers
function animateRotation(face, cw, currentTime) {
  isSolving = true;
  var k = 0.3 * ((face % 2) * 2 - 1) * (2 * cw - 1),
    qubes = Array(9)
      .fill(pieces[face])
      .map(function (value, index) {
        return index ? getPieceBy(face, index / 2, index % 2) : value;
      });
  (function rotatePieces() {
    var passed = Date.now() - currentTime,
      style =
        "rotate" + getAxis(face) + "(" + k * passed * (passed < 300) + "deg)";
    qubes.forEach(function (piece) {
      piece.style.transform = piece.style.transform.replace(
        /rotate.\(\S+\)/,
        style
      );
    });
    if (passed >= 300) {
      swapPieces(face, 3 - 2 * cw);
      isSolving = false;
      return;
    }
    requestAnimationFrame(rotatePieces);
  })();
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function resetView() {
  if (pivot) pivot.style.transform = "rotateX(-35deg) rotateY(-135deg)";
  moveHistory = [];
  isSolving = false;
  assembleCube();
}

// =========================================================================
// 2. STABLE HYBRID SWIPE TRACKING & LAYER COMPENSATION LOGIC
// =========================================================================

function mousedown(md_e) {
  if (isSolving) return;
  var startXY = pivot.style.transform.match(/-?\d+\.?\d*/g).map(Number),
    element = md_e.target.closest(".element"),
    face = [].indexOf.call((element || cube).parentNode.children, element);
    
  var startPageX = md_e.pageX;
  var startPageY = md_e.pageY;
  var hasSliced = false;

  function mousemove(mm_e) {
    if (element) {
      var deltaX = mm_e.pageX - startPageX;
      var deltaY = mm_e.pageY - startPageY;
      var dragDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Extract specific binary signature to filter out center rows vs corners
      var clickedPiece = element.parentNode;
      var pieceId = parseInt(clickedPiece.id.replace("piece", ""));
      var activeBits = 0;
      for (var b = 0; b < 6; b++) { if (pieceId & (1 << b)) activeBits++; }
      var isCenterLane = (activeBits < 3);

      // Execution Layer A: Standard perimeter anchor slicing for outer bands
      var gid = /\d/.exec(document.elementFromPoint(mm_e.pageX, mm_e.pageY).id);
      if (!isCenterLane && gid && gid.input.includes("anchor")) {
        mouseup();
        var e = element.parentNode.children[mx(face, Number(gid) + 3)].hasChildNodes();
        var targetFace = mx(face, Number(gid) + 1 + 2 * e);
        var isClockwise = e;

        if (!isSolving) moveHistory.push({ type: 'single', face: targetFace, cw: isClockwise });
        animateRotation(targetFace, isClockwise, Date.now());
        return;
      }

      // Execution Layer B: Seamless Outer-Face Compensation for perfect middle rows
      if (isCenterLane && !hasSliced && dragDistance > 25) {
        var absX = Math.abs(deltaX);
        var absY = Math.abs(deltaY);
        var swipeHorizontal = absX > absY;
        var forwardDirection = swipeHorizontal ? (deltaX > 0) : (deltaY < 0);

        let primaryFace = -1;
        let secondaryFace = -1;
        let clockwiseDir = forwardDirection;

        // Front (2) / Back (3) Surface Mapping
        if (face === 2 || face === 3) {
          if (swipeHorizontal) {
            primaryFace = 0; secondaryFace = 1; // Top & Bottom
            clockwiseDir = (face === 2) ? !forwardDirection : forwardDirection;
          } else {
            primaryFace = 4; secondaryFace = 5; // Left & Right
            clockwiseDir = (face === 2) ? forwardDirection : !forwardDirection;
          }
        }
        // Top (0) / Bottom (1) Surface Mapping
        else if (face === 0 || face === 1) {
          if (swipeHorizontal) {
            primaryFace = 2; secondaryFace = 3; // Front & Back
            clockwiseDir = (face === 0) ? forwardDirection : !forwardDirection;
          } else {
            primaryFace = 4; secondaryFace = 5; // Left & Right
            clockwiseDir = forwardDirection;
          }
        }
        // Left (4) / Right (5) Surface Mapping
        else if (face === 4 || face === 5) {
          if (swipeHorizontal) {
            primaryFace = 0; secondaryFace = 1; // Top & Bottom
            clockwiseDir = forwardDirection;
          } else {
            primaryFace = 2; secondaryFace = 3; // Front & Back
            clockwiseDir = (face === 4) ? !forwardDirection : forwardDirection;
          }
        }

        if (primaryFace !== -1 && secondaryFace !== -1) {
          hasSliced = true;
          mouseup();

          if (!isSolving) {
            moveHistory.push({ type: 'middle', face1: primaryFace, face2: secondaryFace, cw: clockwiseDir });
          }

          // Spin the outer boundaries simultaneously to isolate a rock-solid middle row visually
          animateRotation(primaryFace, clockwiseDir, Date.now());
          setTimeout(() => {
            animateRotation(secondaryFace, !clockwiseDir, Date.now());
          }, 50);
        }
      }
    } else {
      // Global View Camera Rotation
      pivot.style.transform =
        "rotateX(" + (startXY[0] - (mm_e.pageY - md_e.pageY) / 2) + "deg)" +
        "rotateY(" + (startXY[1] + (mm_e.pageX - md_e.pageX) / 2) + "deg)";
    }
  }
  
  function mouseup() {
    document.body.appendChild(guide);
    scene.removeEventListener("mousemove", mousemove);
    document.removeEventListener("mouseup", mouseup);
    scene.addEventListener("mousedown", mousedown);
  }

  (element || document.body).appendChild(guide);
  scene.addEventListener("mousemove", mousemove);
  document.addEventListener("mouseup", mouseup);
  scene.removeEventListener("mousedown", mousedown);
}

document.ondragstart = function () { return false; };
window.addEventListener("load", assembleCube);
scene.addEventListener("mousedown", mousedown);

// =========================================================================
// 3. UNIFIED SHUFFLE GENERATOR & TIMELINE AUTO-SOLVER
// =========================================================================

function shuffleCube() {
  if (isSolving) return;
  
  var movesCount = document.getElementById("shuffle-moves").value;
  var counter = 0;
  moveHistory = []; 

  var shuffler = setInterval(() => {
    let isMiddle = Math.random() < 0.25; // 25% chance to shuffle a true middle row
    let cw = Math.random() < 0.5;

    if (isMiddle) {
      // Choose an opposite face pair to shift the center line
      let pairs = [[0, 1], [2, 3], [4, 5]];
      let selectedPair = pairs[getRndInteger(0, 2)];
      let f1 = selectedPair[0];
      let f2 = selectedPair[1];

      moveHistory.push({ type: 'middle', face1: f1, face2: f2, cw: cw });
      animateRotation(f1, cw, Date.now());
      setTimeout(() => { animateRotation(f2, !cw, Date.now()); }, 50);
    } else {
      let face = getRndInteger(0, 5);
      moveHistory.push({ type: 'single', face: face, cw: cw });
      animateRotation(face, cw, Date.now());
    }

    counter++;
    if (counter >= movesCount) clearInterval(shuffler);
  }, 380);
}

// UI Buttons Event Setup
const rotateTopButton = document.getElementById('rotateTop');
const rotateBottomButton = document.getElementById('rotateBottom');
const rotateFrontButton = document.getElementById('rotateFront');
const rotateBackButton = document.getElementById('rotateBack');
const rotateLeftButton = document.getElementById('rotateLeft');
const rotateRightButton = document.getElementById('rotateRight');
const solveButton = document.getElementById('solveButton');

rotateTopButton.addEventListener('click', (e) => rotateCube('top', !e.shiftKey));
rotateBottomButton.addEventListener('click', (e) => rotateCube('bottom', !e.shiftKey));
rotateFrontButton.addEventListener('click', (e) => rotateCube('front', !e.shiftKey));
rotateBackButton.addEventListener('click', (e) => rotateCube('back', !e.shiftKey));
rotateLeftButton.addEventListener('click', (e) => rotateCube('left', !e.shiftKey));
rotateRightButton.addEventListener('click', (e) => rotateCube('right', !e.shiftKey));
solveButton.addEventListener('click', solveCube);

function rotateCube(direction, isClockwise) {
  if (isSolving) return;
  const faceMap = { 'top': 0, 'bottom': 1, 'front': 2, 'back': 3, 'left': 4, 'right': 5 };
  const face = faceMap[direction];

  moveHistory.push({ type: 'single', face: face, cw: isClockwise });
  animateRotation(face, isClockwise, Date.now());
}

// Fixed Timeline solver completely capable of undoing single and double lane shifts
function solveCube() {
  if (isSolving || moveHistory.length === 0) return;
  
  const delay = 400; 

  const performSolveMove = () => {
    if (moveHistory.length > 0) {
      let lastMove = moveHistory.pop();
      
      if (lastMove.type === 'single') {
        animateRotation(lastMove.face, !lastMove.cw, Date.now());
        setTimeout(performSolveMove, delay);
      } 
      else if (lastMove.type === 'middle') {
        // To reverse a center swipe, we undo both matching boundary rotations together
        animateRotation(lastMove.face1, !lastMove.cw, Date.now());
        setTimeout(() => {
          animateRotation(lastMove.face2, lastMove.cw, Date.now());
        }, 50);
        
        setTimeout(performSolveMove, delay + 50);
      }
    }
  };

  performSolveMove();
}
// Global checker function allowing deck.js to see if the cube is fully solved
function isCubeSolved() {
  const faces = [0, 1, 2, 3, 4, 5];
  
  for (let f of faces) {
    let piecesOnFace = Array(9).fill(pieces[f]).map((val, idx) => idx ? getPieceBy(f, idx / 2, idx % 2) : val);
    let stickers = piecesOnFace.map(p => p.children[f < 4 ? mx(f, 0) : f].firstChild);
    
    // Get the color of the first sticker on this face to use as a baseline
    if (!stickers[0]) continue;
    let baseColor = stickers[0].className;
    
    // If any sticker on the same face doesn't match the baseline, the cube is NOT solved
    for (let s of stickers) {
      if (!s || s.className !== baseColor) return false;
    }
  }
  return true; // All faces are completely uniform!
}
