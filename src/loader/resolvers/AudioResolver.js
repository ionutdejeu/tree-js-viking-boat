import { AudioLoader } from 'three'

export class AudioResolver {
  constructor(renderer) {
    this.type = 'audio'
    this.renderer = renderer
    this.loader = new AudioLoader();
  }

  resolve(item) {
    return new Promise(resolve => {
      this.loader.load(item.url, audio_file => {
        
        resolve(Object.assign(item, { texture }))
      })
    })
  }

  get(item) {
    return item.texture
  }
}
