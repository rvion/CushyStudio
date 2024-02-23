import { resolve } from 'pathe'

import { JsonFile } from '../core/JsonFile'
import { asAbsolutePath } from '../utils/fs/pathUtils'

export type TsConfigCustom = {
    include: string[]
    exclude: string[]
}

export const mkTypescriptConfig = (): JsonFile<TsConfigCustom> => {
    return new JsonFile<TsConfigCustom>({
        path: asAbsolutePath(resolve('tsconfig.custom.json')),
        maxLevel: 1,
        init: () => ({
            // this file is created by CushyStudio itself
            // when it runs for the first time
            // it will allow to only see errors in cards you either
            // MAINTAIN or are CURRENTLY WORKING ON
            include: [...mandatoryTSConfigIncludes],
            exclude: [],
        }),
    })
}

export const mandatoryTSConfigIncludes: string[] = [
    //
    'src',
    'library',
    'schema/global.d.ts',
]
