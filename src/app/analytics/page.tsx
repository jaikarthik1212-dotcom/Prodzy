import { getAnalytics } from "@/app/actions/content"
import { AnalyticsClient } from "@/components/analytics/analytics-client"

export const revalidate = 0

export default async function AnalyticsPage() {
  const response = await getAnalytics()
  const analytics = response.data

  if (!analytics) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-muted-foreground mt-2">No data available yet.</p>
      </div>
    )
  }

  return (
    <div className="p-8 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">Track your content performance across all brands.</p>
      </div>
      <AnalyticsClient data={analytics} />
    </div>
  )
}
