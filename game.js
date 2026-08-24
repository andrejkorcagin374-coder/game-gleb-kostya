// Game state
const game = {
    gleb: {
        name: 'Глеб',
        maxHp: 100,
        hp: 100,
        energy: 100,
        maxEnergy: 100,
        emoji: '🧠'
    },
    kostya: {
        name: 'Костя',
        maxHp: 100,
        hp: 100,
        energy: 100,
        maxEnergy: 100,
        emoji: '💪'
    },
    currentPlayer: 'gleb',
    gameOver: false,
    winner: null,
    logs: []
};

// DOM elements - will be initialized when DOM is ready
let hp1, hp2, hpText1, hpText2, energy1, energy2, status, logDiv, btnAttack, btnSpecial, btnHeal, btnReset;

function initDOM() {
    hp1 = document.getElementById('hp1');
    hp2 = document.getElementById('hp2');
    hpText1 = document.getElementById('hp-text1');
    hpText2 = document.getElementById('hp-text2');
    energy1 = document.getElementById('energy1');
    energy2 = document.getElementById('energy2');
    status = document.getElementById('status');
    logDiv = document.getElementById('log');
    btnAttack = document.getElementById('btn-attack');
    btnSpecial = document.getElementById('btn-special');
    btnHeal = document.getElementById('btn-heal');
    btnReset = document.getElementById('btn-reset');
    
    // Event listeners
    btnAttack.addEventListener('click', attack);
    btnSpecial.addEventListener('click', specialAttack);
    btnHeal.addEventListener('click', heal);
    btnReset.addEventListener('click', resetGame);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (!game.gameOver) {
            if (game.currentPlayer === 'gleb') {
                if (e.key === '1' || e.key === 'q') attack();
                if (e.key === '2' || e.key === 'w') specialAttack();
                if (e.key === '3' || e.key === 'e') heal();
            }
        }
        if (e.key === '0' || e.key === 'r') resetGame();
    });
}

// Update UI
function updateUI() {
    // Update HP bars
    const hp1Percent = (game.gleb.hp / game.gleb.maxHp) * 100;
    const hp2Percent = (game.kostya.hp / game.kostya.maxHp) * 100;
    
    hp1.style.width = Math.max(0, hp1Percent) + '%';
    hp2.style.width = Math.max(0, hp2Percent) + '%';
    
    hpText1.textContent = `${Math.max(0, game.gleb.hp)} / ${game.gleb.maxHp} HP`;
    hpText2.textContent = `${Math.max(0, game.kostya.hp)} / ${game.kostya.maxHp} HP`;
    
    energy1.textContent = `⚡ Энергия: ${game.gleb.energy}`;
    energy2.textContent = `⚡ Энергия: ${game.kostya.energy}`;
    
    // Update status
    if (game.gameOver) {
        if (game.winner === 'gleb') {
            status.innerHTML = `<span class="status-gleb">🎉 Глеб победил! 🎉</span>`;
        } else {
            status.innerHTML = `<span class="status-kostya">🎉 Костя победил! 🎉</span>`;
        }
        disableAllButtons();
    } else {
        if (game.currentPlayer === 'gleb') {
            status.innerHTML = `<span class="status-gleb">Ход Глеба 🧠</span>`;
        } else {
            status.innerHTML = `<span class="status-kostya">Ход Костьи 💪</span>`;
        }
    }
}

// Add log entry
function addLog(message, type = 'normal') {
    const entry = document.createElement('div');
    entry.className = `log-entry log-${type}`;
    entry.textContent = message;
    logDiv.appendChild(entry);
    logDiv.scrollTop = logDiv.scrollHeight;
    game.logs.push(message);
}

// Disable all buttons
function disableAllButtons() {
    btnAttack.disabled = true;
    btnSpecial.disabled = true;
    btnHeal.disabled = true;
}

// Enable action buttons
function enableActionButtons() {
    const player = game.currentPlayer === 'gleb' ? game.gleb : game.kostya;
    
    btnAttack.disabled = player.energy < 15;
    btnSpecial.disabled = player.energy < 40;
    btnHeal.disabled = player.energy < 20 || player.hp === player.maxHp;
}

