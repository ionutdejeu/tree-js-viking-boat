import { Object3D, EquirectangularReflectionMapping } from 'three'
import { preloader } from '../loader'

export default class Island extends Object3D {
  constructor () {
    super()

    this.scale.setScalar(10)
    this.rotation.x = 90;
    const islandModel = preloader.get('island')

    this.add(islandModel.scene)
  }
}
