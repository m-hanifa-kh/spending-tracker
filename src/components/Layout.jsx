import React, { useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, List, PieChart, Settings, Plus, Hexagon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Layout = () => {
    const { pathname } = useLocation();
    const { setTheme } = useAppContext();



    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: List, label: 'Transactions', path: '/transactions' },
        { icon: PieChart, label: 'Analytics', path: '/analytics' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <div className="flex flex-col h-screen bg-transparent text-foreground overflow-hidden font-sans selection:bg-primary/20">
            {/* Top decorative glow */}
            <div className="fixed top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none z-0" />

            <main className="flex-1 overflow-y-auto pb-24 z-10 scrollbar-hide">
                <div className="container mx-auto p-4 max-w-md">
                    <Outlet />
                </div>
            </main>

            {/* Floating Navigation Bar */}
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md z-50">
                <nav className="glass-panel rounded-2xl h-16 px-2 flex justify-between items-center relative">
                    {navItems.map((item, index) => {
                        // Insert the FAB in the middle (index 2)
                        if (index === 2) {
                            return (
                                <React.Fragment key="fab">
                                    <div className="relative -top-8 w-14 h-14">
                                        <Link to="/add" className="absolute inset-0 flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:scale-105 transition-all duration-300">
                                            <Plus size={28} />
                                        </Link>
                                    </div>
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex-1 flex flex-col items-center justify-center h-full space-y-1 transition-all duration-300 ${pathname === item.path ? 'text-primary scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        <item.icon size={20} strokeWidth={2} />
                                    </Link>
                                </React.Fragment>
                            )
                        }
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex-1 flex flex-col items-center justify-center h-full space-y-1 transition-all duration-300 ${pathname === item.path ? 'text-primary scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <item.icon size={20} strokeWidth={2} />
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};

export default Layout;
