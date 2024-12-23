import type { BaseSchema } from './BaseSchema'
import type { IBuilder } from './builders/IBuilder'
import type { DraftLike } from './Draft'
import type { EntityConfig } from './Entity'

import { runInAction } from 'mobx'
import { type DependencyList, useEffect, useMemo } from 'react'

import { getGlobalRepository, type Repository } from './Repository'

/** a factory is a top-level class aimed to */
export class Factory<BUILDER extends IBuilder = IBuilder> {
   /**
    * repository technically doesn't require a builder to function
    * but it's easier to assume most project will have one repository,
    * and one default builder.
    * it makes it easier to add convenience mothods on the repository
    * so we can use it to create fields, and not just to retrieve them.
    */
   builder: BUILDER
   repository: Repository

   constructor(builder: BUILDER, repository?: Repository) {
      this.repository = repository ?? getGlobalRepository()
      this.builder = builder
   }

   // #region Creation
   /** simple alias to create a new Document */
   document<SCHEMA extends BaseSchema>(
      schemaExt: SCHEMA | ((form: BUILDER) => SCHEMA),
      entityConfig: EntityConfig<NoInfer<SCHEMA>> = {},
   ): SCHEMA['$Field'] {
      let schema: SCHEMA = this.evalSchema(schemaExt)
      if (entityConfig.onSerialChange || entityConfig.onValueChange)
         schema = schema.withConfig({
            onSerialChange: entityConfig.onSerialChange,
            onValueChange: entityConfig.onValueChange,
         })
      return schema.create(entityConfig.serial?.(), this.repository)
   }

   /** simple alias to create a new Document */
   draft<SCHEMA extends BaseSchema>(
      schemaExt: SCHEMA | ((form: BUILDER) => SCHEMA),
      entityConfig: EntityConfig<NoInfer<SCHEMA>> = {},
   ): DraftLike<SCHEMA['$Field']> {
      return this.document(schemaExt, entityConfig)
   }

   // #region React Hooks

   /**
    * simple way to defined forms and in react components
    *
    * 🔶 warning: as of 2024-09-19, the schema is memoized based
    * | on the DependencyList provided as 3rd argument.
    * | // TODO: change that ?
    */
   use<SCHEMA extends BaseSchema>(
      schemaExt: SCHEMA | ((form: BUILDER) => SCHEMA),
      entityConfig: EntityConfig<NoInfer<SCHEMA>> = {},
      deps: DependencyList = [],
   ): SCHEMA['$Field'] {
      const doc = useMemo(() => {
         // TODO: document properly
         // 💬 2024-09-19 rvion:
         // | when we create a mutable object
         // | in a useMemo, then happen to update it within that same useMemo lambda
         // | we need to prevent the component from re-rendering.
         // |
         // | BUT we also need to allow sub-lambdas to still be able to register subscription
         // | on other mobx atoms.
         // | so we can't use `untracked`. `runInAction` does exactly that
         return runInAction(() => {
            const doc = this.document(schemaExt, entityConfig)
            return doc
         })
      }, deps)

      return doc
   }

   /**
    * same as `use` but dispose the document when the component unmount.
    *
    * @since 2024-09-19
    * @see {@link use}
    */
   useDisposable<SCHEMA extends BaseSchema>(
      schemaExt: SCHEMA | ((form: BUILDER) => SCHEMA),
      entityConfig: EntityConfig<NoInfer<SCHEMA>> = {},
      deps: DependencyList = [],
   ): SCHEMA['$Field'] {
      const doc = this.use(schemaExt, entityConfig, deps)
      // dispose that document when the component unmount
      useEffect(() => (): void => doc.disposeTree(), [doc])
      return doc
   }

   useDraft<SCHEMA extends BaseSchema>(
      schemaExt: SCHEMA | ((form: BUILDER) => SCHEMA),
      entityConfig: EntityConfig<NoInfer<SCHEMA>> = {},
      deps: DependencyList = [],
   ): DraftLike<SCHEMA['$Field']> {
      return this.use(schemaExt, entityConfig, deps)
   }

   /**
    * same as `useDraft` but dispose the document when the component unmount.
    *
    * @since 2024-09-19
    * @see {@link useDraft}
    * @see {@link use}
    */
   useDisposableDraft<SCHEMA extends BaseSchema>(
      schemaExt: SCHEMA | ((form: BUILDER) => SCHEMA),
      entityConfig: EntityConfig<NoInfer<SCHEMA>> = {},
      deps: DependencyList = [],
   ): DraftLike<SCHEMA['$Field']> {
      return this.useDisposable(schemaExt, entityConfig, deps)
   }

   /** simple way to defined forms and in react components */
   useLocalstorage<SCHEMA extends BaseSchema>(
      key: string,
      schemaExt: SCHEMA | ((form: BUILDER) => SCHEMA),
      deps: DependencyList = [],
   ): SCHEMA['$Field'] {
      return this.useLocalstorage_persistOnlyWhen(key, schemaExt, () => true, deps)
   }

   /** simple way to defined forms and in react components */
   useLocalstorage_persistOnlyWhenValid<SCHEMA extends BaseSchema>(
      key: string,
      schemaExt: SCHEMA | ((form: BUILDER) => SCHEMA),
      deps: DependencyList = [],
   ): SCHEMA['$Field'] {
      return this.useLocalstorage_persistOnlyWhen(key, schemaExt, (doc) => doc.isValid, deps)
   }

   /** simple way to defined forms and in react components */
   useLocalstorage_persistOnlyWhen<SCHEMA extends BaseSchema>(
      key: string,
      schemaExt: SCHEMA | ((form: BUILDER) => SCHEMA),
      canPersistPredicate: (doc: SCHEMA['$Field']) => boolean,
      deps: DependencyList = [],
   ): SCHEMA['$Field'] {
      let serial: any = null

      try {
         const prev = localStorage.getItem(key)
         const parsed = prev ? JSON.parse(prev) : null
         serial = parsed
      } catch {
         /* empty */
      }

      return this.use(
         schemaExt,
         {
            serial: () => serial,
            onSerialChange: (root) => {
               if (!canPersistPredicate(root)) return
               localStorage.setItem(key, JSON.stringify(root.serial))
            },
         },
         deps,
      )
   }

   // #region misc
   /** simple alias to create a new Form */
   define<SCHEMA extends BaseSchema>(schemaFn: (form: BUILDER) => SCHEMA): SCHEMA {
      return schemaFn(this.builder)
   }
   schema = <T extends BaseSchema>(fn: (form: BUILDER) => T): T => fn(this.builder)

   /** eval schema if it's a function */
   private evalSchema<SCHEMA extends BaseSchema>(buildFn: SCHEMA | ((form: BUILDER) => SCHEMA)): SCHEMA {
      if (typeof buildFn === 'function') return buildFn(this.builder as BUILDER)
      return buildFn
   }
}
