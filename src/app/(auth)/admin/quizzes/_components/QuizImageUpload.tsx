import { Dispatch, SetStateAction, useEffect } from "react"
import Image from "next/image"

interface Props {
    previewImageSrc: string | null
    quizImage: string | File | null
    setValue: (name: "image", value: File) => void
    setPreviewImageSrc: Dispatch<SetStateAction<string | null>>
}

export function QuizImageUpload({ quizImage, setValue, previewImageSrc, setPreviewImageSrc }: Props) {
    useEffect(() => {
        if (quizImage instanceof File) {
            const objectUrl = URL.createObjectURL(quizImage)
            setPreviewImageSrc(objectUrl)

            return () => {
                URL.revokeObjectURL(objectUrl)
                setPreviewImageSrc(null)
            }
        } else if (typeof quizImage === "string") {
            setPreviewImageSrc(`/uploads/quizzes/${quizImage}`)
        } else {
            setPreviewImageSrc(null)
        }
    }, [quizImage])
    return (
        <div>
            <label
                htmlFor="quizImage"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg cursor-pointer"
            >
                {quizImage instanceof File ? quizImage.name : quizImage || "Choose image"}
            </label>
            <input
                id="quizImage"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) setValue("image", file)
                }}
            />
            {previewImageSrc && (
                <Image
                    src={previewImageSrc}
                    alt="Quiz image"
                    width={280}
                    height={200}
                    className="mt-4 rounded-xl border border-blue-400 shadow-xs"
                    draggable={false}
                    priority
                />
            )}
        </div>
    )
}
