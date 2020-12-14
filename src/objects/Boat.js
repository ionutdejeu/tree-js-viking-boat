
import { 
  BoxGeometry, 
  MeshPhongMaterial,
  CylinderGeometry,
  MeshBasicMaterial,
  PointLight,
  SpotLight,
  Object3D,
  Mesh,
  Color,
  Vector3
} from 'three'
import { preloader } from '../loader'

let boatHulMaterial = new MeshPhongMaterial({ 
  color: 0xB74242, 
  shininess: 100, 
  emissive: 0x990000,
  emissiveIntensity: 0.7
});

let boatSailMaterial = new MeshPhongMaterial({ 
  color: 0xffffff, 
  shininess: 100, 
  emissive: 0x990000,
  emissiveIntensity: 0.7
});

var KeysPressed  = []
export {KeysPressed};

export default class Boat extends Object3D {
  constructor(camera){
    super();
    this.sceneCamera = camera;
    this.maxspeed= 3;
    this.speed=  0;
    this.angle = 0;
    this.steering=  0;
    this.lightsOn =  true;
    this.scale.setScalar(4);
    const boat = preloader.get('boat');
    console.log(boat);
    
    let hulIndex = [0,1];
    let sailIndex = [2,3];

    
    for(let i = 0;i<hulIndex;i++){
      boat.scene.children[hulIndex[i]].material= boatHulMaterial;
    }
    for(let i = 0;i<sailIndex;i++){
      boat.scene.children[sailIndex[i]].material= boatSailMaterial;
    }

    this.add(boat.scene)
  
    /*////////////////////////////////////////*/
    
    var light = new PointLight( 0xFFFFFF, 1, 0 );
    light.position.z = 25;
    light.position.x = 5;
  
    light.castShadow = true;
    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = 512;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 50;
    light.shadow.bias = 0.1;
    light.shadow.radius = 5;
  
    light.power = 3;
    
    this.add(light);
    

    /*////////////////////////////////////////*/

    this.lights = Array(2).fill(null);
    this.lights = this.lights.map((light,i) => {
    
        light = new SpotLight( 0xffffff );
        light.position.x = 11;
        light.position.y = ( i < 1 ? -3 : 3 ); //;
        light.position.z = -3;
        light.angle = Math.PI / 3.5;

        light.castShadow = true;

        light.shadow.mapSize.width = 512;
        light.shadow.mapSize.height = 512;

        light.shadow.camera.near = 1;
        light.shadow.camera.far = 400;
        light.shadow.camera.fov = 40;
        
        light.target.position.y = ( i < 1 ? -0.5 : 0.5 );
        light.target.position.x = 35;// = Math.PI/2;
        
        this.add( light.target );
        this.add( light );
        
        return light;
    });
    
    document.body.addEventListener("keydown",function(e) {
        KeysPressed[e.keyCode] = true;
        e.preventDefault();
      });
    document.body.addEventListener("keyup",function(e) {
        KeysPressed[e.keyCode] = false;
        e.preventDefault();
      });
}

keyDown(e){
    this.keys[e.code] = true;
    console.log(KeysPressed);
    e.preventDefault();
}

keyUp(e){
     this.keys[e.code] = false;
     e.preventDefault();
}
update(){
    var prev = {
        x: this.position.x,
        y: this.position.y,
        rot: this.rotation.z
    }
        
    var steerPower = 0.0006;// / (this.speed + 1);

    // steering
    if ( KeysPressed[39] || KeysPressed[68] ) {
    this.steering += ( this.steering > -.01) ? steerPower : 0;
    // left
    } else if ( KeysPressed[37] || KeysPressed[65] ) {
        this.steering -= ( this.steering < .01) ? steerPower : 0;
    } else {
        this.steering *= 0.92;
    }

    // gas
    if ( KeysPressed[38] || KeysPressed[87] ) {
        this.speed += (this.speed < this.maxspeed) ? 0.04 : 0;
    } else if ( KeysPressed[40] || KeysPressed[83] ) { // reverse
        this.speed -= (this.speed > -this.maxspeed/2 )? 0.04 : 0;
    } else {
        this.speed *= 0.96;
    }
    
    this.speed *= 1 - Math.abs(this.steering/2);
    
    this.angle += this.steering * this.speed;
     

    var xdir = this.speed * Math.cos(this.angle);
    var ydir = this.speed * Math.sin(this.angle);

    this.position.x += xdir;
    this.position.y += -ydir;
    this.rotation.z = -this.angle;
    
    
    if ( this.lights ) {
        this.lights.forEach((light,i) => {
            
            light.rotation.z = this.angle;  
            light.target.position.clone(this.position);
            light.target.position.x += 10;
            light.target.position.y += ( i < 1 ? -0.5 : 0.5 );
            light.target.updateMatrixWorld();
        });
        
        if ( KeysPressed[76] ) {
    
            KeysPressed[76] = false;
            this.lightsOn = !this.lightsOn;
            this.lights = this.lightsOn;
        
        }
    }
    

    this.position.x = ( this.position.x > 990 || this.position.x < -990 ? prev.x : this.position.x );
    this.position.y = ( this.position.y > 990 || this.position.y < -990 ? prev.y : this.position.y );

    this.sceneCamera.position.x += ( this.position.x - this.sceneCamera.position.x ) * 0.1; //0.02; // (camera.position.x - this.position.x)/50;
    this.sceneCamera.position.y = ( this.position.y - 40 - ( this.speed * 10 ) );//(( this.position.y -camera.position.y ) * 0.01 ) +; //0.02; //(camera.position.y - thiposition.y)/50;
    
    //camera.position.z = ( 40 + (Math.cos(this.speed)+1/2) * 40 );

    this.sceneCamera.lookAt(
        new Vector3(
            this.position.x,// + (xdir * 4), 
            this.position.y,// - (ydir * 4), 
            0//Math.sin( (this.speed / this.maxspeed) * Math.PI*2 )+1/2 * 80)
        )
    );
}
}
