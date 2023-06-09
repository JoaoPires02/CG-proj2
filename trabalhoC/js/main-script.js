//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var groundGeo, groundMesh;

var skydome, moon, ufo;

var scene, delta, clock;

var skyTextureApplied = false;

var fieldTextureApplied = false;

const ufoSpeed = 30;

const ufoRotSpeed = Math.PI / 4;

var previousMaterial;

var currentMaterial = 1;

var camera, renderer;

var fieldTexture, skydomeTexture;

var trees = [];

var groundMat;

var domeMaterials;

var moonMaterials = [];

var logMat = [];

var leavesMat = [];

var ufoCockpitMat = [];

var ufoBodyMat = [];

var ufoBaseMat = [];

var ufoLightsMat = [];

var ufoBodyMat = [];

var ufoSpheresMat = [];

var houseRoofMat = [];

var houseWallMat = [];

var houseWindowMat = [];

var moveUFO = [false, false, false, false];

var moonLight, ambientLight, spotLight;

var pointLights = [];

var house, walls, roof, windows;



/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxesHelper(10));
    scene.background = new THREE.Color("rgb(200, 200, 200)");

    createGround();
    createSkydome();
    createMoon();
    createMoonLight();
    createAmbientLight();
    createSpotLight();

    prepareUFO();
    createUFO(0, 90, 0);

    prepareHouse();
    createHouse(-70, 25, 40);
    
    prepareTree();
    
    createTree(-80, 29, -80, 2, Math.PI / 3, 0);
    createTree(70, 39, 70, 2.5, Math.PI / 8, 1);
    createTree(60, 40, -60, 1, Math.PI / 4, 2);

}

/////////////////////
//* CREATE GROUND *//
/////////////////////
function createGround() {
    groundGeo = new THREE.PlaneGeometry(400, 400, 100, 100);

    let disMap = new THREE.TextureLoader()
        .load('https://web.tecnico.ulisboa.pt/~ist199090/alentejo4.png');

    disMap.wrapS = disMap.wrapT = THREE.RepeatWrapping;
    disMap.repeat.set(1, 1);

    groundMat = new THREE.MeshPhongMaterial ({
        color: 0xffffff,
        wireframe: false,
        displacementMap: disMap,
        displacementScale: 60,
    });

    groundMesh = new THREE.Mesh(groundGeo, groundMat);
    scene.add(groundMesh);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -0.5;
}

function generateFieldTexture() {
    var canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
  
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#30F637'; // Green
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    var colors = ['#FFFFFF', '#FFFF00', '#BA68C8', '#B3E5FC']; // Circle colors
    var radius = 2; // Circle radius
  
    for (var i = 0; i < 200; i++) {
      var x = Math.random() * canvas.width;
      var y = Math.random() * canvas.height;
      var color = colors[Math.floor(Math.random() * colors.length)];
  
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.closePath();
    }
  
    var texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

function applyFieldTexture() {
    fieldTexture = generateFieldTexture();
    groundMat.map = fieldTexture;
    groundMat.needsUpdate = true;
}

////////////////////
/* CREATE SKYDOME */
////////////////////
function createSkydome() {
    domeMaterials = new THREE.MeshPhongMaterial({ transparent: true, side: THREE.BackSide });
    var geometry = new THREE.SphereGeometry(175, 235, 235);
    skydome = new THREE.Mesh(geometry, domeMaterials);
    scene.add(skydome);
}

function generateSkydomeTexture() {
    var canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;

    var ctx = canvas.getContext('2d');

    // Create a radial gradient for the skydome
    var gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
    gradient.addColorStop(0, '#0d0a3a'); // Dark blue
    gradient.addColorStop(1, '#1e003d'); // Dark violet
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Generate stars
    var starColor = '#ffffff'; // White
    var starRadius = 1; // Radius of stars

    for (var i = 0; i < 1000; i++) {
        var x = Math.random() * canvas.width;
        var y = Math.random() * canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, starRadius, 0, 2 * Math.PI);
        ctx.fillStyle = starColor;
        ctx.fill();
    }

    var texture = new THREE.CanvasTexture(canvas);
    return texture;
}

function applySkydomeTexture() {
    skydomeTexture = generateSkydomeTexture();
    domeMaterials.map = skydomeTexture;
    domeMaterials.needsUpdate = true;
}

