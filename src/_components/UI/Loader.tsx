"use client"

import CircularProgress from "@mui/material/CircularProgress"

interface LoaderProps {
    isLoading: boolean | null
}

export const Loader = ({ isLoading }: LoaderProps) => {
    if (!isLoading) return null

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 z-[9999]">
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
                sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }}
            />
        </div>
    )
}

Loader.displayName = "Loader"
