/**
 * we used to have some kind of root document specific serial.
 * it's now gone
 */
export function autofixSerial_20240703(serial: object): object {
    if ('type' in serial && serial?.type === 'FormSerial') return (serial as any).root
    return serial
}
