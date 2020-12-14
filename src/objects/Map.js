import { 
    Texture,
    RepeatWrapping,
    PlaneGeometry,
    MeshPhongMaterial,
    Mesh,
    SmoothShading,
} from 'three'

export class Map {

    
    constructor(){
        this.noise = this.noiseMap(256, 20, 30);
        this.mesh = this.snowyGround(this.noise);
    }

    snowyGround(noise){
        let geometry = new PlaneGeometry( 2000, 2000, 40, 45 );
        for (let i = 0; i < geometry.vertices.length; i++) {
            geometry.vertices[i].x += (Math.cos( i * i )+1/2) * 2; 
            geometry.vertices[i].y += (Math.cos(i)+1/2) * 2; 
            geometry.vertices[i].z = (Math.sin(i * i * i)+1/2) * -4;
        }
        geometry.verticesNeedUpdate = true;
        geometry.normalsNeedUpdate = true;
        geometry.computeFaceNormals(); 

        let material = new MeshPhongMaterial({ 
            color: 0xFFFFFF, 
            shininess: 80,
            bumpMap: noise,
            bumpScale: 0.15,
            //emissive: 0xEBF7FD,
            //emissiveIntensity: 0.05,
            shading: SmoothShading
        }); 

        let plane = new Mesh( geometry, material );
        plane.receiveShadow = true;
        plane.position.z = -5;

        return plane;
    }

    noiseMap(size = 256, intensity = 60, repeat = 0){
        var canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            width = canvas.width = size,
            height = canvas.height = size;
      
        var imageData = ctx.getImageData(0, 0, width, height),
            pixels = imageData.data,
            n = pixels.length,
            i = 0;
      
        while (i < n) {
          pixels[i++] = pixels[i++] = pixels[i++] = Math.sin( i * i * i + (i/n) * Math.PI) * intensity; 
          pixels[i++] = 255;
        }
        ctx.putImageData(imageData, 0, 0);
      
        let texture = new Texture(canvas);
        if ( repeat ) {
          texture.wrapS = texture.wrapT = RepeatWrapping;
          texture.repeat.set(repeat, repeat);
        }
        texture.needsUpdate = true;
      
        return texture;
      }
}