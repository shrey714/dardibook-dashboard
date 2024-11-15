import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const token = req.headers.get('Authorization')?.split('Bearer ')[1];
  //  if (!token) {
     //   return NextResponse.json({ error: 
//'Unauthorized' }, { status: 401 });
  //  }
    try {
        const apiResponse = await fetch(`${req.nextUrl.basePath}/api/token-verify`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const apiResponseBody = await apiResponse.json();

        if (apiResponse.ok) {
            return NextResponse.next();
        } else {
            return NextResponse.json({ error: 'Invalid token', details: apiResponseBody.error }, { status: 401 });
        }
    } catch (error) {
        console.error('Error verifying token in middleware:', error);
        return NextResponse.json({ error: `Internal Server Error(${req.nextUrl.basePath}) : ${error}` }, { status: 500 });
    }
}

export const config = {
    matcher: '/api/:path*',
};
