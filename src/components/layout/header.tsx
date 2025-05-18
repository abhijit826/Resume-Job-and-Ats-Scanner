
import { Briefcase, FileText, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggleButton } from './theme-toggle-button';

export default function Header() {
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-3 group">
            <Briefcase className="h-8 w-8 text-primary group-hover:text-primary/90 transition-colors" />
            <h1 className="text-3xl font-semibold text-foreground group-hover:text-foreground/90 transition-colors">
              CareerCompass
            </h1>
          </Link>
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <Button variant="ghost" asChild className="px-2 sm:px-3">
              <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                <Home className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Job Matching</span>
              </Link>
            </Button>
            <Button variant="ghost" asChild className="px-2 sm:px-3">
              <Link href="/ats-scanner" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                <FileText className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">ATS Scan</span>
              </Link>
            </Button>
            <ThemeToggleButton />
          </nav>
        </div>
      </div>
    </header>
  );
}
