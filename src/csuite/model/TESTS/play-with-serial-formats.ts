import chalk from 'chalk'

print('V1', '(yesterday)', {
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
})

print('V2.0', '(now)', {
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
})

print('V2.1', '(with less chars)', {
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
})

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

print('V4.c', 'array container + 3 letter type', [
    'arr',
    [
        ['str', 'abc'],
        ['str', 'de'],
        ['num', 96],
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

print('V5', 'array wrapper + enum type + short repr', [
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
])

function print(version: string, desc: string, x: any): void {
    console.log('\n\n')
    const str = JSON.stringify(x)
    console.log(`${str.length}${chalk.gray('b')}`, chalk.bold(version), chalk.green(desc))
    console.log('| ', chalk.blue(str))
}
