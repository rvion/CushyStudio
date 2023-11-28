import { createTable } from './createTable'

// ------------------------------------------------------------------------------------
export const migrations: { id: string; name: string; up: string | string[] }[] = [
    {
        id: '1b5eb947',
        name: 'create users table',
        up: `--sql
            create table users (
                id           integer primary key,
                firstName    text    not null,
                lastName     text    not null,
                email        text    not null unique,
                passwordHash text    not null
            );`,
    },
    {
        id: 'UA2XmUXnK9',
        name: 'create graph table',
        up: createTable('graph', [`comfyPromptJSON json`]),
    },
    {
        id: 'UA2XmUXnK9',
        name: 'create graph table',
        up: [
            //
            createTable('draft', [
                //
                `title string`,
                `appPath string not null`,
                `appParams json not null`,
                `graphID string not null`,
            ]),
        ],
    },
]
