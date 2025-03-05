export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <div className="bg-gray-900 p-15 text-white">
        {children}
      </div>
    </section>
  )
}
