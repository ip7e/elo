export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { circle: string }
}) {
  return <div className="container max-w-lg py-10 mx-auto">{children}</div>
}
