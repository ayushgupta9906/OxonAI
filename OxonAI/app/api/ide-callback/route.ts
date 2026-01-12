export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Store pending auth sessions (persist across hot-reloads in dev)
const pendingSessions: Map<string, { userId: string; timestamp: number }> =
    (global as any).pendingSessions || new Map<string, { userId: string; timestamp: number }>();

if (process.env.NODE_ENV !== 'production') {
    (global as any).pendingSessions = pendingSessions;
}

// Cleanup old sessions every 5 minutes
if (!(global as any).cleanupInterval) {
    (global as any).cleanupInterval = setInterval(() => {
        const now = Date.now();
        for (const [code, data] of Array.from(pendingSessions.entries())) {
            if (now - data.timestamp > 5 * 60 * 1000) { // 5 minutes
                pendingSessions.delete(code);
            }
        }
    }, 5 * 60 * 1000);
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            // Redirect to login with return URL
            const loginUrl = new URL('/login', req.url);
            loginUrl.searchParams.set('callbackUrl', '/api/ide-callback');
            return NextResponse.redirect(loginUrl);
        }

        const userId = (session.user as any).id;

        // Generate a one-time code
        const code = `ide_${Math.random().toString(36).substring(2)}${Date.now()}`;
        pendingSessions.set(code, { userId, timestamp: Date.now() });

        // Redirect to IDE with the code
        const ideUrl = `oxonai://auth?code=${code}`;

        return new NextResponse(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>OxonAI - Authenticating...</title>
                <style>
                    body {
                        font-family: system-ui, -apple-system, sans-serif;
                        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                        color: white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 100vh;
                        margin: 0;
                    }
                    .container {
                        text-align: center;
                        padding: 2rem;
                        background: rgba(255, 255, 255, 0.05);
                        border-radius: 1rem;
                        backdrop-filter: blur(10px);
                        max-width: 500px;
                    }
                    .spinner {
                        border: 4px solid rgba(255, 255, 255, 0.1);
                        border-top: 4px solid #9333ea;
                        border-radius: 50%;
                        width: 40px;
                        height: 40px;
                        animation: spin 1s linear infinite;
                        margin: 0 auto 1rem;
                    }
                    .code-box {
                        background: rgba(0, 0, 0, 0.3);
                        padding: 1rem;
                        border-radius: 0.5rem;
                        margin: 1rem 0;
                        font-family: monospace;
                        word-break: break-all;
                        cursor: pointer;
                        border: 1px solid rgba(147, 51, 234, 0.3);
                    }
                    .code-box:hover {
                        background: rgba(0, 0, 0, 0.4);
                        border-color: rgba(147, 51, 234, 0.6);
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    .hidden { display: none; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="spinner" id="spinner"></div>
                    <h2>Authentication Successful!</h2>
                    <p id="status">Attempting to open IDE...</p>
                    <div id="manual" class="hidden">
                        <p style="font-size: 0.9rem; margin-top: 1.5rem; opacity: 0.8;">
                            If the IDE didn't open automatically, copy this code:
                        </p>
                        <div class="code-box" onclick="copyCode()" id="codeBox">
                            ${code}
                        </div>
                        <p style="font-size: 0.8rem; opacity: 0.6;">
                            Click to copy • Paste in IDE login
                        </p>
                    </div>
                    <p style="font-size: 0.9rem; opacity: 0.7; margin-top: 1rem;">
                        <a href="${ideUrl}" style="color: #a78bfa;">Try opening IDE manually</a>
                    </p>
                </div>
                <script>
                    function copyCode() {
                        const code = '${code}';
                        navigator.clipboard.writeText(code).then(() => {
                            document.getElementById('codeBox').innerHTML = '✓ Copied!';
                            setTimeout(() => {
                                document.getElementById('codeBox').innerHTML = code;
                            }, 2000);
                        });
                    }
                    
                    // Try to open IDE
                    setTimeout(() => {
                        window.location.href = '${ideUrl}';
                    }, 1000);
                    
                    // Show manual code after a delay
                    setTimeout(() => {
                        document.getElementById('spinner').classList.add('hidden');
                        document.getElementById('status').textContent = 'Return to the IDE to complete sign-in';
                        document.getElementById('manual').classList.remove('hidden');
                    }, 3000);
                </script>
            </body>
            </html>
        `, {
            headers: { 'Content-Type': 'text/html' },
        });
    } catch (error) {
        console.error('IDE callback error:', error);
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        );
    }
}

// Exchange code for user data
export async function POST(req: NextRequest) {
    try {
        const { code } = await req.json();
        console.log('IDE callback POST received:', code);

        if (!code || !code.startsWith('ide_')) {
            console.warn('Invalid IDE auth code received');
            return NextResponse.json(
                { valid: false, error: 'Invalid code' },
                { status: 400 }
            );
        }

        const sessionData = pendingSessions.get(code);
        console.log('Session data found for code:', sessionData ? 'Yes' : 'No');

        if (!sessionData) {
            return NextResponse.json(
                { valid: false, error: 'Code expired or invalid. Please try signing in again.' },
                { status: 401 }
            );
        }

        // Delete the code after use
        pendingSessions.delete(code);

        // Fetch user data
        const user = await prisma.user.findUnique({
            where: { id: sessionData.userId },
            select: {
                id: true,
                email: true,
                name: true,
                plan: true,
                credits: true,
                role: true,
            },
        });

        if (!user) {
            console.error('User not found in database for ID:', sessionData.userId);
            return NextResponse.json(
                { valid: false, error: 'User not found' },
                { status: 404 }
            );
        }

        console.log('Successfully exchanged code for user:', user.email);

        return NextResponse.json({
            valid: true,
            user,
        });
    } catch (error) {
        console.error('Code exchange error:', error);
        return NextResponse.json(
            { valid: false, error: 'Server error' },
            { status: 500 }
        );
    }
}
