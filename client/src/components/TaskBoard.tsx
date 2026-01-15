import { Task } from "@shared/schema";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"; // Standard dnd lib
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// We'll simulate a DND board for visual purposes since full DND logic is complex
// This component renders columns based on status

const statusConfig = {
  todo: { label: "To Do", color: "bg-slate-100 border-slate-200" },
  in_progress: { label: "In Progress", color: "bg-blue-50 border-blue-100" },
  review: { label: "Review", color: "bg-amber-50 border-amber-100" },
  completed: { label: "Completed", color: "bg-emerald-50 border-emerald-100" },
};

export function TaskBoard({ tasks, onStatusChange }: { tasks: Task[], onStatusChange: (id: number, status: string) => void }) {
  const columns = Object.keys(statusConfig) as (keyof typeof statusConfig)[];

  return (
    <div className="flex gap-6 overflow-x-auto pb-6 h-[calc(100vh-240px)]">
      {columns.map((status) => {
        const columnTasks = tasks.filter(t => t.status === status);
        
        return (
          <div key={status} className="flex-none w-80 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                {statusConfig[status].label}
                <span className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">
                  {columnTasks.length}
                </span>
              </h3>
            </div>
            
            <div className={cn("flex-1 rounded-xl p-2 border-2 border-dashed border-transparent bg-muted/30 hover:border-muted transition-colors overflow-y-auto", statusConfig[status].color)}>
              {columnTasks.map(task => (
                <Card key={task.id} className="mb-3 cursor-pointer hover:shadow-md transition-all duration-200 border-none shadow-sm">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider",
                        task.priority === 'high' ? "bg-rose-100 text-rose-700" :
                        task.priority === 'medium' ? "bg-amber-100 text-amber-700" :
                        "bg-slate-100 text-slate-700"
                      )}>
                        {task.priority}
                      </span>
                      <button className="text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <h4 className="font-medium text-sm leading-snug">{task.title}</h4>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex -space-x-2">
                        {/* Placeholder for assignee avatar */}
                        <div className="w-6 h-6 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-[10px]">
                           {(task as any).assignee?.role?.[0] || "?"}
                        </div>
                      </div>
                      
                      {task.dueDate && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(task.dueDate), "MMM d")}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {columnTasks.length === 0 && (
                <div className="h-24 flex items-center justify-center text-xs text-muted-foreground border-2 border-dashed border-muted-foreground/10 rounded-lg">
                  No tasks
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