///////////////////
//* CREATE MOON *//
///////////////////
function createMoon() {
    var moonGeo = new THREE.SphereGeometry(10, 32, 32);

    moonMaterials[0] = new THREE.MeshBasicMaterial({
        color: 0xffff00, 
    });

    moonMaterials[1] = new THREE.MeshLambertMaterial({
        color: 0xffff00, 
        emissive: 0xffff00, 
        emissiveIntensity: 1, 
    });

    moonMaterials[2] = new THREE.MeshPhongMaterial({
        color: 0xffff00, 
        emissive: 0xffff00, 
        emissiveIntensity: 1, 
    });

    moonMaterials[3] = new THREE.MeshToonMaterial({
        color: 0xffff00, 
        emissive: 0xffff00, 
        emissiveIntensity: 1, 
    });

    moon = new THREE.Mesh(moonGeo, moonMaterials[1]);
    moon.position.set(-60, 110, -40); 
    scene.add(moon);
}

/////////////////
/* CREATE TREE */
/////////////////
function prepareTree(){
    // log color: orange brown mix
    logMat[0] = new THREE.MeshBasicMaterial({color: 0xA9671C}); 
    logMat[1] = new THREE.MeshLambertMaterial({color: 0xA9671C});
    logMat[2] = new THREE.MeshPhongMaterial({color: 0xA9671C});
    logMat[3] = new THREE.MeshToonMaterial({color: 0xA9671C});
    
    // leaves color: green
    leavesMat[0] = new THREE.MeshBasicMaterial({color: 0x139509});
    leavesMat[1] = new THREE.MeshLambertMaterial({color: 0x139509});
    leavesMat[2] = new THREE.MeshPhongMaterial({color: 0x139509});
    leavesMat[3] = new THREE.MeshToonMaterial({color: 0x139509});
}

function createTree(x, y, z, height, rot, pos) {
    trees[pos] = new THREE.Object3D();

    createLog1(pos);
    createLog2(pos);

    scene.add(trees[pos]);
    trees[pos].position.set(x, y, z);
    trees[pos].scale.set(height, height, height);
    trees[pos].rotation.y = rot;
}

function createLog1(pos) {
    var log1 = new THREE.CylinderGeometry(1, 1, 10, 32);
    var log1Mesh = new THREE.Mesh(log1, logMat[1]);
    var leaves1 = new THREE.SphereGeometry(2, 32, 16);

    leaves1.rotateZ(Math.PI / 2);
    leaves1.scale(1, 1, 2);

    var leaves1Mesh = new THREE.Mesh(leaves1, leavesMat[1]);
    leaves1Mesh.position.y = 5;

    log1Mesh.add(leaves1Mesh);
    log1Mesh.rotation.x = -Math.PI / 10;

    trees[pos].add(log1Mesh);
}

function createLog2(pos) {
    var log2 = new THREE.CylinderGeometry(1, 1, 8, 32);
    var log2Mesh = new THREE.Mesh(log2, logMat[1]);
    var leaves2 = new THREE.SphereGeometry(2, 32, 16);

    leaves2.rotateZ(Math.PI / 2);
    leaves2.scale(1, 1, 2);

    var leaves2Mesh = new THREE.Mesh(leaves2, leavesMat[1]);
    leaves2Mesh.position.y = 4;

    log2Mesh.add(leaves2Mesh);
    log2Mesh.position.set (0, 0.5, 3);
    log2Mesh.rotation.x = Math.PI / 5;

    trees[pos].add(log2Mesh);
}

