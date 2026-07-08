import { getAllContent } from "@/app/actions/content"
import { getProjects } from "@/app/actions/projects"
import { BoardClient } from "@/components/board/board-client"

export const revalidate = 0

export default async function BoardPage({ searchParams }: { searchParams: Promise<{ projectId?: string }> }) {
  const params = await searchParams;
  const projectId = params?.projectId;

  const [contentRes, projectsRes] = await Promise.all([getAllContent(), getProjects()])
  let contents = contentRes.data || []
  if (projectId) {
    contents = contents.filter(c => c.projectId === projectId);
  }
  const projects = (projectsRes.data || []).map((p: any) => ({ id: p.id, name: p.name }))

  return (
    <div className="p-8 pb-20 h-full flex flex-col">
      <BoardClient contents={contents} projects={projects} />
    </div>
  )
}
