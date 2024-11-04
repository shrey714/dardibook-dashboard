import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {

    const token = req.headers.get('Authorization')?.split('Bearer ')[1];

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const verifyIdToken = true; //logic to handle the api 

    if (verifyIdToken) {
        return NextResponse.next();
    } else {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
}

// Apply middleware only to API routes
export const config = {
    matcher: '/api/:path*',
};
