
import { 
    Texture,
    RepeatWrapping,
    PlaneGeometry,
    MeshPhongMaterial,
    Mesh,
    SmoothShading,
    Object3D,
    DoubleSide,
    FrontSide,
    PlaneBufferGeometry,
    MeshLambertMaterial,
    PointLight,
    Color,
    UVMapping
} from 'three'
import * as SN from 'simplex-noise';
import * as chroma from 'chroma-js';
import { preloader } from '../loader'

export const coeficients = {
    xyCoef: 120,
    zCoef: 20,
    speed:1.18
}

export class Waves{
    constructor(scene,conf){
        this.conf= {
            fov: 75,
            cameraZ: 75,
            xyCoef: 120,
            zCoef: 20,
            speed: 1.18,
            waveLength:150,
            waveHeight:15.31,
            noiseStrength:0,
            lightIntensity: 0.9,
            ambientColor: 0x000000,
            light1Color: 0x0E09DC,
            light2Color: 0x1CD1E1,
            light3Color: 0x18C02C,
            light4Color: 0xee3bcf,
            ...conf
        };
        this.scene = scene;
        this.createPlane(scene,5000,5000);
    }

    createPlane(scene,planeWidht,planeHeight){
        this.simplex = new SN();
        const wTexture = preloader.get('waterTexture');
        wTexture.wrapS = wTexture.wrapT = RepeatWrapping
        wTexture.repeat.set(10,10);
        wTexture.mapping = UVMapping
        this.mat = new MeshLambertMaterial({ side:FrontSide,color: 0xffffff,map:wTexture , emissive:0xffffff,emissiveIntensity:0.1});
        this.geo = new PlaneBufferGeometry(planeWidht,planeWidht,planeWidht/50,planeHeight/50);
        this.plane = new Mesh(this.geo,this.mat);
        
        scene.add(this.plane);
        
        this.plane.position.z = -5;
        
    }

    

    render(){
        this.animatePlane();
    }

    animatePlane() {
        let gArray = this.plane.geometry.attributes.position.array;
        const time = Date.now() * 0.002 * this.conf.speed;
        //for (let i = 0; i < gArray.length; i += 3) {
        //  gArray[i + 2] = this.simplex.noise4D(gArray[i] / this.conf.xyCoef,
        //    gArray[i + 1] / this.conf.xyCoef, time, time) * this.conf.zCoef;
        //}
        //console.log(gArray);

        for (let i = 0; i < gArray.length; i+=3) {   
            gArray[i+2] = Math.sin(time+ 
                gArray[i] / this.conf.xyCoef + 
                gArray[i + 1] / this.conf.xyCoef) *this.conf.zCoef;
        }
        this.plane.geometry.attributes.position.needsUpdate = true;
        // plane.geometry.computeBoundingSphere();
    }
}