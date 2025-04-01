"use client"

import CircularProgress from "@mui/material/CircularProgress"
import { Box } from "@mui/material"

interface LoaderProps {
    isLoading: string | boolean | null
}

export const Loader = ({ isLoading }: LoaderProps) => {
    if (!isLoading) return null

    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                zIndex: 9999
            }}
        >
            <svg width={0} height={0}>
                <defs>
                    <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#f93b15" />
                        <stop offset="50%" stopColor="#f09819" />
                        <stop offset="100%" stopColor="#f93b15" />
                    </linearGradient>
                </defs>
            </svg>
            <CircularProgress
                size={60}
                thickness={4}
                sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }}
            />
        </Box>
    )
}
