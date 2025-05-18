import { Briefcase } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-3 group">
            <Briefcase className="h-8 w-8 text-primary group-hover:text-primary/90 transition-colors" />
            <h1 className="text-3xl font-semibold text-foreground group-hover:text-foreground/90 transition-colors">
              CareerCompass
            </h1>
          </Link>
          {/* Navigation items can be added here if needed */}
        </div>
      </div>
    </header>
  );
}
