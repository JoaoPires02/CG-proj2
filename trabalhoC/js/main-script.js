//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var groundGeo;

var skydome, moon;

var scene;

var camera, renderer;

var fieldTexture, skydomeTexture;

const groundMat = [];

const materials = [];

const moonMaterials = [];

var moonLight;

var isMoonLightOn = true;


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
    createTree(30, 40, 60, -(25 * Math.PI) / 180);

}

function createMoon() {
    var moonGeo = new THREE.SphereGeometry(10, 32, 32);
    moonMaterials[0] = new THREE.MeshStandardMaterial({
        color: 0xffff00, 
        emissive: 0xffff00, 
        emissiveIntensity: 1, 
        roughness: 0,
        metalness: 0
    });

    moonMaterials[1] = new THREE.MeshBasicMaterial({
        color: 0xffff00, 
    });

    moon = new THREE.Mesh(moonGeo, moonMaterials[0]);
    moon.position.set(-60, 90, 0); 
    scene.add(moon);
}

function toggleMoonlight() {
    isMoonLightOn = !isMoonLightOn;

    if (isMoonLightOn) {
        moonLight.intensity = 1;
    } else {
        moonLight.intensity = 0;
    }
}

function createGround() {
    groundGeo = new THREE.PlaneGeometry(200, 200, 100, 100);

    let disMap = new THREE.TextureLoader()
        .load('https://web.tecnico.ulisboa.pt/~ist199090/alentejo.png');

    disMap.wrapS = disMap.wrapT = THREE.RepeatWrapping;
    disMap.repeat.set(1, 1);

    groundMat[0] = new THREE.MeshStandardMaterial ({
        color: 0xffffff,
        wireframe: false,
        displacementMap: disMap,
        displacementScale: 100,
        roughness: 1,
        metalness: 0,
    });

    groundMesh = new THREE.Mesh(groundGeo, groundMat[0]);
    scene.add(groundMesh);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -0.5;
}

function generateFieldTexture() {
    var canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
  
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#C8E6C9'; // Fundo verde claro
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    var colors = ['#FFFFFF', '#FFFF00', '#BA68C8', '#B3E5FC']; // Cores dos círculos
    var radius = 2; // Raio dos círculos
  
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
    var material = new THREE.MeshBasicMaterial({ color: '#0d0a3a', side: THREE.BackSide });
    var geometry = new THREE.SphereGeometry(145, 195, 195);
    skydome = new THREE.Mesh(geometry, material);
    scene.add(skydome);
}

function applySkydomeTexture() {
    skydomeTexture = generateSkydomeTexture();
    var material = new THREE.MeshStandardMaterial({ map: skydomeTexture, side: THREE.BackSide });
    skydome.material = material;
    skydome.needsUpdate = true;
}

function createTree(x, y, z, theta) {
    'use strict'

    var tree = new THREE.Object3D();

    addLog(tree, theta);

    scene.add(tree);
    tree.position.set(x, y, z);

}

function addLog(obj, theta) {
    'use strict'
    
    var material = new THREE.MeshBasicMaterial({ color: 0x8b4513, wireframe: true });
    var geometry1 = new THREE.CylinderGeometry(2, 2, 8, 8);
    var mesh1 = new THREE.Mesh(geometry1, material);
    mesh1.rotation.y = (25 * Math.PI) / 180;

    var geometry2 = new THREE.CylinderGeometry(2, 2, 8, 6);
    var mesh2 = new THREE.Mesh(geometry2, material);
    mesh2.position.set(0, 2, -1);
    mesh2.rotation.y = theta;

    obj.add(mesh1);
    obj.add(mesh2);
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
    moonLight = new THREE.DirectionalLight(0xffff00, 1);
    moonLight.position.copy(moon.position);
    scene.add(moonLight);
}

function createAmbientLight() {
    ambientLight = new THREE.AmbientLight(0xffff00, 0.2);
    scene.add(ambientLight);
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
    createCamera(125, 100, 125);

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
        case 49: // Generate and apply new field texture
            applyFieldTexture();
            render();
            break;
        case 50: // Generate and apply new field texture
            applySkydomeTexture();
            render();
            break;
        case 68: // Turn moon light on and off
            toggleMoonlight();
            render();
            break;

    }

}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

}

