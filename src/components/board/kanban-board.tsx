"use client"

import { useState } from "react"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { ContentCard } from "./content-card"
import { Column } from "./column"
import { ContentDetailDrawer } from "@/components/content/content-detail-drawer"
import { updateContentStatus } from "@/app/actions/content"

const COLUMNS = [
  { id: "Idea", title: "Idea", color: "bg-gray-500/20 text-gray-400" },
  { id: "Planned", title: "Planned", color: "bg-blue-500/20 text-blue-400" },
  { id: "Script Ready", title: "Script Ready", color: "bg-purple-500/20 text-purple-400" },
  { id: "Designing", title: "Designing", color: "bg-orange-500/20 text-orange-400" },
  { id: "Editing", title: "Editing", color: "bg-pink-500/20 text-pink-400" },
  { id: "Review", title: "Review", color: "bg-yellow-500/20 text-yellow-400" },
  { id: "Approved", title: "Approved", color: "bg-green-500/20 text-green-400" },
  { id: "Scheduled", title: "Scheduled", color: "bg-cyan-500/20 text-cyan-400" },
  { id: "Posted", title: "Posted", color: "bg-emerald-500/20 text-emerald-400" },
]

export function KanbanBoard({ initialData }: { initialData: any[] }) {
  const [items, setItems] = useState(initialData)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [selectedContent, setSelectedContent] = useState<any | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveTask = active.data.current?.type === "Task"
    const isOverTask = over.data.current?.type === "Task"
    const isOverColumn = over.data.current?.type === "Column"

    if (!isActiveTask) return

    if (isActiveTask && isOverColumn) {
      setItems((items) => {
        const activeIndex = items.findIndex((t) => t.id === activeId)
        if (activeIndex === -1) return items
        const updated = [...items]
        updated[activeIndex] = { ...updated[activeIndex], status: overId as string }
        return updated
      })
      return
    }

    if (isActiveTask && isOverTask) {
      setItems((items) => {
        const activeIndex = items.findIndex((t) => t.id === activeId)
        const overIndex = items.findIndex((t) => t.id === overId)
        if (activeIndex === -1 || overIndex === -1) return items
        if (items[activeIndex].status !== items[overIndex].status) {
          const updated = [...items]
          updated[activeIndex] = { ...updated[activeIndex], status: items[overIndex].status }
          return arrayMove(updated, activeIndex, overIndex)
        }
        return arrayMove(items, activeIndex, overIndex)
      })
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null)
    const { active } = event

    const activeItem = items.find((i) => i.id === active.id)
    if (activeItem) {
      await updateContentStatus(activeItem.id, activeItem.status)
    }
  }

  const handleCardClick = (item: any) => {
    setSelectedContent(item)
  }

  const activeItem = items.find((i) => i.id === activeId)

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-full gap-4 px-1 pb-4 items-start">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              column={col}
              items={items.filter((i) => i.status === col.id)}
              onCardClick={handleCardClick}
            />
          ))}
        </div>
        <DragOverlay>
          {activeItem ? <ContentCard item={activeItem} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

      {selectedContent && (
        <ContentDetailDrawer
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
        />
      )}
    </>
  )
}
