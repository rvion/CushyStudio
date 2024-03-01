import { _createTable } from './_createTable'

export const _checkAllMigrationsHaveDifferentIds = () => {
    // check all migrations have different IDS
    const ids = new Set()
    for (const migration of migrations) {
        if (ids.has(migration.id)) throw new Error(`duplicate migration id: ${migration.id}`)
        ids.add(migration.id)
    }
}

// ------------------------------------------------------------------------------------
export const migrations: {
    id: string
    name: string
    up: string | string[] // | (() => void)
}[] = [
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
        up: _createTable('graph', [`comfyPromptJSON json not null`]),
    },
    {
        id: 'lRtCJxvumg',
        name: 'create misc tables',
        up: [
            _createTable('draft', [
                //
                `title          text`,
                `appPath        text                           not null`,
                `appParams      json                           not null`,
                // `graphID        text                           not null`,
            ]),
            _createTable('project', [
                //
                `name           text`,
                `rootGraphID    text    references graph(id)   not null`,
                `currentApp     text`,
                `currentDraftID text    references draft(id)`,
            ]),
            _createTable('step', [
                //
                `name           text`,
                `appPath        text                           not null`,
                `formResult     json                           not null`,
                `formSerial     json                           not null`,
                // `parentGraphID  text     references graph(id)  not null`,
                `outputGraphID  text     references graph(id)  not null`,
                'status         text                           not null',
            ]),
            _createTable('comfy_prompt', [
                //
                `stepID         text     references step(id)   not null`,
                `graphID        text     references graph(id)  not null`,
                'executed       int                            not null default 0',
                'error          json', // execution error
            ]),
            _createTable('comfy_schema', [
                //
                'spec           json                             not null',
                'embeddings     json                             not null',
            ]),
        ],
    },
    {
        id: 'OHwk_shY_c',
        name: 'create misc tables',
        up: [
            //
            // markdown / html / text
            _createTable('media_text', [
                //
                `kind text not null`,
                `content text not null`,
                `stepID text references step(id)`,
            ]),
            _createTable('media_video', [
                //
                `absPath text`,
            ]),
            _createTable('media_image', [
                //
                `base64URL text`,
            ]),
            _createTable('media_3d_displacement', [
                `width     int`,
                `height    int`,
                `image     text`,
                `depthMap  text`,
                `normalMap text`,
                //
                // `base64URL text`,
            ]),
        ],
    },
    {
        id: 'whR8E1Uh05',
        name: 'fix image',
        up: [
            `alter table media_image add column width int`,
            `alter table media_image add column height int`,
            `alter table media_image add column star int`,
            `alter table media_image add column infos json`,
        ],
    },
    {
        id: 'PONTSFSpA_',
        name: 'fix image2',
        up: [`alter table media_image drop column base64URL`],
    },
    {
        id: 'R1lQ0YLIqO',
        name: 'add promptID to image',
        up: [
            //
            `alter table media_image add column promptID text references comfy_prompt(id)`,
            `alter table media_image add column stepID   text references step(id)`,
        ],
    },
    {
        id: 'x8cqAoMEvu',
        name: 'add runtime error',
        up: [
            _createTable('runtime_error', [
                'message text not null',
                'infos json not null',
                'promptID text references comfy_prompt(id)',
                'graphID text references graph(id)',
            ]),
        ],
    },
    {
        id: '0D1XHSH0Dk',
        name: 'add runtime error',
        up: ['alter table runtime_error add column stepID text references step(id)'],
    },
    {
        id: 'oOzhdq3rM2',
        name: 'add step and prompt to video',
        up: [
            //
            'alter table media_video add column stepID text references step(id)',
            'alter table media_video add column promptID text references comfy_prompt(id)',
        ],
    },
    {
        id: 'isTECbxy71',
        name: 'add step and prompt to video',
        up: [
            //
            'alter table media_3d_displacement add column stepID text references step(id)',
            'alter table media_3d_displacement add column promptID text references comfy_prompt(id)',
        ],
    },
    {
        id: 'XXDvvMf4Eu',
        name: 'add step and graph',
        up: ['alter table graph add column stepID text references step(id)'],
    },
    {
        id: '4cjq8_0hGP',
        name: 'add gaussian splat support',
        up: [_createTable('media_splat', [`stepID text references step(id)`])],
    },
    {
        id: '-apJ3x9uB4',
        name: 'add gaussian splat support',
        up: [`alter table media_splat add column url text not null`],
    },
    {
        id: 'kIoMnNKcix',
        name: 'add non nullable title field to MediaText',
        up: [
            //
            `alter table media_text add column title text not null default ''`,
        ],
    },
    {
        id: '5Ka1ddK8ma',
        name: 'add filePath and url to MediaVideo',
        up: [
            //
            `alter table media_video add column filePath text`,
            `alter table media_video add column url text not null`,
        ],
    },
    {
        id: 'sS4mA__Ofg',
        name: 'add isOpened to drafts',
        up: [`alter table draft add column isOpened int not null default 1`],
    },
    {
        id: 'M2uSmJqhbF',
        name: 'new runtime datastore',
        up: [
            //
            _createTable('custom_data', [
                //
                "data json not null default '{}'",
            ]),
        ],
    },
    {
        id: '9e3b92c6-8a71-4a51-af90-03b2f0d48ec8',
        name: 'new runtime datastore',
        up: ['alter table custom_data rename column data to json'],
    },
    {
        id: 'UI2LFUl9Lq',
        name: 'step.isExpanded',
        up: ['alter table step add column isExpanded int not null default 1'],
    },
    {
        id: 'V_WM75Ppn3',
        name: 'prompt.status',
        up: ['alter table comfy_prompt add column status text'],
    },
    {
        id: 'JIf9D18H7R',
        name: 'create cushy_script table',
        up: [_createTable('cushy_script', ['path text not null', 'code text not null'])],
    },
    {
        id: 'hG9xjiZn4I',
        name: 'create cushy_app table',
        up: [
            _createTable('cushy_app', [
                //
                'guid text unique',
                'scripID text references graph(id) not null',
            ]),
        ],
    },
    {
        id: 'kn8M4lrSlB',
        name: 'create cushy_app table',
        up: [`alter table cushy_app rename column scripID to scriptID`],
    },
    {
        id: 'H2wy77-Rvx',
        name: 'create cushy_app table',
        up: [
            `alter table cushy_app drop column scriptID`,
            `alter table cushy_app add column scriptID text references cushy_script(id) not null`,
        ],
    },
    {
        id: 'baWamSPnwf',
        name: 'create drafts now based on cushy_app table',
        up: [
            `alter table draft drop column appPath`,
            `alter table draft add column appID text references cushy_app(id) not null`,
        ],
    },
    {
        id: 'D9nJFXN2t0',
        name: 'idem for step',
        up: [`alter table step drop column appPath`, `alter table step add column appID text references cushy_app(id) not null`],
    },
    {
        id: 'ZVMqRs0ogh',
        name: 'add user table',
        up: [
            _createTable('auth', [
                'expires_at text',
                'expires_in text',
                'provider_token text',
                'refresh_token text',
                'token_type text',
                'access_token text',
            ]),
            'alter table cushy_app add column name text',
            'alter table cushy_app add column illustration text',
        ],
    },
    {
        id: '-U4fPEdWdv',
        name: 'provider_refresh_token',
        up: [`alter table auth add column provider_refresh_token text`],
    },
    {
        id: '3ZOHzNx4CL',
        name: 'auth.expires_at & auth.expires_in are numbers',
        up: [
            `alter table auth drop column expires_at`,
            `alter table auth drop column expires_in`,
            `alter table auth add column expires_at int `,
            `alter table auth add column expires_in int `,
        ],
    },
    {
        id: 'SKEO1Da-aa',
        name: 'add app description and tags',
        up: [
            //
            'alter table cushy_app add column description text',
            'alter table cushy_app add column tags text',
        ],
    },
    {
        id: 'W4Srl6gMMD',
        name: 'add app description and tags',
        up: [_createTable('tree_infos', ['isExpanded int'])],
    },
    {
        id: '8OUHASEkDa',
        name: 'add app description and tags',
        up: ['drop table tree_infos', _createTable('tree_entry', ['isExpanded int'])],
    },
    {
        id: 'TsqhCRBCgq',
        name: 'switch comfy_host to proper table',
        up: [
            //
            _createTable('comfy_host', [
                //
                'name text not null default (hex(randomblob(16)))',
                'hostname text not null default "localhost"',
                'port int not null default 8188',
                'useHttps int not null default 0',
                'isLocal int not null default 0',
                'localPath text',
            ]),
            'alter table comfy_schema add column hostID text references comfy_host(id)',
        ],
    },
    {
        id: 'ssH7sUSqD8',
        name: 'rename comfy_host to hosts',
        up: [
            //
            'alter table comfy_host rename to host',
        ],
    },
    {
        id: 'ikhG_dD58q',
        name: 'tweak host table',
        up: [
            //
            'alter table host rename column localPath to absolutePathToComfyUI',
            'alter table host add column absolutPathToDownloadModelsTo text',
        ],
    },
    {
        id: 'F4j-vbWNqe',
        name: 'more host table tweaks',
        up: [
            //
            'alter table host add column isVirtual int not null default 0',
        ],
    },
    {
        id: 'dCGQQaHT8F',
        name: 'misc',
        up: [
            //
            'alter table cushy_app add column publishedID text',
            'alter table cushy_app add column publishedAs text',
            'alter table cushy_script add column lastEvaluatedAt text',
            'alter table cushy_script add column lastSuccessfulEvaluation text',
        ],
    },
    {
        id: 'XemPQB9Biq',
        name: 'misc',
        up: [
            //
            'alter table cushy_app add column publishedVersion int',
            'alter table cushy_app add column publishedAt text',
        ],
    },
    {
        id: 'qDXgzrF5GN',
        name: 'misc',
        up: [
            // rename
            'alter table cushy_app    rename column publishedAs to publishedAsUserID',

            // delete
            'alter table cushy_app    drop column publishedID',
            'alter table cushy_app    drop column publishedVersion',
            'alter table cushy_app    drop column publishedAt',
            'alter table cushy_script drop column lastEvaluatedAt',
            'alter table cushy_script drop column lastSuccessfulEvaluation',

            // recreate
            'alter table cushy_app    add column publishedAt INT',
            'alter table cushy_script add column lastEvaluatedAt INT',
            'alter table cushy_script add column lastSuccessfulEvaluationAt INT',
        ],
    },
    {
        id: 'aqBUfUJihT',
        name: 'misc',
        up: [
            // rename
            'alter table media_image add column promptNodeID text',
        ],
    },
    {
        id: '9tHBrHFrCu',
        name: 'misc',
        up: [
            // rename
            'alter table graph add column metadata json',
        ],
    },
    {
        id: 'gz_W2ilKV1',
        name: 'misc',
        up: [
            // rename
            'alter table graph drop column metadata',
            `alter table graph add column metadata json default '{}'`,
        ],
    },
    {
        id: 'yACVuOp3-B',
        name: 'misc',
        up: [
            // rename
            'alter table graph drop column metadata',
            `alter table graph add column metadata json not null default '{}'`,
        ],
    },
    {
        id: 'M0A2RGCDiV',
        name: 'misc',
        up: [
            // rename
            'alter table step add column draftID text references draft(id)',
        ],
    },
    {
        id: 'S7ah1uaV3n',
        name: 'misc',
        up: [
            // rename
            'alter table project add column filterNSFW int not null default 0',
        ],
    },
    {
        id: '3acd7308-0815-4473-a2a4-5818b6c7b74a',
        name: 'misc',
        up: [
            // rename
            'alter table project add column autostartDelay int not null default 0',
        ],
    },
    {
        id: '7b2a2F2kj9',
        name: 'misc',
        up: [
            // rename
            'alter table project add column autostartMaxDelay int not null default 100',
        ],
    },
    {
        id: 'RRvM1VVbV6',
        name: 'more host table tweaks',
        up: [
            //
            'alter table host add column isReadonly int not null default 0',
        ],
    },
    {
        id: '3IcMByr0Rg',
        name: 'store cushy_script metafile',
        up: [
            //
            'alter table cushy_script add column metafile json',
        ],
    },
    {
        id: 'tdo2F6zNxC',
        name: 'store cushy_script metafile',
        up: [
            //
            'alter table draft add column illustration text',
        ],
    },
    {
        id: '0kp5F23p4i',
        name: 'store filesize and hash on MediaImages',
        up: [
            //
            'alter table media_image add column fileSize int',
            'alter table media_image add column hash text',
        ],
    },
    {
        id: 'QpwjQfxeBX',
        name: 'redo images',
        up: [
            //
            'delete from media_image',
            //
            'alter table media_image drop column width       ',
            'alter table media_image drop column height      ',
            'alter table media_image drop column fileSize    ',
            'alter table media_image drop column hash        ',
            'alter table media_image drop column infos       ',

            `alter table media_image add column  width        int  NOT NULL`,
            `alter table media_image add column  height       int  NOT NULL`,
            'alter table media_image add column  fileSize     int  NOT NULL',
            'alter table media_image add column  hash         text NOT NULL',
            'alter table media_image add column  path         text NOT NULL',
            `alter table media_image add column  comfyUIInfos json`,
        ],
    },
    {
        id: 'hrMMl9pMZ5',
        name: 'more image-meta fields',
        up: [
            //
            'alter table media_image add column  type         text',
            'alter table media_image add column  orientation  int',
        ],
    },
    {
        id: 'UiC3lfBf52',
        name: 'draft and apps can be favorites too',
        up: [
            //
            'alter table draft     add column isFavorite int not null default 0',
            'alter table cushy_app add column isFavorite int not null default 0',
        ],
    },
    {
        id: 'SxOZd0SEQm',
        name: 'remove draft.isOpen',
        up: [
            //
            'alter table draft drop column isOpened',
        ],
    },
    {
        id: 'hZrIo6_dmO',
        name: 'rename draft.appParams to draft.serial',
        up: [
            //
            `alter table draft rename column appParams to serial`,
        ],
    },
    {
        id: 'H86-VhgWVk',
        name: 'drop column formResult',
        up: [
            //
            `alter table step drop column formResult`,
        ],
    },
    {
        id: 'XI9-fX8Eqk',
        name: 'rename draft.serial to draft.formSerial',
        up: [
            //
            `alter table draft rename column serial to formSerial`,
        ],
    },
    {
        id: 'rKN8C31HEj',
        name: 'rename draft.serial to draft.formSerial',
        up: [
            //
            `alter table cushy_app add column canStartFromImage int`,
        ],
    },
    {
        id: 'b6W8cWEVgR',
        name: 'add script.lastExtractedAt',
        up: [
            //
            `alter table cushy_script add column lastExtractedAt int`,
        ],
    },
    // {
    //     id: 'e574c006-daca-4fd0-a51b-73a66b4fbd79',
    //     name: 'create cushy_app table',
    //     up: ['drop table cushy_app'],
    // },
]
