import {Sidebar} from "./Sidebar";

interface IProps {
    children: React.ReactNode
}

export function Layout({ children }: IProps) {
    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-2">{children}</main>
        </div>
    );
}
