// prettier-ignore
export type RSSize =
    // legacy sizes, based on rsuite sizes, inspired by regular design systems
    | 'xs' // extra-small
    | 'sm' //       small
    | 'md' //      medium
    | 'lg' //       large
    | 'xl' // extra-large

    // modern approach for size
    | 'widget' // TODO: rename 'cell'
    | /* ↘️ */'input'
    | /*       ↘️ */'inside' // for blocks that need to be displayed within inputs. (e.g. badges)

/*




    */
