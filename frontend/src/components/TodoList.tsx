"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Button,
  Typography,
  Box,
  Checkbox,
  Chip,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
} from "@mui/material"
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  TrendingUp,
  Assignment,
  CheckCircle,
  Schedule,
} from "@mui/icons-material"
import axios from "axios"

interface Todo {
  id: number
  title: string
  description: string
  completed: boolean
  priority?: "low" | "medium" | "high"
  category?: string
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    priority: "medium" as const,
    category: "Personal",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "pending">("all")
  const [editDialog, setEditDialog] = useState<{ open: boolean; todo: Todo | null }>({
    open: false,
    todo: null,
  })

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/todos")
      setTodos(response.data)
    } catch (error) {
      console.error("Error fetching todos:", error)
      // Mock data for demo
      setTodos([
        {
          id: 1,
          title: "Complete project proposal",
          description: "Finish the quarterly project proposal",
          completed: false,
          priority: "high",
          category: "Work",
        },
        {
          id: 2,
          title: "Buy groceries",
          description: "Milk, bread, eggs, and vegetables",
          completed: true,
          priority: "medium",
          category: "Personal",
        },
      ])
    }
  }

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.title.trim()) return

    try {
      const response = await axios.post("http://localhost:8080/api/todos", newTodo)
      setTodos([response.data, ...todos])
      setNewTodo({ title: "", description: "", priority: "medium", category: "Personal" })
    } catch (error) {
      console.error("Error adding todo:", error)
      // Mock add for demo
      const mockTodo: Todo = {
        id: Date.now(),
        ...newTodo,
        completed: false,
      }
      setTodos([mockTodo, ...todos])
      setNewTodo({ title: "", description: "", priority: "medium", category: "Personal" })
    }
  }

  const handleDeleteTodo = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/todos/${id}`)
      setTodos(todos.filter((todo) => todo.id !== id))
    } catch (error) {
      console.error("Error deleting todo:", error)
      setTodos(todos.filter((todo) => todo.id !== id))
    }
  }

  const handleToggleComplete = async (id: number, completed: boolean) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/todos/${id}`, {
        completed: !completed,
      })
      setTodos(todos.map((todo) => (todo.id === id ? response.data : todo)))
    } catch (error) {
      console.error("Error updating todo:", error)
      setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !completed } : todo)))
    }
  }

  const handleEditTodo = (todo: Todo) => {
    setEditDialog({ open: true, todo })
  }

  const handleUpdateTodo = async () => {
    if (!editDialog.todo) return

    try {
      const response = await axios.put(`http://localhost:8080/api/todos/${editDialog.todo.id}`, editDialog.todo)
      setTodos(todos.map((todo) => (todo.id === editDialog.todo!.id ? response.data : todo)))
      setEditDialog({ open: false, todo: null })
    } catch (error) {
      console.error("Error updating todo:", error)
      setTodos(todos.map((todo) => (todo.id === editDialog.todo!.id ? editDialog.todo! : todo)))
      setEditDialog({ open: false, todo: null })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return { bg: "#FEE2E2", color: "#DC2626" }
      case "medium":
        return { bg: "#FEF3C7", color: "#D97706" }
      case "low":
        return { bg: "#D1FAE5", color: "#059669" }
      default:
        return { bg: "#F3F4F6", color: "#6B7280" }
    }
  }

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch =
      todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "completed" && todo.completed) ||
      (filterStatus === "pending" && !todo.completed)
    return matchesSearch && matchesStatus
  })

  const completedCount = todos.filter((todo) => todo.completed).length
  const totalCount = todos.length
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <Container maxWidth="lg" sx={{ py: 4, position: "relative", zIndex: 1 }}>
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Fade in timeout={600}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ textAlign: "center", py: 3 }}>
                <Assignment sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {totalCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Tasks
                </Typography>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Fade in timeout={800}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ textAlign: "center", py: 3 }}>
                <CheckCircle sx={{ fontSize: 40, color: "success.main", mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {completedCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed
                </Typography>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Fade in timeout={1000}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ textAlign: "center", py: 3 }}>
                <Schedule sx={{ fontSize: 40, color: "warning.main", mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="warning.main">
                  {totalCount - completedCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending
                </Typography>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Fade in timeout={1200}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ textAlign: "center", py: 3 }}>
                <TrendingUp sx={{ fontSize: 40, color: "secondary.main", mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="secondary.main">
                  {Math.round(progressPercentage)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Progress
                </Typography>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>

      {/* Progress Bar */}
      <Fade in timeout={1400}>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "between", mb: 2 }}>
            <Typography variant="h6" fontWeight="600">
              Overall Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {completedCount} of {totalCount} tasks completed
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            sx={{
              height: 8,
              borderRadius: 4,
              background: "rgba(139, 92, 246, 0.1)",
              "& .MuiLinearProgress-bar": {
                background: "linear-gradient(45deg, #8B5CF6, #3B82F6)",
                borderRadius: 4,
              },
            }}
          />
        </Paper>
      </Fade>

      {/* Add Todo Form */}
      <Fade in timeout={1600}>
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight="600" gutterBottom sx={{ mb: 3 }}>
            Add New Task
          </Typography>
          <Box component="form" onSubmit={handleAddTodo}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Task Title"
                  value={newTodo.title}
                  onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Category"
                  value={newTodo.category}
                  onChange={(e) => setNewTodo({ ...newTodo, category: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={newTodo.description}
                  onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={newTodo.priority}
                    label="Priority"
                    onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value as any })}
                  >
                    <MenuItem value="low">Low Priority</MenuItem>
                    <MenuItem value="medium">Medium Priority</MenuItem>
                    <MenuItem value="high">High Priority</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button type="submit" variant="contained" startIcon={<AddIcon />} fullWidth sx={{ py: 1.5 }}>
                  Add Task
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Fade>

      {/* Filters */}
      <Fade in timeout={1800}>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Filter by Status"
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                >
                  <MenuItem value="all">All Tasks</MenuItem>
                  <MenuItem value="pending">Pending Tasks</MenuItem>
                  <MenuItem value="completed">Completed Tasks</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      </Fade>

      {/* Todo List */}
      <Fade in timeout={2000}>
        <Paper sx={{ overflow: "hidden" }}>
          <Box sx={{ p: 3, borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
            <Typography variant="h5" fontWeight="600">
              Your Tasks ({filteredTodos.length})
            </Typography>
          </Box>

          {filteredTodos.length === 0 ? (
            <Box sx={{ p: 6, textAlign: "center" }}>
              <Assignment sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No tasks found
              </Typography>
              <Typography variant="body2" color="text.disabled">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your filters"
                  : "Add your first task to get started"}
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {filteredTodos.map((todo, index) => (
                <Fade in timeout={2200 + index * 100} key={todo.id}>
                  <ListItem
                    sx={{
                      borderBottom: "1px solid rgba(0,0,0,0.05)",
                      py: 2,
                      px: 3,
                      "&:hover": {
                        background: "rgba(139, 92, 246, 0.05)",
                      },
                      opacity: todo.completed ? 0.7 : 1,
                    }}
                  >
                    <Checkbox
                      checked={todo.completed}
                      onChange={() => handleToggleComplete(todo.id, todo.completed)}
                      sx={{
                        color: "primary.main",
                        "&.Mui-checked": {
                          color: "primary.main",
                        },
                      }}
                    />
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              textDecoration: todo.completed ? "line-through" : "none",
                              fontWeight: 600,
                            }}
                          >
                            {todo.title}
                          </Typography>
                          {todo.priority && (
                            <Chip
                              label={todo.priority}
                              size="small"
                              sx={{
                                backgroundColor: getPriorityColor(todo.priority).bg,
                                color: getPriorityColor(todo.priority).color,
                                fontWeight: 600,
                                textTransform: "capitalize",
                              }}
                            />
                          )}
                          {todo.category && (
                            <Chip label={todo.category} size="small" variant="outlined" sx={{ fontWeight: 500 }} />
                          )}
                        </Box>
                      }
                      secondary={
                        todo.description && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              textDecoration: todo.completed ? "line-through" : "none",
                            }}
                          >
                            {todo.description}
                          </Typography>
                        )
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          edge="end"
                          onClick={() => handleEditTodo(todo)}
                          sx={{
                            color: "text.secondary",
                            "&:hover": {
                              color: "primary.main",
                              background: "rgba(139, 92, 246, 0.1)",
                            },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => handleDeleteTodo(todo.id)}
                          sx={{
                            color: "text.secondary",
                            "&:hover": {
                              color: "error.main",
                              background: "rgba(239, 68, 68, 0.1)",
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Fade>
              ))}
            </List>
          )}
        </Paper>
      </Fade>

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, todo: null })} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Task Title"
              value={editDialog.todo?.title || ""}
              onChange={(e) =>
                setEditDialog({
                  ...editDialog,
                  todo: editDialog.todo ? { ...editDialog.todo, title: e.target.value } : null,
                })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              value={editDialog.todo?.description || ""}
              onChange={(e) =>
                setEditDialog({
                  ...editDialog,
                  todo: editDialog.todo ? { ...editDialog.todo, description: e.target.value } : null,
                })
              }
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={editDialog.todo?.priority || "medium"}
                    label="Priority"
                    onChange={(e) =>
                      setEditDialog({
                        ...editDialog,
                        todo: editDialog.todo ? { ...editDialog.todo, priority: e.target.value as any } : null,
                      })
                    }
                  >
                    <MenuItem value="low">Low Priority</MenuItem>
                    <MenuItem value="medium">Medium Priority</MenuItem>
                    <MenuItem value="high">High Priority</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Category"
                  value={editDialog.todo?.category || ""}
                  onChange={(e) =>
                    setEditDialog({
                      ...editDialog,
                      todo: editDialog.todo ? { ...editDialog.todo, category: e.target.value } : null,
                    })
                  }
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditDialog({ open: false, todo: null })}>Cancel</Button>
          <Button onClick={handleUpdateTodo} variant="contained">
            Update Task
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default TodoList
