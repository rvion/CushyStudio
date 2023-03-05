import { sampler, image } from './entry'

await image.get()

for (let i = 0; i < 3; i++) {
    console.log(`test ${i}`)
    sampler.p.seed++
    await image.get()
}
