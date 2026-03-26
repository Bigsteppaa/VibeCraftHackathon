"use client"

import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react"
import { Plus, Trash2, GripVertical, Check, ListTodo, X } from "lucide-react"
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
    const inputRef = useRef<HTMLInputElement>(null)

    // Load tasks from localStorage
    useEffect(() => {
      const saved = localStorage.getItem("focus-tasks")
      if (saved) {
        setTasks(JSON.parse(saved))
      }
    }, [])

    // Save tasks to localStorage
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

    // Drag and drop handlers
    const handleDragStart = (e: React.DragEvent, id: string) => {
      setDraggedId(id)
      e.dataTransfer.effectAllowed = "move"
    }

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = "move"
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
    }

    const handleDragEnd = () => {
      setDraggedId(null)
    }

    const completedCount = tasks.filter((t) => t.completed).length
    const totalCount = tasks.length

    return (
      <div className="glass rounded-2xl p-6 glass-hover h-full flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Tasks</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              <span className="font-semibold text-primary">{completedCount}</span>
              <span className="mx-1">/</span>
              <span>{totalCount}</span>
            </span>
            {completedCount > 0 && (
              <button
                onClick={clearCompletedTasks}
                className="text-xs px-2 py-1 rounded bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear done
              </button>
            )}
          </div>
        </div>

        {/* Add Task Form */}
        <form onSubmit={addTask} className="mb-4">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-input text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </form>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto space-y-2 min-h-0 max-h-[300px]">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <ListTodo className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No tasks yet</p>
              <p className="text-xs opacity-70">Add one to get started</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, task.id)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "group flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
                  "bg-secondary/50 hover:bg-secondary/80",
                  draggedId === task.id && "opacity-50 scale-95",
                  task.completed && "opacity-60"
                )}
              >
                {/* Drag Handle */}
                <div className="cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground">
                  <GripVertical className="h-4 w-4" />
                </div>

                {/* Checkbox */}
                <button
                  onClick={() => toggleTask(task.id)}
                  className={cn(
                    "flex-shrink-0 h-5 w-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center",
                    task.completed
                      ? "bg-primary border-primary"
                      : "border-muted-foreground/50 hover:border-primary"
                  )}
                >
                  {task.completed && <Check className="h-3 w-3 text-primary-foreground" />}
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
                      className="flex-1 px-2 py-1 rounded bg-input text-foreground text-sm border border-border focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                    <button
                      onClick={saveEdit}
                      className="text-primary hover:text-primary/80"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <span
                    onClick={() => startEditing(task)}
                    className={cn(
                      "flex-1 text-sm cursor-pointer transition-all",
                      task.completed
                        ? "line-through text-muted-foreground"
                        : "text-foreground"
                    )}
                  >
                    {task.text}
                  </span>
                )}

                {/* Delete Button */}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }
)

TaskPanel.displayName = "TaskPanel"
