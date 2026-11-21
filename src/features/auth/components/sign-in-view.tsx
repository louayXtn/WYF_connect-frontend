// import { buttonVariants } from '@/components/ui/button';
// import { cn } from '@/lib/utils';
// import { SignIn as ClerkSignInForm } from '@clerk/nextjs';
// import { Metadata } from 'next';
// import Link from 'next/link';
// import { InteractiveGridPattern } from './interactive-grid';

// export const metadata: Metadata = {
//   title: 'Sign In | WYF Connect',
//   description: 'Access your WYF Connect account to manage pitches, investors, and secure deals.'
// };

// export default function SignInViewPage() {
//   return (
//     <div className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
//       <Link
//         href='/auth/sign-up'
//         className={cn(
//           buttonVariants({ variant: 'ghost' }),
//           'absolute top-4 right-4 hidden md:top-8 md:right-8'
//         )}
//       >
//         Create account
//       </Link>
//       <div className='relative hidden h-full flex-col p-10 lg:flex dark:border-r'>
//         <div className='absolute inset-0 bg-sidebar' />
//         <div className='text-sidebar-foreground relative z-20 flex items-center gap-3 text-lg font-medium'>
//           <div className='bg-sidebar-primary text-sidebar-primary-foreground flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold'>
//             W
//           </div>
//           <div>
//             <p className='font-semibold'>WYF Connect</p>
//             <p className='text-sidebar-foreground/70 text-sm'>Youth Innovation Marketplace</p>
//           </div>
//         </div>
//         <InteractiveGridPattern
//           className={cn(
//             'mask-[radial-gradient(400px_circle_at_center,white,transparent)]',
//             'inset-x-0 inset-y-[0%] h-full skew-y-12'
//           )}
//         />
//         <div className='relative z-20 mt-auto space-y-2'>
//           <blockquote className='space-y-2'>
//             <p className='text-lg'>
//               &ldquo;Build trust, protect IP, and connect promising youth ventures with serious investors.&rdquo;
//             </p>
//             <footer className='text-sidebar-foreground/70 text-sm'>WYF Connect</footer>
//           </blockquote>
//         </div>
//       </div>
//       <div className='flex h-full items-center justify-center p-4 lg:p-8'>
//         <div className='flex w-full max-w-md flex-col items-center justify-center space-y-6'>
//           <ClerkSignInForm />
//         </div>
//       </div>
//     </div>
//   );
// }








'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { InteractiveGridPattern } from './interactive-grid';
import LoginForm from './login-form';

export default function SignInViewPage() {
  return (
    <div className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <Link
        href='/auth/sign-up'
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute top-4 right-4  md:top-8 md:right-8'
        )}
      >
        Create account
      </Link>
      <div className='relative hidden h-full flex-col p-10 lg:flex dark:border-r'>
        <div className='absolute inset-0 bg-sidebar' />
        <div className='text-sidebar-foreground relative z-20 flex items-center gap-3 text-lg font-medium'>
          <div className='bg-sidebar-primary text-sidebar-primary-foreground flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold'>
            W
          </div>
          <div>
            <p className='font-semibold'>WYF Connect</p>
            <p className='text-sidebar-foreground/70 text-sm'>Youth Innovation Marketplace</p>
          </div>
        </div>
        <InteractiveGridPattern
          className={cn(
            'mask-[radial-gradient(400px_circle_at_center,white,transparent)]',
            'inset-x-0 inset-y-[0%] h-full skew-y-12'
          )}
        />
        <div className='relative z-20 mt-auto space-y-2'>
          <blockquote className='space-y-2'>
            <p className='text-lg'>
              &ldquo;Build trust, protect IP, and connect promising youth ventures with serious investors.&rdquo;
            </p>
            <footer className='text-sidebar-foreground/70 text-sm'>WYF Connect</footer>
          </blockquote>
        </div>
      </div>
      <div className='flex h-full items-center justify-center p-4 lg:p-8'>
        <div className='flex w-full max-w-md flex-col items-center justify-center space-y-6'>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}