////////////////
/* CREATE UFO */
////////////////
function prepareUFO(){
    // Cockpit color: Light blue
    ufoCockpitMat[0] = new THREE.MeshBasicMaterial({color: 0xADD8E6}); 
    ufoCockpitMat[1] = new THREE.MeshLambertMaterial({color: 0xADD8E6});
    ufoCockpitMat[2] = new THREE.MeshPhongMaterial({color: 0xADD8E6});
    ufoCockpitMat[3] = new THREE.MeshToonMaterial({color: 0xADD8E6});

    // Base color: Dark grey
    ufoBaseMat[0] = new THREE.MeshBasicMaterial({color: 0x5A5A5A});
    ufoBaseMat[1] = new THREE.MeshLambertMaterial({color: 0x5A5A5A});
    ufoBaseMat[2] = new THREE.MeshPhongMaterial({color: 0x5A5A5A});
    ufoBaseMat[3] = new THREE.MeshToonMaterial({color: 0x5A5A5A});

    // Light emitting spheres color: Orange
    ufoLightsMat[0] = new THREE.MeshBasicMaterial({color: 0xFFD580}); 
    ufoLightsMat[1] = new THREE.MeshLambertMaterial({color: 0xFFD580});
    ufoLightsMat[2] = new THREE.MeshPhongMaterial({color: 0xFFD580});
    ufoLightsMat[3] = new THREE.MeshToonMaterial({color: 0xFFD580});
    
    // UFO body color: Light grey
    ufoBodyMat[0] = new THREE.MeshBasicMaterial({color: 0xD3D3D3});
    ufoBodyMat[1] = new THREE.MeshLambertMaterial({color: 0xD3D3D3});
    ufoBodyMat[2] = new THREE.MeshPhongMaterial({color: 0xD3D3D3});
    ufoBodyMat[3] = new THREE.MeshToonMaterial({color: 0xD3D3D3});
}

function createUFO(x, y, z){
    ufo = new THREE.Object3D();

    ufo.position.set(x, y, z);
    
    addUFOBody(ufo);
    addUFOBase(ufo);
    addCockpit(ufo);
    addUFOLights(ufo);

    scene.add(ufo);
    
}

function addUFOBody(obj) {
    var ufoBody = new THREE.SphereGeometry(12, 32, 16);
    var ufoBodyMesh = new THREE.Mesh(ufoBody, ufoBodyMat[currentMaterial]);
    ufoBody.scale(1, 1/6, 1);

    obj.add(ufoBodyMesh);
}

function addUFOBase(obj) {
    var base = new THREE.CylinderGeometry(4, 4, 1, 32);
    var baseMesh = new THREE.Mesh(base, ufoBaseMat[currentMaterial]);
    baseMesh.position.set(0, -2, 0);

    obj.add(baseMesh);
}

function addCockpit(obj) {
    var cockpit = new THREE.SphereGeometry(4, 32, 16);
    var cockpitMesh = new THREE.Mesh(cockpit, ufoCockpitMat[currentMaterial]);
    cockpitMesh.position.set(0, 2, 0);
    obj.add(cockpitMesh);
}

function addUFOLights(obj) {
    const sphereCount = 8;
    const angleIncrement = (2 * Math.PI) / sphereCount;
    var counter = 0;
    
    for (let i = 0; i < sphereCount; i++) {
        const angle = i * angleIncrement;
        var x = Math.cos(angle) * 8;
        var z = Math.sin(angle) * 8;
    
        var sphereGeometry = new THREE.SphereGeometry(0.4, 32, 32);
        var sphere = new THREE.Mesh(sphereGeometry, ufoLightsMat[currentMaterial]);
        
        sphere.position.set(x, -1.5, z);

        createPointLight(sphere, x, z, counter);

        obj.add(sphere);

        counter++;
    }
}

//////////////////
/* CREATE HOUSE */
//////////////////
function prepareHouse(){
    // Roof color: Brown
    houseRoofMat[0] = new THREE.MeshBasicMaterial({color:   0x873e23, side : THREE.FrontSide}); 
    houseRoofMat[1] = new THREE.MeshLambertMaterial({color: 0x873e23, side : THREE.FrontSide});
    houseRoofMat[2] = new THREE.MeshPhongMaterial({color:   0x873e23, side : THREE.FrontSide});
    houseRoofMat[3] = new THREE.MeshToonMaterial({color:    0x873e23, side : THREE.FrontSide});

    // Wall and chimney color: White
    houseWallMat[0] = new THREE.MeshBasicMaterial({color:   0xFFFFFF, side : THREE.FrontSide});
    houseWallMat[1] = new THREE.MeshLambertMaterial({color: 0xFFFFFF, side : THREE.FrontSide});
    houseWallMat[2] = new THREE.MeshPhongMaterial({color:   0xFFFFFF, side : THREE.FrontSide});
    houseWallMat[3] = new THREE.MeshToonMaterial({color:    0xFFFFFF, side : THREE.FrontSide});

    // Window and door color: Blue
    houseWindowMat[0] = new THREE.MeshBasicMaterial({color:   0x0000FF, side : THREE.FrontSide}); 
    houseWindowMat[1] = new THREE.MeshLambertMaterial({color: 0x0000FF, side : THREE.FrontSide});
    houseWindowMat[2] = new THREE.MeshPhongMaterial({color:   0x0000FF, side : THREE.FrontSide});
    houseWindowMat[3] = new THREE.MeshToonMaterial({color:    0x0000FF, side : THREE.FrontSide});
}

