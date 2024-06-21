document.querySelector(".control-buttons span").onclick = function() {
    document.querySelector(".control-buttons").remove();
    startGame();
    
};

const players = [
    { name: 'yazan', score: 0 },
    { name: 'amir', score: 0 }
];

let currentPlayerIndex = 0;

function updateScore() {
    const scoreElement = document.getElementById(`score${currentPlayerIndex + 1}`);
    players[currentPlayerIndex].score++;
    scoreElement.textContent = players[currentPlayerIndex].score;
}

function togglePlayer() {
    currentPlayerIndex = (currentPlayerIndex + 1) % 2;
}

const canvas = document.getElementById('memory-game');
const context = canvas.getContext('2d');
const blockSize = 100;
const blocksPerRow = 4;
const blockSpacing = 10;
const blockOffset = 20;
const duration = 1000;




let blocks = [];
let flippedBlocks = [];
let matchedBlocks = [];
let noClicking = false;

function startGame() {
    blocks = createBlocks();
    shuffle(blocks);
    drawGame();
    canvas.addEventListener('click', handleCanvasClick);
}

function createBlocks() {
    const shapes = ['circle', 'square', 'triangle', 'hexagon', 'star', 'diamond'];
    const blockCount = shapes.length * 2;
    let blocks = [];
    for (let i = 0; i < blockCount; i++) {
        const shape = shapes[i % shapes.length];
        blocks.push({ shape, isFlipped: false, isMatched: false });
    }
    return blocks;
}

function shuffle(array) {
    let current = array.length, temp, random;
    while (current > 0) {
        random = Math.floor(Math.random() * current);
        current--;
        temp = array[current];
        array[current] = array[random];
        array[random] = temp;
    }
}

function drawGame() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    blocks.forEach((block, index) => {
        const x = blockOffset + (index % blocksPerRow) * (blockSize + blockSpacing);
        const y = blockOffset + Math.floor(index / blocksPerRow) * (blockSize + blockSpacing);
        drawBlock(block, x, y);
    });
}

function drawBlock(block, x, y) {
    context.fillStyle = '#333';
    context.fillRect(x, y, blockSize, blockSize);

    if (block.isFlipped || block.isMatched) {
        drawShape(block.shape, x + blockSize / 2, y + blockSize / 2);
    } else {
        context.fillStyle = '#607D8B';
        context.fillRect(x, y, blockSize, blockSize);
        context.fillStyle = '#FFF';
        context.font = '48px Arial';
        context.fillText('?', x + blockSize / 2 - 15, y + blockSize / 2 + 15);
    }

    context.strokeStyle = '#2196f3';
    context.lineWidth = 5;
    context.strokeRect(x, y, blockSize, blockSize);
}

function drawShape(shape, centerX, centerY) {
    context.fillStyle = getShapeColor(shape);
    context.beginPath();
    switch (shape) {
        case 'circle':
            context.arc(centerX, centerY, 30, 0, Math.PI * 2);
            break;
        case 'square':
            context.rect(centerX - 30, centerY - 30, 60, 60);
            break;
        case 'triangle':
            context.moveTo(centerX, centerY - 30);
            context.lineTo(centerX + 30, centerY + 30);
            context.lineTo(centerX - 30, centerY + 30);
            break;
        case 'hexagon':
            for (let i = 0; i < 6; i++) {
                context.lineTo(centerX + 30 * Math.cos(i * Math.PI / 3), centerY + 30 * Math.sin(i * Math.PI / 3));
            }
            break;
        case 'star':
            for (let i = 0; i < 10; i++) {
                let radius = i % 2 === 0 ? 30 : 15;
                context.lineTo(centerX + radius * Math.cos(i * Math.PI / 5), centerY + radius * Math.sin(i * Math.PI / 5));
            }
            break;
        case 'diamond':
            context.moveTo(centerX, centerY - 30);
            context.lineTo(centerX + 30, centerY);
            context.lineTo(centerX, centerY + 30);
            context.lineTo(centerX - 30, centerY);
            break;
    }
    context.closePath();
    context.fill();
}

function getShapeColor(shape) {
    switch (shape) {
        case 'circle': return 'blue';
        case 'square': return 'red';
        case 'triangle': return 'green';
        case 'hexagon': return 'yellow';
        case 'star': return 'purple';
        case 'diamond': return 'orange';
    }
}

