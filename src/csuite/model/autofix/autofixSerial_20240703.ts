export function autofixSerial_20240703(serial: any): any {
    // RECOVER FROM EntitySerial
    if (serial?.type === 'FormSerial') {
        const prev: any = serial
        const next: any = prev.root

        return next
    }

    return serial
}
