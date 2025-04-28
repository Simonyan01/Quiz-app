"use client"

import { BsArrowDown, BsArrowUp } from 'react-icons/bs'
import { useEffect, useState } from 'react'

export const ScrollButton = () => {
    const [scrollDown, setScrollDown] = useState(true)
    const [isVisible, setIsVisible] = useState(false)

    const handleClick = () => {
        window.scrollTo({
            top: scrollDown ? document.body.scrollHeight : 0,
            behavior: "smooth",
        })
    }

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY
            const windowHeight = window.innerHeight
            const fullHeight = document.documentElement.scrollHeight

            const isAtBottom = scrollTop + windowHeight >= fullHeight - 10
            const isScrollable = fullHeight > windowHeight

            setScrollDown(!isAtBottom)
            setIsVisible(isScrollable)
        }

        const throttledScroll = () => requestAnimationFrame(handleScroll)

        addEventListener("scroll", throttledScroll)
        handleScroll()

        return () => removeEventListener("scroll", throttledScroll)
    }, [])
    return (
        isVisible && (
            <button
                type="button"
                onClick={handleClick}
                className="fixed bottom-10 right-10 p-4 rounded-full shadow-xs bg-gray-800 transition-all cursor-pointer text-gray-200 transform duration-200 hover:scale-115"
            >
                <div className={`transition-transform transform duration-500 text-2xl ${scrollDown ? "rotate-180" : "rotate-x-180"}`}>
                    {scrollDown ? <BsArrowUp size={24} /> : <BsArrowDown size={24} />}
                </div>
            </button>
        )
    )
}
