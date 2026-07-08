import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"
import { Clock, MessageSquare } from "lucide-react"
import { getPlatformConfig } from "@/lib/constants"

export function SortableContentCard({
  item,
  onCardClick,
}: {
  item: any
  onCardClick?: (item: any) => void
}) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: item.id,
    data: { type: "Task", item },
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-28 w-full rounded-xl bg-primary/20 border-2 border-primary border-dashed opacity-40"
      />
    )
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div onClick={() => onCardClick?.(item)}>
        <ContentCard item={item} />
      </div>
    </div>
  )
}

export function ContentCard({
  item,
  isOverlay = false,
}: {
  item: any
  isOverlay?: boolean
}) {
  const platform = getPlatformConfig(item.platform)
  const priorityColor =
    item.priority === "High"
      ? "border-l-red-400"
      : item.priority === "Medium"
      ? "border-l-yellow-400"
      : "border-l-green-400"

  return (
    <div
      className={cn(
        "group relative flex cursor-grab flex-col gap-2.5 rounded-xl bg-[#1D2330] p-4 border border-white/5 border-l-2 shadow-sm transition-all active:cursor-grabbing hover:border-white/10",
        priorityColor,
        isOverlay && "scale-105 shadow-xl ring-2 ring-primary bg-[#1D2330]/95 backdrop-blur-xl z-50"
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className="rounded-md px-2 py-0.5 text-[10px] font-semibold"
          style={{ backgroundColor: platform.color + "20", color: platform.color }}
        >
          {platform.icon} {item.platform}
        </span>
        <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/50">
          {item.contentType}
        </span>
      </div>

      <h4 className="font-medium text-sm text-white line-clamp-2 leading-snug">
        {item.title}
      </h4>

      <div className="flex items-center justify-between pt-2 mt-0.5 border-t border-white/5 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3 w-3" />
          <span>
            {item.postingDate
              ? new Date(item.postingDate).toLocaleDateString()
              : "No date"}
          </span>
        </div>
        {item.project && (
          <span className="truncate max-w-[80px] text-muted-foreground/60">
            {item.project.name}
          </span>
        )}
      </div>
    </div>
  )
}
