'use client';

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, LayoutGrid, Github } from "lucide-react"; // Import icons

import { Button } from "@/components/ui/button";

export function Header() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-100 dark:border-neutral-700 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo Placeholder */}
        <Link href="/" className="flex items-center space-x-3 transition-colors hover:opacity-90">
          <LayoutGrid className="h-7 w-7 text-primary" />
          <span className="font-bold text-lg tracking-tight">MyLanding</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-base font-medium">
          <Link 
            href="#features" 
            className="relative text-foreground/70 hover:text-foreground transition-colors after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
          >
            Features
          </Link>
          <Link 
            href="#testimonials" 
            className="relative text-foreground/70 hover:text-foreground transition-colors after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
          >
            Testimonials
          </Link>
          <Link 
            href="#pricing" 
            className="relative text-foreground/70 hover:text-foreground transition-colors after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
          >
            Pricing
          </Link>
          <Link 
            href="#faq" 
            className="relative text-foreground/70 hover:text-foreground transition-colors after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
          >
            FAQ
          </Link>
        </nav>

        {/* Right Aligned Items (Theme Toggle, GitHub) */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Theme Toggle Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="rounded-full h-10 w-10 hover:bg-muted"
          >
            <Sun className="h-[1.3rem] w-[1.3rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
            <Moon className="absolute h-[1.3rem] w-[1.3rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-sky-400" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* GitHub Link Button */}
          <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="gap-2 h-10 px-4 rounded-full">
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline-block">GitHub</span>
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex justify-end">
          <Button variant="ghost" size="icon" className="rounded-md hover:bg-muted">
             <LayoutGrid className="h-6 w-6" />
             <span className="sr-only">Toggle Menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
} 