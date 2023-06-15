import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import Stats from 'stats.js'

//scene setup
const backgroundColor = 0x000000;


var renderCalls = [];
function render () {
  requestAnimationFrame( render );
  renderCalls.forEach((callback)=>{ callback(); });
}
render();


var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 0.1, 800 );
camera.position.set(0,.5,2);

var renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( backgroundColor );//0x );

renderer.toneMapping = THREE.LinearToneMapping;
renderer.toneMappingExposure = Math.pow( 0.94, 5.0 );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

window.addEventListener( 'resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}, false );


document.body.appendChild( renderer.domElement);

function renderScene(){ renderer.render( scene, camera ); }
renderCalls.push(renderScene);


var light = new THREE.PointLight( 0xffffcc, 20, 200 );
light.position.set( 4, 30, -20 );
scene.add( light );
var light = new THREE.PointLight( 0xffffcc, 20, 200 );
light.position.set( -130, 100, -190);
scene.add( light );

var light2 = new THREE.AmbientLight( 0x20202A, 20, 100 );
light2.position.set( 30, -10, 30 );
scene.add( light2 );


//sets up animation mixer, stats, loader, nextButton and pauseButton
var mixers = [];

var mixerMIXER
var mixerDog


const loader = new GLTFLoader();
loader.crossOrigin = false;
var pauseButtonMIXER = document.getElementById('pauseButtonMIXER');
var pauseButtonDog = document.getElementById('pauseButtonDog');
var nextButton = document.getElementById('nextButton');

var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );


/*loads in gltf animations and handles pausing should probably 
split this into multiple functions
*/

loader.load( 'MIXER.gltf', function ( gltf ) {
var object = gltf.scene;
object.position.set(1.9, -1, -1.5);
//console.log(object.rotation)
object.rotation.set(0, -1.5, 0)
var isAnimationPausedMIXER = false
mixerMIXER = new THREE.AnimationMixer(gltf.scene);

  var animationNumber = 0;
  
  pauseButtonMIXER.onclick = function pauseAnimation() {
    isAnimationPausedMIXER = !(isAnimationPausedMIXER)
    mixerMIXER.clipAction(gltf.animations[animationNumber]).paused = isAnimationPausedMIXER
  }
  
  mixerMIXER.update(0)
  mixerMIXER.clipAction(gltf.animations[animationNumber]).play();
  mixers.push(mixerMIXER)
  scene.add( object );
});


loader.load( 'doggo-good/source/animated_dog_shiba_inu (1)/scene.gltf', function ( gltf ) {
  var object = gltf.scene;
  object.position.set(-0, -70, -150);
  
  mixerDog = new THREE.AnimationMixer(gltf.scene);

  var isAnimationPausedDog = false
  var animationNumber = 2;
  
  pauseButtonDog.onclick = function pauseAnimation() {
    isAnimationPausedDog = !(isAnimationPausedDog)
    mixerDog.clipAction(gltf.animations[animationNumber]).paused = isAnimationPausedDog
  }
  
  nextButton.onclick = function nextAnimation() {
    if(animationNumber == 3){
      animationNumber = 1;
    }else{
      animationNumber++;
    }
    mixerDog.stopAllAction() 
    isAnimationPausedDog = false
    mixerDog.clipAction(gltf.animations[animationNumber]).play();
    
  }
  mixerDog.update(0)
  mixerDog.clipAction(gltf.animations[animationNumber]).play();
  scene.add( object );
  mixers.push(mixerDog)
});


//Continuous function to handle the playback clock
var clock = new THREE.Clock();
function animate(){
  stats.begin();
  requestAnimationFrame(animate);
  var delta = clock.getDelta();
  for (let i = 0; i < mixers.length; i++){
      
      mixers[i].update(delta);
      
  } 

  renderer.render(scene, camera);
  stats.end();
  
}
animate()