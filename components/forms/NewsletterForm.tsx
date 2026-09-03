'use client'

export function NewsletterForm() {
  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="you@example.com"
        className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] bg-[var(--color-bg-base)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-2 focus:outline-[var(--color-accent)] focus:border-transparent"
        aria-label="Email address"
      />
      <button
        type="submit"
        className="w-full py-2 text-sm font-medium rounded-[var(--radius-md)] bg-[var(--color-accent)] text-[var(--color-bg-base)] hover:opacity-90 transition-opacity"
      >
        Subscribe
      </button>
    </form>
  )
}
