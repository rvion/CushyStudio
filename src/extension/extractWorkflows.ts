import * as vscode from 'vscode'
import { bang } from '../utils/bang'
import { logger } from '../logger/logger'

const WorkflowRe = /^^WORKFLOW\(['"](.*)['"]/

export const extractWorkflows = (
    text: string,
    events: {
        onWorkflowFound(range: vscode.Range, workflowName: string): void
        // onHeading(range: vscode.Range, name: string, depth: number): void
    },
) => {
    const lines = text.split('\n')

    for (let lineNo = 0; lineNo < lines.length; lineNo++) {
        const line = lines[lineNo]

        const isWorkflow = WorkflowRe.exec(line)
        if (isWorkflow) {
            logger().info(`found workflow "${isWorkflow?.[1]}"`)
            const name = bang(isWorkflow[1])
            // const [, a, operator, b, expected] = test;
            const range = new vscode.Range(
                //
                new vscode.Position(lineNo, 0),
                new vscode.Position(lineNo, line.length),
            )
            events.onWorkflowFound(range, name)
            continue
        }

        // const test = testRe.exec(line);
        // if (test) {
        // 	const [, a, operator, b, expected] = test;
        // 	const range = new vscode.Range(new vscode.Position(lineNo, 0), new vscode.Position(lineNo, test[0].length));
        // 	events.onTest(range, Number(a), operator, Number(b), Number(expected));
        // 	continue;
        // }

        // const heading = headingRe.exec(line);
        // if (heading) {
        // 	const [, pounds, name] = heading;
        // 	const range = new vscode.Range(new vscode.Position(lineNo, 0), new vscode.Position(lineNo, line.length));
        // 	events.onHeading(range, name, pounds.length);
        // }
    }
}

// const headingRe = /^(#+)\s*(.+)$/
// const WorkflowRe = /^WORKFLOW\(/
// const testRe = /^([0-9]+)\s*([+*/-])\s*([0-9]+)\s*=\s*([0-9]+)/
