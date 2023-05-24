//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

const MIN = 0; const MAX = 1; const X = 0; const Z = 1;

const moveTrailer = [false, false, false, false];

const moveArms = [false, false];

const moveHead = [false, false];

const moveLegs = [false, false];

const moveFeet = [false, false];

const cameras = [];

const materials = [];

const pivot = [];

var scene, renderer;

var currentCamera = 0;

var trailer, robot, core, head, rArm, lArm, rLeg, lLeg, rFoot, lFoot;

var isTruckBool, duringAnimation;

var trailerBB = [];

var truckBB = [];

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxisHelper(10));
    scene.background = new THREE.Color("rgb(200, 200, 200)");

    createTrailer(0, 1.5, -15);
    createRobot(0, 0, 0);

    truckBB = [[-4.5, -13.5], [4.5, 2]];
    trailerBB = [[-4, -25.5], [4, -4.5]];

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

    var geometry = new THREE.BoxGeometry(8, 10, 21);
    var mesh = new THREE.Mesh(geometry, materials[0]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addTrailerBase(obj, x, y, z) {
    'use strict'

    var geometry = new THREE.BoxGeometry(5, 1, 16);
    var mesh = new THREE.Mesh(geometry, materials[1]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addWheel(obj, x, y ,z) {
    'use strict'

    var geometry = new THREE.CylinderGeometry(1, 1, 1.5, 8);
    var mesh = new THREE.Mesh(geometry, materials[2]);
    mesh.position.set(x, y, z);
    mesh.rotation.z = Math.PI / 2;
    obj.add(mesh);
}

function createTrailer(x, y, z) {
    'use strict';

    trailer = new THREE.Object3D();

    materials[0] = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, wireframe: true }); //material for trailer body
    materials[1] = new THREE.MeshBasicMaterial({ color: 0x4151ff, wireframe: true }); //material for trailer base
    materials[2] = new THREE.MeshBasicMaterial({ color: 0x383838, wireframe: true }); //material for wheel

    addTrailerBody(trailer, 0, 0, 0)
    addTrailerBase(trailer, 0, -5.5, -1.5);
    addWheel(trailer, 3.25, -6.5, -6.5);
    addWheel(trailer, 3.25, -6.5, -8.5);
    addWheel(trailer, -3.25, -6.5, -6.5);
    addWheel(trailer, -3.25, -6.5, -8.5);

    scene.add(trailer);

    trailer.position.x = x;
    trailer.position.y = y;
    trailer.position.z = z;
}


function addRobotCore(obj, x, y ,z) {
    'use strict';

    var geometry = new THREE.BoxGeometry(8, 4, 4);
    core = new THREE.Mesh(geometry, materials[4]);
    core.position.set(x, y, z);
    obj.add(core);
    addRobotWaist(robot, 0, -4.5, 1.5)
    addWheel(robot, 3.25, -5, 0);
    addWheel(robot, -3.25, -5, 0);
    addRobotAbdomen(robot, 0, -3, 0);
}

function addRobotAbdomen(obj, x, y, z) {
    'use strict';

    var geometry = new THREE.BoxGeometry(5, 2, 4);
    var mesh = new THREE.Mesh(geometry, materials[4]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addRobotArm(obj, side, x, y, z) {
    'use strict';

    var geometry = new THREE.BoxGeometry(1, 4, 1);
    if (side == "r") {
        rArm = new THREE.Mesh(geometry, materials[4]);
        rArm.position.set(x, y, z);
        obj.add(rArm);
        addRobotForeArm(rArm, 0, -2.5, 1.5);
        addRobotExhaust(rArm, -0.75, 1, 0);
    }

    if (side == "l") {
        lArm = new THREE.Mesh(geometry, materials[4]);
        lArm.position.set(x, y, z);
        obj.add(lArm);
        addRobotForeArm(lArm, 0, -2.5, 1.5);
        if (side == "l") addRobotExhaust(lArm, 0.75, 1, 0);
    }
}

function addRobotForeArm(obj, x, y, z) {
    'use strict';

    var geometry = new THREE.BoxGeometry(1, 1, 4);
    var mesh = new THREE.Mesh(geometry, materials[4]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addRobotExhaust(obj, x, y, z) {
    'use strict'

    var geometry = new THREE.CylinderGeometry(0.25, 0.25, 4, 8);
    var mesh = new THREE.Mesh(geometry, materials[0]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addRobotHead(obj, x, y, z) {
    'use strict';

    pivot[0] = new THREE.Group();

    obj.add(pivot[0]);

    var geometry = new THREE.BoxGeometry(2, 2, 2);
    head = new THREE.Mesh(geometry, materials[1]);
    head.position.set(x, y, z);
    pivot[0].add(head);

    addRobotEye(head, -0.5, 0.5, 1.05);
    addRobotEye(head, 0.5, 0.5, 1.05);
    addRobotAntenna(head, -1.25, 0.75, 0);
    addRobotAntenna(head, 1.25, 0.75, 0);

    pivot[0].position.set(0, 1, 0);
    head.position.set(0, 2, 0);
}

function addRobotEye(obj, x, y, z) {
    'use strict';

    var geometry = new THREE.CylinderGeometry(0.25, 0.25, 0.1, 8);
    var mesh = new THREE.Mesh(geometry, materials[3]);
    mesh.position.set(x, y, z);
    mesh.rotation.x = Math.PI / 2;
    obj.add(mesh);
}

function addRobotAntenna(obj, x, y, z) {
    'use strict'

    var geometry = new THREE.CylinderGeometry(0.25, 0.25, 1.5, 8);
    var mesh = new THREE.Mesh(geometry, materials[1]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addRobotWaist(obj, x, y, z) {
    'use strict';

    var geometry = new THREE.BoxGeometry(8, 1, 1);
    var mesh = new THREE.Mesh(geometry, materials[0]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addRobotLegs(obj){
    pivot[1] = new THREE.Group();
    pivot[2] = new THREE.Group();

    obj.add(pivot[1]);

    addRobotLeg(pivot[1], "l", 1.5, -11, 0);
    addRobotLeg(pivot[1], "r", -1.5, -11, 0);

    pivot[1].position.set(0, -4.5, 0);
    lLeg.position.set(1.5, -5.5, 0);
    rLeg.position.set(-1.5, -5.5, 0);

    
    pivot[2].position.set(0, -4.5, -1);
    lFoot.position.set(3.75, 0.75, 1.75);
    rFoot.position.set(-0.75, 0.75, 1.75);
    
}

function addRobotLeg(obj, side, x, y, z) {
    'use strict';

    var geometry = new THREE.BoxGeometry(2, 8, 2);
    if (side == "r") {
        rLeg = new THREE.Mesh(geometry, materials[1]);
        rLeg.position.set(x, y, z);
        obj.add(rLeg);
        rLeg.add(pivot[2]);
        addRobotThigh(rLeg, 0, 5, 0);
        addRobotFoot(pivot[2], "r", -0.75, -4.75, 0.75);
        addWheel(rLeg, -1.75, -1, 0.5);
        addWheel(rLeg, -1.75, -3, 0.5);

    }
    if (side == "l") {
        lLeg = new THREE.Mesh(geometry, materials[1]);
        lLeg.position.set(x, y, z);
        obj.add(lLeg);
        lLeg.add(pivot[2]);
        addRobotThigh(lLeg, 0, 5, 0);
        addRobotFoot(pivot[2], "l", 0.75, -4.75, 0.75);
        addWheel(lLeg, 1.75, -1, 0.5);
        addWheel(lLeg, 1.75, -3, 0.5);

    }

}

function addRobotThigh(obj, x, y, z) {
    'use strict';

    var geometry = new THREE.BoxGeometry(1, 2, 1);
    var mesh = new THREE.Mesh(geometry, materials[0]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addRobotFoot(obj, side, x, y, z) {
    'use strict';

    var geometry = new THREE.BoxGeometry(3.5, 1.5, 3.5);
    if (side == "r") {
        rFoot = new THREE.Mesh(geometry, materials[1]);
        rFoot.position.set(x, y, z);
        obj.add(rFoot);

        pivot[2].add(rFoot);
    }

    if (side == "l") {
        lFoot = new THREE.Mesh(geometry, materials[1]);
        lFoot.position.set(x, y, z);
        obj.add(lFoot);

        pivot[2].add(lFoot);
    }
}


function createRobot(x, y ,z) {
    'use strict'

    robot = new THREE.Object3D();

    materials[3] = new THREE.MeshBasicMaterial({ color: 0xfaff42, wireframe: true }); //material for eyes
    materials[4] = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }); //material for core, abdomen, arms and forearms


    addRobotCore(robot, 0, 0, 0);
    addRobotArm(robot, "l", 4.5, 0, -1.5);
    addRobotArm(robot, "r", -4.5, 0, -1.5);
    addRobotHead(robot, 0, 3, 0);
    addRobotLegs(robot);

    scene.add(robot);

    robot.position.x = x;
    robot.position.y = y;
    robot.position.z = z;
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(){
    'use strict';

    if (trailerBB[MIN][X] <= truckBB[MAX][X] &&
        trailerBB[MAX][X] >= truckBB[MIN][X] &&
        trailerBB[MIN][Z] <= truckBB[MAX][Z] &&
        trailerBB[MAX][Z] >= truckBB[MIN][Z]){
            handleCollisions();
        }
}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(){
    'use strict';

    duringAnimation = true;

    if (trailer.position.z < -24.2) {
        trailer.position.z += 0.2;
        trailerBB[MIN][Z] += 0.2;
        trailerBB[MAX][Z] += 0.2;
    }
    if (trailer.position.z > -24.2) {
        trailer.position.z -= 0.2;
        trailerBB[MIN][Z] -= 0.2;
        trailerBB[MAX][Z] -= 0.2;
    }
    if (trailer.position.x < 0) {
        trailer.position.x += 0.2;
        trailerBB[MIN][X] += 0.2;
        trailerBB[MAX][X] += 0.2;
    }
    if (trailer.position.x > 0) {
        trailer.position.x -= 0.2;
        trailerBB[MIN][X] -= 0.2;
        trailerBB[MAX][X] -= 0.2;
    }

    if (trailer.position.x > -0.2 && trailer.position.x < 0.2) {
        if (trailer.position.z > -24.4 && trailer.position.z < -24.0) {
            duringAnimation = false;
        }
    }

}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';

    isTruckBool = isTruck();

    if (!duringAnimation){
        if(moveTrailer[0]){
            trailer.position.x -= 0.2;
            trailerBB[MIN][X] -= 0.2;
            trailerBB[MAX][X] -= 0.2;
        }
        if(moveTrailer[1]){
            trailer.position.z -= 0.2;
            trailerBB[MIN][Z] -= 0.2;
            trailerBB[MAX][Z] -= 0.2;
        }
        if(moveTrailer[2]){
            trailer.position.x += 0.2;
            trailerBB[MIN][X] += 0.2;
            trailerBB[MAX][X] += 0.2;
        }
        if(moveTrailer[3]){
            trailer.position.z += 0.2;
            trailerBB[MIN][Z] += 0.2;
            trailerBB[MAX][Z] += 0.2;
        }
        if(moveArms[0]){
            if (lArm.position.x < 4.5){
                lArm.position.x += 0.01;
                rArm.position.x -= 0.01;
            }
        }
        if(moveArms[1]){
            if (lArm.position.x > 3.5){
                rArm.position.x += 0.01;
                lArm.position.x -= 0.01;
            }
        }
        if(moveHead[0]){
            if (pivot[0].rotation.x < 0){
                pivot[0].rotation.x += Math.PI / 64;
            }
        }
        if(moveHead[1]){
            if (pivot[0].rotation.x > -Math.PI){
                pivot[0].rotation.x -= Math.PI / 64;
            }
        }
        if(moveLegs[0]){
            if (pivot[1].rotation.x > 0){
                pivot[1].rotation.x -= Math.PI / 64;
            }
        }
        if(moveLegs[1]){
            if (pivot[1].rotation.x < Math.PI / 2){
                pivot[1].rotation.x += Math.PI / 64;
            }
        }
        if(moveFeet[0]){
            if (pivot[2].rotation.x > 0){
                pivot[2].rotation.x -= Math.PI / 64;
            }
        }
        if(moveFeet[1]){
            if (pivot[2].rotation.x < Math.PI / 2){
                pivot[2].rotation.x += Math.PI / 64;
            }
        }
    }

    duringAnimation = false;
    if (isTruckBool){
        checkCollisions();
    }

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

    update();

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
        case 68: //D(d)
        case 100:
            moveArms[1] = true;
            break;
        case 69: //E(e)
        case 101:
            moveArms[0] = true;
            break;
        case 70: //F(f)
        case 102:
            moveHead[1] = true;
            break;
        case 82: //R(r)
        case 114:
            moveHead[0] = true;
            break;
        case 83: //S(s)
        case 115:
            moveLegs[1] = true;
            break;
        case 87: //W(w)
        case 119:
            moveLegs[0] = true;
            break;
        case 81: //Q(q)
        case 113:
            moveFeet[1] = true;
            break;
        case 65: //A(a)
        case 97:
            moveFeet[0] = true;
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
        case 68: //D(d)
        case 100:
            moveArms[1] = false;
            break;
        case 69: //E(e)
        case 101:
            moveArms[0] = false;
            break;
        case 70: //F(f)
        case 102:
            moveHead[1] = false;
            break;
        case 82: //R(r)
        case 114:
            moveHead[0] = false;
            break;
        case 83: //S(s)
        case 115:
            moveLegs[1] = false;
            break;
        case 87: //W(w)
        case 119:
            moveLegs[0] = false;
            break;
        case 81: //Q(q)
        case 113:
            moveFeet[1] = false;
            break;
        case 65: //A(a)
        case 97:
            moveFeet[0] = false;
            break;
    }
}

//////////////////////////////////////
/* CHECKS IF ROBOT IS IN TRUCK MODE */
//////////////////////////////////////
function isTruck() {
    if (-Math.PI - 0.05 > pivot[0].rotation.x || pivot[0].rotation.x > -Math.PI + 0.05) return false;
    if (Math.PI/2 - 0.05 > pivot[1].rotation.x || pivot[1].rotation.x > Math.PI/2 + 0.05) return false;
    if (Math.PI/2 - 0.05 > pivot[2].rotation.x || pivot[2].rotation.x > Math.PI/2 + 0.05) return false;
    if ((3.49 > lArm.position.x || lArm.position.x > 3.51)) return false;

    return true;
}