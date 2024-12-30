'use client';

import { Link } from '@/components/ui/link';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/layout/UserNav';
import { Link2, BarChart2 } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <Link2 className="h-6 w-6" />
            <span className="font-bold">LinkPro</span>
          </Link>
          <nav className="flex items-center space-x-4 lg:space-x-6">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/analytics">
              <span className="flex items-center">
                <BarChart2 className="mr-2 h-4 w-4" />
                Analytics
              </span>
            </Link>
          </nav>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
}