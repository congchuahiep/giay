import CollaborativeEditor from "@/components/Editor/CollaborativeEditor";
import Titlebar from "@/components/Window/Titlebar";
import { useRegisterShortcuts } from "@/core/shortcut";
import { ShortcutListener } from "@/core/shortcut/components/ShortcutListener";
import type { ShortcutExtension } from "@/core/shortcut/store/shortcutStore";
import { useMemo, useState } from "react";

interface AppContext {
  toggleSidebar: () => void;
  openSettings: () => void;
}

const AppShortcutExtension: ShortcutExtension<AppContext> = {
  name: "app-navigation",
  priority: 200, // High priority
  actions: {
    "toggle-sidebar": (event, context) => {
      if (context) {
        event.preventDefault();
        context.toggleSidebar();
        return true;
      }
      return false;
    },
    "open-settings": (event, context) => {
      if (context) {
        event.preventDefault();
        context.openSettings();
        return true;
      }
      return false;
    },
  },

  keySettings: {
    "mod+s": "toggle-sidebar",
    "mod+,": "open-settings",
  },
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const appContext = useMemo(
    () => ({
      toggleSidebar: () => {
        console.log("Open sidebar!!!!!!!!!!");
        setSidebarOpen(!sidebarOpen);
      },
      openSettings: () => {
        console.log("Open settings!!!!!!!!!!");
        /* open settings logic */
      },
    }),
    []
  );

  useRegisterShortcuts("global", appContext, [AppShortcutExtension]);

  return (
    <main className="overflow-hidden">
      <Titlebar />
      <ShortcutListener />
      

      {/* EDITOR CONTAINER */}
      <div className="overflow-auto">
        <div className="px-12 pt-10 m-auto w-full md:w-3xl dark:bg-gray-900">
          <CollaborativeEditor />
        </div>
      </div>
    </main>
  );
}

// md:w-3xl
// lg:w-5xl

export default App;
