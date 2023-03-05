import { KSampler_3, SaveImage_9 } from './entry'

// console.log(demo.toJSON())

await SaveImage_9.get()
await new Promise((yes) => setTimeout(yes, 1000))

for (let i = 0; i < 3; i++) {
    console.log(`test ${i}`)
    console.log(KSampler_3.p.seed)
    KSampler_3.p.seed++
    console.log(KSampler_3.p.seed)
    const json = SaveImage_9.comfy.toJSON()['3']
    console.log(json)
    await SaveImage_9.get()
    await new Promise((yes) => setTimeout(yes, 1000))
}
