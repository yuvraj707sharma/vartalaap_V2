'use client';

import Link from 'next/link';
import { Button } from './ui/Button';

export function Navbar() {
  return (
    <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Vartalaap AI
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/practice" className="text-slate-300 hover:text-cyan-400 transition-colors">
              Practice
            </Link>
            <Link href="/interview" className="text-slate-300 hover:text-cyan-400 transition-colors">
              Interview
            </Link>
            <Link href="/dashboard" className="text-slate-300 hover:text-cyan-400 transition-colors">
              Dashboard
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
