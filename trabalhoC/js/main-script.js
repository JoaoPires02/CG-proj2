//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var groundGeo, groundMat;

var skydome;

var scene, terrainScene;

var camera, renderer, terrainRenderer;

var fieldTexture, skydomeTexture;

const materials = [];


/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxesHelper(10));
    scene.background = new THREE.Color("rgb(200, 200, 200)");

    materials[0] = new THREE.MeshLambertMaterial( {color: 0x00ff00} );
    materials[1] = new THREE.MeshPhongMaterial( {color: 0x00ff00} );
    materials[2] = new THREE.MeshToonMaterial( {color: 0x00ff00} );

    createGround();
    createSkydome();
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    

    

}

function createGround() {
    groundGeo = new THREE.PlaneGeometry(200, 200, 100, 100);

    let disMap = new THREE.TextureLoader()
        .load('https://web.tecnico.ulisboa.pt/~ist199090/heightmap.jpg');

    disMap.wrapS = disMap.wrapT = THREE.RepeatWrapping;
    disMap.repeat.set(1, 1);

    groundMat = new THREE.MeshStandardMaterial ({
        color: 0xffffff,
        wireframe: false,
        displacementMap: disMap,
        displacementScale: 50,
        roughness: 1,
        metalness: 0,
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
    createCamera(100, 100, 100);

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
        case 49: //LEFT ARROW
            applyFieldTexture();
            render();
            console.log("111111");
            break;
        case 50:
            applySkydomeTexture();
            render();
            console.log("222222");
            break;

    }

}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

}

