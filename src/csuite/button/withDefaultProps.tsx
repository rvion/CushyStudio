// eslint-disable-next-line no-restricted-imports

import type { PropsOf } from '../types/PropsOf'

import { objectAssignTsEfficient_pt_t } from '../utils/objectAssignTsEfficient'

export function withDefaultProps<T extends (p: object) => any>(
   //
   WrappedComponent: T,
   defaultProps?: Partial<PropsOf<T>>,
): T {
   // @ts-ignore
   return observer((props: PropsOf<T>) => {
      const finalProps: PropsOf<T> = objectAssignTsEfficient_pt_t(defaultProps ?? {}, props)
      const X = WrappedComponent as any
      return (<X {...finalProps} />) as any
   }) as T
}
