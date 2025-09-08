import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Titlebar from "@/components/Window/Titlebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider storageKey="theme">
      <SidebarProvider>
        <Titlebar />
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
