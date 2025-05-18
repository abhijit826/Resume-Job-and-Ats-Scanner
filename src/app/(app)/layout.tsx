import Header from '@/components/layout/header';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="py-6 text-center text-muted-foreground text-sm border-t border-border mt-auto">
      Made By-Abhijit Ranjan   © {new Date().getFullYear()} CareerCompass. All rights reserved.
      </footer>
    </div>
  );
}
