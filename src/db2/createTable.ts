export const createTable = (tableName: string, fields: string[]) => {
    return `--sql
        create table ${tableName} (
            id string primary key default (hex(randomblob(16))),
            created_at integer not null default now,
            updated_at integer not null default now,
            ${fields.join(',\n')}
        );`
}

export const createOutputTable = (tableName: string, fields: string[]) => {
    return `--sql
        create table ${tableName} (
            id string primary key default (hex(randomblob(16))),
            created_at integer not null default now,
            updated_at integer not null default now,
            star: number,
            width: number,
            height: number,

            ${fields.join(',\n')}
        );`
}
