import { Sidebar } from "./Sidebar"

interface IProps {
    children: React.ReactNode
}

export const Layout = ({ children }: IProps) => {
    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 m-2">{children}</main>
        </div>
    )
}
