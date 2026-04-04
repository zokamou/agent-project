# AGENTS.md

## Purpose

This project should stay small, clean, readable, and easy to extend.

When making changes, prefer the simplest structure that keeps responsibilities clear.
Do not overengineer. Do not create extra files, abstractions, or layers unless they are clearly needed.

---

## Core Principles

- Keep files short and focused.
- Prefer clarity over cleverness.
- Use descriptive names for variables, functions, props, and files.
- Avoid unnecessary abstraction.
- Avoid unnecessary file splitting.
- Keep logic close to where it is used.
- Only extract code when it is clearly reused or meaningfully improves readability.

---

## General Code Style

- Use fully named, descriptive variables.
- Avoid abbreviations unless they are standard and obvious.
- Good: `businessContext`, `knowledgeItems`, `suggestedResponse`
- Bad: `busCtx`, `items`, `resp`

- Prefer straightforward control flow.
- Prefer readable conditionals over compact one-liners.
- Keep functions small and purpose-driven.

---

## Frontend Rules

### Component Structure

Frontend code should be organized into components and pages, but not over-separated.

- Keep page-specific logic in the page or feature components that use it.
- Keep shared UI in reusable components only when it is actually reused.
- Do not move logic upward unless multiple children genuinely need it.

### Colocation Rule

If logic is only used in one component, define it in that component.

Example:
- If a `KnowledgeResults` component is the only place that fetches or transforms knowledge results, keep that logic inside `KnowledgeResults`.
- Do not move that logic to a parent component just to pass it down through props.

Avoid patterns like:
- parent owns all logic
- child just receives many props
- functions are passed down multiple levels unnecessarily

Prefer:
- logic lives where it is used
- props stay minimal
- components remain readable

### Hooks

- Prefer `useEffect` when side effects are needed.
- Avoid unnecessary `useRef`.
- Avoid unnecessary `useMemo`.
- Do not add `useMemo` or `useRef` preemptively.
- Only use them when there is a real, clear need.

Good:
- `useEffect` for fetching data on mount or on dependency change
- local state for UI interactions

Bad:
- wrapping simple derived values in `useMemo`
- using `useRef` when normal state or local variables are enough

### State

- Keep state as local as possible.
- Do not lift state unless multiple components truly need to share it.
- Do not introduce global state libraries for this project.

### Frontend File Organization

Use a practical, lightweight structure.

Preferred pattern:

- `pages/` for page-level components
- `components/` for reusable UI
- page-specific subcomponents can live near the page if only used there

Do not create folders just to look structured.

---

## Backend Rules

### Backend Structure

The backend should be clean and modular, but not enterprise-heavy.

- Keep route handlers thin.
- Put real logic in focused service/module files.
- Keep helpers close to the feature they support.
- Avoid creating many layers unless there is a real benefit.

### Avoid Over-Architecture

Do not add unnecessary:
- controllers
- repositories
- interfaces
- factories
- dependency injection
- DTO layers
- service layers for trivial logic

Use only the amount of structure the current project actually needs.

### Backend File Organization

Prefer feature-based organization over generic architectural folders when possible.

Good:
- retrieval logic grouped together
- LLM prompt generation grouped together
- knowledge loading/parsing grouped together

Bad:
- many folders with one tiny file each
- abstract patterns without clear value

---

## File Creation Rules

Before creating a new file, ask:

1. Is this logic reused in more than one place?
2. Is the current file becoming too large or hard to read?
3. Does this extraction make the code easier to understand?

If the answer is no, keep the code where it is.

Do not split files aggressively.
Do not create "placeholder architecture."

---

## Naming Rules

Use full, explicit names.

Examples:
- `businessContext`
- `customerQuestion`
- `relatedKnowledgeItems`
- `generateSuggestedResponse`

Avoid:
- `busContext`
- `custQ`
- `relItems`
- `genResp`

File names should also be descriptive and readable.

Good:
- `retrieveKnowledgeItems.ts`
- `generateSuggestedResponse.ts`
- `KnowledgeResults.tsx`

Bad:
- `utils.ts`
- `helpers.ts`
- `data.ts`

Unless the file truly contains broad shared utilities.

---

## Prompting / LLM Rules

- Keep prompts structured and readable.
- Treat prompts as behavior instructions, not as a place to store business knowledge.
- Dynamic knowledge should come from system-provided context, not be hardcoded into prompts.
- Keep prompt files focused and easy to inspect.
- Avoid bloated prompt builders unless necessary.

---

## UI Expectations

- Prioritize clarity and usability.
- Keep layouts simple.
- Use component library primitives when possible.
- Avoid unnecessary custom CSS complexity.
- The UI should feel clean and functional, not overdesigned.

---

## What to Avoid

Avoid:
- giant files
- giant prop chains
- unnecessary lifting of state
- unnecessary `useMemo`
- unnecessary `useRef`
- over-abstraction
- over-separation
- vague naming
- file explosion
- patterns added just because they seem "professional"

---

## What Good Looks Like

Good code in this project should feel:

- clear
- compact
- descriptive
- local
- practical
- easy to scan
- easy to explain in an interview

The project should look thoughtfully structured, not overbuilt.

---

## Decision Heuristic

When in doubt, choose the version that:

- uses fewer files
- keeps logic close to usage
- is easier to read
- is easier to explain
- does not introduce abstraction too early

---

## Final Rule

This project should be intentionally structured, not artificially complex.

If a change makes the codebase feel heavier without making it clearer, do not do it.