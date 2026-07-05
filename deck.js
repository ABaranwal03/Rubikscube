// =========================================================================
// PRODUCTION SPEEDCUBING SPEEDRUN ENGINE (Unified Master Controller)
// =========================================================================

let startTime = null;
let timerInterval = null;
let totalMoves = 0;
let runActive = false;
let isScrambled = false; 

const notationMap = ['U', 'D', 'F', 'B', 'L', 'R', 'E', 'S', 'M'];

// Bootstrapping: Pull historical Personal Best values straight out of Local Storage on file load
window.addEventListener("load", () => {
    let savedPB = localStorage.getItem("rubiksPB_text");
    if (savedPB) {
        document.getElementById("pb-display").innerText = "Best: " + savedPB;
    }
});

// Dynamic Interceptor Injection: Wrap the base animation script to map live metrics on manual loops
const nativeAnimation = animateRotation;
animateRotation = function(face, cw, currentTime) {
    trackMovePerformance(face, cw);
    nativeAnimation(face, cw, currentTime);
};

function trackMovePerformance(face, cw) {
    if (isSolving) return; // Disregard timeline solve rollbacks completely

    // Fire stopwatch engine exclusively on the user's initial real input turn
    if (!runActive && isScrambled) {
        runActive = true;
        startTime = Date.now();
        timerInterval = setInterval(updateTimerUI, 10);
    }

    if (isScrambled) {
        totalMoves++;
        document.getElementById("move-counter").innerText = totalMoves;

        let code = notationMap[face] + (cw ? "" : "'");
        let logBox = document.getElementById("scramble-log");
        
        if (logBox.innerText.includes("Ready") || logBox.innerText.includes("Scrambled")) {
            logBox.innerText = code;
        } else {
            logBox.innerText += " " + code;
        }

        // Post-Animation Sync Hook: Scan matrix nodes after turn completion (350ms) to read solved states
        setTimeout(() => {
            if (runActive && typeof isCubeSolved === "function" && isCubeSolved()) {
                stopTimerSuccess();
            }
        }, 350);
    }
}

function updateTimerUI() {
    if (!startTime) return;
    let delta = Date.now() - startTime;
    
    let minutes = Math.floor(delta / 60000);
    let seconds = Math.floor((delta % 60000) / 1000);
    let milliseconds = Math.floor((delta % 1000) / 10);

    let formatMin = minutes < 10 ? "0" + minutes : minutes;
    let formatSec = seconds < 10 ? "0" + seconds : seconds;
    let formatMs = milliseconds < 10 ? "0" + milliseconds : milliseconds;

    document.getElementById("timer-display").innerText = `${formatMin}:${formatSec}.${formatMs}`;

    let totalSeconds = delta / 1000;
    let tps = totalSeconds > 0 ? (totalMoves / totalSeconds).toFixed(1) : "0.0";
    document.getElementById("tps-counter").innerText = tps;
}

// Save Records to Browser Storage Cache 
function stopTimerSuccess() {
    clearInterval(timerInterval);
    runActive = false;
    isScrambled = false; 
    
    let delta = Date.now() - startTime;
    let finalTime = document.getElementById("timer-display").innerText;
    let logBox = document.getElementById("scramble-log");
    
    let bestTimeMs = localStorage.getItem("rubiksPB_ms");
    let isNewPB = false;

    if (!bestTimeMs || delta < parseInt(bestTimeMs)) {
        localStorage.setItem("rubiksPB_ms", delta);
        localStorage.setItem("rubiksPB_text", finalTime);
        document.getElementById("pb-display").innerText = "Best: " + finalTime;
        isNewPB = true;
    }

    if (isNewPB) {
        logBox.innerHTML = `<span style="color: #ffd700; font-weight: bold;">🏆 NEW PERSONAL BEST!</span> Final Time: ${finalTime}`;
    } else {
        logBox.innerHTML = `<span style="color: #00ff66; font-weight: bold;">SOLVED!</span> Final Time: ${finalTime}`;
    }
}

// =========================================================================
// PERFORMANCE DESKTOP INTERACTORS (Global Keyboard Bindings Map)
// =========================================================================
window.addEventListener('keydown', (e) => {
    if (isSolving) return;

    const keyMap = {
        'u': 'top',
        'd': 'bottom',
        'f': 'front',
        'b': 'back',
        'l': 'left',
        'r': 'right'
    };

    let dir = keyMap[e.key.toLowerCase()];
    if (dir) {
        let isClockwise = !e.shiftKey; // Holding Shift generates prime inverse actions
        if (typeof rotateCube === 'function') {
            rotateCube(dir, isClockwise);
        }
    }
});

