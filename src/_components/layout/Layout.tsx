import { Sidebar } from "./Sidebar"
import { ReactNode } from "react"

interface IProps {
    children: ReactNode
}

export const Layout = ({ children }: IProps) => {
    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 m-2">{children}</main>
        </div>
    )
}
