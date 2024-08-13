/**
 * Capitalize the first letter of a string.
 * 'foo' => 'Foo'
 * 'a' => 'A'
 * '' => ''
 */
export function capitalize(string: string): string {
    if (string === '') return ''
    return string.charAt(0).toUpperCase() + string.slice(1)
}