function addSideWalls(walls, windows){

    // Wall 1
    const wallsGeometry = new THREE.BufferGeometry();

    var vertices = new Float32Array( [
        24,  0,  0, //v0
        24,  0, 12, //v1
        24,  4, 12, //v2
        24,  4,  0, //v3

        24,  8,  0, //v4
        24,  8, 12, //v5
        24, 12, 12, //v6
        24, 12,  0, //v7

        24,  4,  4, //v8
        24,  4,  8, //v9
        24,  8,  8, //v10
        24,  8,  4, //v11

        24, 18,  6, //v12

        24, 0,  -1, //v13
        24, 11,  0, //v14
        24, 11, -1  //v15
    ]);

    var indices = [
        0, 1, 2,
        2, 3, 0,

        3, 8, 11,
        11, 4, 3,

        9, 2, 5,
        5, 10, 9,

        4, 5, 6,
        6, 7, 4,

        7, 6, 12,

        13, 0, 14,
        14, 15, 13,
    ];

    wallsGeometry.setIndex(indices);
    wallsGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    wallsGeometry.computeVertexNormals();
    
    const wallSide1 = new THREE.Mesh( wallsGeometry, houseWallMat[1]);

    walls.add(wallSide1);

    // Wall 1
    const wallsGeometry2 = new THREE.BufferGeometry();

    var vertices = new Float32Array( [
        0,  0,  0, //v0
        0,  0, 12, //v1
        0,  4, 12, //v2
        0,  4,  0, //v3

        0,  8,  0, //v4
        0,  8, 12, //v5
        0, 12, 12, //v6
        0, 12,  0, //v7

        0,  4,  4, //v8
        0,  4,  8, //v9
        0,  8,  8, //v10
        0,  8,  4, //v11

        0, 18,  6, //v12

        0, 0,  -1, //v13
        0, 11,  0, //v14
        0, 11, -1  //v15
    ]);

    var indices = [
        1, 0, 3,
        3, 2, 1,

        8, 3, 4,
        4, 11, 8,

        2, 9, 10,
        10, 5, 2,

        5, 4, 7,
        7, 6, 5,

        6, 7, 12,

        0, 13, 15,
        15, 14, 0,
    ];

    wallsGeometry2.setIndex(indices);
    wallsGeometry2.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    wallsGeometry2.computeVertexNormals();
    
    const wallSide2 = new THREE.Mesh( wallsGeometry2, houseWallMat[1]);

    wallSide2.position.set(48, 0, 0);

    walls.add(wallSide2);


    // Window
    const windowsGeometry = new THREE.BufferGeometry();


    vertices = new Float32Array( [
        24,  4,  4, //v0
        24,  4,  8, //v1
        24,  8,  8, //v2
        24,  8,  4  //v3
    ]);

    indices = [
        0, 1, 2,
        2, 3, 0,
    ];

    windowsGeometry.setIndex(indices);
    windowsGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    windowsGeometry.computeVertexNormals();
    
    const window1 = new THREE.Mesh(windowsGeometry, houseWindowMat[1]);
    const window2 = new THREE.Mesh(windowsGeometry, houseWindowMat[1]);

    window2.position.set(24, 0, 0);

    windows.add(window1);
    windows.add(window2);
}

