/**
 *
 * before 2024-07-11, every serial had a `type` property
 *  | {"type":"str","value":"🔵"}
 *
 * after 2024-07-11, every serial has a `$` property instead
 *  | {$:"str","value":"🔵"}
 */
export function autofixSerial_20240711(serial: any): void {
    if (
        // if serial is from pre-2024-07-11 format
        serial != null &&
        typeof serial === 'object' &&
        'type' in serial &&
        !('$' in serial)
    ) {
        // convert to post-2024-07-11 format
        serial['$'] = serial['type']
        delete serial['type']
    }
}
