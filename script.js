// -------------------------------------- CANVAS ---------------------------------------------
console.log("Adam, Eve and ...");
let c = document.getElementById('eden');
let ctx = c.getContext('2d');

let s = document.getElementById('score-bar');
let stx = s.getContext('2d');

let max_width = Math.floor(window.innerWidth);
let max_height = Math.floor(window.innerHeight);
// -------------------------------------- SETTINGS ---------------------------------------------
// DEFAULT SETTINGS
const default_head_skin = "#00FF00";
const default_body_skin = "#54AA23";
const default_board_skin = "#000";
const default_apple_skin = "#FF0000";
const default_font_color = "#FFFFFF";
const default_tick_rate = 4;
const default_scaleOfBox = max_width / 30;
let font_size = 30;
let gameStarted = false;
let gamePaused = false;
let scaleOfBox = default_scaleOfBox;
let border = false;
let masochist = false;
let speedy = false;
let infinite = false;
let journey_stamp = 100;
let speed_stamp = 100;
// USER SETTINGS
let head_skin = "#00FF00";
let body_skin = "#54AA23";
let board_skin = "#000";
let apple_skin = "#FF0000";
let font_color = "#FFFFFF";
let tick_rate = 4;
document.querySelector('body').style.backgroundColor = board_skin;
// RESOLUTION DISPLAY
console.log(`${max_width} \n ${max_height} \n ${c.width} \n ${c.height}`);
c.width = max_width;
c.height = max_height;

s.width = max_width;
s.height = font_size * 2;

// -------------------------------------- PLAYBOARD ---------------------------------------------
let drawGrid = () => {
    for(let i = 1; i <= indicator; i++){
        ctx.moveTo(sizeOfBox * i, 0);
        ctx.lineTo(sizeOfBox * i, max_height);
        ctx.stroke();
        ctx.moveTo(0, sizeOfBox * i);
        ctx.lineTo(max_width, sizeOfBox * i);
        ctx.stroke();    
    }
};
// PLAYBOARD SETTINGS
let sizeOfBox = Math.floor(max_width / scaleOfBox);
let indicator = max_width / sizeOfBox ;
console.log(`sizeOfBox: ${sizeOfBox}`);

ctx.strokeStyle = board_skin;
drawGrid();
// -------------------------------------- APPLE ---------------------------------------------
let apple = {
    x : 0,
    y : 0,
    score : 0
};
// APPLE DRAW
let drawApple = () => {
    ctx.beginPath();
    ctx.rect(
        apple.x, 
        apple.y,
        sizeOfBox,
        sizeOfBox
    );
    ctx.fillStyle = apple_skin;
    ctx.fill();
};
// APPLE INIT
let init_apple = () => {
    apple.x = sizeOfBox * Math.floor(Math.random(0, scaleOfBox) * scaleOfBox);
    apple.y = sizeOfBox * Math.floor(Math.random(0, scaleOfBox) * ( (max_height / sizeOfBox) - 2) );
    console.log(`APPLE : ${apple.x} ${apple.y}`);
};
// -------------------------------------- SNAKE ---------------------------------------------
let head = {
    x : 0,
    y : 0,
};
let body = [];
// BODY DRAW
    let drawBody = () => {
        let i = 0;
        for(i; i < apple.score + 3; i++){
            ctx.beginPath();
            ctx.rect(
                body[i].x, 
                body[i].y,
                sizeOfBox,
                sizeOfBox
            );
            if(i == 0){
                ctx.strokeStyle = head_skin;    
            }else{
                ctx.strokeStyle = body_skin;
            }
            ctx.stroke();
        }
    };
// HEAD INIT
let headDirection = 0;
    let init_head = () => {
        headDirection = 0;
        head.x = sizeOfBox * Math.floor(Math.random(0, scaleOfBox) * scaleOfBox);
        head.y = sizeOfBox * Math.floor(Math.random(0, scaleOfBox) * ( (max_height / sizeOfBox) - 2) );
        console.log(head.y);
        body = [
            {x:head.x, y:head.y},
            {x:head.x - sizeOfBox, y:head.y},
            {x:head.x - ( 2 * sizeOfBox ), y:head.y}
        ];
        // drawBody();
    };
