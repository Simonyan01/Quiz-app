"use client"

import CircularProgress from "@mui/material/CircularProgress"
import { Box } from "@mui/material"
import { memo } from "react"

interface LoaderProps {
    isLoading: boolean | null
}

export const Loader = memo(({ isLoading }: LoaderProps) => {
    if (!isLoading) return null

    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
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
                size={55}
                thickness={4}
                sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }}
            />
        </Box>
    )
})

Loader.displayName = "Loader"
