import { 
    EventDispatcher
} from 'three'
import {ResourceTypes,BoatStats} from './GameController';

const UiEventsDispatcher = new EventDispatcher();
export const UIEventsNames = {
    PortChanged:"PortUIChanged",
    PortEnter:"PortEnter",
    PortLeave:"PortLeave",
    BoatStatsChanged:"BoatStatsChanged",
    PortNewRegister:"RegisterNewPort",
    BoatCargoChanged:"BoatCargoChanged"
}
export {UiEventsDispatcher};

let boatCargo = {};
let boatStats = {}

let boatCargoFolder,portFolder,menuPannel,boatStatsFolder;
let portFolders = {};
class UIController { 
    constructor(){
        const guigui = require('guigui')
        menuPannel = guigui.addPanel('Menu')

        // creates folder in guigui default panel
        boatCargoFolder = menuPannel.addFolder('Cargo');
        boatStatsFolder = menuPannel.addFolder('Stats');
        
        UiEventsDispatcher.addEventListener(UIEventsNames.PortEnter,(info)=>{this.onPortEnterUiUpdate(info)});
        UiEventsDispatcher.addEventListener(UIEventsNames.PortLeave,(info)=>{this.onPortLeaveUiUpdate(info)});
        UiEventsDispatcher.addEventListener(UIEventsNames.BoatStatsChanged,(info)=>{this.onBoatStatsChanged(info)});
        UiEventsDispatcher.addEventListener(UIEventsNames.BoatCargoChanged,(info)=>{this.onBoatCargoChanged(info)});
        UiEventsDispatcher.addEventListener(UIEventsNames.PortNewRegister,(info)=>{this.onRegisterPortUI(info)});
        
        for (const [key, value] of Object.entries(ResourceTypes)) {
            boatCargo[value] = 0;
            boatCargoFolder.add(boatCargo,value,{label:value,watch:true});
        }

        for (const [key, value] of Object.entries(BoatStats)) {
            boatStats[key] = BoatStats[key];
            boatStatsFolder.add(boatStats,key,{label:key,watch:true});
        }
    }

    onBoatCargoChanged(cargoInfo){
        let msg = cargoInfo.message;
        for (const [key, value] of Object.entries(ResourceTypes)) {
           if(msg[value]!=undefined){
                boatCargo[value] = msg[value];
           }
        }
        console.log(boatCargo);

    }

    onBoatStatsChanged(statsInfo){
        console.log(statsInfo);
        let msg = statsInfo.message;
        for (const [key, value] of Object.entries(BoatStats)) {
            if(msg[key]!=undefined){
                 boatStats[key] = msg[key];
            }
        }
    }

    onRegisterPortUI(portInfo){
        let msg = portInfo.message;
        let newPort = menuPannel.addFolder(`Port: ${msg.name}`);
        let buyAction = "Buy 1x"+msg.info.to+ " from "+msg.info.factor+"x"+msg.info.from;
        newPort.add(portInfo.message,'callback',{label:buyAction,watch:false});   
        portFolders[msg.name] = newPort;
    }

    onPortEnterUiUpdate(portInfo){
        let msg = portInfo.message;
        portFolder.add(portInfo.message,'name',{label:"Name",watch:false});
        let buyAction = "Buy 1x"+msg.info.to+ " from "+msg.info.factor+"x"+msg.info.from;
        portFolder.add(portInfo.message,'callback',{label:buyAction,watch:false});   
    }
    onPortLeaveUiUpdate(portInfo){
        portFolder = menuPannel.addFolder('Port');
    }
}

const UIControllerInstance = new UIController();
export {UIControllerInstance}


