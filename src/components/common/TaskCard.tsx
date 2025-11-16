import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Edit,
  Delete,
  AccessTime,
  Update,
} from '@mui/icons-material';
import { formatDateTime, getRelativeTime } from '../../utils/dateUtils';
import type { TaskEntry } from '../../types/task';

interface TaskCardProps {
  task: TaskEntry;
  onEdit: (task: { id: string; title: string; description: string }) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard = React.memo<TaskCardProps>(({ task, onEdit, onDelete }) => {
  const handleEdit = () => {
    onEdit({ id: task.id, title: task.title, description: task.description });
  };

  const handleDelete = () => {
    onDelete(task.id);
  };

  return (
    <Card className="task-card">
      <CardContent className="task-card-content">
        <Box className="task-card-header">
          <Typography variant="h6" component="h2" className="task-card-title">
            {task.title}
          </Typography>
          <Box className="task-card-actions">
            <IconButton
              color="primary"
              onClick={handleEdit}
              size="small"
              className="task-icon-button"
            >
              <Edit />
            </IconButton>
            <IconButton
              color="error"
              onClick={handleDelete}
              size="small"
              className="task-icon-button"
            >
              <Delete />
            </IconButton>
          </Box>
        </Box>

        {task.description && (
          <Typography variant="body1" color="text.secondary" className="task-description">
            {task.description}
          </Typography>
        )}

        <Box className="task-chips">
          <Chip
            icon={<AccessTime />}
            label={`Created: ${getRelativeTime(task.createdAt)}`}
            size="small"
            variant="outlined"
            className="task-chip"
          />
          {task.updatedAt && (
            <Chip
              icon={<Update />}
              label={`Updated: ${getRelativeTime(task.updatedAt)}`}
              size="small"
              variant="outlined"
              color="primary"
              className="task-chip"
            />
          )}
        </Box>

        <Box className="task-timestamps">
          <Typography variant="caption" color="text.secondary" className="task-timestamp">
            Created: {formatDateTime(task.createdAt)}
          </Typography>
          {task.updatedAt && (
            <Typography variant="caption" color="text.secondary" className="task-timestamp">
              Last updated: {formatDateTime(task.updatedAt)}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
});

TaskCard.displayName = 'TaskCard';