// =========================================================================
// COMPETITION MACRO GENERATION (Official WCA 20-Move Scrambles)
// =========================================================================
const nativeShuffle = shuffleCube;
shuffleCube = function() {
    clearInterval(timerInterval);
    runActive = false;
    startTime = null;
    totalMoves = 0;
    isScrambled = false; 
    
    document.getElementById("timer-display").innerText = "00:00.00";
    document.getElementById("move-counter").innerText = "0";
    document.getElementById("tps-counter").innerText = "0.0";
    
    const faces = ['top', 'bottom', 'front', 'back', 'left', 'right'];
    const notationMapStr = ['U', 'D', 'F', 'B', 'L', 'R'];
    let scrambleSequence = [];
    let scrambleText = "";
    let lastFace = -1;

    for(let i = 0; i < 20; i++) {
        let f;
        do { f = Math.floor(Math.random() * 6); } while (f === lastFace); 
        lastFace = f;
        
        let cw = Math.random() < 0.5;
        scrambleSequence.push({ dir: faces[f], cw: cw });
        scrambleText += notationMapStr[f] + (cw ? "" : "'") + " ";
    }

    document.getElementById("scramble-log").innerHTML = `<span style="color:#ffae00; font-weight:bold;">Scrambling...</span><br>${scrambleText}`;

    // Execute the WCA sequence programmatically through our automated macro runner
    playAlgorithm(scrambleSequence.map(m => m.dir), scrambleSequence.map(m => m.cw));

    // Wait for the full set of turns to conclude safely before arming the user timer trigger
    setTimeout(() => {
        isScrambled = true; 
        document.getElementById("scramble-log").innerHTML = `<span style="color:#fff; font-weight:bold;">Scramble Stack:</span><br>${scrambleText}`;
    }, 20 * 380 + 100);
};

const nativeReset = resetView;
resetView = function() {
    clearInterval(timerInterval);
    runActive = false;
    startTime = null;
    totalMoves = 0;
    isScrambled = false;
    
    document.getElementById("timer-display").innerText = "00:00.00";
    document.getElementById("move-counter").innerText = "0";
    document.getElementById("tps-counter").innerText = "0.0";
    document.getElementById("scramble-log").innerText = "Ready for action...";
    
    nativeReset();
};

// =========================================================================
// CUSTOMIZATION THEME SHOP AND GAMIFICATION LOGIC
// =========================================================================
window.setTheme = function(themeName) {
    document.body.classList.remove('theme-pastel');
    if (themeName !== 'standard') document.body.classList.add('theme-' + themeName);
};

window.setBackground = function(bgName) {
    document.body.classList.remove('bg-dark', 'bg-gradient');
    document.body.classList.add('bg-' + bgName);
};

let isBlindfolded = false;
window.toggleBlindfold = function() {
    isBlindfolded = !isBlindfolded;
    let btn = document.getElementById('btn-blindfold');

    if (isBlindfolded) {
        document.body.classList.add('blindfolded');
        btn.innerHTML = '<span style="font-weight: bold; color: #ccffcc;">👀 Exit Blindfolded Mode</span>';
        btn.style.background = "#004d00";
        btn.style.borderColor = "#4dff4d";
    } else {
        document.body.classList.remove('blindfolded');
        btn.innerHTML = '<span style="font-weight: bold; color: #ffcccc;">🙈 Enter Blindfolded Mode</span>';
        btn.style.background = "#5c0000";
        btn.style.borderColor = "#ff4d4d";
    }
};

window.playPattern = function(patternName) {
    if (isSolving) return;
    resetView();
    
    setTimeout(() => {
        let sequence = [];
        let directions = [];
        
        if (patternName === 'checkerboard') {
            sequence = ['top','top','bottom','bottom','right','right','left','left','front','front','back','back'];
            directions = Array(12).fill(true); 
        } 
        else if (patternName === 'cubeincube') {
            sequence = ['front', 'left', 'front', 'top', 'right', 'top', 'front', 'front', 'left', 'left', 'top', 'left', 'back', 'bottom', 'back', 'left', 'left', 'top'];
            directions = [true, true, true, false, true, true, true, true, true, true, false, false, true, false, false, true, true, true];
        }

        playAlgorithm(sequence, directions);
    }, 150); 
};

// =========================================================================
// MACRO SEQUENCER AUTOMATION RUNNER
// =========================================================================
window.playAlgorithm = function(moveSequenceArray, directionArray = null) {
    if (isSolving) return; 
    
    const previouslyScrambled = isScrambled;
    isScrambled = false; // Mute live metric intervals during automated animations

    let currentStepIndex = 0;
    const cadenceDelay = 380; 

    const executeNextQueuedMove = () => {
        if (currentStepIndex < moveSequenceArray.length) {
            let directionCode = moveSequenceArray[currentStepIndex];
            let cw = directionArray ? directionArray[currentStepIndex] : true;
            
            if (typeof rotateCube === 'function') {
                rotateCube(directionCode, cw);
            }
            currentStepIndex++;
            setTimeout(executeNextQueuedMove, cadenceDelay);
        } else {
            isScrambled = previouslyScrambled; // Re-arm context state flags safely on sequence end
        }
    };

    executeNextQueuedMove();
};