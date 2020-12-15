import {
  EffectComposer,
  BloomEffect,
  SMAAEffect,
  RenderPass,
  EffectPass
} from 'postprocessing'
import { 
  WebGLRenderer, 
  Scene, 
  PerspectiveCamera, 
  HemisphereLight, 
  AmbientLight,
  PointLight,
  Fog,
  Vector3,
  LinearToneMapping,
  PCFSoftShadowMap } from 'three'
import { preloader } from './loader'
import { TextureResolver } from './loader/resolvers/TextureResolver'
import { ImageResolver } from './loader/resolvers/ImageResolver'
import { GLTFResolver } from './loader/resolvers/GLTFResolver'
import {Map} from './objects/Map';
import {Car} from './objects/Car';
import {Boat} from './objects/Boat';
import { Waves } from './objects/Waves';
import Island from './objects/Island'
import {IslandPort} from './objects/Port'

import {UIControllerInstance} from './controls/UIController';
import { ResourceTypes } from './controls/GameController'

/* Custom settings */
const SETTINGS = {
  useComposer: true,
  bla:123,
  oper:"test"
}

let composer
let stats
let waves
let boat

/* Init renderer and canvas */
const container = document.body
const renderer = new WebGLRenderer({antialias: true, alpha: true});
container.style.overflow = 'hidden'
container.style.margin = 0
container.appendChild(renderer.domElement)
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0xffffff );

renderer.toneMapping = LinearToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;

/* Main scene and camera */
const scene = new Scene();
scene.fog = new Fog(0xffffff, 20, 600);
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 10,600);
camera.position.z = 90;


/* Lights */
let hemiLight = new HemisphereLight( 0xEBF7FD, 0xEBF7FD, 0.2 );
hemiLight.position.set( 0, 20, 20 );
const ambient = new AmbientLight(0xffdb26,1.5 ); // soft white light
scene.add( ambient );
scene.add( hemiLight );

/* Map */
//let m = new Map();
//scene.add(m.mesh);

const welcome_msg  = `
  Welcome to the sea of vikings  
  Find near by ports and start trading goods in order to win the game. 
  To win this game you must trade 100 wood, 100 sheep, 100 rock, 100 hay stack. 
`

//let car  = new Car(camera);
//scene.add(car);


/* Various event listeners */
window.addEventListener('resize', onResize)

/* Preloader */
preloader.init(new ImageResolver(), new GLTFResolver(), new TextureResolver())
preloader.load([
  { id: 'searchImage', type: 'image', url: SMAAEffect.searchImageDataURL },
  { id: 'areaImage', type: 'image', url: SMAAEffect.areaImageDataURL },
  { id: 'waterTexture', type: 'texture', url: 'assets/textures/water_texture.png' },
  { id: 'boat', type: 'gltf', url: 'assets/models/low_poly_boat.glb' },
  { id: 'island', type: 'gltf', url: 'assets/models/low_polly_island.glb' },
  { id: 'port', type: 'gltf', url: 'assets/models/low_polly_island_port.glb' },


]).then(() => {
  initPostProcessing()
  onResize()
  animate()
  //alert(welcome_msg);
})


   
const Stats = require('stats.js')
stats = new Stats()
stats.showPanel(0)
container.appendChild(stats.domElement)
stats.domElement.style.position = 'absolute'
stats.domElement.style.top = 0
stats.domElement.style.left = 0


/* -------------------------------------------------------------------------------- */
function initPostProcessing () {
  composer = new EffectComposer(renderer);
  const bloomEffect = new BloomEffect()
  const smaaEffect = new SMAAEffect(preloader.get('searchImage'), preloader.get('areaImage'))
  const effectPass = new EffectPass(camera, smaaEffect, bloomEffect)
  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)
  composer.addPass(effectPass)
  effectPass.renderToScreen = true
  waves = new Waves(scene,{});
  boat = new Boat(camera);
  scene.add(boat);

  var i = new Island(new Vector3(100,100,10));
  scene.add(i);
  var portIsl = new IslandPort(new Vector3(-100,-100,100),"Prort North",{
    from:ResourceTypes.Bricks,
    to:ResourceTypes.Sheep,
    factor:3
  });
  scene.add(portIsl);
  var portIsl = new IslandPort(new Vector3(-800,-800,100),"Port South",{
    from:ResourceTypes.Wood,
    to:ResourceTypes.Grass,
    factor:2
  });
  var portIsl = new IslandPort(new Vector3(0,900,100),"Port East",{
    from:ResourceTypes.Wood,
    to:ResourceTypes.Grass,
    factor:2
  });
  scene.add(portIsl);

  console.log(scene);
}

/**
  Resize canvas
*/
function onResize () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  composer.setSize(window.innerWidth, window.innerHeight)
}

/**
  RAF
*/
function animate() {
  window.requestAnimationFrame(animate);
  render();
}


/**
 * Animate the
 */

/**
  Render loop
*/


function render () {
  if (DEVELOPMENT) {
    stats.begin()
  }
  boat.update();
  //car.update();
  
  renderer.toneMappingExposure = Math.pow( 0.91, 5.0 );
  waves.render();
  if (SETTINGS.useComposer) {
    composer.render()
  } else {
    renderer.clear()
    renderer.render(scene, camera)
  }
  
  if (DEVELOPMENT) {
    stats.end()
  }
}


