import '@/styles/globals.css'

export const metadata = {
  title: '知识导航',
  description: '常用网址导航',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
