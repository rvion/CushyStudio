export type SimpleColor = 'gray' | 'green' | 'red'
export type SimpleKind = 'attack' | 'power' | 'skill'
export type SimpleRarity = 'common' | 'uncommon' | 'rare'

// prettier-ignore
export const stsAssets = {
    'energy-gray':            'https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/7CpGRAjMQnFByuJT2JX9XUD5yloD7docUssAADQ6g.png',
    'energy-green':           'https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/8q2MaoJJOM2sM7RxmukF20mPDaK6vshOEDzMY1nCnSI.png',
    'energy-red':             'https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/XuXUVMqyRbI10AlRrBbU3wjvy5UpvRr1StGDuq7D0yY.png',

    'rarity-attack-common':   'https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/aILsWMSWkHPPg0CJYUiaWfrBc6U6sINeg9qtqEc0.png',
    'rarity-attack-uncommon': 'https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/MOFRFAFehUbJCqJnsSD88UGs1i1lKfO2RIwM0Jo.png',
    'rarity-attack-rare':     'https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/dfSMEsyUZE62fGpfD5jiOkoppdHV0WH6GpiW9rupus.png',

    'rarity-power-common':    'https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/4eKBs8ZfYCLYoAl3yGplWM0hOow3TRNJHSVQpyfp0.png',
    'rarity-power-rare':      'https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/hXMf3xUkw3J3YRMf08HlYB3TYJ0f7hW3vpzr5ZIOo.png',
    'rarity-power-uncommon':  'https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/UQ2mqVt5ZxLq5elRFKiggMhRN8uHYtX6N9pm5FE.png',

    'rarity-skill-common':    'https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/X0RhU07glQ5YIuYGqDRYd2FSXRaxT6KFBjYI08Y9MM.png',
    'rarity-skill-rare':      'https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/3MgJVd95uoYs9Txx6yZh8CGltVeVuWwB6uKu4yBy8.png',
    'rarity-skill-uncommon':  'https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/4fkCxtqwUlzBcqBiCTCmSfuPIBW78xQ6wI40IVpUU.png',

    'header-common':          'https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/gp6Agun2fsxPwApErObMuXoDcBysesRVesW64jXP1g.png',
    'header-rare':            'https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/tHFqVs7lVmh1cIAHCA7ZJiyxQGvphKVoSTZIuuc8UQ.png',
    'header-uncommon':        'https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/xHln1m7f6YoOdaA4L8UPKNFaX4t0GttbF2uSDdEU.png',

    'attack-gray':            'https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/q5FAoHba9t3f4dn8WhVo7auJMZHTpPVPcuRPj78pfc.png',
    'attack-green':           'https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/0xrqtq4p8Z2vQXQcBXmb4Al5wosnXUeY1IzxIV4fw.png',
    'attack-red':             'https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/zicOEsSP4M3wFUVr2GtZUoUfJbG1HnB7Fz4ilbG21c.png',

    'curse-black':            'https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/LlruDqYIBTp0M4IzgGwFJbMm9QRxxaKF1GmLiDmKw5U.png',

    'power-green':            'https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/00taa1iUnNljAbuYLtUhqi8UnWKdtr1fFqbMGfeebc.png',
    'power-red'  :            'https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/za6M2AtrNSOsvoryprMuYUMjb2ieqNYSecQPNrxvqk.png',
    'power-gray' :            'https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/M3bbj8OXivcgYqT7jjozp2kns05oMCLaSVL1QTA1G8.png',

    'skill-gray' :            'https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/iVRurGnTy0QBk7ARLgtRBokzh24XnjVq0mb1DzLtIo.png',
    'skill-green':            'https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/p9Lq4mHyUBKutquDwky8x6pb6aqd6lEnI0r0fwez4.png',
    'skill-red'  :            'https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/bFK8DDJHheGlcFLvlgyaZHzo9W52ddUpxfDEq9OVw.png',

    // masks are 500x380
    'mask-attack':            'https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/8ALTU5ZQGHz7njDEu6k2unqkyIwN62yPYFvB2MeOYI.png',
    'mask-power' :            'https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/ZqKl6DgAY01Z4iOYxpMKZVVqkrbjGjNE2ONDdWNtI.png',
    'mask-skill' :            'https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/xPbgOSkMFK2dz4CUCEqtXm8YiH2QzB4463IEH4oeivo.png',
}
const character = [
   //
   'The Silent',
   'The Ironclad',
   'The Defect',
   'The Watcher',
]
