const addplayerBtn = document.getElementById('addplayer');
const playerList = document.getElementById('playerlist');
const playerCounter = document.getElementById('playercount');

const soulCounter = document.getElementById('soulcounter');

const filterAllBtn = document.getElementById('filterAll');
const filterAliveBtn = document.getElementById('filterAlive');
const filterDeadBtn = document.getElementById('filterDead');

const removeSoul = document.getElementById('removeSoul');
const resetSoul = document.getElementById('resetSoul');

let playerCount = 0;

let playersAlive = 0;

let playersDead = 0;

let souls = 0;

const startTimer = document.getElementById('startTimer');
const resetTimer = document.getElementById('resetTimer');
const timerDisplay = document.getElementById('timerDisplay');

let secondsElapsed = 0;
let timerInterval = null;

function formatTime(totalSeconds) {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

startTimer.addEventListener("click", () => {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        startTimer.textContent = "Start";
    } else {
        timerInterval = setInterval(() => {
            secondsElapsed++;
            timerDisplay.textContent = formatTime(secondsElapsed);
        }, 1000);
        startTimer.textContent = "Pause";
    }
});

resetTimer.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
    secondsElapsed = 0;
    timerDisplay.textContent = "00:00:00";
    startTimer.textContent = "Start";
});

resetSoul.addEventListener("click", () => {
    soulCounter.textContent = '0';
    souls = 0;
});

removeSoul.addEventListener("click", () => {
    if (souls - 1 < 0) {
        souls = 0;
    } else {
        souls--;
        soulCounter.textContent = souls;
    }
})

addplayerBtn.addEventListener("click", () => {
    playerCount++;
    playerCounter.textContent = `${playerCount} players`;

    playerList.innerHTML += `
        <div class="player">
            <span contenteditable="true">Player ${playerCount}</span>
            <button class="killplayer">Kill</button>
            <button class="removeplayer">Remove</button>
        </div>
    `;

    filterAllBtn.textContent = `All (${playerCount})`;
    playersAlive++;
    filterAliveBtn.textContent = `Alive (${playersAlive})`;
});

playerList.addEventListener("click", (event) => {
    if (event.target.classList.contains("removeplayer")) {
        const player = event.target.closest(".player");
        const wasDead = player.classList.contains("dead");

        player.remove();
        playerCount--;
        playerCounter.textContent = `${playerCount} players`;
        filterAllBtn.textContent = `All (${playerCount})`;

        if (wasDead) {
            playersDead--;
            filterDeadBtn.textContent = `Dead (${playersDead})`;
        } else {
            playersAlive--;
            filterAliveBtn.textContent = `Alive (${playersAlive})`;
        }
    }

    if (event.target.classList.contains("killplayer")) {
        const isDead = event.target.closest(".player").classList.toggle("dead");

        if (isDead) {
            playersDead++;
            playersAlive--;
            souls++
            soulCounter.textContent = souls
        } else {
            playersDead--;
            playersAlive++;
        }

        filterDeadBtn.textContent = `Dead (${playersDead})`;
        filterAliveBtn.textContent = `Alive (${playersAlive})`;
    }
});

filterAllBtn.addEventListener("click", () => {
    document.querySelectorAll(".player").forEach(player => {
        player.style.display = "flex";
    });
});

filterAliveBtn.addEventListener("click", () => {
    document.querySelectorAll(".player").forEach(player => {
        player.style.display = player.classList.contains("dead") ? "none" : "flex";
    });
});

filterDeadBtn.addEventListener("click", () => {
    document.querySelectorAll(".player").forEach(player => {
        player.style.display = player.classList.contains("dead") ? "flex" : "none";
    });
});