// import { NextResponse, type NextRequest } from 'next/server';

// export function proxy(_request: NextRequest) {
//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     '/(api|trpc)(.*)'
//   ]
// };



import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/auth/sign-in', '/auth/sign-up', '/auth/forgot-password', '/auth/reset-password'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('wyf_token')?.value;

  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  // لو مش مسجل دخول وعم يحاول يدخل صفحة محمية → رجّعه لصفحة تسجيل الدخول
  if (!token && !isPublicRoute && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  // لو مسجل دخول وعم يحاول يدخل صفحة تسجيل الدخول → رجّعه للداشبورد
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard/overview', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)'
  ]
};