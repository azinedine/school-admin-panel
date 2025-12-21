import { ChevronLeft, ChevronRight, Filter, Plus, Bell, MessageSquare, Search, MoreHorizontal, CheckCircle2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ContentPage } from "@/components/layout/content-page"

const months = [
  "Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"
]

const exams = [
  {
    day: 1,
    items: [
      { id: 1, class: "Class 302", time: "8:00 am", subject: "Math Exam", grade: "Grade 12", color: "bg-pastel-blue", status: "Confirmed", count: 19 },
      { id: 2, class: "Class 303", time: "9:00 am", subject: "Physics Exam", grade: "Grade 10", color: "bg-pastel-yellow", status: "Confirmed", count: 18 },
    ]
  },
  {
    day: 2,
    items: []
  },
  {
    day: 3,
    items: [
      { id: 3, class: "Class 304", time: "8:00 am", subject: "Art Exam", grade: "Grade 9", color: "bg-pastel-coral", status: "Confirmed", count: 20 },
      { id: 4, class: "Class 302", time: "9:00 am", subject: "Math Exam", grade: "Grade 12", color: "bg-pastel-blue", status: "Confirmed", count: 19 },
      { id: 5, class: "Class 305", time: "10:00 am", subject: "English Exam", grade: "Grade 11", color: "bg-pastel-green", status: "Confirmed", count: 18 },
    ]
  }
]

function ExamsHeaderActions() {
  return (
    <>
      <Button variant="outline" size="icon" className="rounded-full h-7 w-7">
        <Bell className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" className="rounded-full h-7 w-7">
        <MessageSquare className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" className="rounded-full h-7 w-7">
        <Search className="h-4 w-4" />
      </Button>
      <Button className="rounded-full px-4 h-7">
        <Plus className="mr-2 h-4 w-4" /> Add exam
      </Button>
    </>
  )
}

export default function ExamsPage() {
  return (
    <ContentPage 
      title="Exams" 
      description="On the attendance page, you can easily track student attendance and monitor absences."
      headerActions={<ExamsHeaderActions />}
    >
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-8">
        {/* Main Content */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Exam Calendar</h2>
            <Button variant="outline" size="sm" className="rounded-full px-4 h-8 text-xs">
              <Filter className="mr-2 h-3.5 w-3.5" /> Filter <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-foreground text-background">1</Badge>
            </Button>
          </div>

          {/* Month Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8 rounded-full">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {months.map((month) => (
              <Button 
                key={month} 
                variant={month === "Feb" ? "default" : "ghost"}
                className={cn(
                  "shrink-0 rounded-full px-6 h-8 text-xs font-medium",
                  month === "Feb" ? "shadow-md px-8" : "text-muted-foreground"
                )}
              >
                {month}
              </Button>
            ))}
            <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8 rounded-full">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="space-y-4">
            {exams.map((dayData) => (
              <div key={dayData.day} className="grid grid-cols-[40px_1fr] gap-4 items-start py-4 border-t first:border-t-0 border-muted/50">
                <span className="text-lg font-bold text-muted-foreground leading-none pt-1">{dayData.day}</span>
                {dayData.items.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dayData.items.map((exam) => (
                      <div key={exam.id} className={cn("p-4 rounded-3xl flex flex-col gap-3 shadow-sm", exam.color)}>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground/80">{exam.class}</span>
                          <span className="text-[10px] font-medium text-foreground/60">{exam.time}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="bg-background/80 p-2 rounded-xl">
                            <FileText className="h-4 w-4 text-foreground/70" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-foreground">{exam.subject}</h4>
                            <p className="text-[10px] text-foreground/60">{exam.grade}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="bg-background/60 text-foreground text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border-0">
                            <CheckCircle2 className="h-3 w-3" /> {exam.status}
                          </Badge>
                          <Badge variant="secondary" className="bg-background/60 text-foreground text-[10px] font-bold h-6 w-6 p-0 flex items-center justify-center rounded-full border-0">
                            {exam.count}
                          </Badge>
                          <Button variant="ghost" size="icon" className="ml-auto h-6 w-6 rounded-full hover:bg-background/40">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic py-1">No exam.</p>
                )}
              </div>
            ))}
            <div className="grid grid-cols-[40px_1fr] gap-4 items-start py-4 border-t border-muted/50">
               <span className="text-lg font-bold text-muted-foreground leading-none pt-1">4</span>
               <p className="text-sm text-muted-foreground italic py-1">Weekend</p>
            </div>
          </div>
        </div>

        {/* Right Sidebar Widgets */}
        <div className="space-y-8">
           <div className="bg-accent/10 p-6 rounded-[2.5rem] border space-y-6">
             <div className="flex items-center justify-between">
               <h3 className="font-bold flex items-center gap-2">
                 <ChevronLeft className="h-4 w-4 cursor-pointer" />
                 February
                 <ChevronRight className="h-4 w-4 cursor-pointer" />
               </h3>
               <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-full">
                 <Filter className="h-3 w-3" />
               </Button>
             </div>
             
             <div className="grid grid-cols-7 text-center text-[10px] font-bold text-muted-foreground gap-y-2">
               <div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div><div>Su</div>
               <div className="text-muted-foreground/30 py-2">1</div>
               <div className="text-muted-foreground/30 py-2">2</div>
               <div className="text-muted-foreground/30 py-2">3</div>
               <div className="text-muted-foreground/30 py-2">4</div>
               <div className="relative py-2 font-bold text-foreground">5<span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-coral-500 rounded-full"></span></div>
               <div className="bg-foreground text-background rounded-full py-2 shadow-lg">6</div>
               <div className="py-2">7</div>
               <div className="py-2">8</div>
               <div className="relative py-2">9<span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></span></div>
               <div className="py-2">10</div>
             </div>

             <div className="pt-4 border-t border-muted/50">
               <div className="flex items-center gap-2 text-[11px] font-bold">
                 <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
                 9 Exams for this month
               </div>
             </div>
           </div>

           <div className="space-y-4">
             <div className="flex items-center justify-between">
               <h3 className="font-bold">Upcoming exams</h3>
               <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-8 px-0">
                 <Filter className="mr-2 h-3.5 w-3.5" /> Filter
               </Button>
             </div>
             
             <div className="space-y-3">
               <div className="bg-pastel-blue/60 p-4 rounded-[2rem] space-y-3 border border-pastel-blue">
                  <div className="flex items-center justify-between">
                    <span className="bg-foreground/5 text-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">302</span>
                    <Badge variant="outline" className="text-[10px] font-bold border-foreground/20 rounded-full bg-background/40">4 Days left</Badge>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">Math Exam</h4>
                    <p className="text-[10px] text-muted-foreground">10 Feb - 7:30am → 9:00am</p>
                  </div>
               </div>

               <div className="bg-pastel-green/60 p-4 rounded-[2rem] space-y-3 border border-pastel-green">
                  <div className="flex items-center justify-between">
                    <span className="bg-foreground/5 text-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">305</span>
                    <Badge variant="outline" className="text-[10px] font-bold border-foreground/20 rounded-full bg-background/40">5 Days left</Badge>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">English Exam</h4>
                    <p className="text-[10px] text-muted-foreground">11 Feb - 7:30am → 9:00am</p>
                  </div>
               </div>
             </div>
           </div>
        </div>
      </div>
    </ContentPage>
  )
}