// Attack action
function attack() {
    const attacker = game.currentPlayer === 'gleb' ? game.gleb : game.kostya;
    const defender = game.currentPlayer === 'gleb' ? game.kostya : game.gleb;
    
    if (attacker.energy < 15) {
        addLog('⚠️ Недостаточно энергии!', 'normal');
        return;
    }
    
    const damage = Math.floor(Math.random() * 15) + 10; // 10-25
    attacker.energy -= 15;
    defender.hp -= damage;
    
    addLog(`${attacker.emoji} ${attacker.name} атакует! 💥 Урон: ${damage}`, 'attack');
    
    if (defender.hp <= 0) {
        defender.hp = 0;
        game.gameOver = true;
        game.winner = game.currentPlayer;
        addLog(`💀 ${defender.name} повержен!`, 'attack');
    }
    
    updateUI();
    if (!game.gameOver) {
        switchTurn();
    }
}

// Special attack
function specialAttack() {
    const attacker = game.currentPlayer === 'gleb' ? game.gleb : game.kostya;
    const defender = game.currentPlayer === 'gleb' ? game.kostya : game.gleb;
    
    if (attacker.energy < 40) {
        addLog('⚠️ Недостаточно энергии!', 'normal');
        return;
    }
    
    const damage = Math.floor(Math.random() * 25) + 25; // 25-50
    attacker.energy -= 40;
    defender.hp -= damage;
    
    addLog(`${attacker.emoji} ${attacker.name} использует спец. удар! 🔥 Урон: ${damage}`, 'special');
    
    if (defender.hp <= 0) {
        defender.hp = 0;
        game.gameOver = true;
        game.winner = game.currentPlayer;
        addLog(`💀 ${defender.name} повержен!`, 'special');
    }
    
    updateUI();
    if (!game.gameOver) {
        switchTurn();
    }
}

// Heal action
function heal() {
    const player = game.currentPlayer === 'gleb' ? game.gleb : game.kostya;
    
    if (player.energy < 20) {
        addLog('⚠️ Недостаточно энергии!', 'normal');
        return;
    }
    
    if (player.hp === player.maxHp) {
        addLog('⚠️ HP уже на максимуме!', 'normal');
        return;
    }
    
    const healing = 30;
    player.energy -= 20;
    player.hp = Math.min(player.hp + healing, player.maxHp);
    
    addLog(`${player.emoji} ${player.name} использует исцеление! 💚 Восстановление: ${healing}`, 'heal');
    
    updateUI();
    switchTurn();
}

// Switch turn
function switchTurn() {
    game.currentPlayer = game.currentPlayer === 'gleb' ? 'kostya' : 'gleb';
    
    // Recover energy slightly each turn
    const player = game.currentPlayer === 'gleb' ? game.gleb : game.kostya;
    player.energy = Math.min(player.energy + 15, player.maxEnergy);
    
    updateUI();
    enableActionButtons();
    
    // AI turn for Kostya
    if (game.currentPlayer === 'kostya' && !game.gameOver) {
        setTimeout(aiTurn, 1000);
    }
}

// AI turn
function aiTurn() {
    if (game.gameOver) return;
    
    const player = game.kostya;
    const opponent = game.gleb;
    
    // AI strategy
    let action;
    
    if (player.hp < 30 && player.energy >= 20) {
        action = 'heal';
    } else if (opponent.hp > 50 && player.energy >= 40) {
        action = Math.random() > 0.5 ? 'special' : 'attack';
    } else if (player.energy >= 15) {
        action = 'attack';
    } else {
        action = 'wait';
    }
    
    if (action === 'attack') {
        attack();
    } else if (action === 'special') {
        specialAttack();
    } else if (action === 'heal') {
        heal();
    } else {
        game.kostya.energy = Math.min(game.kostya.energy + 15, game.kostya.maxEnergy);
        addLog(`${game.kostya.emoji} ${game.kostya.name} восстанавливает энергию...`);
        updateUI();
        switchTurn();
    }
}

// Reset game
function resetGame() {
    game.gleb.hp = game.gleb.maxHp;
    game.gleb.energy = game.gleb.maxEnergy;
    game.kostya.hp = game.kostya.maxHp;
    game.kostya.energy = game.kostya.maxEnergy;
    game.currentPlayer = 'gleb';
    game.gameOver = false;
    game.winner = null;
    game.logs = [];
    
    logDiv.innerHTML = '';
    addLog('🎮 Новая игра начинается!');
    
    updateUI();
    enableActionButtons();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initDOM();
    resetGame();
    enableActionButtons();
});