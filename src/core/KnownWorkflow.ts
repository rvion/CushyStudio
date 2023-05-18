import type { FormDefinition } from './Requirement'
import type { AbsolutePath } from 'src/utils/fs/BrandedPaths'

export type ActionRef = {
    name: string
    file: AbsolutePath
    form: FormDefinition
}
