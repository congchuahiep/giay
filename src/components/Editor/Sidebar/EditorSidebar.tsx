import React from "react"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarItem,
  SidebarGroup,
  FileTextIcon,
  FolderIcon,
  SettingsIcon,
  TrashIcon,
} from "@/components/ui/sidebar"
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus"
import { ClockIcon } from "@phosphor-icons/react/dist/csr/Clock"
import { StarIcon } from "@phosphor-icons/react/dist/csr/Star"
import { ShareIcon } from "@phosphor-icons/react/dist/csr/Share"

export default function EditorSidebar() {
  const [activeItem, setActiveItem] = React.useState<string>("current-doc")

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-2">
          <FileTextIcon size={20} className="text-[var(--sidebar-primary)]" />
          <span className="font-semibold text-[var(--sidebar-foreground)]">Giay Editor</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarItem
            icon={<PlusIcon size={16} />}
            label="Tạo tài liệu mới"
            onClick={() => {
              // Handle new document creation
              console.log("Creating new document...")
            }}
          />
          <SidebarItem
            icon={<FileTextIcon size={16} />}
            label="Tài liệu hiện tại"
            active={activeItem === "current-doc"}
            onClick={() => setActiveItem("current-doc")}
          />
        </SidebarGroup>

        <SidebarGroup title="Gần đây">
          <SidebarItem
            icon={<FileTextIcon size={16} />}
            label="Ý tưởng dự án"
            active={activeItem === "project-ideas"}
            onClick={() => setActiveItem("project-ideas")}
          />
          <SidebarItem
            icon={<FileTextIcon size={16} />}
            label="Ghi chú hội họp"
            active={activeItem === "meeting-notes"}
            onClick={() => setActiveItem("meeting-notes")}
          />
          <SidebarItem
            icon={<FileTextIcon size={16} />}
            label="Kế hoạch tuần"
            active={activeItem === "weekly-plan"}
            onClick={() => setActiveItem("weekly-plan")}
          />
        </SidebarGroup>

        <SidebarGroup title="Workspace">
          <SidebarItem
            icon={<FolderIcon size={16} />}
            label="Dự án cá nhân"
            onClick={() => {
              console.log("Opening personal projects...")
            }}
          />
          <SidebarItem
            icon={<StarIcon size={16} />}
            label="Yêu thích"
            onClick={() => {
              console.log("Opening favorites...")
            }}
          />
          <SidebarItem
            icon={<ShareIcon size={16} />}
            label="Chia sẻ"
            onClick={() => {
              console.log("Opening shared documents...")
            }}
          />
          <SidebarItem
            icon={<ClockIcon size={16} />}
            label="Lịch sử"
            onClick={() => {
              console.log("Opening history...")
            }}
          />
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarGroup>
          <SidebarItem
            icon={<SettingsIcon size={16} />}
            label="Cài đặt"
            onClick={() => {
              console.log("Opening settings...")
            }}
          />
          <SidebarItem
            icon={<TrashIcon size={16} />}
            label="Thùng rác"
            onClick={() => {
              console.log("Opening trash...")
            }}
          />
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}