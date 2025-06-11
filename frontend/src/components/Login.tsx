"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate, Link as RouterLink } from "react-router-dom"
import { Container, Paper, TextField, Button, Typography, Link, Box, Avatar, Fade, Alert } from "@mui/material"
import { LockOutlined, LoginOutlined } from "@mui/icons-material"
import axios from "axios"
import { useAuth } from "../contexts/AuthContext"

const Login: React.FC = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        username,
        password,
      })
      login(response.data.token)
      navigate("/")
    } catch (err) {
      setError("Invalid username or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              p: 6,
              width: "100%",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: 3,
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
              <Avatar
                sx={{
                  m: 1,
                  bgcolor: "transparent",
                  background: "linear-gradient(45deg, #8B5CF6, #3B82F6)",
                  width: 56,
                  height: 56,
                }}
              >
                <LockOutlined sx={{ fontSize: 28 }} />
              </Avatar>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                align="center"
                sx={{
                  background: "linear-gradient(45deg, #8B5CF6, #3B82F6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                Sign in to your account to continue
              </Typography>
            </Box>

            {error && (
              <Fade in>
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              </Fade>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
                required
                autoFocus
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                startIcon={<LoginOutlined />}
                sx={{
                  mt: 2,
                  mb: 3,
                  py: 1.5,
                  fontSize: "1.1rem",
                }}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <Link
                component={RouterLink}
                to="/register"
                variant="body2"
                sx={{
                  color: "primary.main",
                  textDecoration: "none",
                  fontWeight: 500,
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Don't have an account? Create one here
              </Link>
            </Box>
          </Paper>
        </Fade>
      </Box>
    </Container>
  )
}

export default Login
