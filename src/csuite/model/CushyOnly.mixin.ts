import type { Field } from './Field'

import { runInAction } from 'mobx'
import { createElement, type ReactNode } from 'react'

import { FormAsDropdownConfigUI } from '../form/FormAsDropdownConfigUI'
import { defineFieldMixin } from './defineFieldMixin'

export type CushyOnlyMixin = typeof CushyOnlyMixinImpl

export const CushyOnlyMixinImpl = defineFieldMixin({
   /**
    * @deprecated prefer Field.Render with the proper modal options
    * allow to quickly render the form in a dropdown button
    * without having to import any component; usage:
    * | <div>{x.renderAsConfigBtn()}</div>
    */
   ϟrenderAsConfigBtn(p?: {
      // 1. anchor option
      // ...TODO
      // 2. popup options
      title?: string
      className?: string
      maxWidth?: string
      minWidth?: string
      width?: string
   }): ReactNode {
      return createElement(FormAsDropdownConfigUI, { form: this, ...p })
   },
})

export const CushyOnlyMixinDescriptors = Object.getOwnPropertyDescriptors(CushyOnlyMixinImpl)
