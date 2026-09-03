export default function QPUsLoading() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6 pt-8">
      <div className="animate-pulse space-y-4">
        {/* Header skeleton */}
        <div className="flex items-start justify-between mb-8">
          <div className="space-y-2">
            <div className="h-8 w-64 rounded-[var(--radius-md)] bg-[var(--color-bg-panel)]" />
            <div className="h-4 w-96 rounded-[var(--radius-md)] bg-[var(--color-bg-panel)]" />
          </div>
          <div className="h-7 w-24 rounded-full bg-[var(--color-bg-panel)]" />
        </div>

        {/* Filter bar skeleton */}
        <div className="h-24 w-full rounded-[var(--radius-lg)] bg-[var(--color-bg-panel)] border border-[var(--color-border)]" />

        {/* Controls row skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-20 rounded-[var(--radius-md)] bg-[var(--color-bg-panel)]" />
          <div className="h-8 w-36 rounded-[var(--radius-md)] bg-[var(--color-bg-panel)]" />
        </div>

        {/* Table skeleton */}
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden">
          {/* Table header */}
          <div className="h-10 bg-[var(--color-bg-raised)] border-b border-[var(--color-border)]" />
          {/* Table rows */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-[60px] border-b border-[var(--color-border-subtle)] last:border-none bg-[var(--color-bg-panel)]"
              style={{ opacity: 1 - i * 0.08 }}
            >
              <div className="flex items-center gap-6 px-4 h-full">
                <div className="w-4 h-4 rounded bg-[var(--color-bg-overlay)]" />
                <div className="flex-1 h-4 rounded bg-[var(--color-bg-overlay)]" />
                <div className="w-16 h-4 rounded bg-[var(--color-bg-overlay)]" />
                <div className="w-24 h-5 rounded-full bg-[var(--color-bg-overlay)]" />
                <div className="w-12 h-4 rounded bg-[var(--color-bg-overlay)]" />
                <div className="w-20 h-4 rounded bg-[var(--color-bg-overlay)]" />
                <div className="w-24 h-5 rounded-full bg-[var(--color-bg-overlay)]" />
                <div className="w-12 h-4 rounded bg-[var(--color-bg-overlay)]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
