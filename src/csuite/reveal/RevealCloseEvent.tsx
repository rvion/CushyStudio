import type { RevealHideReason } from './RevealProps'

export class RevealCloseEvent {
   private prevented: boolean = false

   constructor(public readonly reason: RevealHideReason) {}

   preventDefault(): void {
      this.prevented = true
   }

   get isDefaultPrevented(): boolean {
      return this.prevented
   }
}
