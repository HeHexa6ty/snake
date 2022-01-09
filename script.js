// -------------------------------------- CANVAS ---------------------------------------------
console.log("Adam, Eve and ...");
// This canvas is responsible for the game
let c = document.getElementById('eden');
let ctx = c.getContext('2d');
// This canvas is responsible for the score
let s = document.getElementById('score-bar');
let stx = s.getContext('2d');
// Usefull resolution variables
let max_width = Math.floor(window.innerWidth) - 1;
let max_height = Math.floor(window.innerHeight) - 1;
// -------------------------------------- SETTINGS ---------------------------------------------
// DEFAULT SETTINGS - Vanilla
const default_head_skin = "#00FF00";
const default_body_skin = "#54AA23";
const default_board_skin = "#000";
const default_apple_skin = "#FF0000";
const default_font_color = "#FFFFFF";
const default_fill_snake = false;
// Tick rate is used to control the speed of the game
// Lower ==> faster         ;      Higher ==> slower
const default_tick_rate = 4;
// snake is grid based game. Here is declared scale of grid
const default_scaleOfBox = max_width / 30;
let font_size = 30;
let gameStarted = false;
let gamePaused = false;
let scaleOfBox = default_scaleOfBox;
// Game modes
let border = false;
let masochist = false;
let speedy = false;
let infinite = false;
let journey_stamp = 100;
let speed_stamp = 100;
// USER SETTINGS
let head_skin = "#00FF00";
let body_skin = "#54AA23";
let board_skin = "#000000";
let apple_skin = "#FF0000";
let font_color = "#FFFFFF";
let fill_snake = false;
let tick_rate = 4;
document.querySelector('body').style.backgroundColor = board_skin;
// RESOLUTION DISPLAY
// console.log(`${max_width} \n ${max_height} \n ${c.width} \n ${c.height}`);
c.width = max_width;
c.height = max_height;

s.width = max_width;
s.height = font_size * 2;

// -------------------------------------- PLAYBOARD ---------------------------------------------
let drawGrid = () => { // function suppoused to help a programmer
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
// Color board to 'xxxxx' color
ctx.strokeStyle = board_skin;
// -------------------------------------- APPLE ---------------------------------------------
let apple = {
    x : 0,
    y : 0,
    score : 0
};
// Used to draw apple at the beggining and when apple has been eaten
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
// initialize apple cords used after being eaten or game just started
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
// Snake is build with queue and that's how we are going to interpret that array 
let body = [];
// Draws every segment of snake's body + head
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
            if(fill_snake){
                if(i == 0){
                    ctx.fillStyle = head_skin;    
                }else{
                    ctx.fillStyle = body_skin;
                }
                ctx.fill();
            }else{
                if(i == 0){
                    ctx.strokeStyle = head_skin;    
                }else{
                    ctx.strokeStyle = body_skin;
                }
                ctx.stroke();
            }
        }
        ctx.beginPath();
        ctx.rect(
            body[0].x, 
            body[0].y,
            sizeOfBox,
            sizeOfBox
        );
        if(fill_snake){
            ctx.fillStyle = head_skin;    
            ctx.fill();
        }else{
            ctx.strokeStyle = head_skin;    
            ctx.stroke();
        }
    };
// Takes random cords to spawn snake at them
let headDirection = 0;
    let init_head = () => {
        headDirection = 0;
        head.x = sizeOfBox * Math.floor(Math.random(0, scaleOfBox) * scaleOfBox);
        head.y = sizeOfBox * Math.floor(Math.random(0, scaleOfBox) * ( (max_height / sizeOfBox) - 2) );
        // console.log(head.y);
        body = [
            {x:head.x, y:head.y},
            {x:head.x - sizeOfBox, y:head.y},
            {x:head.x - ( 2 * sizeOfBox ), y:head.y}
        ];
        // drawBody();
    };
