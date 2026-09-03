import Header from '@/components/navigation/Header'
import Footer from '@/components/navigation/Footer'
import { CommandPaletteProvider } from '@/components/command-palette/CommandPalette'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CommandPaletteProvider>
      <Header />
      <main className="flex-1 pt-[60px]">{children}</main>
      <Footer />
    </CommandPaletteProvider>
  )
}
