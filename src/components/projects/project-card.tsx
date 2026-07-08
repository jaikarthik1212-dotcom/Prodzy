import { Project, Platform } from "@prisma/client"
import { Calendar, MoreHorizontal } from "lucide-react"

export type ProjectWithPlatforms = Project & {
  platforms: Platform[]
  _count: { contents: number }
}

export function ProjectCard({ project, onEdit }: { project: ProjectWithPlatforms, onEdit?: () => void }) {
  return (
    <div className="glass-card flex flex-col justify-between rounded-2xl p-6 transition-all hover:scale-[1.02] hover:shadow-[0_8px_32px_0_rgba(108,99,255,0.2)]">
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div 
              className="flex h-12 w-12 items-center justify-center rounded-xl shadow-lg overflow-hidden relative"
              style={{ backgroundColor: project.primaryColor || '#6C63FF' }}
            >
              {project.logo ? (
                <img src={project.logo} alt={project.name} className="object-cover w-full h-full bg-white" />
              ) : (
                <span className="text-xl font-bold text-white uppercase">
                  {project.name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{project.name}</h3>
              <p className="text-sm text-muted-foreground">{project._count.contents} Posts managed</p>
            </div>
          </div>
          <button onClick={onEdit} className="text-muted-foreground hover:text-white transition-colors" title="Edit Project">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
        
        <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.platforms.map(p => (
            <span 
              key={p.id} 
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-white/5 border border-white/10"
              style={{ color: p.brandColor || '#FFFFFF' }}
            >
              {p.name}
            </span>
          ))}
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Active</span>
        </div>
        <div className="flex -space-x-2">
          <div className="h-8 w-8 rounded-full bg-surface border-2 border-[#1D2330] z-10"></div>
          <div className="h-8 w-8 rounded-full bg-surface border-2 border-[#1D2330] z-0"></div>
        </div>
      </div>
    </div>
  )
}
