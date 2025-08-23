# Copilot Instructions for Slate.js Rich Text Editor

This project implements a Notion-like rich text editor using Slate.js, React, and TypeScript. Here are the key patterns and conventions to understand:

## Architecture Overview

### Core Components
- `Editor.tsx` - Main editor component integrating all plugins and features
- `features/editor/` - Core editor functionality organized by feature
  - `format/` - Text formatting and block type conversions
  - `insert/` - Block insertion and break handling
  - `markdown/` - Markdown shortcut processing
  - `clipboard/` - Copy/paste handling with HTML/Markdown support

### Key Data Flow Patterns
1. Editor plugins are composed using `composePlugins.ts`
2. Block interactions use HOC pattern via `withBlockInteraction.tsx`
3. Shortcuts and commands are handled through plugin system

## Development Workflows

### Running the Project
```bash
# Install dependencies
bun install

# Start dev server
bun dev
```

### Key Conventions

1. **Plugin Architecture**
- New features should be implemented as plugins in `features/editor/`
- Plugins follow the pattern in `MarkdownPlugin.ts`:
  ```typescript
  const MyPlugin = {
    name: "pluginName",
    priority: number,
    actions: {
      "action-name": (event, editor) => void
    }
  };
  ```

2. **Block Components**
- Block components are in `components/Editor/Block/`
- Must implement basic block interface
- Use `withBlockInteraction` HOC for drag/drop support

3. **Clipboard Handling**
- HTML deserializer in `clipboard/deserializeHtml.ts`
- Markdown deserializer in `clipboard/deserializeMarkdown.ts`
- Format conversions maintain styling and structure

## Common Patterns

### Adding New Block Types
1. Create component in `components/Editor/Block/`
2. Add renderer in `features/editor/render/renderBlock.tsx`
3. Add format toggle in `features/editor/format/toggleBlock.ts`
4. Update slash menu in `components/Editor/SlashMenu/`

### Markdown Shortcuts
- Define shortcuts in `features/editor/markdown/markdownShortcutMap.ts`
- Implement handlers in `features/editor/markdown/`
- Follow pattern in `handleDividerShortcut.ts`

### Text Formatting
- Use `toggleMark` for inline formatting
- Use `toggleBlock` for block-level changes
- Check `isMarkActive` before applying formats

## Integration Points

1. **Slate.js Integration**
- Custom plugins extend core Slate functionality
- Editor configurations in `features/editor/initialEditor.ts`

2. **External Dependencies**
- @radix-ui/react-dialog - Modal dialogs
- slate-react - Core editor framework
- slate-history - Undo/redo support

## Testing and Debug Workflows

1. Use browser dev tools to inspect Slate operations
2. Check clipboard data format in paste handlers
3. Monitor plugin execution order via console logs

## Common Gotchas

1. Always normalize Slate operations to prevent invalid states
2. Handle collapsed vs expanded selections differently
3. Remember to update both the model and view when modifying blocks
4. Check block type before applying transformations
