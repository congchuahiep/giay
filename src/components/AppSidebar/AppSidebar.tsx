import { GearIcon } from "@phosphor-icons/react/dist/csr/Gear";
import { QuestionIcon } from "@phosphor-icons/react/dist/csr/Question";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { openSettingsWindow } from "@/features/navigates";
import { cn } from "@/utils";

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
    onClick: openSettingsWindow,
  },
];

const footerItemClass = "dark:text-stone-100";

const footerItems = [
  {
    icon: <QuestionIcon className={footerItemClass} />,
  },
  {
    icon: <GearIcon className={footerItemClass} />,
  },
];

const AppSidebar = () => {
  return (
    <Sidebar className="pt-10" variant="inset">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="dark:text-stone-300">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} onClick={item.onClick}>
                  <SidebarMenuButton
                    asChild
                    className="dark:text-stone-100 dark:hover:bg-stone-700/50 active:text-stone-400"
                    // onClick={item.onClick}
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="flex justify-end gap-2">
            {footerItems.map((item, index) => (
              <SidebarMenuButton
                key={index}
                asChild
                tooltip={"123"}
                className={cn(
                  "p-2 text-stone-500 hover:bg-stone-700/50 rounded-md cursor-pointer",
                )}
              >
                {item.icon}
              </SidebarMenuButton>
            ))}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
