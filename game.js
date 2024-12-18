const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 게임 상태
const game = {
    player: {
        x: 100,
        y: 300,
        width: 30,
        height: 30,
        speed: 5
    },
    exit: {
        x: 700,
        y: 300,
        width: 50,
        height: 80
    },
    isLightOn: true,
    gameOver: false,
    success: false
};

// 키보드 입력 처리
const keys = {};
document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

// 조명 상태 변경
function toggleLight() {
    if (!game.gameOver && !game.success) {
        game.isLightOn = !game.isLightOn;
        setTimeout(toggleLight, Math.random() * 2000 + 1000); // 1-3초 간격으로 변경
    }
}

// 게임 업데이트
function update() {
    if (game.gameOver || game.success) return;

    // 플레이어 이동
    if (keys['ArrowLeft']) game.player.x -= game.player.speed;
    if (keys['ArrowRight']) game.player.x += game.player.speed;
    if (keys['ArrowUp']) game.player.y -= game.player.speed;
    if (keys['ArrowDown']) game.player.y += game.player.speed;

    // 경계 체크
    game.player.x = Math.max(0, Math.min(canvas.width - game.player.width, game.player.x));
    game.player.y = Math.max(0, Math.min(canvas.height - game.player.height, game.player.y));

    // 움직임 감지 및 게임 오버 체크
    if (game.isLightOn && 
        (keys['ArrowLeft'] || keys['ArrowRight'] || keys['ArrowUp'] || keys['ArrowDown'])) {
        game.gameOver = true;
    }

    // 탈출구 도달 체크
    if (checkCollision(game.player, game.exit)) {
        game.success = true;
    }
}

// 충돌 감지
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// 게임 화면 그리기
function draw() {
    // 배경
    ctx.fillStyle = game.isLightOn ? '#ffffff' : '#333333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 책상들 그리기
    ctx.fillStyle = '#8B4513';
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 3; j++) {
            if (!(i === 1 && j === 1)) { // 플레이어 시작 위치 제외
                ctx.fillRect(100 + i * 150, 100 + j * 150, 80, 50);
            }
        }
    }

    // 플레이어
    ctx.fillStyle = '#0000FF';
    ctx.fillRect(game.player.x, game.player.y, game.player.width, game.player.height);

    // 탈출구
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(game.exit.x, game.exit.y, game.exit.width, game.exit.height);

    // 게임 상태 메시지
    ctx.fillStyle = '#000000';
    ctx.font = '30px Arial';
    if (game.gameOver) {
        ctx.fillText('게임 오버! - 불이 켜진 상태에서 움직였습니다', 150, 50);
    } else if (game.success) {
        ctx.fillText('탈출 성공!', 350, 50);
    }
}

// 게임 루프
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// 게임 시작
toggleLight();
gameLoop(); 