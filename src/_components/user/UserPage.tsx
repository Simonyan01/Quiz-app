import Image from "next/image"

interface UserProfileProps {
    name: string
    surname: string
    role: string
    image: string | undefined
}

export const UserProfile = ({ name, surname, role, image }: UserProfileProps) => (
    <>
        <div className="flex justify-start items-center mb-4">
            {image && (
                <Image
                    src={`/uploads/${image}`}
                    alt={`${name} ${surname}`}
                    width={200}
                    height={150}
                    className="rounded-full p-1 size-35 bg-gradient-to-tr from-[#f93b15] via-[#f09819] to-[#f93b15] hover:scale-105 transition-transform duration-200"
                    priority
                />
            )}
        </div>
        <div className="space-y-4">
            <div className="flex flex-col">
                <span className="text-sm uppercase tracking-widest text-gray-400">Name</span>
                <span className="text-lg font-semibold">{name} {surname}</span>
            </div>
            <div className="flex flex-col">
                <span className="text-sm uppercase tracking-widest text-gray-400">Role</span>
                <span className="text-lg font-semibold">{role}</span>
            </div>
        </div>
    </>
)
