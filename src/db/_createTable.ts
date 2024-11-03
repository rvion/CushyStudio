export const _createTable = (tableName: string, fields: string[]): string => {
   return `--sql
        create table ${tableName} (
            id string primary key not null default (hex(randomblob(16))),
            createdAt integer not null default now,
            updatedAt integer not null default now,
            ${fields.join(',\n')}
        );`
}

export type TableFields = {
   id: string
   createdAt: number
   updatedAt: number
}
// export const createOutputTable = (tableName: string, fields: string[]) => {
//     return `--sql
//         create table ${tableName} (
//             id string primary key default (hex(randomblob(16))),
//             createdAt integer not null default now,
//             updatedAt integer not null default now,
//             star: number,
//             width: number,
//             height: number,

//             ${fields.join(',\n')}
//         );`
// }
