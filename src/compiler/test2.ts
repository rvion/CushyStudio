import { sampler, image } from './entry'

sampler.p.seed = Math.round(1000 * Math.random())
await image.get()

for (let i = 0; i < 3; i++) {
    console.log(`test ${i}`)
    sampler.p.seed++
    await image.get()
}
