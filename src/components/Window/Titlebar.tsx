import { getCurrentWindow } from '@tauri-apps/api/window';

import { cn } from "@/utils";
import { CornersOutIcon } from "@phosphor-icons/react/dist/csr/CornersOut";
import { MinusIcon } from "@phosphor-icons/react/dist/csr/Minus";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import { isTauri } from '@tauri-apps/api/core';
import DebugMenu from '@/components/Window/DebugMenu';

const Titlebar = () => {
  if (!isTauri()) return null;

  const appWindow = getCurrentWindow();

  return (
    <div
      data-tauri-drag-region
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "h-10 flex items-center justify-between px-3 select-none",
        "bg-stone-100/50 dark:bg-stone-900/30 dark:text-white"
      )}
    >
      <DebugMenu />
      {/* <div>Titlebar</div> */}
      <div className="flex items-center gap-2">
        <button
          className="p-2 rounded hover:bg-amber-100 dark:hover:bg-amber-800 transition-colors cursor-pointer"
          tabIndex={-1}
          type="button"
          onClick={() => appWindow.minimize()}
        >
          <MinusIcon size={16} />
        </button>
        <button
          className="p-2 rounded hover:bg-green-100 dark:hover:bg-green-800 transition-colors cursor-pointer"
          tabIndex={-1}
          type="button"
          onClick={() => appWindow.toggleMaximize()}
        >
          <CornersOutIcon size={16} />
        </button>
        <button
          className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900 transition-colors cursor-pointer"
          tabIndex={-1}
          type="button"
          onClick={() => appWindow.close()}
        >
          <XIcon size={16} />
        </button>
      </div>
    </div>
  );
};

export default Titlebar;
