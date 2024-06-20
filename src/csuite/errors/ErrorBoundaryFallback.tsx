import { JsonViewUI } from '../json/JsonViewUI'

export const ErrorBoundaryFallback = (p: {
    // 🔴 pretty unsafe
    error: any
    resetErrorBoundary: (...args: any[]) => void
}) => {
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
