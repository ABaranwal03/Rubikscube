
var colors = ["blue", "green", "white", "yellow", "orange", "red"],
  pieces = document.getElementsByClassName("piece");

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
    if (passed >= 300) return swapPieces(face, 3 - 2 * cw);
    requestAnimationFrame(rotatePieces);
  })();
}



// Events
function mousedown(md_e) {
  var startXY = pivot.style.transform.match(/-?\d+\.?\d*/g).map(Number),
    element = md_e.target.closest(".element"),
    face = [].indexOf.call((element || cube).parentNode.children, element);
  function mousemove(mm_e) {
    if (element) {
      var gid = /\d/.exec(document.elementFromPoint(mm_e.pageX, mm_e.pageY).id);
      if (gid && gid.input.includes("anchor")) {
        mouseup();
        console.log(element, face, gid);
        var e =
          element.parentNode.children[
            mx(face, Number(gid) + 3)
          ].hasChildNodes();
        animateRotation(mx(face, Number(gid) + 1 + 2 * e), e, Date.now());
        console.log("rotated now");
      }
    } else
      pivot.style.transform =
        "rotateX(" +
        (startXY[0] - (mm_e.pageY - md_e.pageY) / 2) +
        "deg)" +
        "rotateY(" +
        (startXY[1] + (mm_e.pageX - md_e.pageX) / 2) +
        "deg)";
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

document.ondragstart = function () {
  return false;
};
window.addEventListener("load", assembleCube);
scene.addEventListener("mousedown", mousedown);



function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleCube() {
  var movesCount = document.getElementById("shuffle-moves").value;
  var face = 1;
  var cw = true;
  var counter = 0;

  var shuffler = setInterval(() => {
    face = getRndInteger(0, 5);
    cw = Math.random() < 0.5;
    animateRotation(face, cw, Date.now());
    counter++;
    if (counter >= movesCount) clearInterval(shuffler);
  }, 300);
}



function resetView() {
  pivot.style.transform = "rotateX(-17deg) rotateY(17deg)";
}








const rotateTopButton = document.getElementById('rotateTop');
        const rotateBottomButton = document.getElementById('rotateBottom');
        const rotateFrontButton = document.getElementById('rotateFront');
        const rotateBackButton = document.getElementById('rotateBack');
        const rotateLeftButton = document.getElementById('rotateLeft');
        const rotateRightButton = document.getElementById('rotateRight');
        const topPrimeButton = document.getElementById('topPrime');
        const rightPrimeButton = document.getElementById('rightPrime');
        const frontPrimeButton = document.getElementById('frontPrime');
        const upPrimeButton = document.getElementById('upPrime');
        const solveButton = document.getElementById('solveButton');
        
        window.addEventListener("load", assembleCube);

        rotateTopButton.addEventListener('click', () => rotateCube('top' , true));
        rotateBottomButton.addEventListener('click', () => rotateCube('bottom' , true));
        rotateFrontButton.addEventListener('click', () => rotateCube('front' , true));
        rotateBackButton.addEventListener('click', () => rotateCube('back' , true));
        rotateLeftButton.addEventListener('click', () => rotateCube('left' , true));
        rotateRightButton.addEventListener('click', () => rotateCube('right' , true));
        topPrimeButton.addEventListener('click', () => rotateCube('top' , false));
        rightPrimeButton.addEventListener('click', () => rotateCube('right' , false));
        frontPrimeButton.addEventListener('click', () => rotateCube('front' , false));
        upPrimeButton.addEventListener('click', () => rotateCube('up' , true));

        solveButton.addEventListener('click', solveCube);
       
        function getColor(sticker) {
          if (!sticker) {
            console.error('Sticker element is missing:', sticker);
            return null;
          }
        
          const stickerChild = sticker.firstChild; // Get the first child, which should be the div with the color class
        
          if (stickerChild && stickerChild.className) {
            const classNames = stickerChild.className.split(' ');
            const colorClass = classNames.find(className => colors.includes(className));
            
            if (colorClass) {
              return colorClass;
            } else {
              console.error('Color class not found for sticker:', stickerChild);
              return null;
            }
          } else {
            console.error('Sticker element is missing or has no class names:', sticker);
            return null;
          }
        }
        
      
     

        function getCubeState() {
          const cubeState = [];
        
          for (let i = 0; i < pieces.length; i++) {
            const piece = pieces[i];
            const stickers = piece.children;
            const stickerColors = [];
        
            for (let j = 0; j < stickers.length; j++) {
              const color = getColor(stickers[j]);
              stickerColors.push(color);
            }
        
            cubeState.push(stickerColors);
          }
        
          const cubeStateString = JSON.stringify(cubeState);
          return cubeStateString;
        }
        
        
        
        
        /*
        function solveCube() {
          let xhr = new XMLHttpRequest();
          xhr.open("POST", "http://localhost:5501/solve", true);
          xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
          xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
              let solution = JSON.parse(xhr.responseText).solution;
              console.log("Solution:", solution);
            }
          };
          xhr.send(JSON.stringify({ cubeState: getCubeState() }));
        }
        
    
        
        function executeSolution(solution) {
            const delay = 400; // Milliseconds
            let index = 0;
        
            const performSolveMove = () => {
                if (index < solution.length) {
                    const nextMove = solution[index]; // Get the next move from the solution
                    rotateCube(nextMove);
                    index++;
        
                    setTimeout(() => {
                        performSolveMove();
                    }, delay);
                }
            };
        
            performSolveMove();
        }
        
        */

        function rotateCube(direction , isClockwise = true) {
          // rotatecube - takes direction as a parameter
          // faceMap - object to map the direction to corresponding face index
            const faceMap = {
                'top': 0,
                'bottom': 1,
                'front': 2,
                'back': 3,
                'left': 4,
                'right': 5,
                'up' : 0,
            };

            const face = faceMap[direction];
            const cw = isClockwise; // clockwise, you can modify this based on your requirement

            // Call the existing animateRotation function with the specified face and direction
            animateRotation(face, cw, Date.now());
          }
        
      
