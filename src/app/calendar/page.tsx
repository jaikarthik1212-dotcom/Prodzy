import { getAllContent } from "@/app/actions/content"
import { getProjects } from "@/app/actions/projects"
import { UnifiedCalendar } from "@/components/calendar/unified-calendar"
import { CalendarExport } from "@/components/calendar/calendar-export"

export const revalidate = 0;

export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ projectId?: string }> }) {
  const params = await searchParams;
  const projectId = params?.projectId;

  const [contentRes, projectsRes] = await Promise.all([getAllContent(), getProjects()]);
  let contents = contentRes.data || [];
  let projectName = "All Projects";
  let projectLogo = "";
  
  if (projectId) {
    contents = contents.filter(c => c.projectId === projectId);
    const selectedProject = projectsRes.data?.find(p => p.id === projectId);
    if (selectedProject) {
      projectName = selectedProject.name;
      projectLogo = selectedProject.logo || "";
    }
  }
  const projects = (projectsRes.data || []).map((p: any) => ({ id: p.id, name: p.name }));

  return (
    <div className="p-8 pb-20 h-full flex flex-col print:p-0 print:h-auto">
      <div className="mb-8 shrink-0 flex items-center justify-between print-hidden">
        <div className="flex items-center gap-4">
          {projectLogo && (
            <div className="h-12 w-12 rounded-xl overflow-hidden bg-white shadow-lg shrink-0 border border-white/10">
              <img src={projectLogo} alt={projectName} className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">{projectName} Calendar</h1>
            <p className="text-muted-foreground mt-1">Unified view of all your scheduled and planned content.</p>
          </div>
        </div>
        <CalendarExport contents={contents} projectName={projectName} />
      </div>

      <div className="flex-1 glass-card rounded-3xl p-6 overflow-hidden">
        <UnifiedCalendar initialData={contents} projects={projects} projectName={projectName} projectLogo={projectLogo} />
      </div>
    </div>
  )
}
