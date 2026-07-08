"use client"

import { useState, useTransition } from "react"
import { X } from "lucide-react"
import { createContent } from "@/app/actions/content"
import { PLATFORMS, CONTENT_TYPES, STATUSES, PRIORITIES } from "@/lib/constants"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function CreateContentModal({
  open,
  onClose,
  projects,
  initialDate,
}: {
  open: boolean
  onClose: () => void
  projects: { id: string; name: string }[]
  initialDate?: Date
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState({
    title: "",
    description: "",
    caption: "",
    platforms: ["Instagram"],
    contentType: "Post",
    postingDate: "",
    postingTime: "",
    status: "Idea",
    priority: "Medium",
    projectId: projects[0]?.id || "",
    referenceLink: "",
    driveLink: "",
  })

  useEffect(() => {
    if (open && initialDate) {
      // Adjust for local timezone to prevent off-by-one day errors
      const offset = initialDate.getTimezoneOffset()
      const adjustedDate = new Date(initialDate.getTime() - (offset*60*1000))
      setForm(prev => ({ ...prev, postingDate: adjustedDate.toISOString().split("T")[0] }))
    }
  }, [open, initialDate])

  if (!open) return null

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = () => {
    if (!form.title.trim() || !form.projectId || form.platforms.length === 0) return
    startTransition(async () => {
      await Promise.all(
        form.platforms.map(platform => 
          createContent({
            ...form,
            platform, // single platform per record
          } as any)
        )
      )
      onClose()
      router.refresh()
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl glass-card rounded-3xl mx-4 max-h-[85vh] h-full flex flex-col overflow-hidden">
        <div className="shrink-0 flex items-center justify-between p-8 pb-4 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">New Content</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5 min-h-0">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Fall Collection Teaser Reel"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          {/* Platforms */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Platforms *</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => {
                const isSelected = form.platforms.includes(p.name);
                return (
                  <button
                    key={p.name}
                    onClick={() => {
                      setForm(prev => {
                        const newPlatforms = isSelected
                          ? prev.platforms.filter(name => name !== p.name)
                          : [...prev.platforms, p.name];
                        return { ...prev, platforms: newPlatforms.length ? newPlatforms : [p.name] }
                      })
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
                      isSelected
                        ? "border-primary bg-primary/20 text-white"
                        : "border-white/5 bg-white/5 text-muted-foreground hover:bg-white/10"
                    }`}
                  >
                    <span style={{ color: p.color }}>{p.icon}</span>
                    {p.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Project + Content Type row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Project *</label>
              <select
                value={form.projectId}
                onChange={(e) => update("projectId", e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#1D2330] text-white">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Content Type</label>
              <select
                value={form.contentType}
                onChange={(e) => update("contentType", e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
              >
                {CONTENT_TYPES.map((t) => (
                  <option key={t} value={t} className="bg-[#1D2330] text-white">{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Priority</label>
            <select
              value={form.priority}
              onChange={(e) => update("priority", e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
            >
              {PRIORITIES.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#1D2330] text-white">{p.label}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Status</label>
            <div className="flex flex-wrap gap-2">
              {STATUSES.slice(0, 8).map((s) => (
                <button
                  key={s.id}
                  onClick={() => update("status", s.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    form.status === s.id
                      ? `${s.color} border-white/20`
                      : "border-white/5 bg-white/5 text-muted-foreground hover:bg-white/10"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date + Time row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Posting Date</label>
              <input
                type="date"
                value={form.postingDate}
                onChange={(e) => update("postingDate", e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Posting Time</label>
              <input
                type="time"
                value={form.postingTime}
                onChange={(e) => update("postingTime", e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="What is this content about..."
              rows={2}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
            />
          </div>

          {/* Caption */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Caption</label>
            <textarea
              value={form.caption}
              onChange={(e) => update("caption", e.target.value)}
              placeholder="Social media caption..."
              rows={2}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
            />
          </div>

          {/* Links row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Reference Link</label>
              <input
                type="url"
                value={form.referenceLink}
                onChange={(e) => update("referenceLink", e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Drive Link</label>
              <input
                type="url"
                value={form.driveLink}
                onChange={(e) => update("driveLink", e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="shrink-0 flex gap-3 p-8 pt-6 border-t border-white/5">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm font-medium text-white hover:bg-white/10 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending || !form.title.trim() || !form.projectId}
            className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(108,99,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {isPending ? "Creating..." : "Create Content"}
          </button>
        </div>
      </div>
    </div>
  )
}
