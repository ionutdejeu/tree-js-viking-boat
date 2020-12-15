import { Object3D, EquirectangularReflectionMapping,Vector3,EventDispatcher } from 'three'
import {UIEventsNames,UiEventsDispatcher} from '../controls/UIController';
import {GameEvents, GameEventsNames, ResourceTypes} from '../controls/GameController';
import {BoatInstance} from './Boat';
import { preloader } from '../loader'


const PortEvents = new EventDispatcher();

export {PortEvents};
export const ActivatePortSquaredDistance = 22000;

export class IslandPort extends Object3D {
  constructor (targetPos,portName,tradingInfo) {
    super()
    if(targetPos!== undefined){
      this.matrix.setPosition(targetPos);
    }
    this.scale.setScalar(7)
    const islandModel = preloader.get('port');
    this.add(islandModel.scene);
    this.isPortActive = false;
    this.portName = portName !== undefined ? portName : "Random Port Name";
    this.tradingInfo = tradingInfo !== undefined ? tradingInfo : {
      from: ResourceTypes.Bricks,
      to: ResourceTypes.Rock,
      factor:2
    };

    UiEventsDispatcher.dispatchEvent({type:UIEventsNames.PortNewRegister,message:{
      name:this.portName,
      info:this.tradingInfo,
      callback:()=>{this.exchangeResources()}}});
  }
  
  checkProximity(boat_position){
    console.log("proximity check, distance:",boat_position.distanceToSquared(this.position));
    if(boat_position.distanceToSquared(this.position) <= ActivatePortSquaredDistance){
      return true;
    }
    return false;
  }

  exchangeResources(){
    if(BoatInstance != undefined){
      if(this.checkProximity(BoatInstance.position)){
        // check if the player can exchange, if not 
        console.log(this);
        GameEvents.dispatchEvent({type:GameEventsNames.ExchangeResouces,message:this.tradingInfo});
      }
      else{
        alert("To far from port "+this.portName+" to execute trade");
      }
    }
  }

  onEnterPort(){
    this.isPortActive = true;
    // dispatch sound 
    // update ui 
    UiEventsDispatcher.dispatchEvent({type:UIEventsNames.PortEnter,message:{
      name:this.portName,
      info:this.tradingInfo,
      callback:()=>{this.exchangeResources()}}});
  }

  onLeave(){
    this.isPortActive = false;
    UiEventsDispatcher.dispatchEvent({type:UIEventsNames.PortLeave,message:{
      name:this.portName,
      info:this.tradingInfo,
      callback:()=>this.exchangeResources()}});
  }
}
