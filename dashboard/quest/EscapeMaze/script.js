const gridSize = 10;
let robotPos = { x: 0, y: 9 };
let robotDir = 0; // 0: up, 1: right, 2: down, 3: left
let commands = [];

const obstacles = [
    { x: 2, y: 8 }, { x: 3, y: 8 }, { x: 4, y: 8 },
    { x: 2, y: 7 }, { x: 4, y: 7 },
    { x: 2, y: 6 }, { x: 4, y: 6 },
    { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }
];

const endPoint = { x: 8, y: 1 };

function createGrid() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            if (x === robotPos.x && y === robotPos.y) {
                const robot = document.createElement('div');
                robot.className = 'robot';
                robot.style.transform = `rotate(${robotDir * 90}deg)`;
                cell.appendChild(robot);
            }
            
            if (x === 0 && y === 9) {
                cell.classList.add('start');
            }
            
            if (x === endPoint.x && y === endPoint.y) {
                cell.classList.add('end');
            }
            
            if (obstacles.some(obs => obs.x === x && obs.y === y)) {
                cell.classList.add('obstacle');
            }
            
            grid.appendChild(cell);
        }
    }
}

function addCommand() {
    const command = document.getElementById('commandSelect').value;
    const repeatCount = document.getElementById('repeatCount').value;
    
    if (command === 'repeat' && (!repeatCount || repeatCount < 2)) {
        alert('Please specify repeat count (2-10)');
        return;
    }
    
    if (command === 'repeat') {
        commands.push({ type: 'repeat', count: parseInt(repeatCount) });
    } else {
        commands.push({ type: command });
    }
    
    updateCommandList();
}

function updateCommandList() {
    const list = document.getElementById('commandList');
    let displayCommands = [];
    
    for (let i = 0; i < commands.length; i++) {
        const cmd = commands[i];
        if (cmd.type === 'repeat') {
            const nextCmd = commands[i + 1];
            if (nextCmd) {
                displayCommands.push(`Repeat ${cmd.count} times: ${nextCmd.type.charAt(0).toUpperCase() + nextCmd.type.slice(1)}`);
                i++;
            } else {
                displayCommands.push(`Repeat ${cmd.count} times: (add command)`);
            }
        } else {
            displayCommands.push(cmd.type.charAt(0).toUpperCase() + cmd.type.slice(1));
        }
    }
    
    list.innerHTML = displayCommands.join('<br>');
}

function moveRobot() {
    const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]]; // up, right, down, left
    const dir = dirs[robotDir];
    const newX = robotPos.x + dir[0];
    const newY = robotPos.y + dir[1];
    
    if (newX >= 0 && newX < gridSize && 
        newY >= 0 && newY < gridSize && 
        !obstacles.some(obs => obs.x === newX && obs.y === newY)) {
        robotPos.x = newX;
        robotPos.y = newY;
        return true;
    }
    return false;
}

async function executeCommands() {
    for (let i = 0; i < commands.length; i++) {
        const cmd = commands[i];
        
        if (cmd.type === 'repeat') {
            const nextCmd = commands[i + 1];
            if (nextCmd) {
                for (let j = 0; j < cmd.count; j++) {
                    switch (nextCmd.type) {
                        case 'forward':
                            moveRobot();
                            break;
                        case 'left':
                            robotDir = (robotDir + 3) % 4;
                            break;
                        case 'right':
                            robotDir = (robotDir + 1) % 4;
                            break;
                    }
                    createGrid();
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    if (robotPos.x === endPoint.x && robotPos.y === endPoint.y) {
                        alert('Congratulations! You reached the end point!');
                        return;
                    }
                }
                i++;
            }
        } else {
            switch (cmd.type) {
                case 'forward':
                    moveRobot();
                    break;
                case 'left':
                    robotDir = (robotDir + 3) % 4;
                    break;
                case 'right':
                    robotDir = (robotDir + 1) % 4;
                    break;
            }
            createGrid();
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        if (robotPos.x === endPoint.x && robotPos.y === endPoint.y) {
            alert('Congratulations! You reached the end point!');
            return;
        }
    }
}

function runCommands() {
    executeCommands();
}

function resetGame() {
    robotPos = { x: 0, y: 9 };
    robotDir = 0;
    commands = [];
    updateCommandList();
    createGrid();
}

document.getElementById('commandSelect').addEventListener('change', function(e) {
    document.getElementById('repeatCount').style.display = 
        e.target.value === 'repeat' ? 'block' : 'none';
});

createGrid();