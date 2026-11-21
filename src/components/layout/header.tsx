import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';
import { Separator } from '../ui/separator';
import { Breadcrumbs } from '../breadcrumbs';
import SearchInput from '../search-input';
import { ThemeSelector } from '../themes/theme-selector';
import { ThemeModeToggle } from '../themes/theme-mode-toggle';
import { NotificationCenter } from '@/features/notifications/components/notification-center';
import Link from 'next/link';

export default function Header() {
  return (
    <header className='bg-background/60 sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-2 backdrop-blur-md md:h-14'>
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 h-4' />
        <Link
          href='/dashboard/overview'
          className='hidden items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1.5 shadow-sm transition-colors hover:bg-accent md:flex'
        >
          <span className='bg-primary/10 text-primary flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold'>W</span>
          <div className='text-left'>
            <p className='text-sm font-semibold'>WYF Connect</p>
            <p className='text-muted-foreground text-xs'>Youth Investment Platform</p>
          </div>
        </Link>
        <div className='hidden md:block'>
  <Breadcrumbs />
</div>
      </div>

      <div className='flex items-center gap-2 px-4'>
        <div className='hidden md:flex'>
          <SearchInput />
        </div>
        <ThemeModeToggle />
        <div className='hidden md:block'>
          <ThemeSelector />
        </div>
        <NotificationCenter />
      </div>
    </header>
  );
}
