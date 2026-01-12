import { NextRequest, NextResponse } from 'next/server';

// Redirect old IDE callback URL to new location
export async function GET(req: NextRequest) {
    const url = new URL('/api/ide-callback', req.url);
    return NextResponse.redirect(url, 301);
}

export async function POST(req: NextRequest) {
    const url = new URL('/api/ide-callback', req.url);
    return NextResponse.redirect(url, 307);
}
