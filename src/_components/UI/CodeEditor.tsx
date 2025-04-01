"use client"

import "prismjs"
import "prismjs/themes/prism-tomorrow.css"
import "prismjs/components/prism-javascript"
import { useEffect, useState } from "react"
import type { UseFormRegister, UseFormWatch } from "react-hook-form"

interface CodeEditorProps {
    idx: number
    value: string
    watch: UseFormWatch<any>
    register: UseFormRegister<any>
    onChange: (val: string) => void
}

export const CodeEditor = ({ idx, value, watch, register }: CodeEditorProps) => {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        import("prismjs").then((Prism) => {
            Prism.highlightAll()
        })
    }, [value, mounted])

    if (!mounted) return null

    return (
        <div className="relative flex gap-3 h-full items-start">
            <textarea
                value={watch(`questions.${idx}.question`)}
                {...register(`questions.${idx}.question` as const, { required: "Question is required." })}
                className="w-3/4 p-2 h-48 rounded bg-gray-700 mt-2 border tracking-wider transition-all border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Start typing your question here..."
            />
            <pre className="w-full h-48 p-3 rounded-md">
                <code className="language-javascript">{value}</code>
            </pre>
        </div>
    )
}