// HEAD MOVEMOENT
    // After using those keys/buttons [LEFT, UP, RIGHT, BOTTOM](keycode order) game will start
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
// resize
window.addEventListener('resize', function(){
    max_width = Math.floor(window.innerWidth) - 1;
    max_height = Math.floor(window.innerHeight) - 1;
    c.width = max_width;
    c.height = max_height;
    // sizeOfBox = Math.floor(max_width / scaleOfBox);
    indicator = max_width / sizeOfBox ;
    s.width = max_width;
    s.height = font_size * 2;
    init_apple();
    drawBody();
    drawApple();
})
// Player is going to control only head
// Rest of the body just follows the head
let ticks = 0;
let refresh = [];
    let headMove = () => {
        // movement is done when fraps allow it
        // and when game isn't paused
        if(ticks % tick_rate == 0 && gamePaused != true){
            ctx.clearRect(0, 0, max_width, max_height);
            switch(headDirection){
                case 1:// move to the left
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
                case 2:// move to the up
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
                case 3:// move to the right
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
                case 4:// move to the down
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
    // if snake cords match apple cords then we initialize apple again.
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
    // snake can move through walls
    let borderlessMode = () => {
        if(body[0].x > max_width ) {
            body[0].x = 0;
        }
        if(body[0].x < 0){
            body[0].x = max_width;
        }
        if(body[0].y > max_height){
            body[0].y = 0;
        }
        if(body[0].y < 0){
            body[0].y = max_height;
        }
    };
    // snake can't move through wall
    // It's killing him
    let borderMode = () => {
        if(body[0].x < 0 || body[0].x > max_width || body[0].y < 0 || body[0].y > max_height){
            reset();
        }
    };
    // snake can eat himself
    let suicideMode = () => {
        let x = body[0].x;
        let y = body[0].y;
        for(let i = 1; i < apple.score + 2; i++){
            if(x == body[i].x && y == body[i].y){
                reset();
            }
        }
    }
    // oh no you died
    // start again
    let reset = () => {
        init_head();
        init_apple();
        headDirection = 0;
        apple.score = 0;
    }
    // apple eaten
    // score is given
    let score = () => {
        stx.clearRect(0, 0, max_width, font_size * 2);
        stx.font = `${font_size}px Arial`;
        stx.fillStyle = font_color;
        stx.textAlign = "center";
        stx.fillText(`Score : ${apple.score}`, max_width/2, font_size);
    };
    // if something won't go right with responsivnes
    // just corect the position of snake
    // push it to the left or right or wherever to the playboard
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
    // GAME MODE: after reaching some points increase the speed of the snake
    let fastest_in_the_west = () => {
        if( apple.score % speed_stamp == 0 && apple.score != 0 && tick_rate > 1){
            tick_rate -= 1;
        }
    }
    // GAME MODE: after reaching some points decrease snake and playboard
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
// Main function used to make animation/gameplay
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
        console.log(`Snake ${body[0].x} ${body[0].y}`);
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
// Option bar at the top-left
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
    document.getElementById('fill').value = fill_snake;
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
        document.getElementById('body-border').style.border = '1px solid red';
    }else{
        document.getElementById('body-border').style.visibility = 'visible';
        document.getElementById('body-border').style.border = '1px solid #555';
    }
    fill_snake = document.getElementById('fill').checked; 
    masochist = document.getElementById('masochist').checked;
    speedy = document.getElementById('fastest').checked;
    infinite = document.getElementById('infinite').checked;
    gamePaused = false;
    menuBar.style.left = '-24%';
    settingsButton.style.visibility = 'visible';
    if(masochist){
        document.getElementById('eater').style.visibility = 'visible';
    }else{
        document.getElementById('eater').style.visibility = 'hidden';
    }
    if(speedy){
        document.getElementById('speed').style.visibility = 'visible';
    }else{
        document.getElementById('speed').style.visibility = 'hidden';
    }
    if(infinite){
        document.getElementById('inf').style.visibility = 'visible';
    }else{
        document.getElementById('inf').style.visibility = 'hidden';
    }
}
let reset_values = () => {
    document.getElementById('snake-skin').value = default_body_skin;
    document.getElementById('head-skin').value = default_head_skin;
    document.getElementById('apple-skin').value = default_apple_skin;
    document.getElementById('board-skin').value = default_board_skin;
    document.getElementById('score-skin').value = default_font_color;
    document.getElementById('fill').checked = default_fill_snake;
    document.getElementById('border').checked = false;
    document.getElementById('masochist').checked = false;
    document.getElementById('fastest').checked = false;
    document.getElementById('infinite').checked = false;
}