function addBackWall(walls, roof) {

    // Wall

    const wallsGeometry = new THREE.BufferGeometry();

    var vertices = new Float32Array( [
         0,  0, 12, //v0
        24,  0, 12, //v1
        24, 12, 12, //v2
         0, 12, 12  //v3
    ]);

    var indices = [
        1, 0, 3,
        3, 2, 1,
    ];

    wallsGeometry.setIndex(indices);
    wallsGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    wallsGeometry.computeVertexNormals();
    
    const wallSide = new THREE.Mesh(wallsGeometry, houseWallMat[1]);

    wallSide.position.set(24, 0, 0);

    walls.add(wallSide);

    // Roof

    const roofGeometry = new THREE.BufferGeometry();

    var vertices = new Float32Array( [
         0, 12, 12, //v0
        24, 12, 12, //v1
        24, 18,  6, //v2
         0, 18,  6  //v3
    ]);

    var indices = [
        1, 0, 3,
        3, 2, 1
    ];

    roofGeometry.setIndex(indices);
    roofGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    roofGeometry.computeVertexNormals();
    
    const roofSide = new THREE.Mesh(roofGeometry, houseRoofMat[1]);

    roofSide.position.set(24, 0, 0);

    roof.add(roofSide);
}

function addFrontWall(walls, roof, windows) {

    // Wall

    const wallsGeometry = new THREE.BufferGeometry();

    var vertices = new Float32Array( [
         2,  0,  0, //v0
        10,  0,  0, //v1
        10,  4,  0, //v2
         2,  4,  0, //v3

        14,  0,  0, //v4
        22,  0,  0, //v5
        22,  4,  0, //v6
        14,  4,  0, //v7

         3,  4,  0, //v8
         3,  8,  0, //v9
         2,  8,  0, //v10

         7,  4,  0, //v11
        10,  8,  0, //v12
         7,  8,  0, //v13

        17,  4,  0, //v14
        17,  8,  0, //v15
        14,  8,  0, //v16

        21,  4,  0, //v17
        22,  8,  0, //v18
        21,  8,  0, //v19

        22, 11,  0, //v20
         2, 11,  0, //v21

         0, 11,  0, //v22
        24, 11,  0, //v23
        24, 12,  0, //v24
         0, 12,  0, //v25

         2,  0, -1, //v26
         2, 11, -1, //v27

        22,  0, -1, //v28
        22, 11, -1, //v29

         0,  0, -1, //v30
         0, 11, -1, //v31

        24,  0, -1, //v32
        24, 11, -1, //v33

         0,  11,  0, //v34

        24,  11,  0, //v35
    ]);

    var indices = [
        1, 0, 3,
        3, 2, 1,

        5, 4, 7,
        7, 6, 5,

        8, 3, 10,
        10, 9, 8,

        1, 11, 13,
        13, 12, 1,

        14, 7, 16,
        16, 15, 14,

        6, 17, 19,
        19, 18, 6,

        18, 10, 21,
        21, 20, 18,

        23, 22, 25,
        25, 24, 23,

        0, 26, 27,
        27, 21, 0,

        28, 5, 20,
        20, 29, 28,

        26, 30, 31,
        31, 27, 26,

        32, 28, 29,
        29, 33, 32,

        27, 31, 34,
        34, 21, 27,

        33, 29, 20,
        20, 35, 33

    ];

    wallsGeometry.setIndex(indices);
    wallsGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    wallsGeometry.computeVertexNormals();
    
    const wallSide = new THREE.Mesh(wallsGeometry, houseWallMat[1]);

    wallSide.position.set(24, 0, 0);

    walls.add(wallSide);

    // Roof
    const roofGeometry = new THREE.BufferGeometry();

    var vertices = new Float32Array( [
         0, 12,  0, //v0
        24, 12,  0, //v1
        24, 14,  2, //v2
         0, 14,  2,  //v3

        19, 14,  2, //v4
        19, 15,  3, //v5
         0, 15,  3, //v6

        22, 14,  2, //v7
        24, 15,  3, //v8
        22, 15,  3, //v9

        0,  18,  6, //v10
        24, 18,  6, //v11
    ]);

    var indices = [
        1, 0, 3,
        3, 2, 1,

        4, 3, 6,
        6, 5, 4,

        2, 7, 9,
        9, 8, 2,

        8, 6, 10,
        10, 11, 8
    ];

    roofGeometry.setIndex(indices);
    roofGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    roofGeometry.computeVertexNormals();
    
    const roofSide = new THREE.Mesh(roofGeometry, houseRoofMat[1]);

    roofSide.position.set(24, 0, 0);

    roof.add(roofSide);

    // Window
    const windowsGeometry = new THREE.BufferGeometry();


    vertices = new Float32Array( [
         3,  4,  0, //v0
         7,  4,  0, //v1
         7,  8,  0, //v2
         3,  8,  0, //v3

         10,  0,  0, //v4
         14,  0,  0, //v5
         14,  8,  0, //v6
         10,  8,  0, //v7

         17,  4,  0, //v8
         21,  4,  0, //v9
         21,  8,  0, //v10
         17,  8,  0, //v11
    ]);

    indices = [
         1, 0, 3,
         3, 2, 1,

         5, 4, 7,
         7, 6, 5,

         9, 8, 11,
        11, 10, 9,
    ];

    windowsGeometry.setIndex(indices);
    windowsGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    windowsGeometry.computeVertexNormals();
    
    const window = new THREE.Mesh(windowsGeometry, houseWindowMat[1]);

    window.position.set(24, 0, 0);

    windows.add(window);
}

