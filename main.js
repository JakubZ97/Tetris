const Pieces = {
    o: {
        rotations: [[[2,2],
                    [2,2]]],
        startingPoint: {row: 0, index: 4}
    },
    i: {
        rotations: [[[0,0,0,0],
                     [2,2,2,2]],
                    [[0,0,2,0],
                     [0,0,2,0],
                     [0,0,2,0],
                     [0,0,2,0]],
                    [[0,0,0,0],
                     [0,0,0,0],
                     [2,2,2,2]],
                    [[0,2,0,0],
                     [0,2,0,0],
                     [0,2,0,0],
                     [0,2,0,0]]],
        startingPoint: {row: 0, index: 3}
    },
    s: {
        rotations: [[[0,2,2],
                     [2,2,0]],
                    [[2,0,0],
                     [2,2,0],
                     [0,2,0]]],
        startingPoint: {row: 0, index: 3}
    },
    z: {
        rotations: [[[2,2,0],
                     [0,2,2]],
                    [[0,0,2],
                     [0,2,2],
                     [0,2,0]]],
        startingPoint: {row: 0, index: 3}
    },
    j: {
        rotations: [[[2,0,0],
                     [2,2,2]],
                    [[0,2,2],
                     [0,2,0],
                     [0,2,0]],
                    [[0,0,0],
                     [2,2,2],
                     [0,0,2]],
                    [[0,2,0],
                     [0,2,0],
                     [2,2,0]]],
        startingPoint: {row: 0, index: 3}
    },
    l: {
        rotations: [[[0,0,2],
                     [2,2,2]],
                    [[0,2,0],
                     [0,2,0],
                     [0,2,2]],
                    [[0,0,0],
                     [2,2,2],
                     [2,0,0]],
                    [[2,2,0],
                     [0,2,0],
                     [0,2,0]]],
        startingPoint: {row: 0, index: 3}
    },
    t:{
        rotations: [[[0,2,0],
                     [2,2,2]],
                    [[0,2,0],
                     [0,2,2],
                     [0,2,0]],
                    [[0,0,0],
                     [2,2,2],
                     [0,2,0]],
                    [[0,2,0],
                     [2,2,0],
                     [0,2,0]]],
        startingPoint: {row: 0, index: 3}
    },
};

const Colors = {
    o: 'rgba(249, 255, 0, 1)',
    i: 'rgba(0, 228, 255, 1)',
    z: 'rgba(246, 1, 0, 1)',
    s: 'rgba(0, 255, 1, 1)',
    j: 'rgba(0, 0, 255, 1)',
    l: 'rgba(254, 170, 0, 1)',
    t: 'rgba(153, 0, 254, 1)',
    defaultColor: 'rgba(180, 180, 180, 1)',
    shadow:{
        o: 'rgba(249, 255, 0, 0.3)',
        i: 'rgba(0, 228, 255, 0.3)',
        z: 'rgba(246, 1, 0, 0.3)',
        s: 'rgba(0, 255, 1, 0.3)',
        j: 'rgba(0, 0, 255, 0.3)',
        l: 'rgba(254, 170, 0, 0.3)',
        t: 'rgba(153, 0, 254, 0.3)',
    }
}

const Levels = {
    1: {speed: 1000, cleared: 0},
    2: {speed: 900, cleared: 10}, 
    3: {speed: 800, cleared: 20}, 
    4: {speed: 700, cleared: 30},
    5: {speed: 600, cleared: 40},
    6: {speed: 500, cleared: 50},
    7: {speed: 400, cleared: 60},
    9: {speed: 300, cleared: 70},
    10: {speed: 250, cleared: 80}
}

const Points = {
    1: 800,
    2: 1200,
    3: 1800,
    4: 2000
}

