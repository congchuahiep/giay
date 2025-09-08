import CollaborativeEditor from "@/components/Editor/CollaborativeEditor";
import { useSidebar } from "@/components/ui/sidebar";
import { useRegisterShortcuts, type ShortcutExtension } from "@/core/shortcut";
import { ShortcutListener } from "@/core/shortcut/components/ShortcutListener";
import { useMemo } from "react";

interface AppContext {
  toggleSidebar: () => void;
  openSettings: () => void;
}

const AppShortcutExtension: ShortcutExtension<AppContext> = {
  name: "app-navigation",
  priority: 200, // High priority
  actions: {
    "toggle-sidebar": (event, context) => {
      event.preventDefault();
      context.toggleSidebar();
      return true;
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
  const { toggleSidebar } = useSidebar();

  const appShortcutContext = useMemo(
    () => ({
      toggleSidebar,
      openSettings: () => {
        console.log("Open settings!!!!!!!!!!");
        /* open settings logic */
      },
    }),
    [toggleSidebar]
  );

  useRegisterShortcuts("global", appShortcutContext, [AppShortcutExtension]);

  return (
    <main className=" w-full">
      <ShortcutListener />
      {/* EDITOR CONTAINER */}
      <div className="overflow-auto mt-12">
        <div className="px-12 m-auto w-full max-w-3xl lg:w-3xl dark:text-white">
          <CollaborativeEditor />
        </div>
      </div>
    </main>
  );
}

// md:w-3xl
// lg:w-5xl

export default App;
