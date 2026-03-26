"use client"

import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react"
import { Plus, Trash2, GripVertical, Check, ListTodo, X, Sparkles, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Task {
  id: string
  text: string
  completed: boolean
  order: number
}

interface TaskPanelProps {
  onTaskComplete?: (taskName: string) => void
}

export interface TaskPanelRef {
  clearCompleted: () => void
  focusInput: () => void
}

export const TaskPanel = forwardRef<TaskPanelRef, TaskPanelProps>(
  ({ onTaskComplete }, ref) => {
    const [tasks, setTasks] = useState<Task[]>([])
    const [newTask, setNewTask] = useState("")
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editText, setEditText] = useState("")
    const [draggedId, setDraggedId] = useState<string | null>(null)
    const [dragOverId, setDragOverId] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
      const saved = localStorage.getItem("focus-tasks")
      if (saved) setTasks(JSON.parse(saved))
    }, [])

    useEffect(() => {
      localStorage.setItem("focus-tasks", JSON.stringify(tasks))
    }, [tasks])

    useImperativeHandle(ref, () => ({
      clearCompleted: () => setTasks((prev) => prev.filter((t) => !t.completed)),
      focusInput: () => inputRef.current?.focus(),
    }))

    const addTask = (e: React.FormEvent) => {
      e.preventDefault()
      if (newTask.trim()) {
        setTasks((prev) => [...prev, {
          id: crypto.randomUUID(),
          text: newTask.trim(),
          completed: false,
          order: prev.length,
        }])
        setNewTask("")
      }
    }

    const toggleTask = (id: string) => {
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id === id) {
            if (!task.completed) onTaskComplete?.(task.text)
            return { ...task, completed: !task.completed }
          }
          return task
        })
      )
    }

    const deleteTask = (id: string) => {
      setTasks((prev) => prev.filter((task) => task.id !== id))
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
    }

    const handleDragStart = (e: React.DragEvent, id: string) => {
      setDraggedId(id)
      e.dataTransfer.effectAllowed = "move"
    }

    const handleDragOver = (e: React.DragEvent, id: string) => {
      e.preventDefault()
      setDragOverId(id)
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

    const completedCount = tasks.filter((t) => t.completed).length
    const totalCount = tasks.length
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

    return (
      <div className="glass rounded-2xl p-6 glass-hover h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className={cn(
              "p-2 rounded-xl transition-colors",
              completedCount > 0 ? "bg-primary/20" : "bg-secondary"
            )}>
              <ListTodo className={cn("h-4 w-4", completedCount > 0 ? "text-primary" : "text-muted-foreground")} />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Tasks</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground tabular-nums">{completedCount}/{totalCount}</span>
            </div>
            {completedCount > 0 && (
              <button
                onClick={() => setTasks((prev) => prev.filter((t) => !t.completed))}
                className="text-xs px-2 py-1 rounded-lg bg-secondary/80 text-muted-foreground hover:text-foreground transition-all"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Add Task */}
        <form onSubmit={addTask} className="mb-4">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="What needs to be done?"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-input text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
            <button
              type="submit"
              disabled={!newTask.trim()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:hover:scale-100 transition-all"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </form>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto space-y-2 min-h-0 max-h-[300px] pr-1">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Circle className="h-10 w-10 opacity-20 mb-2" />
              <p className="text-sm">No tasks yet</p>
              <p className="text-xs opacity-70">Add one to get started</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
                onDragOver={(e) => handleDragOver(e, task.id)}
                onDragLeave={() => setDragOverId(null)}
                onDrop={(e) => handleDrop(e, task.id)}
                onDragEnd={() => { setDraggedId(null); setDragOverId(null) }}
                className={cn(
                  "group flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
                  "bg-secondary/40 hover:bg-secondary/60",
                  draggedId === task.id && "opacity-50 scale-[0.98]",
                  dragOverId === task.id && draggedId !== task.id && "ring-2 ring-primary/50",
                  task.completed && "opacity-60"
                )}
              >
                {/* Drag Handle */}
                <div className="cursor-grab active:cursor-grabbing text-muted-foreground/30 hover:text-muted-foreground transition-colors">
                  <GripVertical className="h-4 w-4" />
                </div>

                {/* Checkbox */}
                <button
                  onClick={() => toggleTask(task.id)}
                  className={cn(
                    "flex-shrink-0 h-5 w-5 rounded-md border-2 transition-all duration-300 flex items-center justify-center",
                    task.completed
                      ? "bg-gradient-to-br from-primary to-primary/80 border-primary"
                      : "border-muted-foreground/40 hover:border-primary"
                  )}
                >
                  <Check className={cn(
                    "h-3 w-3 text-primary-foreground transition-all",
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
                        if (e.key === "Escape") setEditingId(null)
                      }}
                      autoFocus
                      className="flex-1 px-2 py-1 rounded-lg bg-input text-foreground text-sm border border-border focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                    <button onClick={saveEdit} className="p-1 rounded bg-primary/20 text-primary hover:bg-primary/30">
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-1 rounded bg-secondary text-muted-foreground hover:text-foreground">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <span
                    onClick={() => startEditing(task)}
                    className={cn(
                      "flex-1 text-sm cursor-pointer transition-all leading-relaxed",
                      task.completed ? "line-through text-muted-foreground" : "text-foreground hover:text-primary"
                    )}
                  >
                    {task.text}
                  </span>
                )}

                {/* Delete */}
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

        {/* Completion Message */}
        {totalCount > 0 && completedCount === totalCount && (
          <div className="mt-4 p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-2 animate-fade-in-up">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">All done! Great work!</span>
          </div>
        )}
      </div>
    )
  }
)

TaskPanel.displayName = "TaskPanel"
