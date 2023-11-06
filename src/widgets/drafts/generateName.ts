import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator'

export const generateName = (): string => {
    return uniqueNamesGenerator({ dictionaries: [colors] })
    // return uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] })
}

// examples
// | const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] }) // big_red_donkey
// |
// | const shortName = uniqueNamesGenerator({
// |     dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
// |     length: 2,
// | }) // big-donkey
