var scrX = 600;
var scrY = 600;

var posX = 0;
var posY = 0;

var zoom = 200;
var time = 200;
var cursor = 1;
var distance = 200;
var colorF = 1;

var movingX = 0;
var movingY = 0;
var movingZ = 0;
var movingT = 0;
var sprint = 2;
var zoomStep = 2;

function Update(){
    scrX = Math.min(window.innerWidth, window.innerHeight);
    scrY = scrX;

    posX -= (movingX*sprint)/zoom;
    posY -= (movingY*sprint)/zoom;

    zoomStep = Math.max(zoomStep, 1);
    zoom+=movingZ*Math.sqrt(Math.max(zoom * Math.pow(zoomStep, zoomStep), 1));

    zoom = Math.max(zoom, 1);

    time += movingT;
    time = Math.max(time,1);

    if(colorF > 6){
        colorF = 1;
    }
}

function Render(){
    Update();
    window.requestAnimationFrame(Render);
    
    canvas.width = scrX;
    canvas.height = scrY;

    gl.viewport(0,0,scrX,scrY);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(shader1);
    SetShader2f("screen",scrX,scrY);
    SetShader2f("position",posX,posY);
    SetShader1i("zoom", zoom);
    SetShader1f("time", time);
    SetShader1i("cursor", cursor);
    SetShader1f("distance", distance);
    SetShader1i("colorF", colorF);

    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
}

document.addEventListener("keydown", function(key){
    if(key.code == 'KeyD'){
        movingX = 1;
    }else if(key.code == 'KeyA'){
        movingX = -1;
    }else if(key.code == 'KeyW'){
        movingY = 1;
    }else if(key.code == 'KeyS'){
        movingY = -1;
    }else if(key.code == 'KeyE'){
        movingZ = 1;
    }else if(key.code == 'KeyQ'){
        movingZ = -1;
    }else if(key.code == 'KeyI'){
        zoomStep++;
    }else if(key.code == 'KeyO'){
        zoomStep--;
    }else if(key.code == "ShiftLeft"){
        sprint=4;
    }else if(key.code == "KeyC"){
        cursor = (cursor == 1 ? 0 : 1);
    }else if(key.code == "KeyM"){
        colorF++;
    }else if(key.code == "KeyT"){
        movingT = 1;
    }else if(key.code == "KeyR"){
        movingT = -1;
    }
})

document.addEventListener("keyup", function(key){
    if(key.code == 'KeyD'){
        movingX = 0;
    }else if(key.code == 'KeyA'){
        movingX = 0;
    }else if(key.code == 'KeyW'){
        movingY = 0;
    }else if(key.code == 'KeyS'){
        movingY = 0;
    }else if(key.code == 'KeyE'){
        movingZ = 0;
    }else if(key.code == 'KeyQ'){
        movingZ = 0;
    }else if(key.code == "ShiftLeft"){
        sprint=2;
    }else if(key.code == "KeyT"){
        movingT = 0;
    }else if(key.code == "KeyR"){
        movingT = 0;
    }
})

QButton(zoomMore, () => {movingZ = 1;}, () => {movingZ = 0;});
QButton(zoomLess, () => {movingZ = -1;}, () => {movingZ = 0;});

QButton(stepMore, () => {zoomStep++});
QButton(stepLess, () => {zoomStep--});

QButton(moveUp, () => {movingY = 1}, () => {movingY = 0});
QButton(moveDown, () => {movingY = -1}, () => {movingY = 0});
QButton(moveRight, () => {movingX = 1}, () => {movingX = 0});
QButton(moveLeft, () => {movingX = -1}, () => {movingX = 0});

QButton(moveSprint, () => {sprint = 4}, () => {sprint = 2});

QButton(genMore, () => {movingT = 1}, () => {movingT = 0});
QButton(genLess, () => {movingT = -1}, () => {movingT = 0});

document.addEventListener("DOMContentLoaded", function(){
    window.requestAnimationFrame(Render)
})