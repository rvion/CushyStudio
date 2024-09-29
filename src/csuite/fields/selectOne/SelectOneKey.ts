// 💬 2024-09-17 rvion:
// | why not allow more than just strings for the key ?
// | solve the nullability problem, and much more.

export type SelectKey = string | null | boolean | number

export function convertSelectKeyToReactKey(key: SelectKey): string {
    return key === null //
        ? 'null'
        : key.toString()
}
