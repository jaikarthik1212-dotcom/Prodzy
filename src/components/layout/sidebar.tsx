"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import {
  LayoutDashboard,
  Calendar,
  KanbanSquare,
  PieChart,
  Settings,
  FolderKanban,
  Plus,
  Search,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SearchDialog } from "@/components/search/search-dialog"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Content Board", href: "/board", icon: KanbanSquare },
  { name: "Analytics", href: "/analytics", icon: PieChart },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar({ projects = [] }: { projects?: any[] }) {
  return (
    <Suspense fallback={<div className="w-64 bg-surface/50 border-r border-white/5 h-screen" />}>
      <SidebarContent projects={projects} />
    </Suspense>
  )
}

function SidebarContent({ projects }: { projects: any[] }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentProjectId = searchParams.get("projectId")

  return (
    <div className="flex h-screen w-64 flex-col border-r border-white/5 bg-surface/50 backdrop-blur-xl flex-shrink-0 print-hidden">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-[0_0_15px_rgba(108,99,255,0.3)]">
            <span className="font-bold text-white text-lg">P</span>
          </div>
          <span className="font-semibold text-white tracking-wide">Prodzy</span>
        </Link>
      </div>

      {/* Search */}
      <div className="px-4 pt-4">
        <SearchDialog />
      </div>

      {/* New Content Button */}
      <div className="px-4 pt-4 pb-2">
        <Link
          href="/board"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(108,99,255,0.4)] active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>New Content</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
        <nav className="flex-1 space-y-1.5">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-white"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Brands & Projects */}
        <div className="mt-8">
          <h3 className="mb-3 px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
            Brands & Projects
          </h3>
          <nav className="space-y-1">
            <Link
              href={pathname}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
                !currentProjectId
                  ? "bg-primary/10 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <div className="flex h-5 w-5 items-center justify-center rounded border border-white/10 bg-white/5 shrink-0">
                <span className="text-[10px] font-bold">ALL</span>
              </div>
              <span className="truncate">All Projects</span>
            </Link>
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`${pathname}?projectId=${project.id}`}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
                  currentProjectId === project.id
                    ? "bg-primary/10 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}
              >
                <div
                  className="h-5 w-5 rounded border border-white/10 shrink-0 flex items-center justify-center shadow-sm overflow-hidden relative"
                  style={{ backgroundColor: project.primaryColor }}
                >
                  {project.logo ? (
                    <img src={project.logo} alt={project.name} className="object-cover w-full h-full bg-white" />
                  ) : (
                    <span className="text-[10px] font-bold text-white uppercase">{project.name.charAt(0)}</span>
                  )}
                </div>
                <span className="truncate">{project.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* User */}
      <div className="border-t border-white/5 p-4">
        <div className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/5 cursor-pointer">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-secondary to-primary flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
          <div className="flex flex-1 flex-col overflow-hidden">
            <span className="truncate text-sm font-medium text-white">
              Admin User
            </span>
            <span className="truncate text-xs text-muted-foreground">
              admin@prodzy.com
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
