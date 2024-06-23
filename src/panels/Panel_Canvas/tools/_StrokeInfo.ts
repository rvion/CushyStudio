export class Stroke {
    constructor(pos?: { x: number; y: number }) {
        if (pos) this.reset(pos)
    }

    startX: number = 0
    startY: number = 0

    prevX: number = 0
    prevY: number = 0

    x: number = 0
    y: number = 0

    reset({ x, y }: { x: number; y: number } = { x: 0, y: 0 }) {
        this.startX = x
        this.startY = y
        this.prevX = x
        this.prevY = y
        this.x = x
        this.y = y
    }

    get offsetXFromStart(): number {
        return this.x - this.startX
    }

    get offsetXFromPrev(): number {
        return this.x - this.prevX
    }

    get offsetYFromStart(): number {
        return this.y - this.startY
    }

    get offsetYFromPrev(): number {
        return this.y - this.prevY
    }

    get euclidianDistanceFromStart(): number {
        return Math.sqrt(
            (this.x - this.startX) ** 2 + //
                (this.y - this.startY) ** 2,
        )
    }

    get euclidianDistanceFromPrev(): number {
        return Math.sqrt(
            (this.x - this.prevX) ** 2 + //
                (this.y - this.prevY) ** 2,
        )
    }
}
