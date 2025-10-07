// ===== Paramètres =====
const CELLS = 20;
const SIZE = 20;

// ===== Éléments DOM =====
const cv = document.getElementById('c');
const cx = cv.getContext('2d');
const scoreEl = document.getElementById('score');
const resetBtn = document.getElementById('reset');

// ===== Variables du jeu =====
let snake, dir, nextDir, score, speed, timer, apple;

// ===== Fonctions =====
function reset(){
    snake = [{x:10,y:10}];
    dir = {x:1,y:0};
    nextDir = {x:1,y:0};
    score = 0; 
    scoreEl.textContent = score;
    speed = 180;
    placeApple();
    restart();
    draw();
}

function placeApple() {
    let newApple;
    do {
        newApple = {
            x: Math.floor(Math.random() * CELLS),
            y: Math.floor(Math.random() * CELLS)
        };
    } while (snake.some(segment => segment.x === newApple.x && segment.y === newApple.y));
    apple = newApple;
}

function restart(){
    if (timer) clearInterval(timer);
    timer = setInterval(tick, speed);
}

function tick(){
    dir = nextDir;
    const head = snake[0];
    const nx = head.x + dir.x;
    const ny = head.y + dir.y;

    // Collision
    if(nx<0||ny<0||nx>=CELLS||ny>=CELLS|| snake.some((s,i)=>i>0 && s.x===nx && s.y===ny)){
        return gameOver();
    }

    snake.unshift({x:nx,y:ny});

    if(nx===apple.x && ny===apple.y){
        score++; 
        scoreEl.textContent = score;
        speed = Math.max(60, speed-12);
        restart();
        placeApple();
    } else {
        snake.pop();
    }

    draw();
}

function gameOver(){
    clearInterval(timer);
    cx.fillStyle = 'rgba(0,0,0,.08)';
    cx.fillRect(0,0,cv.width,cv.height);
    cx.fillStyle = '#222';
    cx.font = 'bold 18px system-ui';
    cx.textAlign='center';
    cx.fillText('Perdu — R pour rejouer', cv.width/2, cv.height/2);
}

function draw(){
    cx.clearRect(0,0,cv.width,cv.height);
    
    // Pomme
    cx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--fruit')||'#ff5a5f';
    cx.fillRect(apple.x*SIZE+2, apple.y*SIZE+2, SIZE-4, SIZE-4);
    
    // Corps du serpent
    cx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--snake')||'#16a34a';
    for(let i=snake.length-1;i>0;i--){ 
        const s=snake[i]; 
        cx.fillRect(s.x*SIZE+2, s.y*SIZE+2, SIZE-4, SIZE-4); 
    }
    
    // Tête du serpent
    cx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--head')||'#059669';
    const h=snake[0]; 
    cx.fillRect(h.x*SIZE+1, h.y*SIZE+1, SIZE-2, SIZE-2);
}

// ===== Événements =====
window.addEventListener('keydown', e=>{
    const k=e.key;
    if(k==='ArrowUp' && dir.y!== 1) nextDir={x:0,y:-1};
    if(k==='ArrowDown' && dir.y!==-1) nextDir={x:0,y: 1};
    if(k==='ArrowLeft' && dir.x!== 1) nextDir={x:-1,y:0};
    if(k==='ArrowRight'&& dir.x!==-1) nextDir={x: 1,y:0};
    if(k==='r' || k==='R') reset();
});

resetBtn.addEventListener('click', reset);

// ===== Lancement =====
reset();