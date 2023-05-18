//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var scene, renderer;

var geometry, mesh;

var currentCamera = 0;

var trailer;

const moveTrailer = [false, false, false, false]

const cameras = [];

const materials = [];

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxisHelper(10));
    scene.background = new THREE.Color("rgb(200, 200, 200)");

    createTrailer(0, 0, 0);

}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCamera(id, x, y, z) {
    'use strict';
    cameras[id] = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    cameras[id].position.x = x;
    cameras[id].position.y = y;
    cameras[id].position.z = z;
    cameras[id].lookAt(scene.position);
}

function createAllCameras() {
    'use strict';
    createCamera(0, 0, 0, 50);
    createCamera(1, -50, 0, 0);
    createCamera(2, 0, 50, 0);
    createCamera(3, 50, 50, 0);
    createCamera(4, 20, 0, 50);
}


/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
function addTrailerBody(obj, x, y, z) {
    'use strict';

    geometry = new THREE.BoxGeometry(8, 10, 21);
    mesh = new THREE.Mesh(geometry, materials[0]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addTrailerBase(obj, x, y, z) {
    'use strict'

    geometry = new THREE.BoxGeometry(5, 1, 16);
    mesh = new THREE.Mesh(geometry, materials[0]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addWheel(obj, x, y ,z) {
    'use strict'

    geometry = new THREE.CylinderGeometry(1, 1, 1.5, 8);
    mesh = new THREE.Mesh(geometry, materials[0]);
    mesh.position.set(x, y, z);
    mesh.rotation.z = Math.PI / 2;
    obj.add(mesh);
}

function createTrailer(x, y, z) {
    'use strict';

    trailer = new THREE.Object3D();

    materials[0] = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    addTrailerBody(trailer, 0, 0, 0)
    addTrailerBase(trailer, 0, -5.5, -1.5);
    addWheel(trailer, 3.25, -6, -6.5);
    addWheel(trailer, 3.25, -6, -8.5);
    addWheel(trailer, -3.25, -6, -6.5);
    addWheel(trailer, -3.25, -6, -8.5);

    scene.add(trailer);

    trailer.position.x = x;
    trailer.position.y = y;
    trailer.position.z = z;
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(){
    'use strict';

}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(){
    'use strict';

}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';

}

/////////////
/* DISPLAY */
/////////////
function render(camera) {
    'use strict';
    renderer.render(scene, cameras[camera]);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createAllCameras();

    render(currentCamera);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

    if(moveTrailer[0]){
        trailer.position.x -= 0.2;
    }
    if(moveTrailer[1]){
        trailer.position.z -= 0.2;
    }
    if(moveTrailer[2]){
        trailer.position.x += 0.2;
    }
    if(moveTrailer[3]){
        trailer.position.z += 0.2;
    }

    render(currentCamera);

    requestAnimationFrame(animate);
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';

}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';

    switch (e.keyCode) {
        case 37: //LEFT ARROW
            moveTrailer[0] = true;
            break;
        case 38: //UP ARROW
            moveTrailer[1] = true;
            break;
        case 39: //RIGHT ARROW
            moveTrailer[2] = true;
            break;
        case 40: //DOWN ARROW
            moveTrailer[3] = true;
            break;
        case 49: //1
            currentCamera = 0;
            break;
        case 50: //2
            currentCamera = 1;
            break;
        case 51: //3
            currentCamera = 2;
            break;
        case 52: //4
            currentCamera = 3;
            break;
        case 53: //5
            currentCamera = 4;
            break;
        case 54: //6
            for (var i = 0; i < materials.length; i++) {
                materials[i].wireframe = !materials[i].wireframe;
            }
            break;
    }
    render(currentCamera);

}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

    switch (e.keyCode) {
        case 37: //LEFT ARROW
            moveTrailer[0] = false;
            break;
        case 38: //UP ARROW
            moveTrailer[1] = false;
            break;
        case 39: //RIGHT ARROW
            moveTrailer[2] = false;
            break;
        case 40: //DOWN ARROW
            moveTrailer[3] = false;
            break;
    }
}