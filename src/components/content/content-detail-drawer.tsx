"use client"

import { useState, useTransition } from "react"
import { X, ExternalLink, Trash2 } from "lucide-react"
import { updateContent, deleteContent } from "@/app/actions/content"
import { PLATFORMS, CONTENT_TYPES, STATUSES, PRIORITIES } from "@/lib/constants"
import { useRouter } from "next/navigation"

export function ContentDetailDrawer({
  content,
  onClose,
}: {
  content: any
  onClose: () => void
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [form, setForm] = useState({
    title: content.title || "",
    description: content.description || "",
    caption: content.caption || "",
    platform: content.platform || "Instagram",
    contentType: content.contentType || "Post",
    postingDate: content.postingDate ? new Date(content.postingDate).toISOString().split("T")[0] : "",
    postingTime: content.postingTime || "",
    status: content.status || "Idea",
    priority: content.priority || "Medium",
    referenceLink: content.referenceLink || "",
    driveLink: content.driveLink || "",
    clientFeedback: content.clientFeedback || "",
  })

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSave = () => {
    startTransition(async () => {
      await updateContent(content.id, form)
      onClose()
      router.refresh()
    })
  }

  const handleDelete = () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true)
      return
    }
    startTransition(async () => {
      await deleteContent(content.id)
      onClose()
      router.refresh()
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl h-full bg-[#1D2330] border-l border-white/5 flex flex-col">
        {/* Header */}
        <div className="shrink-0 z-10 flex items-center justify-between px-6 py-4 bg-[#1D2330] border-b border-white/5">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-white">Edit Content</h2>
            <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${STATUSES.find(s => s.id === form.status)?.color || ""}`}>
              {form.status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {showDeleteConfirm ? (
              <>
                <button onClick={handleDelete} className="px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors text-xs font-bold">
                  Sure?
                </button>
                <button onClick={() => setShowDeleteConfirm(false)} className="px-3 py-1.5 rounded-lg bg-white/5 text-muted-foreground hover:bg-white/10 transition-colors text-xs">
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={handleDelete} className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors" title="Delete">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <button onClick={onClose} className="p-2 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Status</label>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
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

          {/* Platform + Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Platform</label>
              <select
                value={form.platform}
                onChange={(e) => update("platform", e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
              >
                {PLATFORMS.map((p) => (
                  <option key={p.name} value={p.name} className="bg-[#1D2330]">{p.name}</option>
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
                  <option key={t} value={t} className="bg-[#1D2330]">{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority + Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => update("priority", e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
              >
                {PRIORITIES.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#1D2330]">{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Posting Date</label>
              <input
                type="date"
                value={form.postingDate}
                onChange={(e) => update("postingDate", e.target.value)}
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
              rows={3}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
            />
          </div>

          {/* Caption */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Caption</label>
            <textarea
              value={form.caption}
              onChange={(e) => update("caption", e.target.value)}
              rows={3}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
            />
          </div>

          {/* Client Feedback */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Client Feedback</label>
            <textarea
              value={form.clientFeedback}
              onChange={(e) => update("clientFeedback", e.target.value)}
              placeholder="Add client notes..."
              rows={2}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
            />
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Reference Link</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={form.referenceLink}
                  onChange={(e) => update("referenceLink", e.target.value)}
                  placeholder="https://..."
                  className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                {form.referenceLink && (
                  <a href={form.referenceLink} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-white transition-colors">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Drive Link</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={form.driveLink}
                  onChange={(e) => update("driveLink", e.target.value)}
                  placeholder="https://..."
                  className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                {form.driveLink && (
                  <a href={form.driveLink} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-white transition-colors">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Meta info */}
          <div className="pt-4 border-t border-white/5 text-xs text-muted-foreground space-y-1">
            <p>Project: <span className="text-white">{content.project?.name || "—"}</span></p>
            <p>Revisions: <span className="text-white">{content.revisionCount || 0}</span></p>
            <p>Created: <span className="text-white">{new Date(content.createdAt).toLocaleDateString()}</span></p>
          </div>
        </div>

        {/* Save footer */}
        <div className="shrink-0 p-6 bg-[#1D2330] border-t border-white/5">
          <button
            onClick={handleSave}
            disabled={isPending}
            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(108,99,255,0.4)] transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}
