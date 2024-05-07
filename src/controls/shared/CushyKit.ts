/**
 * set of shared configuration used by cushy kit;
 * to be injected via context
 * can be configured by project
 */
export interface CushyKit {
    clickAndSlideMultiplicator?: number
}

/** default simple example configuration for external project
 * using cushy kit
 */
export const defaultCushyKitOptions: CushyKit = {
    clickAndSlideMultiplicator: 1,
}
