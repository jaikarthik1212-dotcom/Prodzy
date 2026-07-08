import { prisma } from "@/lib/prisma"
import {
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  Zap
} from "lucide-react"
import Link from "next/link"

export const revalidate = 0

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ projectId?: string }> }) {
  const params = await searchParams;
  const projectId = params?.projectId;

  const [projects, fetchedContent] = await Promise.all([
    prisma.project.findMany({
      include: { platforms: true, _count: { select: { contents: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.content.findMany({
      include: { project: true },
      orderBy: { postingDate: "asc" },
    }),
  ])

  let allContent = fetchedContent;
  if (projectId) {
    allContent = allContent.filter(c => c.projectId === projectId);
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const todayPosts = allContent.filter((c) => {
    if (!c.postingDate) return false
    const d = new Date(c.postingDate)
    return d >= today && d < tomorrow
  })

  const overduePosts = allContent.filter((c) => {
    if (!c.postingDate) return false
    const d = new Date(c.postingDate)
    return d < today && c.status !== "Posted" && c.status !== "Completed"
  })

  const completedPosts = allContent.filter(
    (c) => c.status === "Posted" || c.status === "Completed"
  )

  const pendingPosts = allContent.filter(
    (c) => c.status !== "Posted" && c.status !== "Completed" && c.status !== "Cancelled"
  )

  const stats = [
    {
      label: "Today's Posts",
      value: todayPosts.length,
      icon: CalendarDays,
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      label: "Overdue",
      value: overduePosts.length,
      icon: AlertTriangle,
      color: "text-danger",
      bg: "bg-danger/10",
    },
    {
      label: "Completed",
      value: completedPosts.length,
      icon: CheckCircle2,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "In Pipeline",
      value: pendingPosts.length,
      icon: Clock,
      color: "text-warning",
      bg: "bg-warning/10",
    },
  ]

  return (
    <div className="p-8 pb-20">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Good {getGreeting()}, Admin 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s your content overview for today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="glass-card rounded-2xl p-6 flex items-center gap-4 transition-all hover:scale-[1.02]"
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <Link
          href="/board"
          className="glass-card rounded-2xl p-6 group hover:border-primary/30 transition-all hover:shadow-[0_0_30px_rgba(108,99,255,0.15)]"
        >
          <div className="flex items-center gap-3 mb-3">
            <Zap className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-white">Content Board</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Drag and drop content through your workflow pipeline.
          </p>
        </Link>
        <Link
          href="/calendar"
          className="glass-card rounded-2xl p-6 group hover:border-secondary/30 transition-all hover:shadow-[0_0_30px_rgba(0,194,255,0.15)]"
        >
          <div className="flex items-center gap-3 mb-3">
            <CalendarDays className="h-5 w-5 text-secondary" />
            <h3 className="font-semibold text-white">Calendar</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            View all your scheduled content across every platform.
          </p>
        </Link>
        <Link
          href="/projects"
          className="glass-card rounded-2xl p-6 group hover:border-success/30 transition-all hover:shadow-[0_0_30px_rgba(22,199,132,0.15)]"
        >
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="h-5 w-5 text-success" />
            <h3 className="font-semibold text-white">Projects</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage your brands and client workspaces.
          </p>
        </Link>
      </div>

      {/* Today's Posts + Overdue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Posts */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-secondary" />
            Today&apos;s Posts
          </h3>
          {todayPosts.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">
              No posts scheduled for today.
            </p>
          ) : (
            <div className="space-y-3">
              {todayPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 rounded-md bg-white/5 text-xs font-medium text-white/80">
                      {post.platform}
                    </span>
                    <span className="text-sm text-white">{post.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground px-2 py-1 rounded-md bg-white/5">
                    {post.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Overdue */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-danger" />
            Overdue Posts
          </h3>
          {overduePosts.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">
              🎉 Nothing overdue. You&apos;re on track!
            </p>
          ) : (
            <div className="space-y-3">
              {overduePosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-danger/5 border border-danger/10"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 rounded-md bg-white/5 text-xs font-medium text-white/80">
                      {post.platform}
                    </span>
                    <span className="text-sm text-white">{post.title}</span>
                  </div>
                  <span className="text-xs text-danger px-2 py-1 rounded-md bg-danger/10">
                    {post.postingDate
                      ? new Date(post.postingDate).toLocaleDateString()
                      : "No date"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Morning"
  if (hour < 17) return "Afternoon"
  return "Evening"
}
