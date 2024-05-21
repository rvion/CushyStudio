import * as icons from '@mdi/js'

// Q. how to merge multiple path into a single one ?
// A. As long as the paths have the same style,
// | and none of them have a transform different from the others,
// | you can simply append the paths together into one.
// cf. https://stackoverflow.com/questions/68100124/get-a-single-path-value-for-svg-file-having-multiple-paths

// whitelisted prefixes as of 2024-05-17:
// - mdi: material-design-icons
// - ldi: locomotive-design-icons
// - cdi: cushy-design-icons
// - bdi: birdd_design_icons

// prettier-ignore
const myCustomIcons = {
    cdiTest: 'M 2.40,7.20 A 20,20 0,0,1 12.00,7.20 A 20,20 0,0,1 21.60,7.20 Q 21.60,14.40 12.00,21.60 Q 2.40,14.40 2.40,7.20 z',
}

export const allIcons = {
    ...icons,
    ...myCustomIcons,
}

export type IconName = keyof typeof allIcons
