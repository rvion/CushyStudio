interface IDomRect {
   top: number
   bottom: number
   height: number
   left: number
   right: number
   width: number
   x: number
   y: number
}

export interface VirtualDomRect extends IDomRect {}
export class VirtualDomRect {
   constructor(p: { height: number; width: number; x: number; y: number }) {
      this.top = p.y
      this.bottom = p.y + p.height
      this.height = 1
      this.left = p.x
      this.right = p.x + p.width
      this.width = 1
      this.x = p.x
      this.y = p.y
   }
   toJSON(): IDomRect {
      return {
         top: this.top,
         bottom: this.bottom,
         height: this.height,
         left: this.left,
         right: this.right,
         width: this.width,
         x: this.x,
         y: this.y,
      }
   }
}
