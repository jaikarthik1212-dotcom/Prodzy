"use client"

import { useState, useTransition, useEffect } from "react"
import { X, Trash2 } from "lucide-react"
import { createProject, updateProject, deleteProject } from "@/app/actions/projects"
import { uploadLogo } from "@/app/actions/upload"
import { PLATFORMS } from "@/lib/constants"
import { useRouter } from "next/navigation"

const BRAND_COLORS = [
  "#6C63FF", "#00C2FF", "#FF6B6B", "#16C784", "#F4B400",
  "#EA4335", "#E1306C", "#1877F2", "#0A66C2", "#FF0000",
]

export function CreateProjectModal({ 
  open, 
  onClose,
  project
}: { 
  open: boolean; 
  onClose: () => void;
  project?: any;
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [logo, setLogo] = useState("")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [primaryColor, setPrimaryColor] = useState("#6C63FF")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])

  useEffect(() => {
    if (open) {
      if (project) {
        setName(project.name || "")
        setDescription(project.description || "")
        setLogo(project.logo || "")
        setLogoFile(null)
        setPrimaryColor(project.primaryColor || "#6C63FF")
        setSelectedPlatforms(project.platforms?.map((p: any) => p.name) || [])
      } else {
        setName("")
        setDescription("")
        setLogo("")
        setLogoFile(null)
        setPrimaryColor("#6C63FF")
        setSelectedPlatforms([])
      }
      setShowDeleteConfirm(false)
    }
  }, [open, project])

  if (!open) return null

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    )
  }

  const handleSubmit = () => {
    if (!name.trim()) return
    startTransition(async () => {
      let finalLogoUrl = logo

      if (logoFile) {
        const formData = new FormData()
        formData.append('file', logoFile)
        const uploadResult = await uploadLogo(formData)
        if (uploadResult.success && uploadResult.url) {
          finalLogoUrl = uploadResult.url
        }
      }

      if (project) {
        await updateProject(project.id, {
          name: name.trim(),
          description: description.trim(),
          logo: finalLogoUrl.trim() || undefined,
          primaryColor,
          platforms: selectedPlatforms,
        })
      } else {
        await createProject({
          name: name.trim(),
          description: description.trim(),
          logo: finalLogoUrl.trim() || undefined,
          primaryColor,
          platforms: selectedPlatforms,
        })
      }
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
      await deleteProject(project.id)
      onClose()
      router.refresh()
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg glass-card rounded-3xl p-8 mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{project ? "Edit Project" : "New Project"}</h2>
          <div className="flex items-center gap-2">
            {project && (
              showDeleteConfirm ? (
                <div className="flex items-center gap-1">
                  <button onClick={handleDelete} disabled={isPending} className="px-2 py-1 rounded-md bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors">
                    Sure?
                  </button>
                  <button onClick={() => setShowDeleteConfirm(false)} className="px-2 py-1 rounded-md bg-white/5 text-muted-foreground text-xs hover:bg-white/10 transition-colors">
                    Cancel
                  </button>
                </div>
              ) : (
                <button onClick={handleDelete} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors" title="Delete Project">
                  <Trash2 className="h-4 w-4" />
                </button>
              )
            )}
            <button onClick={onClose} className="p-1.5 text-muted-foreground hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Project Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Nike Fall Campaign"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Upload Logo (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) setLogoFile(file)
              }}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30"
            />
            {(logoFile || logo) && (
              <div className="mt-3 flex items-center gap-3 p-2 rounded-lg border border-white/10 bg-white/5">
                 <div className="h-10 w-10 shrink-0 rounded bg-white overflow-hidden flex items-center justify-center">
                    <img 
                      src={logoFile ? URL.createObjectURL(logoFile) : logo} 
                      alt="Logo Preview" 
                      className="max-h-full max-w-full object-contain"
                    />
                 </div>
                 <span className="text-xs text-muted-foreground truncate flex-1">
                   {logoFile ? logoFile.name : logo.split('/').pop()}
                 </span>
                 <button 
                   onClick={() => { setLogoFile(null); setLogo("") }}
                   className="p-1.5 hover:bg-white/10 rounded-md text-muted-foreground hover:text-red-400"
                 >
                   <X className="h-4 w-4" />
                 </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief project overview..."
              rows={3}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Brand Color</label>
            <div className="flex gap-2 flex-wrap">
              {BRAND_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setPrimaryColor(color)}
                  className={`h-8 w-8 rounded-lg transition-all ${
                    primaryColor === color ? "ring-2 ring-white ring-offset-2 ring-offset-background scale-110" : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Platforms</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => togglePlatform(p.name)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    selectedPlatforms.includes(p.name)
                      ? "border-primary/50 bg-primary/10 text-white"
                      : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10"
                  }`}
                >
                  <span>{p.icon}</span>
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm font-medium text-white hover:bg-white/10 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending || !name.trim()}
            className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(108,99,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {isPending ? "Saving..." : project ? "Save Changes" : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  )
}
