import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Add,
  ArrowBack,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { addTask, updateTask, deleteTask } from '../redux/slices/tasksSlice';
import { TaskCard } from '../components/common/TaskCard';
import '../styles/TaskListPage.css';

export const TaskListPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userSession = useAppSelector((state) => state.session.userSession);
  const tasks = useAppSelector((state) => state.tasks.tasks);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<{ id: string; title: string; description: string } | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [error, setError] = useState('');

  // Memoize handlers
  const handleOpenAddDialog = useCallback(() => {
    setEditingTask(null);
    setFormData({ title: '', description: '' });
    setError('');
    setOpenDialog(true);
  }, []);

  const handleOpenEditDialog = useCallback((task: { id: string; title: string; description: string }) => {
    setEditingTask(task);
    setFormData({ title: task.title, description: task.description });
    setError('');
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditingTask(null);
    setFormData({ title: '', description: '' });
    setError('');
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }

    if (editingTask) {
      dispatch(updateTask({
        id: editingTask.id,
        updates: {
          title: formData.title.trim(),
          description: formData.description.trim(),
        },
      }));
    } else {
      dispatch(addTask({
        title: formData.title.trim(),
        description: formData.description.trim(),
      }));
    }

    handleCloseDialog();
  }, [formData, editingTask, dispatch, handleCloseDialog]);

  const handleDeleteTask = useCallback((taskId: string) => {
    dispatch(deleteTask(taskId));
  }, [dispatch]);

  const handleNavigateToDashboard = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  // Memoize username extraction
  const username = useMemo(
    () => userSession?.email.split('@')[0] ?? '',
    [userSession?.email]
  );

  // Memoize task count text
  const taskCountText = useMemo(
    () => `${tasks.length} task${tasks.length !== 1 ? 's' : ''} total`,
    [tasks.length]
  );

  // Redirect if not logged in
  if (!userSession) {
    navigate('/');
    return null;
  }

  return (
    <Box className="task-page">
      {/* App Bar */}
      <AppBar position="static" className="task-appbar">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleNavigateToDashboard}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" className="task-appbar-title">
            Weekly Tasks
          </Typography>
          <Typography variant="body2">
            {username}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth={false} disableGutters className="task-container">
        {/* Header */}
        <Box className="task-header">
          <Box className="task-header-info">
            <Typography variant="h4" component="h1" gutterBottom className="task-header-title">
              My Weekly Tasks
            </Typography>
            <Typography variant="body1" color="text.secondary" className="task-header-count">
              {taskCountText}
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={handleOpenAddDialog}
            className="task-add-button"
          >
            Add Task
          </Button>
        </Box>

        {/* Task List */}
        {tasks.length === 0 ? (
          <Card className="task-empty-card">
            <Typography variant="h6" color="text.secondary" gutterBottom className="task-empty-title">
              No tasks yet
            </Typography>
            <Typography variant="body2" color="text.secondary" className="task-empty-text">
              Click "Add Task" to create your first weekly task
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenAddDialog}
            >
              Add Your First Task
            </Button>
          </Card>
        ) : (
          <Box className="task-list">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleOpenEditDialog}
                onDelete={handleDeleteTask}
              />
            ))}
          </Box>
        )}
      </Container>

      {/* Add/Edit Task Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle className="task-dialog-title">
            {editingTask ? 'Edit Task' : 'Add New Task'}
          </DialogTitle>
          <DialogContent className="task-dialog-content">
            <Box className="task-dialog-form">
              <TextField
                fullWidth
                label="Task Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                margin="normal"
                required
                autoFocus
                error={!!error}
                helperText={error}
              />
              <TextField
                fullWidth
                label="Description (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                margin="normal"
                multiline
                rows={4}
              />
            </Box>
          </DialogContent>
          <DialogActions className="task-dialog-actions">
            <Button onClick={handleCloseDialog} className="task-dialog-button">
              Cancel
            </Button>
            <Button type="submit" variant="contained" className="task-dialog-button">
              {editingTask ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
