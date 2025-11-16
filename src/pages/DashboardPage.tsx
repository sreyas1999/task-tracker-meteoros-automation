import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Divider,
  Chip,
} from "@mui/material";
import {
  Person,
  Computer,
  LocationOn,
  AccessTime,
  Task,
} from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { clearUserSession } from "../redux/slices/sessionSlice";
import { clearTasks } from "../redux/slices/tasksSlice";
import { formatDateTime } from "../utils/dateUtils";
import { WelcomeDialog } from "../components/common/WelcomeDialog";
import "../styles/DashboardPage.css";

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userSession = useAppSelector((state) => state.session.userSession);
  const [openWelcomeDialog, setOpenWelcomeDialog] = useState(false);

  // Memoize handlers to prevent unnecessary re-renders
  const handleLogout = useCallback(() => {
    dispatch(clearUserSession());
    dispatch(clearTasks());
    sessionStorage.removeItem("hasSeenWelcome");
    navigate("/");
  }, [dispatch, navigate]);

  const handleCloseWelcomeDialog = useCallback(() => {
    setOpenWelcomeDialog(false);
  }, []);

  const handleGoToTasks = useCallback(() => {
    setOpenWelcomeDialog(false);
    navigate("/tasks");
  }, [navigate]);

  // Extract username from email (part before @) - memoized
  const username = useMemo(
    () => userSession?.email.split('@')[0] ?? '', 
    [userSession?.email]
  );

  // Show welcome dialog only once per login session
  React.useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome && userSession) {
      setOpenWelcomeDialog(true);
      sessionStorage.setItem("hasSeenWelcome", "true");
    }
  }, [userSession]);

  if (!userSession) {
    navigate("/");
    return null;
  }

  return (
    <Container maxWidth={false} disableGutters className="dashboard-container">
      <Box className="dashboard-header">
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          className="dashboard-title"
        >
          Welcome back!
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {username}
        </Typography>
      </Box>

      <Box className="dashboard-content">
        {/* Row 1: Login and Device Info */}
        <Box className="dashboard-row">
          {/* Login Info Card */}
          <Card className="dashboard-card">
            <CardContent>
              <Box className="dashboard-card-header">
                <AccessTime className="dashboard-card-icon" />
                <Typography variant="h6" className="dashboard-card-title">
                  Login Information
                </Typography>
              </Box>
              <Divider className="dashboard-divider" />
              <Box className="dashboard-info-item">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  className="dashboard-info-label"
                >
                  Email
                </Typography>
                <Box className="dashboard-info-value">
                  <Person fontSize="small" className="dashboard-info-icon" />
                  <Typography variant="body1">{userSession.email}</Typography>
                </Box>
              </Box>
              <Box className="dashboard-info-item">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  className="dashboard-info-label"
                >
                  Login Time
                </Typography>
                <Typography variant="body1" className="dashboard-info-value">
                  {formatDateTime(userSession.loginTime)}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Device Info Card */}
          <Card className="dashboard-card">
            <CardContent>
              <Box className="dashboard-card-header">
                <Computer className="dashboard-card-icon" />
                <Typography variant="h6" className="dashboard-card-title">
                  Device Information
                </Typography>
              </Box>
              <Divider className="dashboard-divider" />
              <Box className="dashboard-info-item">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  className="dashboard-info-label"
                >
                  Browser
                </Typography>
                <Typography variant="body1" className="dashboard-info-value">
                  {userSession.deviceInfo.browser}
                </Typography>
              </Box>
              <Box className="dashboard-info-item">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  className="dashboard-info-label"
                >
                  Operating System
                </Typography>
                <Typography variant="body1" className="dashboard-info-value">
                  {userSession.deviceInfo.os}
                </Typography>
              </Box>
              <Box className="dashboard-info-item">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  className="dashboard-info-label"
                >
                  Device Type
                </Typography>
                <Box>
                  <Chip
                    label={userSession.deviceInfo.deviceType}
                    size="small"
                    color="primary"
                    variant="outlined"
                    className="dashboard-chip"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Location Card */}
        <Card className="dashboard-card">
          <CardContent>
            <Box className="dashboard-card-header">
              <LocationOn className="dashboard-card-icon" />
              <Typography variant="h6" className="dashboard-card-title">
                Location Information
              </Typography>
            </Box>
            <Divider className="dashboard-divider" />
            {userSession.location ? (
              <Box className="dashboard-location-grid">
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="dashboard-info-label"
                  >
                    Latitude
                  </Typography>
                  <Typography variant="body1" className="dashboard-info-value">
                    {userSession.location.lat.toFixed(6)}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="dashboard-info-label"
                  >
                    Longitude
                  </Typography>
                  <Typography variant="body1" className="dashboard-info-value">
                    {userSession.location.lon.toFixed(6)}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="dashboard-info-label"
                  >
                    Accuracy
                  </Typography>
                  <Typography variant="body1" className="dashboard-info-value">
                    ±{userSession.location.accuracy.toFixed(0)} meters
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary">
                Location permission denied or unavailable
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <Box className="dashboard-actions">
          <Button
            variant="contained"
            size="large"
            startIcon={<Task />}
            onClick={() => navigate("/tasks")}
            className="dashboard-action-button"
          >
            Go to Weekly Tasks
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={handleLogout}
            className="dashboard-action-button"
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Welcome Dialog */}
      <WelcomeDialog
        open={openWelcomeDialog}
        onClose={handleCloseWelcomeDialog}
        onStartAddingTasks={handleGoToTasks}
      />
    </Container>
  );
};
