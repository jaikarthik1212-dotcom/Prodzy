import { createElement } from 'react'
import { 
  FaInstagram, 
  FaYoutube, 
  FaFacebook, 
  FaLinkedin, 
  FaTiktok, 
  FaPinterest, 
  FaSnapchatGhost 
} from 'react-icons/fa'
import { FaXTwitter, FaThreads } from 'react-icons/fa6'

// Platform definitions with icons and colors
export const PLATFORMS = [
  { name: "Instagram", color: "#E1306C", icon: createElement(FaInstagram) },
  { name: "YouTube", color: "#FF0000", icon: createElement(FaYoutube) },
  { name: "Facebook", color: "#1877F2", icon: createElement(FaFacebook) },
  { name: "LinkedIn", color: "#0A66C2", icon: createElement(FaLinkedin) },
  { name: "Twitter", color: "#000000", icon: createElement(FaXTwitter) },
  { name: "TikTok", color: "#000000", icon: createElement(FaTiktok) },
  { name: "Pinterest", color: "#E60023", icon: createElement(FaPinterest) },
  { name: "Snapchat", color: "#FFFC00", icon: createElement(FaSnapchatGhost) },
  { name: "Threads", color: "#000000", icon: createElement(FaThreads) },
] as const

export const CONTENT_TYPES = [
  "Reel",
  "Carousel",
  "Post",
  "Story",
  "Shorts",
  "Long Video",
  "Tweet",
  "Article",
  "Image",
  "Banner",
  "GIF",
] as const

export const STATUSES = [
  { id: "Idea", label: "Idea", color: "bg-gray-500/20 text-gray-400", dot: "bg-gray-400" },
  { id: "Planned", label: "Planned", color: "bg-blue-500/20 text-blue-400", dot: "bg-blue-400" },
  { id: "Script Ready", label: "Script Ready", color: "bg-purple-500/20 text-purple-400", dot: "bg-purple-400" },
  { id: "Designing", label: "Designing", color: "bg-orange-500/20 text-orange-400", dot: "bg-orange-400" },
  { id: "Editing", label: "Editing", color: "bg-pink-500/20 text-pink-400", dot: "bg-pink-400" },
  { id: "Review", label: "Review", color: "bg-yellow-500/20 text-yellow-400", dot: "bg-yellow-400" },
  { id: "Approved", label: "Approved", color: "bg-green-500/20 text-green-400", dot: "bg-green-400" },
  { id: "Scheduled", label: "Scheduled", color: "bg-cyan-500/20 text-cyan-400", dot: "bg-cyan-400" },
  { id: "Posted", label: "Posted", color: "bg-emerald-500/20 text-emerald-400", dot: "bg-emerald-400" },
  { id: "Completed", label: "Completed", color: "bg-teal-500/20 text-teal-400", dot: "bg-teal-400" },
  { id: "Missed", label: "Missed", color: "bg-red-500/20 text-red-400", dot: "bg-red-400" },
  { id: "Cancelled", label: "Cancelled", color: "bg-zinc-500/20 text-zinc-400", dot: "bg-zinc-400" },
  { id: "Rejected", label: "Rejected", color: "bg-rose-500/20 text-rose-400", dot: "bg-rose-400" },
  { id: "Need Changes", label: "Need Changes", color: "bg-amber-500/20 text-amber-400", dot: "bg-amber-400" },
] as const

export const PRIORITIES = [
  { id: "High", label: "High", color: "text-red-400" },
  { id: "Medium", label: "Medium", color: "text-yellow-400" },
  { id: "Low", label: "Low", color: "text-green-400" },
] as const

export function getStatusConfig(statusId: string) {
  return STATUSES.find((s) => s.id === statusId) || STATUSES[0]
}

export function getPlatformConfig(platformName: string) {
  return PLATFORMS.find((p) => p.name === platformName) || PLATFORMS[0]
}