function handleCanvasClick(event) {
    if (noClicking) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const index = getBlockIndex(x, y);

    if (index !== -1 && !blocks[index].isFlipped && !blocks[index].isMatched) {
        flipBlock(index);
        if (flippedBlocks.length === 2) {
            stopClicking();
            setTimeout(checkMatch, duration);
        }
    }
}

function getBlockIndex(x, y) {
    for (let i = 0; i < blocks.length; i++) {
        const blockX = blockOffset + (i % blocksPerRow) * (blockSize + blockSpacing);
        const blockY = blockOffset + Math.floor(i / blocksPerRow) * (blockSize + blockSpacing);
        if (x > blockX && x < blockX + blockSize && y > blockY && y < blockY + blockSize) {
            return i;
        }
    }
    return -1;
}


function flipBlock(index) {
    const block = blocks[index];
    if (block.isFlipped || noClicking) return; // Do not flip if already flipped or during noClicking state

    block.isFlipped = true;
    flippedBlocks.push(index);

    let rotateAnimation = 0;

    const animateFlip = () => {
        rotateAnimation += 10; // Adjust speed of rotation

        // Clear only the clicked block area
        context.clearRect(
            blockOffset + (index % blocksPerRow) * (blockSize + blockSpacing),
            blockOffset + Math.floor(index / blocksPerRow) * (blockSize + blockSpacing),
            blockSize,
            blockSize
        );

        // Draw the card with rotation animation
        context.save();
        context.translate(
            blockOffset + (index % blocksPerRow) * (blockSize + blockSpacing) + blockSize / 2,
            blockOffset + Math.floor(index / blocksPerRow) * (blockSize + blockSpacing) + blockSize / 2
        );
        context.rotate(rotateAnimation * Math.PI / 180); // Convert degrees to radians
        context.translate(
            -(blockOffset + (index % blocksPerRow) * (blockSize + blockSpacing) + blockSize / 2),
            -(blockOffset + Math.floor(index / blocksPerRow) * (blockSize + blockSpacing) + blockSize / 2)
        );
        drawBlock(block, 
            blockOffset + (index % blocksPerRow) * (blockSize + blockSpacing), 
            blockOffset + Math.floor(index / blocksPerRow) * (blockSize + blockSpacing)
        ); // Redraw only the flipped card

        context.restore();

        if (rotateAnimation <= 180) {
            requestAnimationFrame(animateFlip);
        } else {
            block.isFlipped = true; // Ensure the card is marked as flipped
            drawBlock(block, 
                blockOffset + (index % blocksPerRow) * (blockSize + blockSpacing), 
                blockOffset + Math.floor(index / blocksPerRow) * (blockSize + blockSpacing)
            ); // Final state after flipping animation
        }
    };

    animateFlip();
}

function checkMatch() {
    const [firstIndex, secondIndex] = flippedBlocks;
    if (blocks[firstIndex].shape === blocks[secondIndex].shape) {
        blocks[firstIndex].isMatched = true;
        blocks[secondIndex].isMatched = true;
        matchedBlocks.push(firstIndex, secondIndex);

        updateScore();
        togglePlayer();
        
    } else {
        blocks[firstIndex].isFlipped = false;
        blocks[secondIndex].isFlipped = false;
        togglePlayer();

    }
    flippedBlocks = [];
    noClicking = false;
    drawGame();

    checkGameCompletion();
}

function stopClicking() {
    noClicking = true;
    setTimeout(() => {
        noClicking = false;
    }, duration);
}


function checkGameCompletion() {
    if (matchedBlocks.length === blocks.length) {
        // All blocks matched, restart the game
        setTimeout(() => {
            print_winner();
            blocks.forEach(block => {
                block.isFlipped = false;
                block.isMatched = false;
            document.getElementById('score1').textContent = 0;
            document.getElementById('score2').textContent = 0;
            players[0].score = 0;
            players[1].score = 0;

            currentPlayerIndex = 0;

            });
            matchedBlocks = [];
            flippedBlocks = [];


            drawGame();
        }, 1000); // Adjust delay as needed before restarting
    }
}

function print_winner(){ 
    let winner_player = " ";
    if (document.getElementById('score1').textContent > document.getElementById('score2').textContent) {
        winner_player = `${players[0].name} won the match`;
    } else if(document.getElementById('score1').textContent < document.getElementById('score2').textContent) {
        winner_player = `${players[1].name} won the match`;
    } else { 
        winner_player = `draw`;
    }
    alert(winner_player);
   
}