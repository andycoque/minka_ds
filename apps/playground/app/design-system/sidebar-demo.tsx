"use client"

import * as React from "react"
import {
  LayoutDashboard, Users, FileText, Bell, Settings,
  ChevronsUpDown, ChevronDown, UsersRound, UserCheck, Archive,
} from "lucide-react"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem,
  SidebarProvider, SidebarTrigger,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

type NavItem = {
  id:    string
  label: string
  icon:  React.ElementType
  sub?:  { id: string; label: string; icon: React.ElementType }[]
}

const NAV: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    id: "clients", label: "Clients", icon: Users,
    sub: [
      { id: "clients-all",      label: "All clients", icon: UsersRound },
      { id: "clients-active",   label: "Active",      icon: UserCheck  },
      { id: "clients-archived", label: "Archived",    icon: Archive    },
    ],
  },
  { id: "documents",     label: "Documents",     icon: FileText },
  { id: "notifications", label: "Notifications", icon: Bell     },
]

const CONTENT: Record<string, { title: string; description: string }> = {
  dashboard:        { title: "Dashboard",      description: "Overview of your workspace activity and key metrics." },
  "clients-all":    { title: "All clients",    description: "Full list of all clients in your workspace."          },
  "clients-active": { title: "Active clients", description: "Clients with ongoing activity in the last 30 days."   },
  "clients-archived":{ title: "Archived",      description: "Clients that have been archived."                    },
  documents:        { title: "Documents",      description: "Browse and manage all documents."                    },
  notifications:    { title: "Notifications",  description: "Your latest alerts and activity updates."            },
  settings:         { title: "Settings",       description: "Manage workspace preferences and integrations."      },
}

export function SidebarDemo() {
  const [active, setActive] = React.useState("dashboard")
  const [clientsOpen, setClientsOpen] = React.useState(false)

  const current = CONTENT[active] ?? CONTENT["dashboard"]

  const isClientsSub = active.startsWith("clients-")

  return (
    <div className="h-[420px] overflow-hidden rounded-lg border border-[var(--color-border-default)] [transform:translateZ(0)]">
      <SidebarProvider className="!min-h-0 h-full" defaultOpen>
        <Sidebar className="!h-full">

          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" className="h-12">
                  <div className="size-8 shrink-0"><svg viewBox="0 0 210 210" fill="none" className="size-full text-[var(--color-text-default)]" xmlns="http://www.w3.org/2000/svg">
                    <path d="M105 166.5L105 204" stroke="currentColor" strokeWidth="12" strokeMiterlimit="10" strokeLinecap="round"/>
                    <path d="M81 177L81 201" stroke="currentColor" strokeWidth="12" strokeMiterlimit="10" strokeLinecap="round"/>
                    <path d="M129 150L129 201" stroke="currentColor" strokeWidth="12" strokeMiterlimit="10" strokeLinecap="round"/>
                    <path d="M57 183L57 192" stroke="currentColor" strokeWidth="12" strokeMiterlimit="10" strokeLinecap="round"/>
                    <path d="M153 124.5L153 192" stroke="currentColor" strokeWidth="12" strokeMiterlimit="10" strokeLinecap="round"/>
                    <path d="M177 81L177 174" stroke="currentColor" strokeWidth="12" strokeMiterlimit="10" strokeLinecap="round"/>
                    <path d="M201 75L201 135" stroke="currentColor" strokeWidth="12" strokeMiterlimit="10" strokeLinecap="round"/>
                    <path d="M105 50.25L105 206.25" stroke="currentColor" strokeWidth="7.5" strokeMiterlimit="10" strokeLinecap="round"/>
                    <path d="M81 67.5L81 203.25" stroke="currentColor" strokeWidth="7.5" strokeMiterlimit="10" strokeLinecap="round"/>
                    <path d="M129 39.75L129 203.25" stroke="currentColor" strokeWidth="7.5" strokeMiterlimit="10" strokeLinecap="round"/>
                    <path d="M57 94.5L57 194.25" stroke="currentColor" strokeWidth="7.5" strokeMiterlimit="10" strokeLinecap="round"/>
                    <path d="M153 33.75L153 194.25" stroke="currentColor" strokeWidth="7.5" strokeMiterlimit="10" strokeLinecap="round"/>
                    <path d="M33 147L33 175.5" stroke="currentColor" strokeWidth="7.5" strokeMiterlimit="10" strokeLinecap="round"/>
                    <path d="M177 35.25L177 174.75" stroke="currentColor" strokeWidth="7.5" strokeMiterlimit="10" strokeLinecap="round"/>
                    <path d="M105 1.5L105 208.5" stroke="currentColor" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round"/>
                    <path d="M81 6L81 204" stroke="currentColor" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round"/>
                    <path d="M129 6L129 204" stroke="currentColor" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round"/>
                    <path d="M57 15L57 195" stroke="currentColor" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round"/>
                    <path d="M153 15L153 195" stroke="currentColor" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round"/>
                    <path d="M33 34.5L33 175.5" stroke="currentColor" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round"/>
                    <path d="M9 72L9 138" stroke="currentColor" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round"/>
                  </svg></div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-label">Minka</span>
                    <span className="text-caption text-[var(--color-text-muted)]">Workspace</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-[var(--color-text-hint)]" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>

                  {/* Dashboard */}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={active === "dashboard"}
                      tooltip="Dashboard"
                      onClick={() => { setActive("dashboard"); setClientsOpen(false) }}
                    >
                      <LayoutDashboard />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* Clients — collapsible */}
                  <Collapsible
                    open={clientsOpen || isClientsSub}
                    onOpenChange={setClientsOpen}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip="Clients">
                          <Users />
                          <span>Clients</span>
                          <ChevronDown className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {[
                            { id: "clients-all",      label: "All clients", icon: UsersRound },
                            { id: "clients-active",   label: "Active",      icon: UserCheck  },
                            { id: "clients-archived", label: "Archived",    icon: Archive    },
                          ].map(({ id, label, icon: Icon }) => (
                            <SidebarMenuSubItem key={id}>
                              <SidebarMenuSubButton
                                isActive={active === id}
                                onClick={() => setActive(id)}
                              >
                                <Icon /><span>{label}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>

                  {/* Documents */}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={active === "documents"}
                      tooltip="Documents"
                      onClick={() => { setActive("documents"); setClientsOpen(false) }}
                    >
                      <FileText />
                      <span>Documents</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* Notifications */}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={active === "notifications"}
                      tooltip="Notifications"
                      onClick={() => { setActive("notifications"); setClientsOpen(false) }}
                    >
                      <Bell />
                      <span>Notifications</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={active === "settings"}
                  tooltip="Settings"
                  onClick={() => { setActive("settings"); setClientsOpen(false) }}
                >
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>

        </Sidebar>

        <SidebarInset>
          <header className="flex h-12 shrink-0 items-center gap-2 px-4 border-b border-[var(--color-border-subtle)]">
            <SidebarTrigger />
            <span className="text-body-sm">{current.title}</span>
          </header>
          <div className="p-6 space-y-2">
            <p className="text-label text-[var(--color-text-default)]">{current.title}</p>
            <p className="text-body-sm text-[var(--color-text-muted)]">{current.description}</p>
          </div>
        </SidebarInset>

      </SidebarProvider>
    </div>
  )
}
