import type { BaseField } from './BaseField'
import type { Entity } from './Entity'

export interface Instanciable<T extends BaseField = BaseField> {
    $Type: T['$Type']
    $Config: T['$Config']
    $Serial: T['$Serial']
    $Value: T['$Value']
    $Field: T['$Field']

    type: T['type']
    config: T['$Config']

    instanciate(
        //
        entity: Entity<any>,
        parent: BaseField | null,
        serial: any | null,
    ): T
}
