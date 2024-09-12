import type { Field } from './Field'
import type { Repository } from './Repository'

export interface Instanciable<T extends Field = Field> {
    $Type: T['$Type']
    $Config: T['$Config']
    $Serial: T['$Serial']
    $Value: T['$Value']
    $Field: T['$Field']
    $Unchecked: T['$Unchecked']

    type: T['type']
    config: T['$Config']

    instanciate(
        //
        repo: Repository,
        root: Field<any> | null,
        parent: Field | null,
        initialMountKey: string,
        serial: any | null,
    ): T
}
