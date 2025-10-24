interface Position {
    x: number;
    y: number;
}

interface GameState {
    snake: Position[];
    food: Position;
    direction: Position;
    nextDirection: Position;
    score: number;
    highScore: number;
    gameRunning: boolean;
    gamePaused: boolean;
}

class SnakeGame {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private readonly gridSize: number = 30;
    private gridWidth: number;
    private gridHeight: number;
    private tileSize: number;
    private canvasWidth: number;
    private canvasHeight: number;
    private state: GameState;
    private gameLoop: number | null = null;
    private readonly gameSpeed: number = 140;
    
    private readonly colors = {
        snakeHead: '#00ff00',
        snakeBody: ['#00cc00', '#00aa00', '#008800', '#006600'],
        food: '#ff0066',
        grid: '#2a2a3e'
    };

    constructor() {
        this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        
        this.canvasWidth = 0;
        this.canvasHeight = 0;
        this.tileSize = 0;
        this.gridWidth = 0;
        this.gridHeight = 0;
        
        this.resizeCanvas();
        
        this.state = {
            snake: this.createInitialSnake(),
            food: { x: 0, y: 0 },
            direction: { x: 1, y: 0 },
            nextDirection: { x: 1, y: 0 },
            score: 0,
            highScore: this.loadHighScore(),
            gameRunning: false,
            gamePaused: false
        };
        
        this.spawnFood();
        this.setupControls();
        this.setupResize();
        this.draw();
    }

    private resizeCanvas(): void {
        this.canvasWidth = window.innerWidth;
        this.canvasHeight = window.innerHeight;
        
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
        this.tileSize = Math.floor(Math.min(this.canvasWidth / 25, this.canvasHeight / 14));
        this.gridWidth = Math.floor(this.canvasWidth / this.tileSize);
        this.gridHeight = Math.floor(this.canvasHeight / this.tileSize);
    }

