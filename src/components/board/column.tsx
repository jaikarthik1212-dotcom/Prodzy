import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { SortableContentCard } from "./content-card"
import { cn } from "@/lib/utils"

export function Column({
  column,
  items,
  onCardClick,
}: {
  column: any
  items: any[]
  onCardClick?: (item: any) => void
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "Column", column },
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-72 flex-shrink-0 flex-col rounded-2xl bg-surface/30 p-3 transition-colors",
        isOver && "bg-white/5 ring-1 ring-primary/50"
      )}
    >
      <div className="mb-3 flex items-center justify-between px-2 pt-1">
        <span className={cn("px-2.5 py-1 rounded-lg text-xs font-semibold", column.color)}>
          {column.title}
        </span>
        <span className="text-xs font-medium text-muted-foreground">{items.length}</span>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 min-h-[100px]">
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SortableContentCard key={item.id} item={item} onCardClick={onCardClick} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}
