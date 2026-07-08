"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts"
import {
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  BarChart3,
} from "lucide-react"

const CHART_COLORS = [
  "#6C63FF", "#00C2FF", "#FF6B6B", "#16C784", "#F4B400",
  "#EA4335", "#E1306C", "#1877F2", "#0A66C2", "#FF0000",
]

export function AnalyticsClient({ data }: { data: any }) {
  const stats = [
    {
      label: "Total Content",
      value: data.totalContent,
      icon: BarChart3,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Completed",
      value: data.completed,
      icon: CheckCircle2,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Missed",
      value: data.missed,
      icon: AlertTriangle,
      color: "text-danger",
      bg: "bg-danger/10",
    },
    {
      label: "Completion Rate",
      value: `${data.completionRate}%`,
      icon: TrendingUp,
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
  ]

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card rounded-xl p-3 text-sm">
          <p className="text-white font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-xs">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card rounded-2xl p-6 flex items-center gap-4">
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

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Performance */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-6">Weekly Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data.weeklyData}>
              <defs>
                <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16C784" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#16C784" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="week" tick={{ fill: "#9AA4B2", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#9AA4B2", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={customTooltip} />
              <Area type="monotone" dataKey="planned" stroke="#6C63FF" fill="url(#colorPlanned)" strokeWidth={2} name="Planned" />
              <Area type="monotone" dataKey="completed" stroke="#16C784" fill="url(#colorCompleted)" strokeWidth={2} name="Completed" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-6">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data.statusDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
                paddingAngle={3}
                stroke="none"
              >
                {data.statusDistribution.map((_: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={customTooltip} />
              <Legend
                formatter={(value: string) => <span className="text-xs text-muted-foreground">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Distribution */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-6">Platform Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.platformDistribution} layout="vertical">
              <XAxis type="number" tick={{ fill: "#9AA4B2", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#9AA4B2", fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip content={customTooltip} />
              <Bar dataKey="value" radius={[0, 8, 8, 0]} name="Posts">
                {data.platformDistribution.map((_: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Project Stats */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-6">Posts by Project</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.projectStats}>
              <XAxis dataKey="name" tick={{ fill: "#9AA4B2", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#9AA4B2", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={customTooltip} />
              <Bar dataKey="posts" fill="#6C63FF" radius={[8, 8, 0, 0]} name="Posts" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
