import type { Field_group } from '../fields/group/FieldGroup'
import type { IBuilder } from './builders/IBuilder'
import type { CSchema } from './CSchema'
import type { DraftLike } from './Draft'
import type { EntityConfig } from './Entity'
import type { SchemaDict } from './SchemaDict'

import { makeObservable, observable, runInAction } from 'mobx'
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
      makeObservable(this, {
         builder: observable.ref,
         repository: observable.ref,
      })
   }

   /**
    * LEGACY API; TYPES ARE COMPLICATED DUE TO MAINTAINING BACKWARD COMPAT
    * @deprecated
    */
   fields<FIELDS extends SchemaDict>(
      schemaExt: (form: BUILDER) => FIELDS,
      entityConfig: EntityConfig<CSchema<Field_group<NoInfer<FIELDS>>>> = { name: 'unnamed' },
   ): Field_group<FIELDS> {
      const schema = this.builder.group({
         label: false,
         items: schemaExt(this.builder),
         collapsed: false,
         onSerialChange: entityConfig.onSerialChange,
         onValueChange: entityConfig.onValueChange,
      })

      // 👇 🔴 CALL CREATE INSTEAD
      return (schema as any).instanciate(
         //
         this.repository,
         null,
         null,
         '$',
         entityConfig.serial?.(),
      )
   }

   // #region Creation
   /** simple alias to create a new Document */
   document<SCHEMA extends CSchema>(
      schemaExt: SCHEMA | ((form: BUILDER) => SCHEMA),
      entityConfig: EntityConfig<NoInfer<SCHEMA>> = {},
   ): SCHEMA['ҨField'] {
      const schema: SCHEMA = this.evalSchema(schemaExt)
      const doc = schema.create(entityConfig.serial?.(), this.repository)
      if (entityConfig.onSerialChange != null) doc.zOnSerialChanges(entityConfig.onSerialChange)
      if (entityConfig.onValueChange != null) doc.zOnSerialChanges(entityConfig.onValueChange)
      return doc
   }

   /** simple alias to create a new Document */
   draft<SCHEMA extends CSchema>(
      schemaExt: SCHEMA | ((form: BUILDER) => SCHEMA),
      entityConfig: EntityConfig<NoInfer<SCHEMA>> = {},
   ): DraftLike<SCHEMA['ҨField']> {
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
   use<SCHEMA extends CSchema>(
      schemaExt: SCHEMA | ((form: BUILDER) => SCHEMA),
      entityConfig: EntityConfig<SCHEMA> = {},
      deps: DependencyList = [],
   ): SCHEMA['ҨField'] {
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

   // // this is not much more than a useMemo(() => new Prez(field))...
   // usePrez<SCHEMA extends CSchema>(
   //    fieldOrSchema: SCHEMA['ҨField'] | SCHEMA,
   //    conf:
   //       | RENDERER.FieldRenderArgs<SCHEMA['ҨField']>
   //       | ((fo: RENDERER.Prez<SCHEMA>) => RENDERER.Prez<SCHEMA>) = {},
   //    deps: DependencyList = [],
   // ): RENDERER.Prez<SCHEMA> {
   //    const prez = useMemo(() => {
   //       if (typeof conf === 'function') return conf(globalThis.RENDERER.makePrez(fieldOrSchema))
   //       return globalThis.RENDERER.makePrez(fieldOrSchema, conf)
   //    }, [...deps])

   //    return prez
   // }

   /**
    * same as `use` but dispose the document when the component unmount.
    *
    * @since 2024-09-19
    * @see {@link use}
    */
   useDisposable<SCHEMA extends CSchema>(
      schemaExt: SCHEMA | ((form: BUILDER) => SCHEMA),
      entityConfig: EntityConfig<NoInfer<SCHEMA>> = {},
      deps: DependencyList = [],
   ): SCHEMA['ҨField'] {
      const doc = this.use(schemaExt, entityConfig, deps)
      // dispose that document when the component unmount
      useEffect(() => (): void => doc.zDisposeTree(), [doc])
      return doc
   }

   useDraft<SCHEMA extends CSchema>(
      schemaExt: SCHEMA | ((form: BUILDER) => SCHEMA),
      entityConfig: EntityConfig<NoInfer<SCHEMA>> = {},
      deps: DependencyList = [],
   ): DraftLike<SCHEMA['ҨField']> {
      return this.use(schemaExt, entityConfig, deps)
   }

   /**
    * same as `useDraft` but dispose the document when the component unmount.
    *
    * @since 2024-09-19
    * @see {@link useDraft}
    * @see {@link use}
    */
   useDisposableDraft<SCHEMA extends CSchema>(
      schemaExt: SCHEMA | ((form: BUILDER) => SCHEMA),
      entityConfig: EntityConfig<NoInfer<SCHEMA>> = {},
      deps: DependencyList = [],
   ): DraftLike<SCHEMA['ҨField']> {
      return this.useDisposable(schemaExt, entityConfig, deps)
   }

   /** simple way to defined forms and in react components */
   useLocalstorage<SCHEMA extends CSchema>(
      key: string,
      schemaExt: SCHEMA | ((form: BUILDER) => SCHEMA),
      deps: DependencyList = [],
   ): SCHEMA['ҨField'] {
      let serial: any = null

      try {
         const prev = localStorage.getItem(key)
         const parsed = prev ? JSON.parse(prev) : null
         serial = parsed
      } catch {
         /* empty */
      }

      const finalDeps = [key, this.builder._uid, ...deps]
      return this.use(
         schemaExt,
         {
            serial: () => serial,
            onSerialChange: (root) => {
               localStorage.setItem(key, JSON.stringify(root.zSerial))
            },
         },
         finalDeps,
      )
   }

   /** simple way to defined forms and in react components */
   useLocalstorageOnlyValid<SCHEMA extends CSchema>(
      key: string,
      schemaExt: SCHEMA | ((form: BUILDER) => SCHEMA),
      deps: DependencyList = [],
   ): SCHEMA['ҨField'] {
      let serial: any = null

      try {
         const prev = localStorage.getItem(key)
         const parsed = prev ? JSON.parse(prev) : null
         serial = parsed
      } catch {
         /* empty */
      }

      const finalDeps = [key, this.builder._uid, ...deps]
      return this.use(
         schemaExt,
         {
            serial: () => serial,
            onSerialChange: (root) => {
               if (root.zIsValid) localStorage.setItem(key, JSON.stringify(root.zSerial))
            },
         },
         finalDeps,
      )
   }

   // #region misc
   /** simple alias to create a new Form */
   define<SCHEMA extends CSchema>(schemaFn: (form: BUILDER) => SCHEMA): SCHEMA {
      return schemaFn(this.builder)
   }

   /** eval schema if it's a function */
   private evalSchema<SCHEMA extends CSchema>(buildFn: SCHEMA | ((form: BUILDER) => SCHEMA)): SCHEMA {
      if (typeof buildFn === 'function') return buildFn(this.builder as BUILDER)
      return buildFn
   }
}
