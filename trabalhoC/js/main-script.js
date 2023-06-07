//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var groundGeo, groundMesh;

var skydome, moon, ufo;

var scene, delta, clock;

var skyTextureApplied = false;

var fieldTextureApplied = false;

const ufoSpeed = 30;

var previousMaterial;

var currentMaterial = 1;

var camera, renderer;

var fieldTexture, skydomeTexture;

var trees = [];

var groundMat = [];

var domeMaterials = [];

var moonMaterials = [];

var logMat = [];

var leavesMat = [];

var ufoCockpitMat = [];

var ufoBodyMat = [];

var ufoBaseMat = [];

var ufoLightsMat = [];

var ufoBodyMat = [];

var ufoSpheresMat = [];

var moveUFO = [false, false, false, false];

var moonLight, ambientLight, spotLight;

var pointLights = [];

var isMoonLightOn = true;

var isSpotLightOn = true;

var arePointLightsOn = true;


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
    
    prepareTree();
    
    createTree(-80, 29, -80, 2, 0, 0);
    createTree(70, 34, 70, 2.5, Math.PI / 2, 1);
    createTree(60, 24, -60, 1, Math.PI / 4, 2);

}

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
    moon.position.set(-60, 140, -40); 
    scene.add(moon);
}

function createGround() {
    groundGeo = new THREE.PlaneGeometry(200, 200, 100, 100);

    let disMap = new THREE.TextureLoader()
        .load('https://web.tecnico.ulisboa.pt/~ist199090/alentejo.png');

    disMap.wrapS = disMap.wrapT = THREE.RepeatWrapping;
    disMap.repeat.set(1, 1);

    groundMat[0] = new THREE.MeshBasicMaterial ({
        color: 0xffffff,
        wireframe: false,
        displacementMap: disMap,
        displacementScale: 100,
    });

    groundMat[1] = new THREE.MeshLambertMaterial ({
        color: 0xffffff,
        wireframe: false,
        displacementMap: disMap,
        displacementScale: 100,
    });

    groundMat[2] = new THREE.MeshPhongMaterial ({
        color: 0xffffff,
        wireframe: false,
        displacementMap: disMap,
        displacementScale: 100,
    });

    groundMat[3] = new THREE.MeshToonMaterial ({
        color: 0xffffff,
        wireframe: false,
        displacementMap: disMap,
        displacementScale: 100,
    });

    groundMesh = new THREE.Mesh(groundGeo, groundMat[1]);
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
    groundMat[0].map = fieldTexture;
    groundMat[1].map = fieldTexture;
    groundMat[2].map = fieldTexture;
    groundMat[3].map = fieldTexture;
    groundMat[currentMaterial].needsUpdate = true;
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

function createSkydome() {
    domeMaterials[0] = new THREE.MeshBasicMaterial({ transparent: true, side: THREE.BackSide });
    domeMaterials[1] = new THREE.MeshLambertMaterial({ transparent: true, side: THREE.BackSide });
    domeMaterials[2] = new THREE.MeshPhongMaterial({ transparent: true, side: THREE.BackSide });
    domeMaterials[3] = new THREE.MeshToonMaterial({ transparent: true, side: THREE.BackSide });
    var geometry = new THREE.SphereGeometry(175, 235, 235, 0, Math.PI * 2, 0, Math.PI / 2);
    skydome = new THREE.Mesh(geometry, domeMaterials[1]);
    scene.add(skydome);
}

function applySkydomeTexture() {
    skydomeTexture = generateSkydomeTexture();
    domeMaterials[0].map = skydomeTexture;
    domeMaterials[1].map = skydomeTexture;
    domeMaterials[2].map = skydomeTexture;
    domeMaterials[3].map = skydomeTexture;
    domeMaterials[currentMaterial].needsUpdate = true;
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

function createTree(x, y, z, height, rot, pos) {
    trees[pos] = new THREE.Object3D();

    createLog1(pos);
    createLog2(pos);

    scene.add(trees[pos]);
    trees[pos].position.set(x, y, z);
    trees[pos].scale.set(height, height, height);
    trees[pos].rotation.y = rot;
}

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

function prepareUFO(){
    // cockpit color: light blue
    ufoCockpitMat[0] = new THREE.MeshBasicMaterial({color: 0xADD8E6}); 
    ufoCockpitMat[1] = new THREE.MeshLambertMaterial({color: 0xADD8E6});
    ufoCockpitMat[2] = new THREE.MeshPhongMaterial({color: 0xADD8E6});
    ufoCockpitMat[3] = new THREE.MeshToonMaterial({color: 0xADD8E6});

    // base color: dark grey
    ufoBaseMat[0] = new THREE.MeshBasicMaterial({color: 0x5A5A5A});
    ufoBaseMat[1] = new THREE.MeshLambertMaterial({color: 0x5A5A5A});
    ufoBaseMat[2] = new THREE.MeshPhongMaterial({color: 0x5A5A5A});
    ufoBaseMat[3] = new THREE.MeshToonMaterial({color: 0x5A5A5A});

    // light emitting spheres color: orange
    ufoLightsMat[0] = new THREE.MeshBasicMaterial({color: 0xFFD580}); 
    ufoLightsMat[1] = new THREE.MeshLambertMaterial({color: 0xFFD580});
    ufoLightsMat[2] = new THREE.MeshPhongMaterial({color: 0xFFD580});
    ufoLightsMat[3] = new THREE.MeshToonMaterial({color: 0xFFD580});
    
    // ufo body color: light grey
    ufoBodyMat[0] = new THREE.MeshBasicMaterial({color: 0xD3D3D3});
    ufoBodyMat[1] = new THREE.MeshLambertMaterial({color: 0xD3D3D3});
    ufoBodyMat[2] = new THREE.MeshPhongMaterial({color: 0xD3D3D3});
    ufoBodyMat[3] = new THREE.MeshToonMaterial({color: 0xD3D3D3});
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

function createUFO(x, y, z){
    ufo = new THREE.Object3D();

    ufo.position.set(x, y, z);
    
    addUFOBody(ufo);
    addUFOBase(ufo);
    addCockpit(ufo);
    addUFOLights(ufo);

    scene.add(ufo);
    
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

function toggleMoonlight() {
    isMoonLightOn = !isMoonLightOn;

    if (isMoonLightOn) {
        moonLight.intensity = 0.8;
    } else {
        moonLight.intensity = 0;
    }
}

function toggleSpotlight() {
    isSpotLightOn = !isSpotLightOn;

    if (isSpotLightOn) {
        spotLight.intensity = 1;
    } else {
        spotLight.intensity = 0;
    }
}

function togglePointLights() {
    arePointLightsOn = !arePointLightsOn;

    if (arePointLightsOn) {
        for(var i = 0; i < 8; i++){
            pointLights[i].intensity = 1;
        }
    } else {
        for(var i = 0; i < 8; i++){
            pointLights[i].intensity = 0;
        }
    }
}

function createMoonLight() {
    moonLight = new THREE.DirectionalLight(0xffff00, 0.8);
    moonLight.position.copy(moon.position);
    moonLight.target.position.set( 0, 0, 0 );
    scene.add(moonLight);
}

function createAmbientLight() {
    ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
}

function createSpotLight() {
    spotLight = new THREE.SpotLight( 0xffff00, 1, 80, Math.PI / 16, 0.5, 0);
    spotLight.position.set(0, 90, 0);
    scene.add(spotLight);
    scene.add(spotLight.target);
}

function createPointLight(sphere, x, z, count) {
    const light = new THREE.PointLight(0xffa500, 0.75, 100);
    light.position.set(x, -1.5, z);
    sphere.add(light);
    pointLights[count] = light;

}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

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
    createCamera(135, 80, -85);

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

function changeMaterials() {
    if (skyTextureApplied && fieldTextureApplied){
        skydome.material = domeMaterials[currentMaterial];
        groundMesh.material = groundMat[currentMaterial];
    }


    moon.material = moonMaterials[currentMaterial];
    
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

