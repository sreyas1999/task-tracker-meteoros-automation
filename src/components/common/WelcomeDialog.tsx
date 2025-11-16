import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { Add, TrackChanges, CheckCircle } from "@mui/icons-material";
import "../../styles/WelcomeDialog.css";

interface WelcomeDialogProps {
  open: boolean;
  onClose: () => void;
  onStartAddingTasks: () => void;
}

export const WelcomeDialog = React.memo<WelcomeDialogProps>(
  ({ open, onClose, onStartAddingTasks }) => {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle className="welcome-dialog-title">
          Welcome to Weekly Task Tracker! <TrackChanges />
        </DialogTitle>
        <DialogContent>
          <Box className="welcome-dialog-content">
            <Typography variant="body1">
              Great to see you here! Let's track your accomplishments for this
              week.
            </Typography>
            <Typography variant="body1">
              <strong>Please add multiple entries</strong> for all the tasks
              you've completed during the week:
            </Typography>
            <Box component="ul" className="welcome-dialog-list">
              <Typography
                component="li"
                variant="body2"
                className="welcome-dialog-list-item"
              >
                <CheckCircle fontSize="small" color="success" /> Projects you've
                worked on
              </Typography>
              <Typography
                component="li"
                variant="body2"
                className="welcome-dialog-list-item"
              >
                <CheckCircle fontSize="small" color="success" /> Meetings you've
                attended
              </Typography>
              <Typography
                component="li"
                variant="body2"
                className="welcome-dialog-list-item"
              >
                <CheckCircle fontSize="small" color="success" /> Tasks you've
                completed
              </Typography>
              <Typography
                component="li"
                variant="body2"
                className="welcome-dialog-list-item"
              >
                <CheckCircle fontSize="small" color="success" /> Goals you've
                achieved
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Each task can include a title and optional description to help you
              remember the details.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions className="welcome-dialog-actions">
          <Button onClick={onClose} variant="outlined">
            Maybe Later
          </Button>
          <Button
            onClick={onStartAddingTasks}
            variant="contained"
            startIcon={<Add />}
          >
            Start Adding Tasks
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

WelcomeDialog.displayName = "WelcomeDialog";
