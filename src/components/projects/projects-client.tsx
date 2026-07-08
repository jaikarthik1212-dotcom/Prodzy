"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { ProjectCard } from "@/components/projects/project-card"
import { CreateProjectModal } from "@/components/projects/create-project-modal"
import type { ProjectWithPlatforms } from "@/components/projects/project-card"

export function ProjectsClient({ projects }: { projects: ProjectWithPlatforms[] }) {
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState<ProjectWithPlatforms | undefined>(undefined)

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Brands & Projects</h1>
          <p className="text-muted-foreground mt-1">Manage all your workspaces in one place.</p>
        </div>
        <button
          onClick={() => {
            setEditingProject(undefined)
            setShowModal(true)
          }}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(108,99,255,0.4)] active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">No projects yet</h3>
          <p className="text-sm text-muted-foreground mb-6">Create your first project to start managing content.</p>
          <button
            onClick={() => {
              setEditingProject(undefined)
              setShowModal(true)
            }}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-all active:scale-95"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onEdit={() => {
                setEditingProject(project)
                setShowModal(true)
              }} 
            />
          ))}
        </div>
      )}

      <CreateProjectModal 
        open={showModal} 
        onClose={() => {
          setShowModal(false)
          // slight delay to clear form after modal animation
          setTimeout(() => setEditingProject(undefined), 200)
        }} 
        project={editingProject}
      />
    </>
  )
}
