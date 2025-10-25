import { NextResponse, NextRequest } from 'next/server'
// import * as jose from 'jose'


export async function middleware(request: NextRequest) {

    const path = request.nextUrl.pathname;
    const isPublicPath = path === '/login' || path === '/register';
    const token = request.cookies.get('token')?.value

    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // let userRole: string;

    // if (token) {
    //     const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    //     const { payload } = await jose.jwtVerify(token, secret)
    //     userRole = payload.role as string
    //     try {
    //     } catch (error) {
    //         console.error('Invalid token:', error)
    //         return NextResponse.redirect(new URL('/login', request.url))
    //     }
    // }


}

export const config = {
    matcher: [
        '/',
        '/dashboard',
        '/dashboard/:path*',
        '/login',
        '/register',
    ]
}