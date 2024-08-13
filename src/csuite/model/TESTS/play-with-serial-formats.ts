import chalk from 'chalk'

let a = ['group', { a: ['string', 's'] }]
let b = ['group', { a: ['string', 's'], b: ['number', 12] }]

const B1 = ['string', '78197289738927438943789']
const BX = ['bigint', '78197289738927438943789']

const A2 = { type: 'string', value: 'abc', collapsed: true, custom: { foo: 1 } }
const B2 = ['string', 'abc', { collapsed: true, custom: { foo: 1 } }]

const A3 = { type: 'group', items_: { valA: { type: 'string', value: 'a' }, valB: { type: 'string', value: 'b' } } }
const B3 = ['group', { valA: ['string', 'a'], valB: ['string', 'b'] }]

const B4 = ['choice', { branches: { valA: true, valB: false }, _: { valA: ['string', 'a'], valB: ['string', 'b'] } }]

type Serial1 = { type: string; value: number }
type Serial2 = [type: string, value: number]

const t0 = 0 as any as Serial2
const x = t0[0]
const y = t0[1]
print(
    'V1',
    '(yesterday)',
    {
        type: 'list',
        items_: [
            { type: 'str', value: 'abc' },
            { type: 'str', value: 'de' },
            { type: 'number', value: 96 },
            { type: 'boolean', value: false },
            {
                type: 'group',
                value: {
                    valA: { type: 'str', value: 'a' },
                    valB: { type: 'str', value: 'b' },
                    valC: { type: 'str', value: 'b' },
                },
            },
        ],
    },
    ['hard to read', 'a bit fat'],
)

print(
    'V2.0',
    '(now)',
    {
        $: 'list',
        items_: [
            { $: 'str', value: 'abc' },
            { $: 'str', value: 'de' },
            { $: 'number', value: 96 },
            { $: 'boolean', value: false },
            {
                $: 'group',
                values_: {
                    valA: { $: 'str', value: 'a' },
                    valB: { type: 'str', value: 'b' },
                    valC: { $: 'str', value: 'b' },
                },
            },
        ],
    },
    ['a tiny bit better ? not much'],
    ['$ inspired by various schema format like jsonschema'],
)

print(
    'V2.1',
    '(with less chars)',
    {
        $: 'list',
        _: [
            { $: 'str', _: 'abc' },
            { $: 'str', _: 'de' },
            { $: 'number', _: 96 },
            { $: 'boolean', _: false },
            {
                $: 'group',
                _: {
                    valA: { $: 'str', _: 'a' },
                    valB: { $: 'str', _: 'b' },
                    valC: { $: 'str', _: 'b' },
                },
            },
        ],
    },
    [],
    ['almost nothing to change in the codebase, we have everythign to conver to this.'],
)

print('V2.2', '(with less chars, and with numbers instead of booleans)', {
    $: 'list',
    _: [
        { $: 'str', _: 'abc' },
        { $: 'str', _: 'de' },
        { $: 'number', _: 96 },
        { $: 'boolean', _: 1 },
        {
            $: 'group',
            _: {
                valA: { $: 'str', _: 'a' },
                valB: { $: 'str', _: 'b' },
                valC: { $: 'str', _: 'b' },
            },
        },
    ],
})

print('V3.b', '(type as emojis)', {
    $: '📁',
    _: [
        { $: '💬', _: 'abc' },
        { $: '💬', _: 'de' },
        { $: '🔢', _: 96 },
        { $: '❓', _: false },
        {
            $: '🎁',
            _: {
                valA: { $: '💬', _: 'a' },
                valB: { $: '💬', _: 'b' },
                valC: { $: '💬', _: 'b' },
            },
        },
    ],
})

print('V4.b', '(everything as array, core payload first, options optionally in 3rd place)', [
    '📁',
    [
        ['💬', 'abc'],
        ['💬', 'de'],
        ['🔢', 96],
        ['❓', false],
        [
            '🎁',
            {
                valA: ['💬', 'a'],
                valB: ['💬', 'b'],
                valC: ['💬', 'b'],
            },
        ],
    ],
])

print('V4.c', 'array container + shorter types', [
    'arr',
    [
        ['str', 'abc'],
        ['str', 'de'],
        // { type: 'number', value: 96 }
        // {    $: 'number', value: 96 }
        // [ 'num', 96 ]
        ['opt', false],
        [
            'obj',
            {
                valA: ['str', 'a'],
                valB: ['str', 'b'],
                valC: ['str', 'b'],
            },
        ],
    ],
])

enum K {
    str = 1,
    num = 2,
    bool = 3,
    obj = 6,
    arr = 8,
    opt = 9,
}

print(
    'V5',
    'array wrapper + enum type + short repr',
    [
        K.arr,
        [
            [K.str, 'abc'],
            [K.str, 'de'],
            [K.num, 96],
            [K.opt, false],
            [
                K.obj,
                {
                    valA: [K.str, 'a'],
                    valB: [K.str, 'b'],
                    valC: [K.str, 'b'],
                },
            ],
        ],
    ],
    ['too dangerous to use enum', 'too hard to read for humans'],
    ['shortest'],
)

function print(
    //
    version: string,
    desc: string,
    x: any,
    bad: string[] = [],
    good: string[] = [],
): void {
    console.log('\n\n')
    const str = JSON.stringify(x)
    console.log(`${str.length}${chalk.gray('b')}`, chalk.bold(version), chalk.yellow(desc))
    console.log('| ', chalk.blue(str))
    bad.length && console.log('  -', bad.map((pb) => chalk.red(pb)).join('\n  - '))
    good.length && console.log('  -', good.map((pb) => chalk.green(pb)).join('\n  - '))
}