const Starting = {
    gameBoardArray: [],

    createGameBoard(){
        let table = document.querySelector('tbody');
        for(let r = 0; r < 20; r++)
        {
            let row = document.createElement('tr');
            table.appendChild(row);
            row.id = r;
            this.gameBoardArray.push([]);
            for(let i = 0; i < 10; i ++)
            {
                let cell = document.createElement('td');
                row.appendChild(cell);
                cell.id = String(r)+String(i);
                this.gameBoardArray[r].push(0);
            }
        }
    },

    startGame(){
        document.querySelector('tbody').innerHTML = '';
        this.gameBoardArray = [];
        this.createGameBoard();
        Next = {};
        Hold = {};
        Game.level = 1;
        Game.score = 0;
        Game.linesCleared = 0;
        clearInterval(Game.timer)
        Game.timer = false;
        Game.createPiece();
        Game.updateLevelAndScore();
    }
}

const Game = {
    randomPiece(destination){
        let numberOfKeys = Object.keys(Pieces).length;
        let randomNumber = Math.floor(Math.random()*numberOfKeys);
        destination.piece = JSON.parse(JSON.stringify(Pieces[Object.keys(Pieces)[randomNumber]]));
        destination.piece.name = Object.keys(Pieces)[randomNumber]
    },

    createPiece(){
        this.holded = 0;
        if (Object.keys(Next).length == 0){
            this.randomPiece(Current);
            Current.squares = {}
            this.randomPiece(Next);
        }
        else{
            Current.piece = JSON.parse(JSON.stringify(Next.piece));
            Current.squares = {};
            this.randomPiece(Next);
        }
        this.generatePiece()
    },

    generatePiece(){
        clearInterval(this.timer);
        this.timer = false;
        this.updateLevelAndScore();
        Current.numberOfRotation = 0;
        Current.shadowSquares = {};
        let squareCounter = 0;
        for(let r = 0; r < Current.piece.rotations[0].length; r++){
            for(let i = 0; i < Current.piece.rotations[0][r].length; i++){
                if (Current.piece.rotations[0][r][i] == 2){
                    let startingIndex = Current.piece.startingPoint.index;
                    Current.squares[squareCounter] = {row: r, index: startingIndex + i};
                    squareCounter++;
                }
            }
        }
        if (!this.checkIfMoveIsValid(Current.squares, 0, 0).includes('false')){
            this.castShadow()
            this.updateGameBoard(Current.squares, 2);
            this.updateTable(Current.squares, Colors[Current.piece.name])
            this.generatePieceInSideBar('#nextPiece', Next)
            this.gameSpeed()
        } else if (!this.checkIfMoveIsValid(Current.squares, -1, 0).includes('false')){
            this.nextCells('row', '-', Current.squares);
            this.castShadow()
            this.updateGameBoard(Current.squares, 2);
            this.updateTable(Current.squares, Colors[Current.piece.name])
            this.generatePieceInSideBar('#nextPiece', Next)
            this.gameSpeed()
        } else {
            document.getElementById('gameOver').style.height = 640 + 'px'
            console.log('game over')
        }
    },

    generatePieceInSideBar(destination, squares){
        table = document.querySelector(destination);
        table.innerHTML = '';
        for(let r = 0; r < squares.piece.rotations[0].length; r++){
            tr = document.createElement('tr');
            table.appendChild(tr);
            for(let i = 0; i < squares.piece.rotations[0][r].length; i++){
                td = document.createElement('td');
                tr.appendChild(td);
                if(squares.piece.rotations[0][r][i] == 2){
                    td.style.backgroundColor = Colors[squares.piece.name];
                }
            }
        }
    },


    moveSideToSide(direction, operator){
        if (!this.checkIfMoveIsValid(Current.squares, 0, direction).includes('false')) {
            this.updateTable(Current.squares, Colors.defaultColor);
            this.updateGameBoard(Current.squares, 0);
            this.nextCells('index', operator, Current.squares);
            this.castShadow();
            this.updateGameBoard(Current.squares, 2);
            this.updateTable(Current.squares, Colors[Current.piece.name]);
            if (operator == '+') {
                Current.piece.startingPoint.index += 1;
            } else {
                Current.piece.startingPoint.index -= 1;
            }
        }
    },

    rotate(direction){
        if(Current.numberOfRotation == undefined){
            Current.numberOfRotation = 0
        }
        let rotartion = Current.numberOfRotation;
        if(direction == 'clockwise'){
                Current.numberOfRotation < Current.piece.rotations.length - 1 ?
                Current.numberOfRotation += 1 :
                Current.numberOfRotation = 0
        } else {
            Current.numberOfRotation < 0 ?
                Current.numberOfRotation = Current.piece.rotations.length - 1 :
                Current.numberOfRotation -= 1;
        }
        let squareCounter = 0;
        let cloned = JSON.parse(JSON.stringify(Current.squares));
        let currentRotation = Current.piece.rotations[Current.numberOfRotation];
        for(let line = 0; line < currentRotation.length; line++){
            for(let cell = 0; cell < currentRotation[line].length; cell++){
                if (currentRotation[line][cell] == 2){
                    Current.squares[squareCounter] = {row : Current.piece.startingPoint.row + line, index : Current.piece.startingPoint.index + cell};
                    squareCounter++;
                }
            }
        }
        if (!this.checkIfMoveIsValid(Current.squares, 0, 0).includes('false')){
            this.updateTable(cloned, Colors.defaultColor);
            this.castShadow()
            this.updateTable(Current.squares, Colors[Current.piece.name]);
            this.updateGameBoard(cloned, 0);
            this.updateGameBoard(Current.squares, 2);
        } else {
            Current.squares = cloned;
            Current.numberOfRotation = rotartion;
        }
    },

    sonicDrop(){
        clearInterval(this.timer);
        this.timer = false;
        while (!this.checkIfMoveIsValid(Current.squares, 1, 0).includes('false')){
            this.updateGameBoard(Current.squares, 0);
            this.updateTable(Current.squares, Colors.defaultColor);
            this.nextCells('row', '+', Current.squares);
            this.updateGameBoard(Current.squares, 2);
            this.updateTable(Current.squares, Colors[Current.piece.name]);
            this.score += 2;
            this.updateLevelAndScore();
        }
        this.gameSpeed();
    },

    softDrop(){
        clearInterval(this.timer);
        this.timer = false;
        this.gravity();
        this.gameSpeed();
        this.score += 1;
        this.updateLevelAndScore();
    },

    hold(){
        if(!this.holded == 1){
            this.holded = 1
            this.updateTable(Current.shadowSquares, Colors.defaultColor);
            this.updateTable(Current.squares, Colors.defaultColor);
            this.updateGameBoard(Current.squares, 0);
            if (!Object.keys(Current).length == 0  && Object.keys(Hold).length == 0){
                Hold.piece = JSON.parse(JSON.stringify(Current.piece));
                Current.piece = JSON.parse(JSON.stringify(Next.piece));
                Current.squares = {}
                Next = {}
                this.randomPiece(Next)
            } else {
                let placeHolder = JSON.parse(JSON.stringify(Hold.piece));
                Hold.piece = JSON.parse(JSON.stringify(Current.piece));
                Current.piece = placeHolder;
                Current.squares = {}
            }
            this.generatePiece()
            this.generatePieceInSideBar('#holdPiece', Hold)
        }
    },

    gravity(){
        if (!this.checkIfMoveIsValid(Current.squares, 1, 0).includes('false')) {
            this.updateGameBoard(Current.squares, 0);
            this.updateTable(Current.squares, Colors.defaultColor);
            this.nextCells('row', '+', Current.squares);
            this.updateGameBoard(Current.squares, 2);
            this.updateTable(Current.squares, Colors[Current.piece.name]);
            Current.piece.startingPoint.row += 1;
        } else {
            this.updateGameBoard(Current.squares, 1);
            this.rowsToClear();
        }
    },

    gameSpeed(){
        if (Game.timer == false){
            this.timer = setInterval(() => {
                this.gravity()
            }, Levels[this.level].speed);
        }
    },

    rowsToClear(){
        toClear = [];
        clearInterval(this.timer)
        for (let row = 0; row < 20; row++){
            if(!Starting.gameBoardArray[row].includes(0)){
                toClear.push(row);
            }
        }
        console.log(toClear.length == 0)
        if(toClear.length == 0){
            this.createPiece();
        } else {
            this.indicateAnimation(toClear)
            setTimeout(() => {
                this.deleteRows()
            }, 300);
        }
    },

    deleteRows(){
        let tr = document.querySelectorAll('tr');
        let table = document.querySelector('tbody');
        let linesRemoved= 0;
        toClear.forEach(row =>{
            let createTr = document.createElement('tr');
            tr[row].remove();
            Starting.gameBoardArray.splice(row, 1);
            Starting.gameBoardArray.unshift([0,0,0,0,0,0,0,0,0,0])
            table.insertBefore(createTr, tr[0]);
            this.linesCleared++;
            linesRemoved++;
            if(this.linesCleared > Levels[this.level + 1].cleared){
                this.level++
            }
            for( let i = 0; i < 10; i++){
                let createTd = document.createElement('td');
                createTr.appendChild(createTd);
            }
            })
            console.log(linesRemoved)
        this.score += Points[linesRemoved] * this.level;
        for (let r = 0, row; row = table.rows[r]; r++){
            row.id = r
            for (let i = 0, cell; cell = row.cells[i]; i++){
                cell.id = String(r)+String(i);
            }  
        }
        this.createPiece();
    },

    checkIfMoveIsValid(input, increaseRow, increaseIndex){
        let booleans= [];
        Object.keys(input).forEach(key=>{
            if (input[key].row + increaseRow < 0){
                return;
            } else if (input[key].row + increaseRow > 19 || 
                Starting.gameBoardArray[input[key].row + increaseRow][input[key].index + increaseIndex] == null ||
                Starting.gameBoardArray[input[key].row + increaseRow][input[key].index + increaseIndex] == 1){
                booleans.push('false')
            } else {
                booleans.push('true')
            }
        })
        return booleans
    },

    castShadow(){
        this.updateTable(Current.shadowSquares, Colors.defaultColor)
        Current.shadowSquares = JSON.parse(JSON.stringify(Current.squares));
        while (!this.checkIfMoveIsValid(Current.shadowSquares, 1, 0).includes('false')){
            this.nextCells('row', '+', Current.shadowSquares);
        }
        this.updateTable(Current.shadowSquares, Colors.shadow[Current.piece.name])
    },

    nextCells(direction, operator, input){
        if(operator == '+') {
            Object.keys(input).forEach(key=>{
                input[key][direction] += 1;})
        } else {
            Object.keys(Current.squares).forEach(key=>{
                Current.squares[key][direction] -= 1;})
        }
    },

    updateTable(square, color){
        Object.keys(square).forEach(key=>{
            if (square[key].row >= 0){
                let cell = document.getElementById(`${String(square[key].row) + String(square[key].index)}`);
                cell.style.backgroundColor = color;
            }
        })
    },

    updateGameBoard(input, state){
        Object.keys(input).forEach(key=>{
            if (input[key].row >= 0){
                Starting.gameBoardArray[input[key].row][input[key].index] = state;
            }
        })
    },

    indicateAnimation(array){
        array.forEach(elem => {
            let tr = document.querySelectorAll('tr');
            tr[elem].childNodes.forEach(cell =>{
                cell.animate([
                    {backgroundColor: cell.style.backgroundColor},
                    {backgroundColor: 'rgba(255, 255, 255, 1)'}
                ], {
                    duration: 150,
                    iterations: 2
                })
            });
        })
    },

    updateLevelAndScore(){
        const level = document.getElementById('level');
        const score = document.getElementById('score');
        level.innerText = this.level;
        score.innerText = this.score;
    }

}

let Current = {}
let Next = {}
let Hold = {}

function checkKey(key){
    console.log(key.keyCode);
    if (key.keyCode == 32) {
        Game.sonicDrop();
    }
    if (key.keyCode == 37) {
        Game.moveSideToSide(-1, '-');
    }
    if (key.keyCode == 39) {
        Game.moveSideToSide(1, '+');
    }
    if (key.keyCode == 38) {
        Game.rotate('clockwise');
    }
    if (key.keyCode == 40) {
        Game.softDrop();
    }
    if (key.keyCode == 67){
        Game.hold();
    }
    key.preventDefault()
};
window.onload = Starting.createGameBoard();
//document.getElementById('startNewGame').addEventListener('click', Starting.startGame())
//document.onkeydown = checkKey;
document.addEventListener('keydown', checkKey)