# Instructions for Slate.js Rich Text Editor

This project is a Notion-like rich text editor built with Slate.js, React, and TypeScript. Follow these guidelines for effective AI agent development.

## Architecture Overview

- **Main Editor**: Editor.tsx is the entry point, integrating plugins, block rendering, and collaborative features.

See `docs/project-structure.md` for a detailed breakdown of the folder organization, file responsibilities, and architectural decisions. Key points:

- **Editor Core**: Located in `src/features/editor/`, including main editor logic, block system, and plugin integration.
- **Blocks**: All block types (paragraph, heading, list, code, etc.) are modularized under `src/features/types/blocks.ts`.
- **Plugins**: Editor features are implemented as plugins in `src/features/editor-plugins/`.
- **UI Components**: Shared and editor-specific UI components are in `src/features/components/`.
- **Slash Menu**: Slash commands is handled in `src/features/editor-plugins/slash-menu/`
- **Shortcuts**: Shortcuts is handled in `src/features/shortcut/`
- **Block System**: All block types (paragraph, heading, list, code, etc.) are in Block. Blocks are rendered via renderBlock.tsx and always wrapped with the `withBlockInteraction` HOC for drag/drop and contextual UI.
- **Block Interaction**: Drag-and-drop, drop indicators, and contextual controls are managed

## 2. Editor Plugins

Refer to `docs/editor-plugin.md` for plugin development standards:

- **Plugin Pattern**: Plugins are functions that extend editor capabilities. They are composed in `src/editor/composePlugins.ts`.
- **Registration**: New plugins should be registered in the plugin composition file.
- **Clipboard**: HTML/Markdown serialization/deserialization is handled via dedicated clipboard plugins.
- **Shortcuts & Slash Menu**: Extendable via plugin architecture and UI components.

## 3. Development Workflow

See `docs/overview.md` for setup and workflow:

- **Install dependencies**: `bun install`
- **Start tauri dev server**: `bun tauri dev`
- **Build**: `bun tauri build`
- **Testing**: Manual browser testing is standard; see docs for debugging tips.
- **Debugging**: Use browser dev tools and console logs for plugin and block debugging.


## 4. Common Gotchas

- **Slate Path/ID**: Always use Slate path or block `id` for block identification in drag/drop logic.
- **DragOverlay**: Do not use Slate's Editable in DragOverlay; use a custom renderer for block preview.
- **State Management**: Use Zustand for drag/drop state, not React Context.
- **Plugin Order**: Plugin execution order can affect editor behavior; check `composePlugins.ts`.
- **Block Normalization**: Ensure block operations are normalized to prevent invalid Slate states.

## 5. Reference Documentation

For further details, always consult the following files in `docs/`:
- `project-structure.md`
- `editor-plugin.md`
- `overview.md`


