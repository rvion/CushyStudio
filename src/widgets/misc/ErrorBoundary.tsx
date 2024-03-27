import { FallbackProps } from 'react-error-boundary'

import { JsonViewUI } from '../workspace/JsonViewUI'

export const ErrorBoundaryFallback = (p: FallbackProps) => {
    // { error, resetErrorBoundary }: any
    // Call resetErrorBoundary() to reset the error boundary and retry the render.

    return (
        <div role='alert'>
            <p tw='flex gap-2 items-center'>
                <span onClick={() => p.resetErrorBoundary()} tw='btn btn-square btn-sm btn-error rounded'>
                    <span className='material-symbols-outlined'>refresh</span>
                </span>
                Something went wrong:
            </p>
            <pre style={{ color: 'red' }}>{p.error?.message}</pre>

            {p.error.extraJSON && <JsonViewUI value={p.error.extraJSON}></JsonViewUI>}
            {p.error?.stack && typeof p.error.stack === 'string' && (
                <pre tw='text-sm'>
                    {p.error.stack.split('\n').map((line: string, i: number) => (
                        <div key={i}>{line}</div>
                    ))}
                </pre>
            )}
        </div>
    )
}
