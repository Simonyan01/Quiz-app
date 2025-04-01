"use client"

import { BsArrowDown, BsArrowUp } from 'react-icons/bs'
import { RefObject, useEffect, useState } from 'react'

interface IRefProps {
    targetRef: RefObject<HTMLElement | null>
}

export const ScrollButton = ({ targetRef }: IRefProps) => {
    const [scrollDown, setScrollDown] = useState(true)
    const [isVisible, setIsVisible] = useState(false)

    const handleClick = () => {
        if (!targetRef.current) return

        if (scrollDown) {
            scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
        } else {
            scrollTo({ top: 0, behavior: "smooth" })
        }
    }

    useEffect(() => {
        const handleScroll = () => {
            if (!targetRef.current) return

            const isAtBottom = innerHeight + scrollY >= document.body.scrollHeight
            const isScrollable = document.documentElement.scrollHeight > innerHeight

            setScrollDown(!isAtBottom)
            setIsVisible(isScrollable)
        }

        const throttledScroll = () => requestAnimationFrame(handleScroll)
        addEventListener("scroll", throttledScroll)
        handleScroll()

        return () => removeEventListener("scroll", throttledScroll)
    }, [targetRef])

    return (
        isVisible ? (
            <button
                type="button"
                onClick={handleClick}
                className="fixed bottom-10 right-10 p-4 rounded-full shadow-xs bg-gray-800 transition-all cursor-pointer text-gray-200 transform duration-200 hover:scale-115"
            >
                <div className={`transition-transform transform duration-500 text-2xl ${scrollDown ? "rotate-180" : "rotate-x-180"}`}>
                    {scrollDown ? <BsArrowUp size={24} /> : <BsArrowDown size={24} />}
                </div>
            </button>
        ) : null
    )
}
