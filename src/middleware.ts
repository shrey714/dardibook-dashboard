// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { tokenVerify } from './app/services/tokenVerify';

// export async function middleware(req: NextRequest) {
//     const token = req.headers.get('Authorization')?.split('Bearer ')[1];
//     if (!token) {
//         return NextResponse.json({
//             error:
//                 'Unauthorized'
//         }, { status: 401 });
//     }
//     try {
//         const apiResponse = await tokenVerify(token)
//         console.log("apiResponse==", apiResponse)

//         if (apiResponse.status === 200) {
//             return NextResponse.next();
//         } else {
//             return NextResponse.json({ error: 'Invalid token', details: apiResponse.error }, { status: 401 });
//         }
//     } catch (error) {
//         console.error('Error verifying token in middleware:', error);
//         return NextResponse.json({ error: `Internal Server Error : ${error}` }, { status: 500 });
//     }
// }

// export const config = {
//     matcher: '/api/((?!token-verify).*)',
// };