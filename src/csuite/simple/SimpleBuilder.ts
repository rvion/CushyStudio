import { nanoid } from 'nanoid'

import { Field_list, type Field_list_config } from '../fields/list/FieldList'
import { Field_optional, type Field_optional_config } from '../fields/optional/FieldOptional'
import { BuilderBoolDescriptors, type BuilderBoolMixin } from '../model/builders/BuilderBoolTypes'
import { BuilderChoicesDescriptors, type BuilderChoicesMixin } from '../model/builders/BuilderChoices'
import { BuilderDateDescriptors, type BuilderDateMixin } from '../model/builders/BuilderDateTypes'
import { BuilderGroupDescriptors, type BuilderGroupMixin } from '../model/builders/BuilderGroup'
import { BuilderMiscDescriptors, type BuilderMiscMixin } from '../model/builders/BuilderMisc'
import { BuilderNumberDescriptors, type BuilderNumberMixin } from '../model/builders/BuilderNumberTypes'
import { BuilderSelectManyDescriptorsFn, type BuilderSelectManyMixin } from '../model/builders/BuilderSelectMany'
import { BuilderSelectOneDescriptorsFn, type BuilderSelectOneMixin } from '../model/builders/BuilderSelectOne'
import { BuilderSharedDescriptors, type BuilderSharedMixin } from '../model/builders/BuilderShared'
import { BuilderStringDescriptors, type BuilderStringMixin } from '../model/builders/BuilderStringTypes'
import { CSchema } from '../model/CSchema'

export class SimpleBuilder {
   _uid: string = nanoid(4)

   /** list with a default */
   list<T extends CSchema>(config: Field_list_config<T>): Z.List<T> {
      return this.list_({
         defaultLength: config.min ?? 0,
         ...config,
      })
   }

   /** list */
   list_<T extends CSchema>(config: Field_list_config<T>): Z.List<T> {
      return CSchema.new<Field_list<T>>(Field_list, config)
   }

   // optional wrappers
   optional<T extends CSchema>(p: Field_optional_config<T>): Z.Maybe<T> {
      return CSchema.new<Field_optional<T>>(Field_optional, p)
   }
}

// string builder mixing
export interface SimpleBuilder extends BuilderStringMixin {}
Object.defineProperties(SimpleBuilder.prototype, BuilderStringDescriptors)

// bool builder mixin
export interface SimpleBuilder extends BuilderBoolMixin {}
Object.defineProperties(SimpleBuilder.prototype, BuilderBoolDescriptors)

// choices builder mixin
export interface SimpleBuilder extends BuilderChoicesMixin {}
Object.defineProperties(SimpleBuilder.prototype, BuilderChoicesDescriptors)

// number builder mixin
export interface SimpleBuilder extends BuilderNumberMixin {}
Object.defineProperties(SimpleBuilder.prototype, BuilderNumberDescriptors)

// date builder mixin
export interface SimpleBuilder extends BuilderDateMixin {}
Object.defineProperties(SimpleBuilder.prototype, BuilderDateDescriptors)

// misc builder mixin
export interface SimpleBuilder extends BuilderMiscMixin {}
Object.defineProperties(SimpleBuilder.prototype, BuilderMiscDescriptors)

// selectOne builder mixin
export interface SimpleBuilder extends BuilderSelectOneMixin {}
Object.defineProperties(SimpleBuilder.prototype, BuilderSelectOneDescriptorsFn())

// selectMany builder mixin
export interface SimpleBuilder extends BuilderSelectManyMixin {}
Object.defineProperties(SimpleBuilder.prototype, BuilderSelectManyDescriptorsFn())

// group builder mixin
export interface SimpleBuilder extends BuilderGroupMixin {}
Object.defineProperties(SimpleBuilder.prototype, BuilderGroupDescriptors)

// shared builder mixin
export interface SimpleBuilder extends BuilderSharedMixin {}
Object.defineProperties(SimpleBuilder.prototype, BuilderSharedDescriptors)
