/**
 * Shared neobrutalism interaction classes.
 *
 * `press` is the signature effect: the element slides toward its shadow by
 * exactly the amount the shadow shrinks, so its bottom-right edge stays pinned
 * and it reads as being physically pushed into the page.
 */
export const press =
	"transition-all duration-75 shadow-nb hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-nb-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none";

export const focusRing =
	"focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-nb-sky";

export const field =
	"w-full border-4 border-nb-ink bg-white px-4 py-3 text-base font-medium text-nb-ink transition-shadow placeholder:text-nb-ink/40 focus:shadow-nb focus:outline-none";

export const label =
	"block font-heading text-xs uppercase tracking-widest text-nb-ink";

export const primaryButton =
	"flex w-full items-center justify-center gap-2 border-4 border-nb-ink bg-nb-lime px-6 py-3.5 font-heading text-base uppercase tracking-wide text-nb-ink disabled:pointer-events-none disabled:opacity-60";
