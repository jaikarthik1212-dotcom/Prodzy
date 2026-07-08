import { getProjects } from "@/app/actions/projects"
import { ProjectsClient } from "@/components/projects/projects-client"
import type { ProjectWithPlatforms } from "@/components/projects/project-card"

export const revalidate = 0

export default async function ProjectsPage() {
  const response = await getProjects()
  const projects = (response.data || []) as ProjectWithPlatforms[]

  return (
    <div className="p-8 pb-20">
      <ProjectsClient projects={projects} />
    </div>
  )
}
