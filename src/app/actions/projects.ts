"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        platforms: true,
        _count: { select: { contents: true } },
      },
      orderBy: { createdAt: "desc" },
    })
    return { success: true, data: projects }
  } catch (error) {
    console.error("getProjects error:", error)
    return { success: false, error: "Failed to fetch projects" }
  }
}

export async function getProjectById(id: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        platforms: true,
        contents: { orderBy: { postingDate: "asc" } },
        _count: { select: { contents: true } },
      },
    })
    return { success: true, data: project }
  } catch (error) {
    console.error("getProjectById error:", error)
    return { success: false, error: "Failed to fetch project" }
  }
}

export async function createProject(data: {
  name: string
  description?: string
  logo?: string
  primaryColor?: string
  platforms?: string[]
}) {
  try {
    // Get or create a default user
    let user = await prisma.user.findFirst()
    if (!user) {
      user = await prisma.user.create({
        data: { email: "admin@prodzy.com", name: "Admin User" },
      })
    }

    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description || "",
        logo: data.logo || null,
        primaryColor: data.primaryColor || "#6C63FF",
        userId: user.id,
        platforms: {
          create: (data.platforms || []).map((p) => ({
            name: p,
            brandColor: getPlatformColor(p),
          })),
        },
      },
      include: { platforms: true },
    })

    revalidatePath("/projects")
    revalidatePath("/")
    return { success: true, data: project }
  } catch (error) {
    console.error("createProject error:", error)
    return { success: false, error: "Failed to create project" }
  }
}

export async function updateProject(
  id: string,
  data: { name?: string; description?: string; logo?: string; primaryColor?: string; status?: string; platforms?: string[] }
) {
  try {
    const { platforms, ...rest } = data;
    const updatePayload: any = { ...rest };

    if (platforms !== undefined) {
      updatePayload.platforms = {
        deleteMany: {},
        create: platforms.map((p) => ({
          name: p,
          brandColor: getPlatformColor(p),
        })),
      };
    }

    const project = await prisma.project.update({
      where: { id },
      data: updatePayload,
    })
    revalidatePath("/projects")
    revalidatePath("/")
    return { success: true, data: project }
  } catch (error) {
    console.error("updateProject error:", error)
    return { success: false, error: "Failed to update project" }
  }
}

export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({ where: { id } })
    revalidatePath("/projects")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("deleteProject error:", error)
    return { success: false, error: "Failed to delete project" }
  }
}

function getPlatformColor(platform: string): string {
  const colors: Record<string, string> = {
    Instagram: "#E1306C",
    YouTube: "#FF0000",
    Facebook: "#1877F2",
    LinkedIn: "#0A66C2",
    Twitter: "#1DA1F2",
    TikTok: "#000000",
    Pinterest: "#E60023",
    Snapchat: "#FFFC00",
    Threads: "#000000",
  }
  return colors[platform] || "#6C63FF"
}