function addChimney(walls){
    const chimneyGeometry = new THREE.BufferGeometry();

    var vertices = new Float32Array( [
        19, 14,  2, //v0
        22, 14,  2, //v1
        22, 15,  3, //v2
        19, 15,  3, //v3

        19, 18,  2, //v4
        22, 18,  2, //v5
        19, 18,  3, //v6
        22, 18,  3, //v7
    ]);

    var indices = [
        3, 0, 4,
        4, 6, 3,

        0, 1, 5,
        5, 4, 0,

        1, 2, 7,
        7, 5, 1,

        2, 3, 6,
        6, 7, 2,

        4, 5, 7,
        7, 6, 4
    ];

    chimneyGeometry.setIndex(indices);
    chimneyGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    chimneyGeometry.computeVertexNormals();
    
    const chimney = new THREE.Mesh(chimneyGeometry, houseWallMat[1]);

    chimney.position.set(24, 0, 0);

    walls.add(chimney);
}

function createHouse(x, y, z) {
    house = new THREE.Object3D();

    walls = new THREE.Object3D();
    roof = new THREE.Object3D();
    windows = new THREE.Object3D();

    house.add(walls);
    house.add(roof);
    house.add(windows);
    
    addSideWalls(walls, windows);
    addBackWall(walls, roof);
    addFrontWall(walls, roof, windows);
    addChimney(walls);

    house.position.set(x, y, z);

    house.scale.set(1.5, 1.5, 1.5);

    scene.add(house);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCamera(x, y, z) {
    'use strict'
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);

    camera.position.x = x;
    camera.position.y = y;
    camera.position.z = z;
    camera.lookAt(scene.position);
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////
function createMoonLight() {
    moonLight = new THREE.DirectionalLight(0xffff00, 0.8);
    moonLight.position.copy(moon.position);
    moonLight.target.position.set( 0, 0, 0 );
    scene.add(moonLight);
}

function createAmbientLight() {
    ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
}

function createSpotLight() {
    spotLight = new THREE.SpotLight( 0xffff00, 1, 80, Math.PI / 16, 0.5, 0);
    spotLight.position.set(0, 90, 0);
    scene.add(spotLight);
    scene.add(spotLight.target);
}

function createPointLight(sphere, x, z, count) {
    const pointLight = new THREE.PointLight(0xffa500, 0.75, 100);
    pointLight.position.set(x, -1.5, z);
    sphere.add(pointLight);
    pointLights[count] = pointLight;

}

/////////////////////
/* TOGGLE LIGHT(S) */
/////////////////////
function toggleMoonlight() {
    if (moonLight.visible) {
        moonLight.visible = false;
    } else {
        moonLight.visible = true;
    }
}

function toggleSpotlight() {
    if (spotLight.visible) {
        spotLight.visible = false;
    } else {
        spotLight.visible = true;
    }
}

function togglePointLights() {
    if (pointLights[0].visible) {
        for(var i = 0; i < 8; i++){
            pointLights[i].visible = false;
        }
    } else {
        for(var i = 0; i < 8; i++){
            pointLights[i].visible = true;
        }
    }
}

//////////////////////
/* CHANGE MATERIALS */
//////////////////////
function changeMaterials() {
    moon.material = moonMaterials[currentMaterial];

    for (var i = 0; i < 5; i++) {
        walls.children[i].material = houseWallMat[currentMaterial];
    }

    for (var i = 0; i < 2; i++) {
        roof.children[i].material = houseRoofMat[currentMaterial];
    }

    for (var i = 0; i < 3; i++) {
        windows.children[i].material = houseWindowMat[currentMaterial];
    }
    
    for (var i = 0; i < 3; i++){
        trees[i].children[0].material = logMat[currentMaterial];
        trees[i].children[0].children[0].material = leavesMat[currentMaterial];
        trees[i].children[1].material = logMat[currentMaterial];
        trees[i].children[1].children[0].material = leavesMat[currentMaterial];
    }

    for (var i = 0; i < 11; i++){
        if (i == 0){
            ufo.children[i].material = ufoBodyMat[currentMaterial];
        }

        else if (i == 1){
            ufo.children[i].material = ufoBaseMat[currentMaterial];
        }

        else if (i == 2){
            ufo.children[i].material = ufoCockpitMat[currentMaterial];
        }

        else if (i >= 3){
            ufo.children[i].material = ufoLightsMat[currentMaterial];
        }
    }
}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';

    ufo.rotation.y += ufoRotSpeed * delta;

    if(moveUFO[0] && ufo.position.x > -100){
        ufo.position.x -= ufoSpeed * delta;
    }
    if(moveUFO[1] && ufo.position.z > -100){
        ufo.position.z -= ufoSpeed * delta;
    }
    if(moveUFO[2] && ufo.position.x < 100){
        ufo.position.x += ufoSpeed * delta;
    }
    if(moveUFO[3] && ufo.position.z < 100){
        ufo.position.z += ufoSpeed * delta;
    }

    spotLight.position.set(ufo.position.x, spotLight.position.y, ufo.position.z);
    spotLight.target.position.set(ufo.position.x, 0, ufo.position.z);

}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';

    renderer.render(scene, camera);

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
    createCamera(150, 95, -100);
    //createCamera(-150, 40, 0);

    clock = new THREE.Clock();

    render(camera);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

    delta = clock.getDelta();

    update();

    render(camera);

    requestAnimationFrame(animate);

}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();

}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';

    switch (e.keyCode) {
        case 37: //LEFT ARROW
            moveUFO[0] = true;
            break;
        case 38: //UP ARROW
            moveUFO[1] = true;
            break;
        case 39: //RIGHT ARROW
            moveUFO[2] = true;
            break;
        case 40: //DOWN ARROW
            moveUFO[3] = true;
            break;
        case 49: // 1 - Generate and apply new field texture
            applyFieldTexture();
            fieldTextureApplied = true;
            render();
            break;
        case 50: // 2 - Generate and apply new field texture
            applySkydomeTexture();
            skyTextureApplied = true;
            render();
            break;
        case 68: // D(d) - Turn moon light on and off
        case 100:
            toggleMoonlight();
            render();
            break;
        case 80: // P(p) - Toggle point lights
        case 112:
            togglePointLights();
            render();
            break;
        case 83: // S(s) - Toggle spotlight
        case 115:
            toggleSpotlight();
            render();
            break;
        case 82: // R(r) - Toggle ilumination calculation
        case 114:
            if (currentMaterial != 0){
            previousMaterial = currentMaterial;
            currentMaterial = 0;
            }
            else{
                currentMaterial = previousMaterial;
            }
            changeMaterials();
            render();
            break;
        case 81: // Q(q) - Change to Lambert material
        case 113: 
            currentMaterial = 1;
            changeMaterials();
            render();
            break;
        case 87: // W(w) - Change to Phong material
        case 119: 
            currentMaterial = 2;
            changeMaterials();
            render();
            break;
        case 69: // E(e) - Change to Toon material
        case 101: 
            currentMaterial = 3;
            changeMaterials();
            render();
            break;
    

    }

}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';
    switch (e.keyCode) {
        case 37: //LEFT ARROW
            moveUFO[0] = false;
            break;
        case 38: //UP ARROW
            moveUFO[1] = false;
            break;
        case 39: //RIGHT ARROW
            moveUFO[2] = false;
            break;
        case 40: //DOWN ARROW
            moveUFO[3] = false;
            break;
    }

}