"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { KanbanBoard } from "@/components/board/kanban-board"
import { CreateContentModal } from "@/components/content/create-content-modal"

export function BoardClient({
  contents,
  projects,
}: {
  contents: any[]
  projects: { id: string; name: string }[]
}) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Content Board</h1>
          <p className="text-muted-foreground mt-1">
            Drag and drop to manage your content pipeline.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(108,99,255,0.4)] active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Add Content</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <KanbanBoard initialData={contents} />
      </div>

      <CreateContentModal
        open={showModal}
        onClose={() => setShowModal(false)}
        projects={projects}
      />
    </>
  )
}
