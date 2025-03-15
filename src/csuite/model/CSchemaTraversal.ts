import type { CSchema } from './CSchema'
import type { SchemaDictWithPaths, SchemaWithSerialPath } from './FieldConstructor'

import { computed } from 'mobx'

import { Object_keys } from '../../../../front/reusable/helpers/Object_keys.utils'
import { isSchemaOptional } from '../fields/WidgetUI.DI'
import { bang } from '../utils/bang'
import { searchMatches } from '../utils/searchMatches'

export type NeighborhoodName = 'children' | 'travels'
export type NeighborhoodPath = Flavor<string, 'NeighborhoodPath'>
export class CSchemaNeighborhood<KEY extends string> {
   constructor(
      public name: NeighborhoodName,
      public schema: CSchema,
      public getEdges: () => SchemaDictWithPaths,
   ) {}

   @computed get edges(): SchemaDictWithPaths {
      return this.getEdges()
   }

   @computed get edgeList(): [key: KEY, schema: SchemaWithSerialPath][] {
      return Object.entries(this.getEdges()) as any
   }

   @computed get keys(): KEY[] {
      return Object_keys(this.edges) as KEY[]
   }

   // --------------------------------------------------------------------
   get(key: KEY | KEY[]): CSchema {
      if (Array.isArray(key)) return this._getAtPath(key)
      return this._getOne(key)
   }
   getOrNull(key: KEY): Maybe<CSchema> {
      return this.edges[key]?.schema
   }

   private _getOne(key: KEY): CSchema {
      const edge = this.edges[key]
      if (edge == null) {
         const availableKeys = this.getPathsAndSchemaNoFollow().map((i) => i.at)
         const errMsg = `❌ key ${key} does not exist in schema ${this.schema._uid}(${this.schema.codeForTypescriptValue()})'s ${this.name} neighboorhood (available keys: ${availableKeys})`
         throw new Error(errMsg)
      }
      return edge.schema
   }

   private _getAtPath(keys: KEY[]): CSchema {
      let at: CSchema = this.schema
      for (const key of keys) at = at.neighboors[this.name]._getOne(key)
      return at
   }
   // --------------------------------------------------------------------
   getP(key: KEY | KEY[]): { schema: CSchema; serialPath: string | null } {
      if (Array.isArray(key)) return this._getAtPathP(key)
      return this._getOneP(key)
   }
   getOrNullP(key: KEY): Maybe<CSchema> {
      return this.edges[key]?.schema
   }
   // 🟢
   private _getOneP(key: KEY): { schema: CSchema; serialPath: string | null } {
      const errMsg = `❌ key ${key} does not exist in schema ${this.schema._uid}'s ${this.name} neighboorhood`
      const zz = bang(this.edges[key], errMsg)
      return { schema: zz.schema, serialPath: zz.serialPath }
   }

   private _getAtPathP(keys: KEY[]): { schema: CSchema; serialPath: string | null } {
      let at: CSchema = this.schema
      const serialPath: string[] = []
      let seenANull = false
      for (const key of keys) {
         const zz = at.neighboors[this.name]._getOneP(key)
         at = zz.schema
         if (zz.serialPath == null) seenANull = true
         else serialPath.push(zz.serialPath)
      }
      const finalSerialPath: string | null = seenANull ? null : serialPath.join('.')
      return { schema: at, serialPath: finalSerialPath }
   }
   // --------------------------------------------------------------------
   /** return all paths to neighboors in a `maxDepth radius */
   getPaths(maxDepth = 3): NeighborhoodPath[] {
      return this.getPathsAndSchema({ maxDepth }).map(({ at }) => at)
   }

   /** return all schemas and their paths to neighboors in a `maxDepth rradius */
   getPathsAndSchema(x: {
      maxDepth: number
      // if false, do not even attempt to go deeper
      enter?: (schema: Z.Schema, at: NeighborhoodPath) => boolean
      // step 2. if accept is present,
      accept?: (schema: Z.Schema, at: NeighborhoodPath) => boolean
   }): SchemaGraphNode[] {
      const enter = x.enter ?? ((): boolean => true)
      const accept = x.accept ?? ((): boolean => true)
      const maxDepth = x.maxDepth ?? 3
      if (maxDepth <= 0) return []
      let leaves: SchemaGraphNode[] = [{ at: '$', schema: this.schema }]
      const out: SchemaGraphNode[] = leaves.filter((i) => accept(i.schema, i.at))
      for (let i = 0; i < maxDepth; i++) {
         const nextLeaves: SchemaGraphNode[] = []
         for (const { at, schema } of leaves) {
            if (!enter(schema, at)) continue
            const XX = schema.neighboors[this.name].edges
            nextLeaves.push(
               ...Object.entries(XX).map(([k, v]) => ({
                  at: `${at}.${k}`,
                  schema: v.schema,
               })),
            )
         }
         out.push(...nextLeaves.filter((i) => accept(i.schema, i.at)))
         leaves = nextLeaves
      }
      return out
   }

   getPathsAndSchemaNoFollow(): SchemaGraphNode[] {
      return this.getPathsAndSchema({
         maxDepth: 99,
         // if false, do not even attempt to go deeper
         enter: (schema: Z.Schema, at) => {
            const realSchema = isSchemaOptional(schema) ? schema.config.schema : schema
            if (realSchema.type === 'relationship') return false
            if (realSchema.type === 'relationships') return false
            if (realSchema.type === 'list') return false
            return true
         },
         // step 2. if accept is present,
         accept: (schema, at) => {
            const realSchema = isSchemaOptional(schema) ? schema.config.schema : schema
            if (realSchema.type === 'group') return false
            if (realSchema.type === 'choices') return false
            if (realSchema.type === 'list') return false
            if (realSchema.type === 'relationships') return false
            return true
         },
      })
   }

   /** mini selector implementation for schema */
   find(queries: string[]): SchemaGraphNode[] {
      let leaves: SchemaGraphNode[] = [{ at: '$', schema: this.schema }]
      const out: SchemaGraphNode[] = []
      for (const query of queries) {
         let nextLeaves: SchemaGraphNode[] = []
         for (const { at, schema } of leaves) {
            const XX = schema.neighboors[this.name].edges
            nextLeaves.push(
               ...Object.entries(XX).map(([k, v]) => ({
                  at: `${at}.${k}`,
                  schema: v.schema,
               })),
            )
            nextLeaves = nextLeaves.filter((t) => searchMatches(t.at, query))
         }
         out.push(...nextLeaves)
         leaves = nextLeaves
      }
      return leaves
   }
}

type ColExpr = Flavor<string, 'NeighborhoodPath'>
export type SchemaGraphNode = { at: ColExpr; schema: CSchema }
