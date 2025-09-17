import {
  CaretRightIcon,
  GearIcon,
  KeyboardIcon,
  PaintBrushIcon,
  TextTIcon,
} from "@phosphor-icons/react";
import type React from "react";
import { useState } from "react";
import KeyboardShortcutSettings from "@/components/SettingPanel/sections/KeyboardShortcutSettings";
import Titlebar from "@/components/Tauri/Titlebar";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { cn } from "@/utils";
import { AppearanceSettings } from "./sections/AppearanceSettings";
import { EditorSettings } from "./sections/EditorSettings";
import { GeneralSettings } from "./sections/GeneralSettings";

// Định nghĩa các loại cài đặt
type SettingType =
  | "general"
  | "profile"
  | "account"
  | "appearance"
  | "editor"
  | "keyboard"
  | "notifications"
  | "privacy"
  | "integrations"
  | "advanced"
  | "sync";

// Cấu trúc dữ liệu cho các mục cài đặt
interface SettingItem {
  id: SettingType;
  title: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

export default function SettingPanel() {
  // State để theo dõi mục cài đặt đang được chọn
  const [selectedSetting, setSelectedSetting] =
    useState<SettingType>("general");

  // Danh sách các mục cài đặt
  const settingItems: SettingItem[] = [
    {
      id: "general",
      title: "General",
      icon: <GearIcon weight="fill" />,
      component: <GeneralSettings />,
    },
    // {
    //   id: "profile",
    //   title: "Profile",
    //   icon: <UserIcon weight="fill" />,
    //   component: <ProfileSettings />
    // },
    // {
    //   id: "account",
    //   title: "Account",
    //   icon: <ShieldCheckIcon weight="fill" />,
    //   component: <AccountSettings />
    // },
    {
      id: "appearance",
      title: "Appearance",
      icon: <PaintBrushIcon weight="fill" />,
      component: <AppearanceSettings />,
    },
    {
      id: "editor",
      title: "Editor",
      icon: <TextTIcon weight="fill" />,
      component: <EditorSettings />,
    },
    {
      id: "keyboard",
      title: "Keyboard Shortcuts",
      icon: <KeyboardIcon weight="fill" />,
      component: <KeyboardShortcutSettings />,
    },
    // {
    //   id: "notifications",
    //   title: "Notifications",
    //   icon: <BellIcon weight="fill" />,
    //   component: <NotificationSettings />
    // },
    // {
    //   id: "privacy",
    //   title: "Privacy & Security",
    //   icon: <LockIcon weight="fill" />,
    //   component: <PrivacySettings />
    // },
    // {
    //   id: "integrations",
    //   title: "Integrations",
    //   icon: <PlugIcon weight="fill" />,
    //   component: <IntegrationSettings />
    // },
    // {
    //   id: "sync",
    //   title: "Sync & Backup",
    //   icon: <CloudArrowUpIcon weight="fill" />,
    //   component: <SyncSettings />
    // },
    // {
    //   id: "advanced",
    //   title: "Advanced",
    //   icon: <WrenchIcon weight="fill" />,
    //   component: <AdvancedSettings />
    // }
  ];

  // Tìm component tương ứng với mục được chọn
  const selectedComponent = settingItems.find(
    (item) => item.id === selectedSetting,
  )?.component;

  return (
    <SidebarProvider className="items-start">
      <Titlebar />
      <Sidebar collapsible="none" className="p-2">
        <SidebarHeader className="flex flex-col">
          <h2 className="text-xl font-semibold">Settings</h2>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {settingItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  isActive={selectedSetting === item.id}
                  onClick={() => setSelectedSetting(item.id)}
                  tooltip={item.title}
                >
                  {item.icon}
                  <span>{item.title}</span>
                  <CaretRightIcon
                    className="ml-auto size-4 text-muted-foreground opacity-60"
                    weight="bold"
                  />
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset
        className={cn(
          "pt-12 pl-6 h-screen w-full over",
          "bg-white dark:bg-stone-900",
        )}
      >
        {selectedComponent}
      </SidebarInset>
    </SidebarProvider>
  );
}
