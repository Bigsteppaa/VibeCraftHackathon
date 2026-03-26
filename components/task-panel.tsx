"use client"

import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react"
import { Plus, Trash2, GripVertical, Check, ListTodo, X, Sparkles, CircleDashed } from "lucide-react"
import { cn } from "@/lib/utils"

interface Task {
  id: string
  text: string
  completed: boolean
  order: number
  priority?: "low" | "medium" | "high"
}

interface TaskPanelProps {
  onTaskComplete?: (taskName: string) => void
  compact?: boolean
}

export interface TaskPanelRef {
  clearCompleted: () => void
  focusInput: () => void
}

export const TaskPanel = forwardRef<TaskPanelRef, TaskPanelProps>(
  ({ onTaskComplete, compact = false }, ref) => {
    const [tasks, setTasks] = useState<Task[]>([])
    const [newTask, setNewTask] = useState("")
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editText, setEditText] = useState("")
    const [draggedId, setDraggedId] = useState<string | null>(null)
    const [dragOverId, setDragOverId] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
      const saved = localStorage.getItem("focus-tasks")
      if (saved) {
        setTasks(JSON.parse(saved))
      }
    }, [])

    useEffect(() => {
      localStorage.setItem("focus-tasks", JSON.stringify(tasks))
    }, [tasks])

    useImperativeHandle(ref, () => ({
      clearCompleted: () => clearCompletedTasks(),
      focusInput: () => inputRef.current?.focus(),
    }))

    const addTask = (e: React.FormEvent) => {
      e.preventDefault()
      if (newTask.trim()) {
        const task: Task = {
          id: crypto.randomUUID(),
          text: newTask.trim(),
          completed: false,
          order: tasks.length,
          priority: "medium",
        }
        setTasks((prev) => [...prev, task])
        setNewTask("")
      }
    }

    const toggleTask = (id: string) => {
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id === id) {
            const newCompleted = !task.completed
            if (newCompleted) {
              onTaskComplete?.(task.text)
            }
            return { ...task, completed: newCompleted }
          }
          return task
        })
      )
    }

    const deleteTask = (id: string) => {
      setTasks((prev) => prev.filter((task) => task.id !== id))
    }

    const clearCompletedTasks = () => {
      setTasks((prev) => prev.filter((task) => !task.completed))
    }

    const startEditing = (task: Task) => {
      setEditingId(task.id)
      setEditText(task.text)
    }

    const saveEdit = () => {
      if (editingId && editText.trim()) {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === editingId ? { ...task, text: editText.trim() } : task
          )
        )
      }
      setEditingId(null)
      setEditText("")
    }

    const cancelEdit = () => {
      setEditingId(null)
      setEditText("")
    }

    const handleDragStart = (e: React.DragEvent, id: string) => {
      setDraggedId(id)
      e.dataTransfer.effectAllowed = "move"
    }

    const handleDragOver = (e: React.DragEvent, id: string) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = "move"
      setDragOverId(id)
    }

    const handleDragLeave = () => {
      setDragOverId(null)
    }

    const handleDrop = (e: React.DragEvent, targetId: string) => {
      e.preventDefault()
      if (draggedId && draggedId !== targetId) {
        setTasks((prev) => {
          const draggedIndex = prev.findIndex((t) => t.id === draggedId)
          const targetIndex = prev.findIndex((t) => t.id === targetId)
          const newTasks = [...prev]
          const [draggedTask] = newTasks.splice(draggedIndex, 1)
          newTasks.splice(targetIndex, 0, draggedTask)
          return newTasks.map((task, index) => ({ ...task, order: index }))
        })
      }
      setDraggedId(null)
      setDragOverId(null)
    }

    const handleDragEnd = () => {
      setDraggedId(null)
      setDragOverId(null)
    }

    const completedCount = tasks.filter((t) => t.completed).length
    const totalCount = tasks.length
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

    return (
      <div className={cn(
        "glass rounded-2xl glass-hover h-full flex flex-col overflow-hidden transition-all duration-500",
        compact ? "p-4" : "p-6"
      )}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={cn(
              "p-1.5 rounded-lg transition-colors",
              completedCount > 0 ? "bg-primary/20" : "bg-secondary"
            )}>
              <ListTodo className={cn("h-4 w-4", completedCount > 0 ? "text-primary" : "text-muted-foreground")} />
            </div>
            <h2 className="text-base font-semibold text-foreground">Tasks</h2>
          </div>
          <div className="flex items-center gap-2">
            {/* Progress indicator */}
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground tabular-nums">
                {completedCount}/{totalCount}
              </span>
            </div>
            {completedCount > 0 && (
              <button
                onClick={clearCompletedTasks}
                className="text-xs px-2 py-1 rounded-lg bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Add Task Form */}
        <form onSubmit={addTask} className="mb-4">
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                placeholder="What needs to be done?"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className={cn(
                  "w-full px-4 py-2.5 rounded-xl bg-input text-foreground placeholder:text-muted-foreground",
                  "border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                  "transition-all duration-200"
                )}
              />
              {newTask && (
                <button
                  type="button"
                  onClick={() => setNewTask("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={!newTask.trim()}
              className={cn(
                "px-4 py-2.5 rounded-xl transition-all duration-200",
                "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground",
                "hover:scale-105 active:scale-95 shadow-lg shadow-primary/20",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              )}
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </form>

        {/* Task List */}
        <div className={cn(
          "flex-1 overflow-y-auto space-y-2 min-h-0 pr-1",
          compact ? "max-h-[200px]" : "max-h-[280px]"
        )}>
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <div className="relative mb-3">
                <CircleDashed className="h-12 w-12 opacity-20" />
                <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-primary/50" />
              </div>
              <p className="text-sm font-medium">No tasks yet</p>
              <p className="text-xs opacity-70">Add one to get started</p>
            </div>
          ) : (
            tasks.map((task, index) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
                onDragOver={(e) => handleDragOver(e, task.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, task.id)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "group flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
                  "bg-secondary/40 hover:bg-secondary/70",
                  draggedId === task.id && "opacity-50 scale-[0.98] rotate-1",
                  dragOverId === task.id && draggedId !== task.id && "ring-2 ring-primary/50 ring-offset-2 ring-offset-background",
                  task.completed && "opacity-60"
                )}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {/* Drag Handle */}
                <div className="cursor-grab active:cursor-grabbing text-muted-foreground/30 hover:text-muted-foreground transition-colors">
                  <GripVertical className="h-4 w-4" />
                </div>

                {/* Checkbox */}
                <button
                  onClick={() => toggleTask(task.id)}
                  className={cn(
                    "relative flex-shrink-0 h-5 w-5 rounded-md border-2 transition-all duration-300 flex items-center justify-center overflow-hidden",
                    task.completed
                      ? "bg-gradient-to-br from-primary to-primary/80 border-primary"
                      : "border-muted-foreground/40 hover:border-primary"
                  )}
                >
                  <Check className={cn(
                    "h-3 w-3 text-primary-foreground transition-all duration-300",
                    task.completed ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  )} />
                </button>

                {/* Task Text */}
                {editingId === task.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit()
                        if (e.key === "Escape") cancelEdit()
                      }}
                      autoFocus
                      className="flex-1 px-2 py-1 rounded-lg bg-input text-foreground text-sm border border-border focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                    <button
                      onClick={saveEdit}
                      className="p-1 rounded bg-primary/20 text-primary hover:bg-primary/30"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-1 rounded bg-secondary text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <span
                    onClick={() => startEditing(task)}
                    className={cn(
                      "flex-1 text-sm cursor-pointer transition-all leading-relaxed",
                      task.completed
                        ? "line-through text-muted-foreground"
                        : "text-foreground hover:text-primary"
                    )}
                  >
                    {task.text}
                  </span>
                )}

                {/* Delete Button */}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Completion celebration */}
        {totalCount > 0 && completedCount === totalCount && (
          <div className="mt-4 p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-2 animate-fade-in-up">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">All tasks completed! Great work!</span>
          </div>
        )}
      </div>
    )
  }
)

TaskPanel.displayName = "TaskPanel"
