import ts from 'typescript'

// Define a type for the output objects
export type PossibleNodeInputAssignation = {
    col: number
    row: number
    nodeName: string
    paramName: string
}

// Define the function to extract information from a function call expression
export function extractInfoFromFunctionCall(node: ts.CallExpression): PossibleNodeInputAssignation[] {
    const result: PossibleNodeInputAssignation[] = []

    // Get the name of the function being called
    const functionName = node.expression.getText()
    const nodeName = functionName.split('.').pop() ?? functionName

    // Get the position of the function call in the source code
    // const { line, character } = ts.getLineAndCharacterOfPosition(node.getSourceFile(), node.getStart())

    // Loop through each argument of the function call
    node.arguments.forEach((arg, index) => {
        // If the argument is an object literal, extract its properties
        if (ts.isObjectLiteralExpression(arg)) {
            arg.properties.forEach((prop) => {
                if (ts.isPropertyAssignment(prop)) {
                    const paramName = prop.name.getText()
                    const { line, character } = ts.getLineAndCharacterOfPosition(prop.getSourceFile(), prop.getStart())

                    result.push({
                        col: character + 1, // + 1,
                        row: line, // + 1,
                        nodeName: nodeName, //functionName,
                        paramName,
                    })
                }
            })
        } else {
            // If the argument is not an object literal, assume it is a variable name
            const { line, character } = ts.getLineAndCharacterOfPosition(arg.getSourceFile(), arg.getStart())
            result.push({
                col: character, // + 1,
                row: line, // + 1,
                nodeName: nodeName, //functionName,
                paramName: arg.getText(),
            })
        }
    })

    return result
}

export const extractAllPossibleNodeInputAssignment = (sourceCode: string): PossibleNodeInputAssignation[] => {
    const sourceFile = ts.createSourceFile('test.ts', sourceCode, ts.ScriptTarget.ES2015, true)
    const result: PossibleNodeInputAssignation[] = []
    ts.forEachChild(sourceFile, function traverse(node) {
        if (ts.isCallExpression(node)) {
            result.push(...extractInfoFromFunctionCall(node))
        }
        ts.forEachChild(node, traverse)
    })
    return result
}
