import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    // atob is deprecated in Node, but works in Edge Runtime (Middleware)
    // For wider compatibility, using Buffer is safer, but Next.js middleware runs in Edge where atob is supported.
    const [user, pwd] = atob(authValue).split(':');

    // ★ここでIDとパスワードを指定しています
    if (user === 'dental' && pwd === 'preview') {
      return NextResponse.next();
    }
  }

  return new NextResponse('Auth required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}

// 認証を適用するパスを指定します
export const config = {
  matcher: ['/:path*'],
};
