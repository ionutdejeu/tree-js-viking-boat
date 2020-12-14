
import { 
    BoxGeometry, 
    MeshPhongMaterial,
    CylinderGeometry,
    MeshBasicMaterial,
    PointLight,
    SpotLight,
    Object3D,
    Mesh,
    Vector3
} from 'three'

let carGeometry = new BoxGeometry(20,10,3);
let carMaterial = new MeshPhongMaterial({ 
  color: 0xB74242, 
  //specular: 0x009900,
  //bumpMap: noiseMap(128, 20, 5),
  shininess: 100, 
  emissive: 0xFF0000,
  emissiveIntensity: 0.6,
});

let carTopGeometry = new BoxGeometry(12,8,5);
let carTopMaterial = new MeshPhongMaterial({ 
  color: 0xB74242, 
  //specular: 0x009900,
  //bumpMap: noiseMap(128, 20, 5),
  shininess: 100, 
  emissive: 0x990000,
  emissiveIntensity: 0.7
});

let wheelGeometry = new CylinderGeometry( 3, 3, 1, 6 );
let wheelMaterial = new MeshBasicMaterial( {color: 0x000000 } );
var KeysPressed  = []
export {KeysPressed};

export class Car extends Object3D{
    
    constructor(camera){
        super();
        this.sceneCamera = camera;
        this.keys = [];
        this.maxspeed= 3;
        this.speed=  0;
        this.angle = 0;
        this.steering=  0;
        this.lightsOn =  true;
      
        let carBody = new Mesh( carGeometry, carMaterial );
        carBody.castShadow = true;
        carBody.receiveShadow = true;
        this.add(carBody);
        
        let carTop = new Mesh( carTopGeometry, carTopMaterial);
        carTop.position.x -= 2;
        carTop.position.z += 3.5;
        carTop.castShadow = true;
        carTop.receiveShadow = true;
        
        this.add(carTop);
        
        this.castShadow = true;
        this.receiveShadow = true;
        
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
  
        this.wheels = Array(4).fill(null);
        this.wheels = this.wheels.map((wheel,i) => {
            wheel = new Mesh( wheelGeometry, wheelMaterial );
            wheel.position.y = ( i < 2 ? 6 : -6 );
            wheel.position.x = ( i % 2 ? 6 : -6 );
            wheel.position.z = -3;
            this.add(wheel);
            return wheel;
        });

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
        
        if ( this.wheels ) {
            this.wheels.forEach((wheel,i)=>{
                wheel.rotation.y += 0.1 * this.speed;
            //wheel.rotation.x = Math.sin(this.angle);// * 0.2;
            });
        }
    
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