# Instructions for Slate.js Rich Text Editor

This project is a Notion-like rich text editor built with Slate.js, React, and TypeScript. Follow these guidelines for effective AI agent development.

## Architecture Overview

- **Main Editor**: Editor.tsx is the entry point, integrating plugins, block rendering, and collaborative features.
- **Block System**: All block types (paragraph, heading, list, code, etc.) are in Block. Blocks are rendered via renderBlock.tsx and always wrapped with the `withBlockInteraction` HOC for drag/drop and contextual UI.
- **Block Interaction**: Drag-and-drop, drop indicators, and contextual controls are managed in `BlockInteraction/` (withBlockInteraction.tsx, `DragHandle.tsx`, `DropIndicator.tsx`, `DragProvider.tsx`). Zustand is used for drag state.
- **Plugins**: Editor features (formatting, markdown shortcuts, clipboard, etc.) are modularized in `features/editor/` and composed in `composePlugins.ts`.
- **Slash Menu & Shortcuts**: Slash commands and keyboard shortcuts are handled in `SlashMenu/` and `core/shortcut/`.

## Developer Workflows

- **Install dependencies**: `bun install`
- **Start dev server**: `bun dev`
- **Build**: `bun run build` (if configured)
- **Testing**: No standard test suite detected; manual browser testing is typical.
- **Debugging**: Use browser dev tools to inspect Slate operations and plugin execution order. Console logs are used for plugin debugging.

## Key Patterns & Conventions

- **Block Rendering**: All blocks are wrapped with `withBlockInteraction` for drag/drop and contextual UI. Example:
  ```tsx
  const blockComponents = {
    h1: withBlockInteraction(Heading1Block),
    paragraph: withBlockInteraction(ParagraphBlock),
    // ...
  };
  ```
- **Block Creation**: Always use `editor.buildBlock()` to create new blocks, ensuring unique IDs via `uuidv4`.
- **Drag-and-Drop**: Uses `@dnd-kit/core` and Zustand. Drop indicators show above/below blocks during drag. See `DragProvider.tsx` and withBlockInteraction.tsx for logic.
- **Plugins**: New features should be added as plugins in `features/editor/`, following the pattern in `MarkdownPlugin.ts`.
- **Clipboard**: HTML/Markdown deserialization/serialization is handled in `features/editor/plugins/clipboard/`.
- **Shortcuts**: Custom shortcuts are defined in `core/shortcut/defaultConfig.ts` and handled via extensions in `features/editor/`.
- **Slash Menu**: Extendable via `components/Editor/SlashMenu/`.

## Integration Points

- **External Libraries**: Uses `@dnd-kit/core` for drag-and-drop, Zustand for state, Slate.js for editor core, and Radix UI for dialogs.
- **Block Path as ID**: Blocks are identified by their Slate path or unique `id` for drag/drop and manipulation.
- **HOC Pattern**: `withBlockInteraction` is the standard for adding contextual UI and drag/drop to blocks.

## Common Gotchas

- **Slate Path/ID**: Always use Slate path or block `id` for block identification in drag/drop logic.
- **DragOverlay**: Do not use Slate's Editable in DragOverlay; use a custom renderer for block preview.
- **State Management**: Use Zustand for drag/drop state, not React Context.
- **Plugin Order**: Plugin execution order can affect editor behavior; check `composePlugins.ts`.
- **Block Normalization**: Ensure block operations are normalized to prevent invalid Slate states.

## Example Files

- withBlockInteraction.tsx — HOC for block UI/drag
- DragProvider.tsx — Drag/drop logic and state
- renderBlock.tsx — Block rendering logic
- composePlugins.ts — Plugin composition
- Editor.tsx — Main editor entry point

---

**Feedback requested:** If any section is unclear or missing important project-specific details, please specify so instructions can be improved.

---

Let me know if any section needs clarification or if you want more details on specific patterns or workflows!
