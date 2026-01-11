import { useState } from 'react';
import { User, LogOut, Settings, CreditCard, Key, Cloud, Shield, Moon, Bell, Globe } from 'lucide-react';

interface AccountPanelProps {
    onClose: () => void;
    onLogout: () => void;
}

export default function AccountPanel({ onClose, onLogout }: AccountPanelProps) {
    const [user] = useState({
        name: 'Demo User',
        email: 'user@oxonai.com',
        plan: 'Pro',
        avatar: null,
    });

    const menuItems = [
        { icon: <User size={16} />, label: 'Profile', action: () => { } },
        { icon: <Settings size={16} />, label: 'Account Settings', action: () => { } },
        { icon: <Key size={16} />, label: 'API Keys', action: () => { } },
        { icon: <CreditCard size={16} />, label: 'Billing', action: () => { } },
        { type: 'separator' },
        { icon: <Cloud size={16} />, label: 'Settings Sync', action: () => { }, toggle: true, enabled: true },
        { icon: <Bell size={16} />, label: 'Notifications', action: () => { }, toggle: true, enabled: false },
        { type: 'separator' },
        { icon: <Shield size={16} />, label: 'Privacy', action: () => { } },
        { icon: <Globe size={16} />, label: 'Language', action: () => { }, value: 'English' },
        { type: 'separator' },
        { icon: <LogOut size={16} />, label: 'Sign Out', action: onLogout, danger: true },
    ];

    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} />
            <div className="fixed top-12 right-4 z-50 w-72 bg-[#252526] border border-[#454545] rounded-xl shadow-2xl overflow-hidden animate-slide-up">
                {/* Header */}
                <div className="p-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-b border-[#454545]">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-lg font-bold">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-white font-medium">{user.name}</p>
                            <p className="text-xs text-[#a1a1aa]">{user.email}</p>
                        </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-[10px] font-medium rounded-full">
                            {user.plan} Plan
                        </span>
                    </div>
                </div>

                {/* Menu */}
                <div className="py-2">
                    {menuItems.map((item, i) =>
                        item.type === 'separator' ? (
                            <div key={i} className="my-2 border-t border-[#454545]" />
                        ) : (
                            <button
                                key={i}
                                onClick={() => {
                                    item.action?.();
                                    if (!item.toggle) onClose();
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-[#2d2d30] transition-colors ${item.danger ? 'text-red-400' : 'text-[#d4d4d4]'
                                    }`}
                            >
                                {item.icon}
                                <span className="flex-1 text-left">{item.label}</span>
                                {item.toggle !== undefined && (
                                    <div className={`w-8 h-4 rounded-full transition-colors ${item.enabled ? 'bg-purple-500' : 'bg-[#454545]'}`}>
                                        <div className={`w-3 h-3 rounded-full bg-white m-0.5 transition-transform ${item.enabled ? 'translate-x-4' : ''}`} />
                                    </div>
                                )}
                                {item.value && (
                                    <span className="text-xs text-[#71717a]">{item.value}</span>
                                )}
                            </button>
                        )
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-[#454545] bg-[#1e1e1e]">
                    <p className="text-[10px] text-[#52525b]">OxonAI IDE v1.0.0</p>
                </div>
            </div>
        </>
    );
}
