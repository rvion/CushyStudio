import * as vscode from 'vscode'
import type { CushyFile } from './testTree'

// type Operator = '+' | '-' | '*' | '/'

export class CushyFlow {
    constructor(
        public file: CushyFile,
        public range: vscode.Range,
        public flowName: string,
        // private readonly a: number,
        // private readonly operator: Operator,
        // private readonly b: number,
        // private readonly expected: number,
        public generation: number,
    ) {}

    // getLabel() {
    //     // return
    //     return `${this.a} ${this.operator} ${this.b} = ${this.expected}`
    // }
    expected = 3
    async run(item: vscode.TestItem, options: vscode.TestRun): Promise<void> {
        const start = Date.now()
        await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))
        const actual = this.evaluate()
        const duration = Date.now() - start

        if (actual === this.expected) {
            options.passed(item, duration)
        } else {
            // const message = vscode.TestMessage.diff(`Expected ${item.label}`, String(this.expected), String(actual));
            const message = new vscode.TestMessage(
                new vscode.MarkdownString()
                    .appendMarkdown(`### Expected ${item.label}`)
                    .appendCodeblock(String(this.expected), 'text'),
            )
            message.location = new vscode.Location(item.uri!, item.range!)
            options.failed(item, message, duration)
        }
    }

    private evaluate() {
        return 3
    }
}
