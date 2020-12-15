import { Object3D, EquirectangularReflectionMapping } from 'three'
import { preloader } from '../loader'

export default class Island extends Object3D {
  constructor (position) {
    super()
    if(position!== undefined){
      this.position.x = position.x;
      this.position.y = position.y;
      this.position.z = position.z;
      
    }
    this.scale.setScalar(10)
    const islandModel = preloader.get('island')

    this.add(islandModel.scene)
  }
}
