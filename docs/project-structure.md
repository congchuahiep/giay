# Project Structure

The project follows a **feature-based architecture**, inspired by best practices such as [Bulletproof React](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md). All core functionalities are organized into the `src/features` directory, where each feature is encapsulated in its own folder.

```
src
|
+-- components        # Shared UI components used across the entire project
|
+-- config            # Project configuration files (API endpoints, environment variables, etc.)
|
+-- hooks             # Custom React hooks shared throughout the project
|
+-- utils             # Utility functions and helpers for common tasks
|
+-- windows           # Multi-window logic and components for Tauri desktop app
|
+-- layouts           # Layout components for structuring pages and views
|
+-- types             # Global TypeScript types and interfaces
|
+-- services          # Tanstack Query hooks and logic for standardized data fetching
|
+-- features          # Business logic and domain-specific modules, organized by feature
|   |                 # Each feature is self-contained and exposes its public API via index.ts
|
+-- app-route.tsx     # Main application route configuration
```

### Key principles:

- Each feature directory contains all related logic, components, hooks, and types.
- Every feature folder must include an `index.ts` file that exposes the public API of the feature.
- Features must not access internal modules of other features directly. Instead, they should only import from the public API exposed by the feature's `index.ts`.

#### Example (Incorrect):

```js
import { abc } from "@/features/do-something/abc";
```

#### Example (Correct):

```js
import { abc } from "@/features/do-something";
```

This approach ensures clear boundaries between features, improves maintainability, and makes refactoring easier.

### Naming Conventions

- **PascalCase**: Used for component names, interface and type names, and Shortcut extension objects.
  _Example: `NoteEditor`, `UserProfile`, `ShortcutConfig`_

- **kebab-case**: Used for file names containing components and for directory names.
  _Example: `note-editor.tsx`, `user-profile`, `editor-plugins`_

- **camelCase**: Used for function names, hooks, and actions.
  _Example: `useNoteEditor`, `fetchUserData`, `toggleSidebar`_
