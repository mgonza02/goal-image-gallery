# SOLID Principles — goal-image-gallery

This document describes how the five SOLID design principles are applied and enforced throughout this project.

---

## S — Single Responsibility Principle

> *A module should have one, and only one, reason to change.*

Each file in this library has one clearly scoped responsibility:

| File | Responsibility |
|---|---|
| `GoalImageGallery.js` | Orchestrates props, state wiring and renders sub-components |
| `components/ImageGalleryGrid.js` | Renders the responsive image grid layout |
| `components/ImageGalleryItem.js` | Renders a single image tile with its action controls |
| `components/ImageGalleryModal.js` | Full-screen modal viewer with zoom and navigation |
| `components/ImageGalleryEmptyState.js` | Renders the empty-state UI when no images exist |
| `hooks/use-image-gallery.js` | Encapsulates all gallery state logic (selection, upload, zoom, keyboard) |
| `utils/image-utils.js` | Pure utility functions for URL resolution and error fallback |
| `styles/styled-components.js` | Centralises all theme-aware style factory functions |

**Rules:**
- No component should contain business logic that belongs in a hook.
- No hook should contain JSX or MUI imports.
- No utility function should hold stateful React code.

---

## O — Open/Closed Principle

> *Software entities should be open for extension but closed for modification.*

The component exposes a **slots** system that lets consumers replace any sub-component without touching library source:

```jsx
<GoalImageGallery
  slots={{
    imageSelector: MyCustomSelector,   // replace upload UI
    emptyState: MyBrandedEmptyState,   // replace empty state
    imageItem: MyCustomTile            // replace individual tile
  }}
  slotProps={{
    imageSelector: { accept: 'image/webp' }
  }}
/>
```

**Rules:**
- New upload methods, themes, or UI variants must be added via props/slots, never by branching inside existing components.
- Style customisation must go through the `sx` prop or `slotProps`, not inline conditional logic.

---

## L — Liskov Substitution Principle

> *Subtypes must be substitutable for their base types without altering correctness.*

All slot overrides and custom render props must honour the same **interface contract** as the default implementations:

```ts
// ImageSelector slot contract
interface ImageSelectorProps {
  onFilesSelected: (files: File[]) => void;
  onUrlSubmit:     (url: string)   => void;
  onCancel:        ()              => void;
  multiple:        boolean;
  maxFileSize:     number;
  accept:          string;
}
```

**Rules:**
- A custom `imageSelector` slot component must accept and call the same callbacks as the default one.
- A custom `emptyState` must accept `{ emptyMessage, updatable, onAddImage }` and render something meaningful for all combinations.
- Never assume the slot receives extra undocumented props — rely only on the published interface.

---

## I — Interface Segregation Principle

> *Clients should not be forced to depend on interfaces they do not use.*

Props are grouped by concern and all non-required props have sensible defaults:

```jsx
// Read-only consumer — needs almost nothing
<GoalImageGallery imageCodes={codes} canEdit={false} />

// Full-edit consumer — opts into each capability individually
<GoalImageGallery
  imageCodes={codes}
  canEdit
  multiple
  allowDownload
  showImageInfo
  onUploadImage={upload}
  onRemoveImage={remove}
/>
```

**Rules:**
- Do not add required props. Every new prop must default to a safe no-op or `false`.
- Separate upload-related props (`onUploadImage`, `maxFileSize`, `accept`) from display-related props (`showImageInfo`, `allowDownload`, `noImageUrl`).
- Hooks follow the same rule: `useImageGallery`, `useImageZoom`, `useClipboard`, and `useKeyboardNavigation` are each consumed independently.

---

## D — Dependency Inversion Principle

> *High-level modules should not depend on low-level modules. Both should depend on abstractions.*

`GoalImageGallery` depends on **abstractions (hooks & prop callbacks)**, never on concrete upload implementations:

```
GoalImageGallery          ← high-level orchestrator
    │
    ├── useImageGallery() ← state abstraction (hook)
    │       └── calls onUploadImage(file) ← injected by consumer
    │
    ├── useClipboard()    ← clipboard abstraction
    └── useImageZoom()    ← zoom abstraction
```

The library never imports `axios`, `fetch`, or any HTTP client. Upload logic lives entirely in the consumer-provided `onUploadImage` callback.

**Rules:**
- The library must never contain direct API calls. All async operations are delegated to injected callbacks.
- Hooks must not import from `components/`. Components may import from `hooks/` and `utils/`.
- `styled-components.js` must not import from any component — components import from it, not the reverse.

---

## Dependency Graph (allowed directions)

```
GoalImageGallery.js
    ↓
components/          hooks/           utils/
    ↓                   ↓                ↓
styles/styled-components.js     image-utils.js
```

Circular imports are forbidden. Any linter (`eslint-plugin-import`) rule `import/no-cycle` should be enabled to enforce this.

---

## Adding New Features — Checklist

Before opening a PR, verify:

- [ ] The new file/function has exactly **one reason to change** (SRP)
- [ ] Existing components/hooks are **not modified** — extend via props or new files (OCP)
- [ ] Any slot replacement honours the **documented prop interface** (LSP)
- [ ] New props are **optional with defaults** — no consumer is forced to pass them (ISP)
- [ ] No network, storage, or side-effect logic lives inside the library — it is **injected** (DIP)
