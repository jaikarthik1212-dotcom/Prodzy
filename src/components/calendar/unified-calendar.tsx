"use client"

import { useMemo, useState } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale/en-US'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { ContentDetailDrawer } from '@/components/content/content-detail-drawer'
import { CreateContentModal } from '@/components/content/create-content-modal'
import { getPlatformConfig } from '@/lib/constants'

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

export function UnifiedCalendar({ 
  initialData, 
  projects,
  projectName,
  projectLogo
}: { 
  initialData: any[]; 
  projects: any[];
  projectName?: string;
  projectLogo?: string;
}) {
  const [selectedContent, setSelectedContent] = useState<any | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelectedDate(start)
    setIsCreating(true)
  }

  const events = useMemo(() => {
    return initialData.filter(i => i.postingDate).map(item => ({
      title: `${item.platform} - ${item.title}`,
      start: new Date(item.postingDate),
      end: new Date(item.postingDate),
      allDay: true,
      resource: item
    }))
  }, [initialData])

  const eventStyleGetter = (event: any, start: any, end: any, isSelected: boolean) => {
    let backgroundColor = '#6C63FF' // Default primary
    
    // Custom colors based on status
    if (event.resource.status === 'Approved' || event.resource.status === 'Posted') {
      backgroundColor = '#16C784' // Success
    } else if (event.resource.status === 'Editing' || event.resource.status === 'Review') {
      backgroundColor = '#F4B400' // Warning
    } else {
      backgroundColor = '#00C2FF' // Secondary
    }

    const style = {
      backgroundColor,
      borderRadius: '6px',
      opacity: 0.9,
      color: 'white',
      border: '0px',
      display: 'block',
      padding: '2px 8px',
      fontSize: '0.75rem',
      fontWeight: 500,
      borderLeft: `3px solid rgba(255,255,255,0.4)`
    }
    return { style }
  }

  const handleSelectEvent = (event: any) => {
    setSelectedContent(event.resource)
  }

  const CustomDateHeader = ({ date, label }: { date: Date, label: string }) => {
    const dayEvents = events.filter(e => 
      e.start.getDate() === date.getDate() &&
      e.start.getMonth() === date.getMonth() &&
      e.start.getFullYear() === date.getFullYear()
    )

    return (
        <div className="flex flex-col w-full min-h-[80px]">
        <div className="text-right pb-1 pr-1 text-sm font-medium">{label}</div>
        <div className="flex flex-col gap-1 w-full px-1 overflow-y-auto max-h-[85px]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {dayEvents.map((event, idx) => {
            const platform = getPlatformConfig(event.resource.platform);
            const color = platform?.color || '#6C63FF';
            const icon = platform?.icon || '•';

            return (
              <div 
                key={idx} 
                onClick={(e) => { 
                  e.preventDefault();
                  e.stopPropagation(); 
                  handleSelectEvent(event); 
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                className="w-full rounded-md flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium cursor-pointer hover:brightness-110 transition-all shadow-sm border truncate"
                style={{ 
                  backgroundColor: `${color}15`, 
                  borderColor: `${color}30`,
                  color: color 
                }}
                title={event.title}
              >
                <span className="shrink-0 text-[12px]">{icon}</span>
                <span className="truncate text-white/90">{event.resource.title}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="h-[600px] w-full calendar-override">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          eventPropGetter={eventStyleGetter}
          views={['month', 'week', 'day']}
          defaultView="month"
          selectable={true}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          components={{
            month: {
              dateHeader: CustomDateHeader
            },
            toolbar: (toolbarProps: any) => {
              return (
                <div className="rbc-toolbar !mb-6">
                  <span className="rbc-btn-group print-hidden">
                    <button type="button" onClick={() => toolbarProps.onNavigate('TODAY')}>Today</button>
                    <button type="button" onClick={() => toolbarProps.onNavigate('PREV')}>Back</button>
                    <button type="button" onClick={() => toolbarProps.onNavigate('NEXT')}>Next</button>
                  </span>
                  
                  <span className="rbc-toolbar-label font-bold text-xl text-white flex items-center justify-center gap-2">
                    {projectName && projectName !== 'All Projects' && (
                      <>
                        {projectLogo && (
                          <div className="h-6 w-6 rounded-md overflow-hidden bg-white border border-white/20 shadow-sm shrink-0">
                            <img src={projectLogo} alt={projectName} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <span className="text-primary">{projectName} •</span>
                      </>
                    )}
                    {toolbarProps.label}
                  </span>
                  
                  <span className="rbc-btn-group print-hidden">
                    {(toolbarProps.views as string[]).map(name => (
                      <button 
                        key={name}
                        type="button" 
                        className={toolbarProps.view === name ? 'rbc-active' : ''}
                        onClick={() => toolbarProps.onView(name as any)}
                      >
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                      </button>
                    ))}
                  </span>
                </div>
              )
            }
          }}
        />
        <style dangerouslySetInnerHTML={{__html: `
          .calendar-override .rbc-calendar {
            font-family: inherit;
            color: white;
          }
          .calendar-override .rbc-header {
            padding: 12px;
            font-weight: 600;
            color: #9AA4B2;
            border-bottom: 1px solid rgba(255,255,255,0.05);
          }
          .calendar-override .rbc-month-view {
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 12px;
            overflow: hidden;
          }
          /* Hide default events in month view */
          .calendar-override .rbc-month-view .rbc-row-content .rbc-row:not(:first-child) {
            display: none;
          }
          .calendar-override .rbc-day-bg {
            border-left: 1px solid rgba(255,255,255,0.05);
          }
          .calendar-override .rbc-month-row {
            border-top: 1px solid rgba(255,255,255,0.05);
            min-height: 100px;
          }
          .calendar-override .rbc-off-range-bg {
            background: rgba(255,255,255,0.02);
          }
          .calendar-override .rbc-today {
            background: rgba(108, 99, 255, 0.1);
          }
          .calendar-override .rbc-date-cell {
            padding: 8px;
            font-weight: 500;
          }
          .calendar-override .rbc-event {
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          .calendar-override .rbc-toolbar button {
            color: white;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 8px;
            margin: 0 4px;
          }
          .calendar-override .rbc-toolbar button:active,
          .calendar-override .rbc-toolbar button.rbc-active,
          .calendar-override .rbc-toolbar button:hover {
            background-color: rgba(108, 99, 255, 0.2);
            border-color: #6C63FF;
            box-shadow: none;
          }
        `}} />
      </div>

      {selectedContent && (
        <ContentDetailDrawer
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
        />
      )}

      <CreateContentModal 
        open={isCreating} 
        onClose={() => setIsCreating(false)} 
        projects={projects} 
        initialDate={selectedDate} 
      />
    </>
  )
}

