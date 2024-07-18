import * as icons from '@mdi/js'

import { _CushyIcons } from './iconsCDI'
import { _IconsLDI } from './iconsLDI'
import { _IconsXDI } from './iconsXDI'

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

// 👋 mdi icons search: https://pictogrammers.com/library/mdi/ 👋

// Open questions:
// - do we add some kind of semantic level mapped to loco (ie. Ikon._user instead of Ikon.mdiAccount), cf pictos => yes? is ._whatever the right way?
//   - what about consistent colors like pictos? Ikon.colored._user was nice to use -> maybe define/use semantic and colors on a totally separate object? -> maybe we don't really need colors right now
//   - feedback from pictos: list is hard to maintain
// - what about variants? solid, outline... -> probably keeping it simple by just using mdi names, it must be pretty rare to need both variants

// TODO:
// - no major obstacle to replace @rsuite/icons and react-icons (via atoms/Icons & pictos) with this, it's mostly tedious
// - hopefully Tong's Icon can use this too
// - we can probably keep the component quite light and have a lot of theming done by the container?
// - 🔶 some incompatibilities with rsuite Button/IconButton -> we probably want to have new Tong's base components before migrating everything.

export const allIcons = {
    _: 'M 0,0 z',
    // made by pictogrammers, for all
    ...icons,
    // made by/for ???
    ..._IconsXDI,
    // made by/for locomotive
    ..._IconsLDI,
    // made by/for cushy
    ..._CushyIcons,
}

// slow when used in union => will break typescript
// export type IconName = keyof typeof allIcons

// possibly fast ???, using [x][0] instead of x prevent distribution
// https://stackoverflow.com/questions/70924508/why-doesnt-union-distribution-happen-with-tnumber-where-t-is-an-arraylike
// > Distribution happens only over naked type parameters, meaning a single type parameter without any other type operation applied to it.
// > T[number] is not a naked type parameter, so no distribution. Elem is a naked type parameter in the second type, so distribution occurs.
export type IconName = [keyof typeof allIcons][0]
