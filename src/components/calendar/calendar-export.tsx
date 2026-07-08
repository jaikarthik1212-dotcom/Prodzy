"use client"

import { useState, useRef, useEffect } from "react"
import { Download, FileSpreadsheet, Calendar as CalendarIcon, FileImage } from "lucide-react"

export function CalendarExport({ contents, projectName }: { contents: any[], projectName: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  
  const safeFileName = `${projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_content_calendar`

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const exportCSV = () => {
    const headers = ["Title", "Platform", "Content Type", "Status", "Date", "Time", "Link"]
    const rows = contents.map(c => [
      `"${c.title?.replace(/"/g, '""') || ''}"`,
      c.platform,
      c.contentType,
      c.status,
      c.postingDate ? new Date(c.postingDate).toLocaleDateString() : "",
      c.postingTime || "",
      c.referenceLink || ""
    ])
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${safeFileName}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setIsOpen(false)
  }

  const exportICS = () => {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Prodzy//Content Calendar//EN\n"
    
    contents.forEach(c => {
      if (!c.postingDate) return
      
      const date = new Date(c.postingDate)
      // Format to YYYYMMDDTHHMMSSZ
      const dateStr = date.toISOString().replace(/[-:]/g, '').split('.')[0] + "Z"
      
      icsContent += "BEGIN:VEVENT\n"
      icsContent += `UID:${c.id}@prodzy.com\n`
      icsContent += `DTSTAMP:${dateStr}\n`
      icsContent += `DTSTART;VALUE=DATE:${dateStr.substring(0, 8)}\n`
      icsContent += `SUMMARY:[${c.platform}] ${c.title}\n`
      icsContent += `DESCRIPTION:Status: ${c.status}\\nType: ${c.contentType}\n`
      icsContent += "END:VEVENT\n"
    })
    
    icsContent += "END:VCALENDAR"
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${safeFileName}.ics`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setIsOpen(false)
  }

  const handlePrint = () => {
    setIsOpen(false)
    setTimeout(() => window.print(), 100)
  }

  return (
    <div className="relative print-hidden" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/10 active:scale-95"
      >
        <Download className="h-4 w-4" />
        <span>Export</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#1D2330] p-1 shadow-xl z-50">
          <button
            onClick={exportCSV}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-white transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Excel / CSV</span>
          </button>
          <button
            onClick={exportICS}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-white transition-colors"
          >
            <CalendarIcon className="h-4 w-4" />
            <span>Apple / Google Cal</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-white transition-colors"
          >
            <FileImage className="h-4 w-4" />
            <span>Save as PDF / Print</span>
          </button>
        </div>
      )}
    </div>
  )
}
