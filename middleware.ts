import { NextResponse } from 'next/server';
import { authMiddleware } from './middlewares/api/authMiddleware';
import { logMiddleware } from './middlewares/api/logMiddleware';

// matchers to precisely target or exclude specific routes
export const config = {
  matcher: '/api/:path*',
};

export function middleware(request: Request) {
  if (request.url.includes('/api/blogs')) {
    const logResult = logMiddleware(request);
    console.log(logResult.response);
  }

  const authResult = authMiddleware(request);

  if (!authResult?.isValid) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
    });
  }
  return NextResponse.next();
}
