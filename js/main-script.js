//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var scene, renderer;

var geometry, material, mesh;

const cameras = [];


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
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addTrailerBase(obj, x, y, z) {
    'use strict'

    geometry = new THREE.BoxGeometry(5, 1, 16);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addWheel(obj, x, y ,z) {
    'use strict'

    geometry = new THREE.CylinderGeometry(1, 1, 1.5, 8, 1, false);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.rotation.z = Math.PI / 2;
    obj.add(mesh);
}

function createTrailer(x, y, z) {
    'use strict';

    var trailer = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

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

    render(1);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

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
        case 49: //1
            render(0);
            break;
        case 50: //2
            render(1);
            break;
        case 51: //3
            render(2);
            break;
        case 52: //4
            render(3);
            break;
        case 53: //5
            render(4);
            break;
    }

}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

}