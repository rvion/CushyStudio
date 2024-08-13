import { makeAutoObservable } from 'mobx'

export class Seeder {
    constructor() {
        makeAutoObservable(this)
    }
    count: number = 0
}

let globablSeeder: Maybe<Seeder> = null

export function getGlobalSeeder(): Seeder {
    globablSeeder ??= new Seeder()
    return globablSeeder
}
