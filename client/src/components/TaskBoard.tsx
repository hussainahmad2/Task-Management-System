import { Task } from "@shared/schema";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const statusConfig = {
  todo: { label: "To Do", color: "bg-muted/30 dark:bg-muted/20 border-muted" },
  in_progress: { label: "In Progress", color: "bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/20" },
  review: { label: "Review", color: "bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/20" },
  completed: { label: "Completed", color: "bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/20" },
};

export function TaskBoard({ tasks, onStatusChange }: { tasks: Task[], onStatusChange: (id: number, status: string) => void }) {
  const columns = Object.keys(statusConfig) as (keyof typeof statusConfig)[];

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside a valid droppable area
    if (!destination) return;

    // Dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // Extract task ID from draggableId (format: "task-{id}")
    const taskId = parseInt(draggableId.replace("task-", ""));
    const newStatus = destination.droppableId;

    // Call the status change handler
    onStatusChange(taskId, newStatus);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
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

              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "flex-1 rounded-xl p-2 border-2 border-dashed transition-all overflow-y-auto",
                      statusConfig[status].color,
                      snapshot.isDraggingOver
                        ? "border-primary bg-primary/5 scale-[1.02]"
                        : "border-transparent"
                    )}
                  >
                    {columnTasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={`task-${task.id}`}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cn(
                              "mb-3 cursor-grab active:cursor-grabbing transition-all duration-200 border-none shadow-sm",
                              snapshot.isDragging
                                ? "shadow-2xl rotate-2 scale-105 ring-2 ring-primary/50"
                                : "hover:shadow-md"
                            )}
                          >
                            <CardContent className="p-4 space-y-3">
                              <div className="flex justify-between items-start gap-2">
                                <span className={cn(
                                  "text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider",
                                  task.priority === 'critical' ? "bg-red-500/20 text-red-700 dark:text-red-400 border border-red-500/30" :
                                    task.priority === 'high' ? "bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/30" :
                                      task.priority === 'medium' ? "bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30" :
                                        "bg-slate-500/20 text-slate-700 dark:text-slate-400 border border-slate-500/30"
                                )}>
                                  {task.priority}
                                </span>
                                <button
                                  className="text-muted-foreground hover:text-foreground"
                                  onClick={(e) => e.stopPropagation()}
                                >
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
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {columnTasks.length === 0 && (
                      <div className="h-24 flex items-center justify-center text-xs text-muted-foreground border-2 border-dashed border-muted-foreground/10 rounded-lg">
                        No tasks
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
