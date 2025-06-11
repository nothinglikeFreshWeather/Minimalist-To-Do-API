"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Chip } from "@mui/material"
import { LogoutOutlined, LoginOutlined, PersonAddOutlined, TaskAltOutlined } from "@mui/icons-material"
import { useAuth } from "../contexts/AuthContext"

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Avatar
            sx={{
              mr: 2,
              background: "linear-gradient(45deg, #8B5CF6, #3B82F6)",
              width: 40,
              height: 40,
            }}
          >
            <TaskAltOutlined />
          </Avatar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              background: "linear-gradient(45deg, #8B5CF6, #3B82F6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 700,
              fontSize: "1.5rem",
            }}
          >
            Elite Todo
          </Typography>
          {isAuthenticated && (
            <Chip
              label="Pro"
              size="small"
              sx={{
                ml: 2,
                background: "linear-gradient(45deg, #10B981, #059669)",
                color: "white",
                fontWeight: 600,
              }}
            />
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          {isAuthenticated ? (
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutOutlined />}
              sx={{
                color: "text.primary",
                borderRadius: 2,
                px: 3,
                fontWeight: 600,
                "&:hover": {
                  background: "rgba(139, 92, 246, 0.1)",
                },
              }}
            >
              Logout
            </Button>
          ) : (
            <>
              <Button
                color="inherit"
                onClick={() => navigate("/login")}
                startIcon={<LoginOutlined />}
                sx={{
                  color: "text.primary",
                  borderRadius: 2,
                  px: 3,
                  fontWeight: 600,
                  "&:hover": {
                    background: "rgba(139, 92, 246, 0.1)",
                  },
                }}
              >
                Login
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate("/register")}
                startIcon={<PersonAddOutlined />}
                sx={{
                  color: "text.primary",
                  borderRadius: 2,
                  px: 3,
                  fontWeight: 600,
                  "&:hover": {
                    background: "rgba(139, 92, 246, 0.1)",
                  },
                }}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
