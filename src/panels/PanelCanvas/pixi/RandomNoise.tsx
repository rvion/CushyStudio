// import { PixiComponent } from '@pixi/react'
// import * as PIXI from 'pixi.js'
// import { Container } from 'pixi.js'
// import ParticleGenerator from 'react-confetti/dist/types/ParticleGenerator'

// const img = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png'

// type EmmiterConfig = {
//     alpha: { start: number; end: number }
//     scale: { start: number; end: number }
//     color: { start: string; end: string }
//     speed: { start: number; end: number }
//     startRotation: { min: number; max: number }
//     rotationSpeed: { min: number; max: number }
//     lifetime: { min: number; max: number }
//     blendMode: string
//     frequency: number
//     emitterLifetime: number
//     maxParticles: number
//     pos: { x: number; y: number }
//     addAtBack: boolean
//     spawnType: string
//     spawnRect: { x: number; y: number; w: number; h: number }
// }
// const emitterConfig = {
//     alpha: {
//         start: 0.5,
//         end: 0.5,
//     },
//     scale: {
//         start: 1,
//         end: 1,
//     },
//     color: {
//         start: 'ffffff',
//         end: 'ffffff',
//     },
//     speed: {
//         start: 3000,
//         end: 3000,
//     },
//     startRotation: {
//         min: 65,
//         max: 65,
//     },
//     rotationSpeed: {
//         min: 0,
//         max: 0,
//     },
//     lifetime: {
//         min: 0.81,
//         max: 0.81,
//     },
//     blendMode: 'normal',
//     frequency: 0.004,
//     emitterLifetime: 0,
//     maxParticles: 1000,
//     pos: {
//         x: 0,
//         y: 0,
//     },
//     addAtBack: false,
//     spawnType: 'rect',
//     spawnRect: {
//         x: -600,
//         y: -460,
//         w: 900,
//         h: 20,
//     },
// }

// // ParticleGenerator
// export const Emitter = PixiComponent<
//     {
//         image: any
//         emitterConfig?: any
//     },
//     Container
// >('Emitter', {
//     create() {
//         return new Container()
//     },
//     applyProps(instance, oldProps, newProps) {
//         const { image, config = emitterConfig } = newProps

//         if (!this._emitter) {
//             this._emitter = new PIXI.particlesEmitter(instance, [PIXI.Texture.from(image)], config)

//             let elapsed = Date.now()

//             const t = () => {
//                 this._emitter.raf = requestAnimationFrame(t)
//                 const now = Date.now()

//                 this._emitter.update((now - elapsed) * 0.001)

//                 elapsed = now
//             }

//             this._emitter.emit = true
//             t()
//         }
//     },
//     willUnmount() {
//         if (this._emitter) {
//             this._emitter.emit = false
//             cancelAnimationFrame(this._emitter.raf)
//         }
//     },
// })
