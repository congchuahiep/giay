# Editor Plugins Structure

The `editor-plugins` module contains all plugins that extend the functionality of the Slate.js editor. Each plugin is structured similarly to a feature, encapsulating its logic, actions, and integrations.

**Plugin structure:**

- Each plugin resides in its own folder within `editor-plugins`.
- The main entry point is `plugin.ts`, which uses the Higher-Order Component (HOC) pattern to register new behaviors with the Slate editor
- New editor behaviors (such as custom commands, formatting, or block manipulation) are implemented in the `actions` directory of the plugin.
- Plugins may also include hooks or decorators to extend editor capabilities, such as custom rendering or state management.

This modular approach allows for easy addition of new plugins and ensures that each plugin remains isolated, maintainable, and testable. To integrate a plugin, simply register it via its HOC in the editor setup. E.g. Register editor plugin:

```typescript
const editor = useMyPlugin(createEditor());
```