// HEAD MOVEMOENT
    // FIRST MOVE (LEFT, UP, RIGHT, BOTTOM) == GAME START
    window.addEventListener('keydown', function(e){
        if( gameStarted == false && settingsButton.style.visibility != 'hidden' && gamePaused == false){
            animate();
            gameStarted = true;
        }
        switch(e.code){
            case "ArrowLeft": headDirection = 1;
                break; 
            case "ArrowUp": headDirection = 2;
                break;
            case "ArrowRight": headDirection = 3;
                break;
            case "ArrowDown": headDirection = 4;
                break;
        }
    });

// MOVEMENT IN GAME == head MOVES
let ticks = 0;
let refresh = [];
    let headMove = () => {
        if(ticks % tick_rate == 0 && gamePaused != true){
            ctx.clearRect(0, 0, max_width, max_height);
            switch(headDirection){
                case 1:
                    refresh = [];
                    for(let i = 0; i < apple.score + 2; i++){
                        refresh.push({x:body[i].x, y:body[i].y});
                    }
                    body[0].x -= sizeOfBox;
                    for(let i = 1; i <= apple.score + 2; i++){
                        body[i] = refresh.shift();
                    }
                    drawBody();
                    break;
                case 2:
                    refresh = [];
                    for(let i = 0; i < apple.score + 2; i++){
                        refresh.push({x:body[i].x, y:body[i].y});
                    }
                    body[0].y -= sizeOfBox;
                    for(let i = 1; i <= apple.score + 2; i++){
                        body[i] = refresh.shift();
                    }
                    drawBody();
                    break;
                case 3:
                    refresh = [];
                    for(let i = 0; i < apple.score + 2; i++){
                        refresh.push({x:body[i].x, y:body[i].y});
                    }
                    body[0].x += sizeOfBox;
                    for(let i = 1; i <= apple.score + 2; i++){
                        body[i] = refresh.shift();
                    }
                    drawBody();
                    break;
                case 4:
                    refresh = [];
                    for(let i = 0; i < apple.score + 2; i++){
                        refresh.push({x:body[i].x, y:body[i].y});
                    }
                    body[0].y += sizeOfBox;
                    for(let i = 1; i <= apple.score + 2; i++){
                        body[i] = refresh.shift();
                    }
                    drawBody();
                    break;  
                default:
                    drawBody();
            }
        }
        
    }
// -------------------------------------- SYSTEM ---------------------------------------------
    let eat = () => {
        if( body[0].x == apple.x && body[0].y == apple.y){
            apple.score++;
            init_apple();
            if(speedy == true){
                fastest_in_the_west();
            }
            if(infinite == true){
                never_ending_journey();
            }
        }
    };
    let borderlessMode = () => {
        if(body[0].x > max_width){
            body[0].x = -sizeOfBox;
        }
        if(body[0].x < -sizeOfBox){
            body[0].x = max_width;
        }
        if(body[0].y > max_height){
            body[0].y = -sizeOfBox;
        }
        if(body[0].y < -sizeOfBox){
            body[0].y = max_height;
        }
    };
    let borderMode = () => {
        if(body[0].x < 0 || body[0].x > max_width || body[0].y < 0 || body[0].y > max_height){
            reset();
        }
    };
    let suicideMode = () => {
        let x = body[0].x;
        let y = body[0].y;
        for(let i = 1; i < apple.score + 2; i++){
            if(x == body[i].x && y == body[i].y){
                reset();
            }
        }
    }
    let reset = () => {
        init_head();
        init_apple();
        headDirection = 0;
        apple.score = 0;
    }
    let score = () => {
        stx.clearRect(0, 0, max_width, font_size * 2);
        stx.font = `${font_size}px Arial`;
        stx.fillStyle = font_color;
        stx.textAlign = "center";
        stx.fillText(`Score : ${apple.score}`, max_width/2, font_size);
        stx.fillText(`X : ${apple.x}`, 2*font_size , font_size);
        stx.fillText(`Y : ${apple.y}`, max_width - font_size * 2 , font_size);
    };
    let position_control = () => {
        while(body[0].x % sizeOfBox != 0){
            body[0].x--;
            console.log("POSITON ERROR : X");
            console.log(`X:${body[0].x} Y:${body[0].y} `);
        }
        while(body[0].y % sizeOfBox != 0){
            body[0].y--;
            console.log("POSITON ERROR : Y");
            console.log(`X:${body[0].x} Y:${body[0].y} `);
        }
        while(apple.x % sizeOfBox != 0){
            apple.x--;
            console.log("POSITON ERROR : X");
            console.log(`X:${body[0].x} Y:${body[0].y} `);
        }
        while(apple.y % sizeOfBox != 0){
            apple.y--;
            console.log("POSITON ERROR : Y");
            console.log(`X:${body[0].x} Y:${body[0].y} `);
        }
    }
    let fastest_in_the_west = () => {
        if( apple.score % speed_stamp == 0 && apple.score != 0 && tick_rate > 1){
            tick_rate -= 1;
        }
    }
    let never_ending_journey = () => {
        if( apple.score % journey_stamp == 0){
            scaleOfBox += 32;
            journey_stamp += journey_stamp;
            sizeOfBox = Math.floor(max_width / scaleOfBox);
            indicator = max_width / sizeOfBox ;
            
            console.log(`sizeOfBox: ${sizeOfBox}`);
        }
    }
