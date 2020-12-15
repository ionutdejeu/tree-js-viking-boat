
import { 
    EventDispatcher
  } from 'three'

  const ResourceTypes= {
    Wood:"Wood",
    Grass:"Grass",
    Bricks:"Bricks",
    Rock:"Rock",
    Sheep:"Sheep"
  }

  const BoatStats = {
    MaxCargo:100,
    MaxSpeed:50,
  }

  export {ResourceTypes};
  export {BoatStats};

  const GameEvents = new EventDispatcher();
  export const GameEventsNames = {
      WinGame:"WinGame",
      Sartgame:"StartGame",
      ExchangeResouces:"PortExchangeResources"
  }
  export {GameEvents};

  export class GameController { 
      constructor(){

      }

      checkWinCondition(){
          
      }
  }