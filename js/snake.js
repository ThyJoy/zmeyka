// игровое поле
const GAME = document.getElementById('Game');
// ряды
const ROWS = 10;
// колонки
const COLUMNS = 10;
// размер ячейкаи
const BOX_SIZE = 30;
// глобальный таймер
let timer = null;
// скорость игры по умолчанию
let SPEED = 400;
const MIN_SPEED = 100;
// направление по умолчанию
let direction = 'Right';
// позиция еды
let foodPos,badfoodPos = null;
// элемент еды
let food,badFood = null;
// название классов
const MOVE_L = 'Left';
const MOVE_U = 'Up';
const MOVE_R = 'Right';
const MOVE_D = 'Down';

// размеры игрового поля
GAME.style.width = BOX_SIZE*COLUMNS+'px';
GAME.style.height = BOX_SIZE*ROWS+'px';

// рисуем поле
drawGame();
// позиция змеи
const snakePos = generatePos();
// создаем тело змеи
const snakeBody = [ 
    GAME.querySelector(`[posX="${snakePos.x}"][posY="${snakePos.y}"]`),
    GAME.querySelector(`[posX="${snakePos.x-1}"][posY="${snakePos.y}"]`),
    GAME.querySelector(`[posX="${snakePos.x-2}"][posY="${snakePos.y}"]`),
];

// создаем еду
createFood();
createBadFood();

// старт game
timer = setInterval(Move,SPEED);


// рисуем игровое поле
function drawGame()
{
    for (let i=0; i < ROWS*COLUMNS; i++)
    {
        // создаем элемент
        let CELL = document.createElement('div');
        // устанавливаем размеры ячейки
        CELL.style.height = BOX_SIZE+'px';
        CELL.style.width = BOX_SIZE+'px';
        CELL.classList.add('cell');
        GAME.appendChild(CELL);
    }

    // находим все ячейки
    let table = GAME.getElementsByClassName('cell');

    // диапазон для координат мин - макс
    let x = 1,
        y = ROWS;

    // идем по каждой ячейке и проставляем координаты
    for (let i = 0; i < table.length; i++)
    {
        // если вышли за пределы
        if (x > COLUMNS)
        {
            // сбрасываем на 1
            x=1;
            // отнимаем по оси y
            y--;
        }
        // установка координат в атрибуты
        table[i].setAttribute('posX',x);
        table[i].setAttribute('posY',y);
        // инкрементируем ось X
        x++;
    }

}


// создание еды
function createFood(){
    foodPos = generatePos(1);
    food = document.querySelector(`[posX="${foodPos.x}"][posY="${foodPos.y}"]`);

    food.classList.add('food');   
    // если попали на змейку тогда перерисовываем еду
    if (JSON.stringify(foodPos) === JSON.stringify(snakePos))
    {
        food.classList.remove('food');
        createFood();
    }
}

function createBadFood(){

    badfoodPos = generatePos(1);
    badFood = document.querySelector(`[posX="${badfoodPos.x}"][posY="${badfoodPos.y}"]`);

    badFood.classList.add('badFood');   
    // если попали на змейку тогда перерисовываем еду
    if (JSON.stringify(badfoodPos) === JSON.stringify(snakePos))
    {
        food.classList.remove('badFood');
        createBadFood();
    }
}



function Move()
{
    // получаем текущую координату
    let snakePos = {x:+snakeBody[0].getAttribute('posX'),y:+snakeBody[0].getAttribute('posY')}
    snakeBody[0].className = 'cell snake__body';
    snakeBody[snakeBody.length - 1].classList.remove('snake__body');
    snakeBody.pop();

    if (direction == 'Right')
    {
        if (snakePos.x < COLUMNS)
        {
            snakeBody.unshift(document.querySelector(`[posX="${snakePos.x+1}"][posY="${snakePos.y}"]`))
        }
        else
        {
            snakeBody.unshift(document.querySelector(`[posX="1"][posY="${snakePos.y}"]`))
        }
    }

    if (direction == 'Left')
    {
        if (snakePos.x > 1)
        {
            snakeBody.unshift(document.querySelector(`[posX="${snakePos.x-1}"][posY="${snakePos.y}"]`))
        }
        else
        {
            snakeBody.unshift(document.querySelector(`[posX="${COLUMNS}"][posY="${snakePos.y}"]`))
        }
    }

    if (direction == 'Up')
    {
        if (snakePos.y < ROWS)
        {
            snakeBody.unshift(document.querySelector(`[posX="${snakePos.x}"][posY="${snakePos.y+1}"]`))
        }
        else
        {
            snakeBody.unshift(document.querySelector(`[posX="${snakePos.x}"][posY="1"]`))
        }
    }

    if (direction == 'Down')
    {
        if (snakePos.y > 1)
        {
            snakeBody.unshift(document.querySelector(`[posX="${snakePos.x}"][posY="${snakePos.y-1}"]`))
        }
        else
        {
            snakeBody.unshift(document.querySelector(`[posX="${snakePos.x}"][posY="${ROWS}"]`))
        }
    }

    // проверка еды
    eatCheck(snakePos);
    // проверка на конец игры ?
    endGame(snakePos);

    // рисуем тело
    for(let i=0; i < snakeBody.length; i++)
    {
        snakeBody[i].classList.add('snake__body');  
    }
    // задаем направление головы
    snakeBody[0].classList.add('snake__head',direction);
   
}

function eatCheck(snakePos)
{
    // eat food
    if ( (snakePos.x === foodPos.x) && (snakePos.y === foodPos.y) )
    {
        let x = snakeBody[snakeBody.length - 1].getAttribute('posX');
        let y = snakeBody[snakeBody.length - 1].getAttribute('posY');
        let getNewCell = document.querySelector(`[posX="${x}"][posY="${y}"]`);
        // add new item body
        snakeBody.push(getNewCell);
        food.classList.remove('food');
        // генерируем еду
        createFood();
        updateTime();
    }
}

function endGame(snakePos)
{
    // если врезались в саму себя
    if (snakeBody[0].classList.contains('snake__body') || (snakePos.x == badfoodPos.x && snakePos.y == badfoodPos.y ))
    {
        console.log('game over');
        document.querySelector('.gameOver').classList.remove('d-none');
        clearInterval(timer);
    }

}

function updateTime()
{
    if (SPEED <= MIN_SPEED)
    {
        SPEED = MIN_SPEED;
    }
    else
    {
        SPEED -= 100;
    }
    clearInterval(timer);
    timer = setInterval(Move,SPEED);
}

// генерация позиции элемента
// минимальная длина элемента
function generatePos(minLength = 3)
{
    let posX = Math.round(Math.random() * (COLUMNS - minLength) + minLength);
    let posY = Math.round(Math.random() * (ROWS - 1) + 1);
    return {x:posX,y:posY}
}

window.addEventListener('keydown',Event=>{

    let key = parseInt(Event.keyCode);

    if (key == 37 && direction != 'Right')
    {
        direction = 'Left';
    }
    if (key == 38 && direction != 'Down')
    {
        direction = 'Up';
    }
    if (key == 39 && direction != 'Left')
    {
        direction = 'Right';
    }
    if (key == 40 && direction != 'Up')
    {
        direction = 'Down';
    }
    
})