// MAIN ANIMATION FUNC
init_head();
drawBody();
init_apple();
drawApple();
let animate = () => {
    requestAnimationFrame(animate);
    // GAMEPLAY
    eat();
    headMove();
    drawApple();
    score();
    // FPS CONTROL
    ticks++;
    if( ticks > tick_rate ){
        ticks = 1;
    }
    // BORDER
    if( border == true ){
        borderMode();
    }else{
        borderlessMode();
    }
    // SELF EATER
    if( masochist == true ){
        suicideMode();
    }
    // IF X and Y Dont match playboard correct them
    position_control(); 
}
let settingsButton = document.getElementById('settings');
let menuBar = document.getElementById('menu-bar');
let show_options = () => {
    gamePaused = true;
    menuBar.style.left = 0;
    settingsButton.style.visibility = 'hidden';
    document.getElementById('snake-skin').value = body_skin;
    document.getElementById('head-skin').value = head_skin;
    document.getElementById('apple-skin').value = apple_skin;
    document.getElementById('board-skin').value = board_skin;
    document.getElementById('score-skin').value = font_color;
    document.getElementById('border').checked = border;
    document.getElementById('masochist').checked = masochist;
    document.getElementById('fastest').checked = speedy;
    document.getElementById('infinite').checked = infinite;
}
let save_and_go = () => {
    body_skin = document.getElementById('snake-skin').value;
    head_skin = document.getElementById('head-skin').value;
    apple_skin = document.getElementById('apple-skin').value;
    board_skin = document.getElementById('board-skin').value;
    document.querySelector('body').style.backgroundColor = board_skin;
    font_color = document.getElementById('score-skin').value;
    border = document.getElementById('border').checked;
    if(border){
        document.getElementById('body-border').style.visibility = 'visible';
    }else{
        document.getElementById('body-border').style.visibility = 'hidden';
    }
    masochist = document.getElementById('masochist').checked;
    speedy = document.getElementById('fastest').checked;
    infinite = document.getElementById('infinite').checked;
    gamePaused = false;
    menuBar.style.left = '-24%';
    settingsButton.style.visibility = 'visible';
}
let reset_values = () => {
    document.getElementById('snake-skin').value = default_body_skin;
    document.getElementById('head-skin').value = default_head_skin;
    document.getElementById('apple-skin').value = default_apple_skin;
    document.getElementById('board-skin').value = default_board_skin;
    document.getElementById('score-skin').value = default_font_color;
    document.getElementById('border').checked = false;
    document.getElementById('masochist').checked = false;
    document.getElementById('fastest').checked = false;
    document.getElementById('infinite').checked = false;
}