import { describe, expect, it } from 'bun:test'

import {
   computePlacement_autoVerticalEndFixedSize,
   computePlacement_autoVerticalStartFixedSize,
} from './compute-placement'

describe('compute-placement', () => {
   describe('computePlacement_autoVerticalStartFixedSize', () => {
      describe('when the anchor is in the first half of the screen', () => {
         describe('when the shell is not overflowing the window', () => {
            it('should position the shell just below the anchor', () => {
               const result = computePlacement_autoVerticalStartFixedSize({
                  anchor: { top: 20, left: 10, height: 100 },
                  shell: { width: 200, height: 300 },
                  window: { innerHeight: 800, innerWidth: 1000 },
               })

               expect(result).toEqual({ left: 10, top: 120 })
            })
         })

         describe('when the shell is overflowing the window on the right', () => {
            it('should position the shell just below the anchor and inside the window', () => {
               const result = computePlacement_autoVerticalStartFixedSize({
                  anchor: { top: 20, left: 800, height: 100 },
                  shell: { width: 992, height: 300 },
                  window: { innerHeight: 800, innerWidth: 1000 },
               })

               expect(result).toEqual({ left: 8, top: 120 })
            })
         })

         describe('when the shell is overflowing the window at the bottom', () => {
            it('should position the shell higher', () => {
               const result = computePlacement_autoVerticalStartFixedSize({
                  anchor: { top: 20, left: 10, height: 100 },
                  shell: { width: 200, height: 798 },
                  window: { innerHeight: 800, innerWidth: 1000 },
               })

               expect(result).toEqual({ left: 10, top: 2 })
            })

            it('should not position the shell above 0', () => {
               const result = computePlacement_autoVerticalStartFixedSize({
                  anchor: { top: 20, left: 10, height: 100 },
                  shell: { width: 200, height: 1000 },
                  window: { innerHeight: 800, innerWidth: 1000 },
               })

               expect(result).toEqual({ left: 10, top: 0 })
            })
         })
      })

      describe('when the anchor is in the second half of the screen', () => {
         describe('when the shell is not overflowing the window', () => {
            it('should position the shell just above the anchor', () => {
               const result = computePlacement_autoVerticalStartFixedSize({
                  anchor: { top: 700, left: 10, height: 100 },
                  shell: { width: 200, height: 300 },
                  window: { innerHeight: 800, innerWidth: 1000 },
               })

               expect(result).toEqual({ left: 10, bottom: 100 })
            })
         })

         describe('when the shell is overflowing the window on the right', () => {
            it('should position the shell just above the anchor and inside the window', () => {
               const result = computePlacement_autoVerticalStartFixedSize({
                  anchor: { top: 700, left: 800, height: 100 },
                  shell: { width: 992, height: 300 },
                  window: { innerHeight: 800, innerWidth: 1000 },
               })

               expect(result).toEqual({ left: 8, bottom: 100 })
            })
         })

         describe('when the shell is overflowing the window at the top', () => {
            it('should position the shell lower', () => {
               const result = computePlacement_autoVerticalStartFixedSize({
                  anchor: { top: 700, left: 10, height: 100 },
                  shell: { width: 200, height: 798 },
                  window: { innerHeight: 800, innerWidth: 1000 },
               })

               expect(result).toEqual({ left: 10, bottom: 2 })
            })

            it('should position the shell below 0', () => {
               const result = computePlacement_autoVerticalStartFixedSize({
                  anchor: { top: 700, left: 10, height: 100 },
                  shell: { width: 200, height: 1000 },
                  window: { innerHeight: 800, innerWidth: 1000 },
               })

               expect(result).toEqual({ left: 10, bottom: -200 })
            })
         })
      })
   })

   describe('computePlacement_autoVerticalEndFixedSize', () => {
      describe('when the anchor is in the first half of the screen', () => {
         describe('when the shell is not overflowing the window', () => {
            it('should position the shell just below the anchor', () => {
               const result = computePlacement_autoVerticalEndFixedSize({
                  anchor: { top: 20, right: 10, height: 100 },
                  shell: { width: 200, height: 300 },
                  window: { innerHeight: 800, innerWidth: 1000 },
               })

               expect(result).toEqual({ right: 10, top: 120 })
            })
         })

         describe('when the shell is overflowing the window on the right', () => {
            it('should position the shell just below the anchor and inside the window', () => {
               const result = computePlacement_autoVerticalEndFixedSize({
                  anchor: { top: 20, right: 800, height: 100 },
                  shell: { width: 992, height: 300 },
                  window: { innerHeight: 800, innerWidth: 1000 },
               })

               expect(result).toEqual({ right: 8, top: 120 })
            })
         })

         describe('when the shell is overflowing the window at the bottom', () => {
            it('should position the shell higher', () => {
               const result = computePlacement_autoVerticalEndFixedSize({
                  anchor: { top: 20, right: 10, height: 100 },
                  shell: { width: 200, height: 798 },
                  window: { innerHeight: 800, innerWidth: 1000 },
               })

               expect(result).toEqual({ right: 10, top: 2 })
            })

            it('should not position the shell above 0', () => {
               const result = computePlacement_autoVerticalEndFixedSize({
                  anchor: { top: 20, right: 10, height: 100 },
                  shell: { width: 200, height: 1000 },
                  window: { innerHeight: 800, innerWidth: 1000 },
               })

               expect(result).toEqual({ right: 10, top: 0 })
            })
         })
      })

      describe('when the anchor is in the second half of the screen', () => {
         describe('when the shell is not overflowing the window', () => {
            it('should position the shell just above the anchor', () => {
               const result = computePlacement_autoVerticalEndFixedSize({
                  anchor: { top: 700, right: 10, height: 100 },
                  shell: { width: 200, height: 300 },
                  window: { innerHeight: 800, innerWidth: 1000 },
               })

               expect(result).toEqual({ right: 10, bottom: 100 })
            })
         })

         describe('when the shell is overflowing the window on the right', () => {
            it('should position the shell just above the anchor and inside the window', () => {
               const result = computePlacement_autoVerticalEndFixedSize({
                  anchor: { top: 700, right: 800, height: 100 },
                  shell: { width: 992, height: 300 },
                  window: { innerHeight: 800, innerWidth: 1000 },
               })

               expect(result).toEqual({ right: 8, bottom: 100 })
            })
         })

         describe('when the shell is overflowing the window at the top', () => {
            it('should position the shell lower', () => {
               const result = computePlacement_autoVerticalEndFixedSize({
                  anchor: { top: 700, right: 10, height: 100 },
                  shell: { width: 200, height: 798 },
                  window: { innerHeight: 800, innerWidth: 1000 },
               })

               expect(result).toEqual({ right: 10, bottom: 2 })
            })

            it('should position the shell below 0', () => {
               const result = computePlacement_autoVerticalEndFixedSize({
                  anchor: { top: 700, right: 10, height: 100 },
                  shell: { width: 200, height: 1000 },
                  window: { innerHeight: 800, innerWidth: 1000 },
               })

               expect(result).toEqual({ right: 10, bottom: -200 })
            })
         })
      })
   })
})
