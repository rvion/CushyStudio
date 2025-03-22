import { describe, expect, it } from 'vitest'

import { sb } from '../simple/SimpleFactory'

// most people will only have srgb monitors, without p3 nor rec 2020
// we must make sure we properly detect when our autocontrast algorithm
// offer colors outside of the available srgb gamut

describe('field schema string representations', () => {
   it('works for basic fields', () => {
      const schema = sb.fields({
         x: sb.string(),
         y: sb.string(),
      })
      expect(schema.codeForTypescriptValue()).toBe(
         [
            //
            `{`,
            `   x: string,`,
            `   y: string,`,
            `}`,
         ].join('\n'),
      )
   })
   it('works for list and optional', () => {
      const schema = sb.fields({
         x: sb.string(),
         y: sb.int().optional(),
         z: sb.bool().list(),
      })
      expect(schema.codeForTypescriptValue()).toBe(
         [
            //
            `{`,
            `   x: string,`,
            `   y: Maybe<number>,`,
            `   z: boolean[],`,
            `}`,
         ].join('\n'),
      )
   })
   it('works for link and shared', () => {
      const schema = sb.fields({
         // very cool way to add volatile stuff for models
         x1: sb.linkedFromExternalField(sb.number().create()),
         x2: sb.linkedFromChannelId('<does-not-exists>', sb.number()),
      })

      expect(schema.codeForTypescriptValue()).toBe(
         [
            //
            'Z.Link<number,{',
            '   x: Z.Shared<number>,',
            '}>',
         ].join('\n'),
      )
   })
   it('support custom fields', () => {
      const schema = sb.fields({
         x: sb.string(),
         y: sb.int().optional(),
         z: sb.bool().list(),
      })
      expect(schema.codeForTypescriptValue()).toBe(
         [
            //
            `{`,
            `   x: string,`,
            `   y: Maybe<number>,`,
            `   z: boolean[],`,
            `}`,
         ].join('\n'),
      )
   })
})