    private setupResize(): void {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.draw();
        });
    }

    private createInitialSnake(): Position[] {
        const startX = 7;
        const startY = 8;
        
        return [
            { x: startX, y: startY },
            { x: startX - 1, y: startY },
            { x: startX - 2, y: startY },
            { x: startX - 3, y: startY },
            { x: startX - 4, y: startY }
        ];
    }

    private loadHighScore(): number {
        const saved = localStorage.getItem('snakeHighScore');
        return saved ? parseInt(saved) : 0;
    }

    private saveHighScore(): void {
        localStorage.setItem('snakeHighScore', this.state.highScore.toString());
    }

    private setupControls(): void {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.toggleGame();
                return;
            }

            if (!this.state.gameRunning || this.state.gamePaused) return;

            const directions: { [key: string]: Position } = {
                'ArrowUp': { x: 0, y: -1 },
                'ArrowDown': { x: 0, y: 1 },
                'ArrowLeft': { x: -1, y: 0 },
                'ArrowRight': { x: 1, y: 0 }
            };

            const newDirection = directions[e.code];
            if (newDirection) {
                e.preventDefault();
                if (this.state.direction.x + newDirection.x !== 0 || 
                    this.state.direction.y + newDirection.y !== 0) {
                    this.state.nextDirection = newDirection;
                }
            }
        });
    }

    private toggleGame(): void {
        if (!this.state.gameRunning) {
            this.startGame();
        } else {
            this.state.gamePaused = !this.state.gamePaused;
            this.updateGameStatus(this.state.gamePaused ? 'PAUSED' : '');
        }
    }

    private startGame(): void {
        this.state.gameRunning = true;
        this.state.gamePaused = false;
        this.updateGameStatus('');
        
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
        
        this.gameLoop = window.setInterval(() => {
            if (!this.state.gamePaused) {
                this.update();
                this.draw();
            }
        }, this.gameSpeed);
    }

    private update(): void {
        this.state.direction = { ...this.state.nextDirection };
        
        const head = this.state.snake[0];
        const newHead: Position = {
            x: (head.x + this.state.direction.x + this.gridWidth) % this.gridWidth,
            y: (head.y + this.state.direction.y + this.gridHeight) % this.gridHeight
        };

        if (this.checkCollision(newHead)) {
            this.gameOver();
            return;
        }

        this.state.snake.unshift(newHead);

        if (newHead.x === this.state.food.x && newHead.y === this.state.food.y) {
            this.state.score += 10;
            this.spawnFood();
        } else {
            this.state.snake.pop();
        }
    }

    private checkCollision(head: Position): boolean {
        return this.state.snake.some(segment => 
            segment.x === head.x && segment.y === head.y
        );
    }

    private spawnFood(): void {
        let newFood: Position;
        const marginX = Math.floor(this.gridWidth * 0.15);
        const marginY = Math.floor(this.gridHeight * 0.15);
        
        do {
            newFood = {
                x: marginX + Math.floor(Math.random() * (this.gridWidth - 2 * marginX)),
                y: marginY + Math.floor(Math.random() * (this.gridHeight - 2 * marginY))
            };
        } while (this.state.snake.some(segment => 
            segment.x === newFood.x && segment.y === newFood.y
        ));
        
        this.state.food = newFood;
    }

    private draw(): void {
        this.ctx.fillStyle = this.colors.grid;
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        this.drawGrid();
        this.drawFood();
        this.drawSnake();
    }

    private drawGrid(): void {
        this.ctx.strokeStyle = '#3a3a4e';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i <= this.gridWidth; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.tileSize, 0);
            this.ctx.lineTo(i * this.tileSize, this.canvasHeight);
            this.ctx.stroke();
        }
        
        for (let i = 0; i <= this.gridHeight; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.tileSize);
            this.ctx.lineTo(this.canvasWidth, i * this.tileSize);
            this.ctx.stroke();
        }
    }

    private drawSnake(): void {
        this.state.snake.forEach((segment, index) => {
            const x = segment.x * this.tileSize;
            const y = segment.y * this.tileSize;
            
            if (index === 0) {
                this.ctx.fillStyle = this.colors.snakeHead;
                this.ctx.shadowBlur = 20;
                this.ctx.shadowColor = this.colors.snakeHead;
            } else {
                const colorIndex = Math.min(index - 1, this.colors.snakeBody.length - 1);
                this.ctx.fillStyle = this.colors.snakeBody[colorIndex];
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = this.colors.snakeBody[colorIndex];
            }
            
            this.ctx.fillRect(
                x + 2, 
                y + 2, 
                this.tileSize - 4, 
                this.tileSize - 4
            );
            
            this.ctx.shadowBlur = 0;
        });
    }

    private drawFood(): void {
        const x = this.state.food.x * this.tileSize;
        const y = this.state.food.y * this.tileSize;
        
        this.ctx.fillStyle = this.colors.food;
        this.ctx.shadowBlur = 25;
        this.ctx.shadowColor = this.colors.food;
        
        this.ctx.beginPath();
        this.ctx.arc(
            x + this.tileSize / 2,
            y + this.tileSize / 2,
            (this.tileSize / 2) - 4,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        
        this.ctx.shadowBlur = 0;
    }

    private gameOver(): void {
        this.state.gameRunning = false;
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
        
        if (this.state.score > this.state.highScore) {
            this.state.highScore = this.state.score;
            this.saveHighScore();
            this.updateGameStatus('NEW HIGH SCORE! Press SPACE to Play Again');
        } else {
            this.updateGameStatus('GAME OVER! Press SPACE to Play Again');
        }
        
        setTimeout(() => {
            this.state.snake = this.createInitialSnake();
            this.state.direction = { x: 1, y: 0 };
            this.state.nextDirection = { x: 1, y: 0 };
            this.state.score = 0;
            this.spawnFood();
            this.draw();
        }, 100);
    }

    private updateGameStatus(message: string): void {
        const statusElement = document.getElementById('gameStatus');
        if (statusElement) {
            statusElement.textContent = message || '';
            statusElement.style.display = message ? 'inline-block' : 'none';
        }
    }
}

new SnakeGame();
