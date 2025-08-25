import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CaretLeftIcon } from "@phosphor-icons/react/dist/csr/CaretLeft"
import { CaretRightIcon } from "@phosphor-icons/react/dist/csr/CaretRight"
import { FileTextIcon } from "@phosphor-icons/react/dist/csr/FileText"
import { FolderIcon } from "@phosphor-icons/react/dist/csr/Folder"
import { GearIcon as SettingsIcon } from "@phosphor-icons/react/dist/csr/Gear"
import { TrashIcon } from "@phosphor-icons/react/dist/csr/Trash"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean
}

interface SidebarContextType {
  isOpen: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextType | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, defaultOpen = true, children, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen)

    const toggleSidebar = () => setIsOpen(!isOpen)

    return (
      <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>
        <div
          ref={ref}
          className={cn(
            "relative h-screen bg-[var(--sidebar)] border-r border-[var(--sidebar-border)] transition-all duration-300",
            isOpen ? "w-64" : "w-12",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </SidebarContext.Provider>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { isOpen, toggleSidebar } = useSidebar()

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between p-4 border-b border-[var(--sidebar-border)]",
        className
      )}
      {...props}
    >
      <div className={cn("flex items-center space-x-2", !isOpen && "hidden")}>
        {children}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleSidebar}
        className="h-8 w-8 p-0 text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)]"
      >
        {isOpen ? <CaretLeftIcon size={16} /> : <CaretRightIcon size={16} />}
      </Button>
    </div>
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-auto p-2", className)}
    {...props}
  >
    {children}
  </div>
))
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "p-4 border-t border-[var(--sidebar-border)] mt-auto",
      className
    )}
    {...props}
  >
    {children}
  </div>
))
SidebarFooter.displayName = "SidebarFooter"

interface SidebarItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
  label: string
  active?: boolean
}

const SidebarItem = React.forwardRef<HTMLButtonElement, SidebarItemProps>(
  ({ className, icon, label, active, ...props }, ref) => {
    const { isOpen } = useSidebar()

    return (
      <Button
        ref={ref}
        variant="ghost"
        className={cn(
          "w-full justify-start h-10 px-3 mb-1",
          "text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]",
          active && "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]",
          !isOpen && "justify-center px-2",
          className
        )}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {isOpen && (
          <span className="ml-2 truncate text-left">{label}</span>
        )}
      </Button>
    )
  }
)
SidebarItem.displayName = "SidebarItem"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { title?: string }
>(({ className, title, children, ...props }, ref) => {
  const { isOpen } = useSidebar()

  return (
    <div ref={ref} className={cn("mb-4", className)} {...props}>
      {title && isOpen && (
        <h4 className="mb-2 px-3 text-sm font-medium text-[var(--sidebar-foreground)] opacity-70">
          {title}
        </h4>
      )}
      <div className="space-y-1">{children}</div>
    </div>
  )
})
SidebarGroup.displayName = "SidebarGroup"

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarItem,
  SidebarGroup,
  useSidebar,
  // Export icons for convenience
  FileTextIcon,
  FolderIcon,
  SettingsIcon,
  TrashIcon,
}