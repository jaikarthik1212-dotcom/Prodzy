import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Clean existing data
  await prisma.content.deleteMany()
  await prisma.platform.deleteMany()
  await prisma.project.deleteMany()
  await prisma.user.deleteMany()

  // Create User
  const user = await prisma.user.create({
    data: { email: "admin@prodzy.com", name: "Admin User" },
  })

  // Create Projects
  const nike = await prisma.project.create({
    data: {
      name: "Nike Fall Campaign",
      description: "Social media rollout for the upcoming fall sneaker collection across all platforms.",
      primaryColor: "#EA4335",
      userId: user.id,
      platforms: {
        create: [
          { name: "Instagram", brandColor: "#E1306C" },
          { name: "Twitter", brandColor: "#1DA1F2" },
          { name: "YouTube", brandColor: "#FF0000" },
        ],
      },
    },
  })

  const spotify = await prisma.project.create({
    data: {
      name: "Spotify Wrapped",
      description: "Annual year-in-review campaign with user listening stats and highlights.",
      primaryColor: "#16C784",
      userId: user.id,
      platforms: {
        create: [
          { name: "YouTube", brandColor: "#FF0000" },
          { name: "Instagram", brandColor: "#E1306C" },
          { name: "TikTok", brandColor: "#000000" },
        ],
      },
    },
  })

  const ashwini = await prisma.project.create({
    data: {
      name: "Ashwini Decors",
      description: "Interior design portfolio showcasing completed projects and new designs.",
      primaryColor: "#F4B400",
      userId: user.id,
      platforms: {
        create: [
          { name: "Instagram", brandColor: "#E1306C" },
          { name: "Pinterest", brandColor: "#E60023" },
          { name: "Facebook", brandColor: "#1877F2" },
        ],
      },
    },
  })

  const hop = await prisma.project.create({
    data: {
      name: "House Of Production",
      description: "Video production company brand awareness and client acquisition.",
      primaryColor: "#6C63FF",
      userId: user.id,
      platforms: {
        create: [
          { name: "YouTube", brandColor: "#FF0000" },
          { name: "LinkedIn", brandColor: "#0A66C2" },
          { name: "Instagram", brandColor: "#E1306C" },
        ],
      },
    },
  })

  const now = new Date()
  const d = (offset: number) => new Date(now.getTime() + offset * 86400000)

  // Nike content
  await prisma.content.createMany({
    data: [
      { title: "Fall Collection Teaser Reel", contentType: "Reel", platform: "Instagram", status: "Approved", priority: "High", projectId: nike.id, postingDate: d(1) },
      { title: "Sneaker Closeup Carousel", contentType: "Carousel", platform: "Instagram", status: "Designing", priority: "Medium", projectId: nike.id, postingDate: d(3) },
      { title: "Athlete Announcement Tweet", contentType: "Tweet", platform: "Twitter", status: "Posted", priority: "High", projectId: nike.id, postingDate: d(-1) },
      { title: "Behind The Scenes Video", contentType: "Shorts", platform: "YouTube", status: "Editing", priority: "Medium", projectId: nike.id, postingDate: d(5) },
      { title: "Launch Day Story", contentType: "Story", platform: "Instagram", status: "Planned", priority: "High", projectId: nike.id, postingDate: d(7) },
      { title: "Product Feature Thread", contentType: "Tweet", platform: "Twitter", status: "Script Ready", priority: "Low", projectId: nike.id, postingDate: d(4) },
      { title: "Color Reveal Post", contentType: "Post", platform: "Instagram", status: "Idea", priority: "Medium", projectId: nike.id, postingDate: d(10) },
    ],
  })

  // Spotify content
  await prisma.content.createMany({
    data: [
      { title: "Top 10 Tracks Video", contentType: "Shorts", platform: "YouTube", status: "Editing", priority: "High", projectId: spotify.id, postingDate: d(2) },
      { title: "User Stats Infographic", contentType: "Carousel", platform: "Instagram", status: "Review", priority: "Medium", projectId: spotify.id, postingDate: d(6) },
      { title: "Wrapped Teaser TikTok", contentType: "Reel", platform: "TikTok", status: "Idea", priority: "Medium", projectId: spotify.id, postingDate: d(8) },
      { title: "Artist Thank You Video", contentType: "Long Video", platform: "YouTube", status: "Planned", priority: "Low", projectId: spotify.id, postingDate: d(12) },
      { title: "Genre Breakdown Reel", contentType: "Reel", platform: "Instagram", status: "Scheduled", priority: "Medium", projectId: spotify.id, postingDate: d(0) },
    ],
  })

  // Ashwini Decors content
  await prisma.content.createMany({
    data: [
      { title: "Living Room Transformation", contentType: "Carousel", platform: "Instagram", status: "Posted", priority: "High", projectId: ashwini.id, postingDate: d(-2) },
      { title: "Kitchen Mood Board", contentType: "Image", platform: "Pinterest", status: "Approved", priority: "Medium", projectId: ashwini.id, postingDate: d(1) },
      { title: "Client Testimonial", contentType: "Post", platform: "Facebook", status: "Designing", priority: "Low", projectId: ashwini.id, postingDate: d(4) },
      { title: "Before & After Reel", contentType: "Reel", platform: "Instagram", status: "Editing", priority: "High", projectId: ashwini.id, postingDate: d(3) },
    ],
  })

  // House Of Production content
  await prisma.content.createMany({
    data: [
      { title: "Showreel 2024", contentType: "Long Video", platform: "YouTube", status: "Editing", priority: "High", projectId: hop.id, postingDate: d(5) },
      { title: "BTS: Commercial Shoot", contentType: "Reel", platform: "Instagram", status: "Script Ready", priority: "Medium", projectId: hop.id, postingDate: d(2) },
      { title: "Team Introduction Post", contentType: "Article", platform: "LinkedIn", status: "Review", priority: "Low", projectId: hop.id, postingDate: d(6) },
      { title: "Equipment Tour Shorts", contentType: "Shorts", platform: "YouTube", status: "Idea", priority: "Medium", projectId: hop.id, postingDate: d(9) },
    ],
  })

  console.log("✅ Seed executed perfectly! Created 4 projects with 20 content items.")
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
