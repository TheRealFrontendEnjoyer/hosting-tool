const addplayerBtn = document.getElementById('addplayer');
const playerList = document.getElementById('playerlist');
const playerCounter = document.getElementById('playercount');
const soulCounter = document.getElementById('soulcounter');
const filterAllBtn = document.getElementById('filterAll');
const filterAliveBtn = document.getElementById('filterAlive');
const filterDeadBtn = document.getElementById('filterDead');
const removeSoul = document.getElementById('removeSoul');
const resetSoul = document.getElementById('resetSoul');
const startTimer = document.getElementById('startTimer');
const resetTimer = document.getElementById('resetTimer');
const timerDisplay = document.getElementById('timerDisplay');

const mainPage = document.querySelector('.mainpage');
const setupScreen = document.querySelector('.setup');
const setupConfirm = document.getElementById('setupConfirm');
const inputHost = document.getElementById('inputHost');
const inputGame = document.getElementById('inputGame');
const part1 = document.querySelector('.part1');
const part2 = document.querySelector('.part2');
const parent = document.querySelector('.parent');
const nextBtn = document.querySelector('.part1 button');

function hide(el) {
    el.style.display = 'none';
}

function fadeOut(el, duration = 350) {
    return new Promise(resolve => {
        el.style.transition = `opacity ${duration}ms, transform ${duration}ms`;
        el.style.opacity = '0';
        el.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            hide(el);
            el.style.transition = '';
            el.style.transform = '';
            resolve();
        }, duration);
    });
}

function fadeIn(el, duration = 350, fromBelow = true) {
    el.style.display = 'flex';
    el.style.opacity = '0';
    el.style.transform = `translateY(${fromBelow ? '20px' : '-20px'})`;
    el.style.transition = 'none';

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            el.style.transition = `opacity ${duration}ms, transform ${duration}ms`;
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    });
}

hide(setupScreen);
hide(part2);
hide(setupConfirm);
parent.style.display = 'none';

// MAIN PAGE TO PART 1

document.querySelector('.mainpage button').addEventListener('click', async () => {
    await fadeOut(mainPage);
    setupScreen.style.display = 'flex';
    fadeIn(part1);
    inputHost.focus();
});

// SETUP PART 1 TO PART 2

async function goToStep2() {
    const host = inputHost.value.trim();
    if (!host) return;

    await fadeOut(part1);

    fadeIn(part2);
    fadeIn(setupConfirm);
    inputGame.focus();
}

nextBtn.addEventListener('click', goToStep2);
inputHost.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') goToStep2();
});

// SETUP PART 2

async function beginGame() {
    const game = inputGame.value.trim();
    if (!game) return;

    const host = inputHost.value.trim();
    document.querySelector('.topleft h3').textContent = `${host}'s MM Game:`;
    document.querySelector('.topleft h2').textContent = game;

    await fadeOut(setupScreen);

    parent.style.display = 'flex';
    parent.style.opacity = '0';
    parent.style.transition = 'none';

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            parent.style.transition = 'opacity 0.5s';
            parent.style.opacity = '1';
        });
    });
}

setupConfirm.addEventListener('click', beginGame);
inputGame.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') beginGame();
});

// TIMER

let secondsElapsed = 0;
let timerInterval = null;

function formatTime(totalSeconds) {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

startTimer.addEventListener('click', () => {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        startTimer.textContent = 'Start';
    } else {
        timerInterval = setInterval(() => {
            secondsElapsed++;
            timerDisplay.textContent = formatTime(secondsElapsed);
        }, 1000);
        startTimer.textContent = 'Pause';
    }
});

resetTimer.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    secondsElapsed = 0;
    timerDisplay.textContent = '00:00:00';
    startTimer.textContent = 'Start';
});

// SOULS

let souls = 0;

resetSoul.addEventListener('click', () => {
    souls = 0;
    soulCounter.textContent = 0;
});

removeSoul.addEventListener('click', () => {
    souls = Math.max(0, souls - 1);
    soulCounter.textContent = souls;
});

// PLAYERS

let playerCount = 0;
let playersAlive = 0;
let playersDead = 0;

addplayerBtn.addEventListener('click', () => {
    playerCount++;
    playersAlive++;
    playerCounter.textContent = `${playerCount} players`;
    filterAllBtn.textContent = `All (${playerCount})`;
    filterAliveBtn.textContent = `Alive (${playersAlive})`;

    playerList.innerHTML += `
        <div class="player">
            <div class="dot"></div>
            <span contenteditable="true">Player ${playerCount}</span>
            <div class="player-actions">
                <button class="killplayer">Kill</button>
                <button class="removeplayer">Remove</button>
            </div>
        </div>
    `;
});

playerList.addEventListener('click', (event) => {
    if (event.target.classList.contains('removeplayer')) {
        const player = event.target.closest('.player');
        const wasDead = player.classList.contains('dead');

        player.remove();
        playerCount--;
        playerCounter.textContent = `${playerCount} players`;
        filterAllBtn.textContent = `All (${playerCount})`;

        if (wasDead) {
            playersDead--;
            soulCounter.textContent = souls;
            filterDeadBtn.textContent = `Dead (${playersDead})`;
        } else {
            playersAlive--;
            filterAliveBtn.textContent = `Alive (${playersAlive})`;
        }
    }

    if (event.target.classList.contains('killplayer')) {
        const player = event.target.closest('.player');
        const isDead = player.classList.toggle('dead');
        const dot = player.querySelector('.dot');

        if (isDead) {
            playersDead++;
            playersAlive--;
            souls++;
            soulCounter.textContent = souls;
            dot.style.backgroundColor = '#ff1a6e';
            event.target.textContent = 'Revive';
        } else {
            playersDead--;
            playersAlive++;
            soulCounter.textContent = souls;
            dot.style.backgroundColor = 'lightgreen';
            event.target.textContent = 'Kill';
        }

        filterDeadBtn.textContent = `Dead (${playersDead})`;
        filterAliveBtn.textContent = `Alive (${playersAlive})`;
    }
});

// FILTERS

filterAllBtn.addEventListener('click', () => {
    document.querySelectorAll('.player').forEach(p => p.style.display = 'flex');
});

filterAliveBtn.addEventListener('click', () => {
    document.querySelectorAll('.player').forEach(p => {
        p.style.display = p.classList.contains('dead') ? 'none' : 'flex';
    });
});

filterDeadBtn.addEventListener('click', () => {
    document.querySelectorAll('.player').forEach(p => {
        p.style.display = p.classList.contains('dead') ? 'flex' : 'none';
    });
});