"use client"

import { ChangeEvent, useEffect, useRef, useState } from "react"
import Image from "next/image"

interface ImagePickerProps {
    image: string
    isOpen: boolean
    defaultAvatar: string
    handleSubmit: () => void
    setOpen: (open: boolean) => void
    onImageSelect: (image: File) => void
}

export const ImagePicker = ({
    image,
    isOpen,
    defaultAvatar,
    handleSubmit,
    setOpen,
    onImageSelect,
}: ImagePickerProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [imagePreview, setImagePreview] = useState<string>(defaultAvatar)
    const imageUrl = image ? `/uploads/${image}` : defaultAvatar

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        if (file) {
            const reader = new FileReader()
            reader.onload = () => {
                setImagePreview(reader.result as string)
            }
            reader.onerror = () => {
                console.error("File loading failed")
            }
            reader.readAsDataURL(file)
            onImageSelect(file)
        }
    }

    const handleChooseImage = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const handleClose = () => setOpen(false)

    useEffect(() => {
        setImagePreview(imageUrl)
    }, [imageUrl])

    return (
        <div className={`modal-overlay ${isOpen ? "open" : ""}`}>
            <div className={`modal-content ${isOpen ? "open" : ""} shadow-xl border tracking-wide border-gray-700 p-4 flex flex-col items-center`}>
                <button
                    type="button"
                    onClick={handleChooseImage}
                    className="bg-indigo-600 text-gray-200 px-4 py-2 transition-all rounded-lg hover:bg-indigo-700 cursor-pointer"
                >
                    Choose Image
                </button>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    ref={fileInputRef}
                />
                <div className="w-full h-60 mt-4 flex justify-center items-center">
                    <Image
                        src={imagePreview}
                        alt="User Avatar"
                        className="object-cover w-full h-full rounded-2xl border-4 bg-gradient-to-r from-[#f93b15] via-[#f09819] to-[#f93b15]"
                        draggable={false}
                        width={250}
                        height={150}
                        priority
                    />
                </div>
                <div className="flex w-full justify-around mt-5">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="bg-red-500 text-gray-200 px-4 py-2 rounded-lg transition-all hover:bg-red-600 cursor-pointer"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-green-600 text-gray-200 px-4 py-2 rounded-lg transition-all hover:bg-green-700 cursor-pointer"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}
