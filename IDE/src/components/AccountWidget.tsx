import { useState, useEffect } from 'react';
import { LogIn, LogOut } from 'lucide-react';

export default function AccountWidget() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadUser();

        // Listen for auth codes
        if (window.electronAPI) {
            window.electronAPI.onAuthCodeReceived(async (code: string) => {
                setLoading(true);
                try {
                    const result = await window.electronAPI.exchangeAuthCode(code);
                    if (result.success && result.user) {
                        setUser(result.user);
                        // Save to settings
                        const settings = await window.electronAPI.getSettings();
                        await window.electronAPI.saveSettings({ ...settings, oxonUser: result.user } as any);
                    }
                } catch (err) {
                    console.error('Auth error:', err);
                } finally {
                    setLoading(false);
                }
            });
        }
    }, []);

    const loadUser = async () => {
        if (window.electronAPI) {
            const settings = await window.electronAPI.getSettings();
            setUser((settings as any).oxonUser);
        }
    };

    const handleLogin = async () => {
        if (!window.electronAPI) return;
        setLoading(true);
        try {
            await window.electronAPI.oauthLogin();
        } catch (err) {
            console.error('Login failed:', err);
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        if (window.electronAPI) {
            const settings = await window.electronAPI.getSettings();
            await window.electronAPI.saveSettings({ ...settings, oxonUser: null } as any);
            setUser(null);
        }
    };

    if (!user) {
        return (
            <div className="mb-3 flex flex-col gap-2">
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full px-3 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg flex items-center justify-center gap-2 text-white text-sm font-medium transition disabled:opacity-50 shadow-lg shadow-purple-500/20"
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Authenticating...</span>
                        </>
                    ) : (
                        <>
                            <LogIn size={16} />
                            <span>Sign in with OxonAI</span>
                        </>
                    )}
                </button>
                <p className="text-[10px] text-gray-500 text-center">
                    Sync your plan and credits across devices
                </p>
            </div>
        );
    }

    return (
        <div className="mb-3 p-3 bg-gray-900/50 backdrop-blur-xl rounded-xl border border-purple-500/30 shadow-xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5 -z-10 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-base font-bold shadow-lg">
                    {user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-semibold truncate leading-tight">{user.name || user.email.split('@')[0]}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider ${user.plan === 'PRO' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/20'
                            }`}>
                            {user.plan || 'FREE'}
                        </span>
                        <span className="text-gray-600">•</span>
                        <span className="text-[10px] text-purple-400 font-medium">
                            {user.credits || 0} credits
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={handleLogout}
                    className="flex-1 px-2 py-1.5 bg-gray-800/50 hover:bg-red-900/20 hover:text-red-400 hover:border-red-500/30 border border-gray-700 rounded-lg text-[10px] text-gray-400 font-medium flex items-center justify-center gap-1.5 transition-all"
                >
                    <LogOut size={12} />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
