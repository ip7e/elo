/**
 * EmptyChart component displays a placeholder message when there are no games.
 */
export function EmptyChart() {
  return (
    <div className="flex h-full min-h-16 w-full items-center justify-center">
      <span className="rounded-md border border-border bg-background px-2 py-1 font-mono text-sm text-muted">
        no games yet
      </span>
    </div>
  )
}
