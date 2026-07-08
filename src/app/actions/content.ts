"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getAllContent() {
  try {
    const content = await prisma.content.findMany({
      include: { project: true },
      orderBy: { postingDate: "asc" },
    })
    return { success: true, data: content }
  } catch (error) {
    console.error("getAllContent error:", error)
    return { success: false, error: "Failed to fetch content" }
  }
}

export async function getContentById(id: string) {
  try {
    const content = await prisma.content.findUnique({
      where: { id },
      include: { project: true },
    })
    return { success: true, data: content }
  } catch (error) {
    console.error("getContentById error:", error)
    return { success: false, error: "Failed to fetch content" }
  }
}

export async function createContent(data: {
  title: string
  description?: string
  caption?: string
  platform: string
  contentType: string
  postingDate?: string
  postingTime?: string
  status?: string
  priority?: string
  projectId: string
  referenceLink?: string
  driveLink?: string
}) {
  try {
    const content = await prisma.content.create({
      data: {
        title: data.title,
        description: data.description || "",
        caption: data.caption || "",
        platform: data.platform,
        contentType: data.contentType,
        postingDate: data.postingDate ? new Date(data.postingDate) : null,
        postingTime: data.postingTime || "",
        status: data.status || "Idea",
        priority: data.priority || "Medium",
        projectId: data.projectId,
        referenceLink: data.referenceLink || "",
        driveLink: data.driveLink || "",
      },
      include: { project: true },
    })

    revalidatePath("/board")
    revalidatePath("/calendar")
    revalidatePath("/")
    return { success: true, data: content }
  } catch (error) {
    console.error("createContent error:", error)
    return { success: false, error: "Failed to create content" }
  }
}

export async function updateContent(
  id: string,
  data: {
    title?: string
    description?: string
    caption?: string
    platform?: string
    contentType?: string
    postingDate?: string | null
    postingTime?: string
    status?: string
    priority?: string
    referenceLink?: string
    driveLink?: string
    clientFeedback?: string
  }
) {
  try {
    const updateData: any = { ...data }
    if (data.postingDate !== undefined) {
      updateData.postingDate = data.postingDate ? new Date(data.postingDate) : null
    }

    const content = await prisma.content.update({
      where: { id },
      data: updateData,
      include: { project: true },
    })

    revalidatePath("/board")
    revalidatePath("/calendar")
    revalidatePath("/")
    return { success: true, data: content }
  } catch (error) {
    console.error("updateContent error:", error)
    return { success: false, error: "Failed to update content" }
  }
}

export async function updateContentStatus(contentId: string, newStatus: string) {
  try {
    const updated = await prisma.content.update({
      where: { id: contentId },
      data: { status: newStatus },
    })
    revalidatePath("/board")
    revalidatePath("/calendar")
    revalidatePath("/")
    return { success: true, data: updated }
  } catch (error) {
    console.error("updateContentStatus error:", error)
    return { success: false, error: "Failed to update content status" }
  }
}

export async function deleteContent(id: string) {
  try {
    await prisma.content.delete({ where: { id } })
    revalidatePath("/board")
    revalidatePath("/calendar")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("deleteContent error:", error)
    return { success: false, error: "Failed to delete content" }
  }
}

export async function getAnalytics() {
  try {
    const allContent = await prisma.content.findMany({
      include: { project: true },
    })
    const projects = await prisma.project.findMany({
      include: { _count: { select: { contents: true } } },
    })

    const totalContent = allContent.length
    const completed = allContent.filter(
      (c) => c.status === "Posted" || c.status === "Completed"
    ).length
    const missed = allContent.filter((c) => {
      if (!c.postingDate) return false
      return (
        new Date(c.postingDate) < new Date() &&
        c.status !== "Posted" &&
        c.status !== "Completed"
      )
    }).length

    // Status distribution
    const statusCounts: Record<string, number> = {}
    allContent.forEach((c) => {
      statusCounts[c.status] = (statusCounts[c.status] || 0) + 1
    })

    // Platform distribution
    const platformCounts: Record<string, number> = {}
    allContent.forEach((c) => {
      platformCounts[c.platform] = (platformCounts[c.platform] || 0) + 1
    })

    // Content type distribution
    const typeCounts: Record<string, number> = {}
    allContent.forEach((c) => {
      typeCounts[c.contentType] = (typeCounts[c.contentType] || 0) + 1
    })

    // Weekly data (last 4 weeks)
    const weeklyData = []
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - i * 7)
      weekStart.setHours(0, 0, 0, 0)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 7)

      const weekContent = allContent.filter((c) => {
        if (!c.postingDate) return false
        const d = new Date(c.postingDate)
        return d >= weekStart && d < weekEnd
      })

      weeklyData.push({
        week: `Week ${4 - i}`,
        planned: weekContent.length,
        completed: weekContent.filter(
          (c) => c.status === "Posted" || c.status === "Completed"
        ).length,
      })
    }

    return {
      success: true,
      data: {
        totalContent,
        completed,
        missed,
        completionRate: totalContent > 0 ? Math.round((completed / totalContent) * 100) : 0,
        statusDistribution: Object.entries(statusCounts).map(([name, value]) => ({
          name,
          value,
        })),
        platformDistribution: Object.entries(platformCounts).map(([name, value]) => ({
          name,
          value,
        })),
        typeDistribution: Object.entries(typeCounts).map(([name, value]) => ({
          name,
          value,
        })),
        weeklyData,
        projectStats: projects.map((p) => ({
          name: p.name,
          posts: p._count.contents,
        })),
      },
    }
  } catch (error) {
    console.error("getAnalytics error:", error)
    return { success: false, error: "Failed to fetch analytics" }
  }
}

export async function searchContent(query: string) {
  try {
    const results = await prisma.content.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
          { caption: { contains: query } },
          { platform: { contains: query } },
        ],
      },
      include: { project: true },
      take: 20,
    })
    return { success: true, data: results }
  } catch (error) {
    console.error("searchContent error:", error)
    return { success: false, error: "Failed to search" }
  }
}
