import { FallbackProps } from 'react-error-boundary'

export function ErrorBoundaryFallback(p: FallbackProps) {
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
        </div>
    )
}
