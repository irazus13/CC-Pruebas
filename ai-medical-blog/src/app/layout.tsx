import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Medical News - IA en Medicina y Odontología',
  description:
    'Últimas noticias e investigaciones sobre inteligencia artificial aplicada a la medicina y odontología. Actualizado automáticamente desde PubMed.',
  keywords: [
    'inteligencia artificial',
    'medicina',
    'odontología',
    'radiología',
    'machine learning',
    'deep learning',
    'salud',
    'investigación',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
