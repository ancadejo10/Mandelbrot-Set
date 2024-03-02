const zoomMore = document.getElementById("zoomMore");
const zoomLess = document.getElementById("zoomLess");
const stepMore = document.getElementById("stepMore");
const stepLess = document.getElementById("stepLess");

const moveUp = document.getElementById("moveUp");
const moveDown = document.getElementById("moveDown");
const moveRight = document.getElementById("moveRight");
const moveLeft = document.getElementById("moveLeft");
const moveSprint = document.getElementById("moveSprint");

const getMore = document.getElementById("getMore");
const getLess = document.getElementById("getLess");

const moveColorF = document.getElementById("colorF");

const canvas = document.getElementById("contextFrame")
const gl = canvas.getContext('webgl');

function CreateShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader error: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

const vertexShader = CreateShader(gl.VERTEX_SHADER, vertSource);
const fragmentShader = CreateShader(gl.FRAGMENT_SHADER, fragSource);

const shader1 = gl.createProgram();
gl.attachShader(shader1, vertexShader);
gl.attachShader(shader1, fragmentShader);
gl.linkProgram(shader1);

function SetShader1i(name,x){
    const offset = gl.getUniformLocation(shader1, name);
    gl.uniform1i(offset, x);
}

function SetShader1f(name,x){
    const offset = gl.getUniformLocation(shader1, name);
    gl.uniform1f(offset, x);
}

function SetShader2f(name,x,y){
    const offset = gl.getUniformLocation(shader1, name);
    gl.uniform2f(offset, x,y);
}

if (!gl.getProgramParameter(shader1, gl.LINK_STATUS)) {
    console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shader1));
}

const vertices = [
    -1.0,1.0,
    1.0,1.0,
    -1.0,-1-0,

    1.0,1.0,
    -1.0,-1-0,
    1.0,-1.0
];

const objBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, objBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

const objOffset = gl.getAttribLocation(shader1, 'aPos');
gl.enableVertexAttribArray(objOffset);
gl.vertexAttribPointer(objOffset, 2, gl.FLOAT, false, 0, 0);

function QButton(btn, f1, f2){
    btn.addEventListener("touchstart", f1);
    btn.addEventListener("touchend", f2)
}