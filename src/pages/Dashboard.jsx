import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Icon } from '@iconify/react';
import { formatCurrency } from '../lib/formatCurrency';

const Dashboard = () => {
    const { currency, wallets, transactions, monthlyBudget, categories, decimalFormat } = useAppContext();

    const totalBalance = wallets.reduce((acc, wallet) => acc + Number(wallet.balance), 0);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyTransactions = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const totalIncome = monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + Number(t.amount), 0);

    const totalExpense = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + Number(t.amount), 0);

    const remainingBudget = monthlyBudget - totalExpense;
    const budgetProgress = Math.min((totalExpense / monthlyBudget) * 100, 100);

    // Prepare Chart Data
    const expenseByCategory = categories.map(cat => {
        const amount = monthlyTransactions
            .filter(t => t.categoryId === cat.id && t.type === 'expense')
            .reduce((acc, t) => acc + Number(t.amount), 0);
        return { name: cat.name, value: amount, color: cat.color }; // We might need to map category colors to the new palette later
    }).filter(item => item.value > 0);

    return (
        <div className="space-y-8 pt-4">
            {/* Header Section */}
            <header className="mb-8">
                <div className="flex items-center space-x-2 mb-2">
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold opacity-80">System Operational</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-serif italic font-medium leading-tight text-foreground mb-2">
                    Architect your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">wealth</span> with precision.
                </h1>
            </header>

            {/* Main Balance Card - "Launch Engine" Style */}
            <div className="relative group">
                {/* Glow effect only in dark mode or subtle in light */}
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-3xl -z-10 group-hover:bg-primary/30 transition-all duration-500 hidden dark:block"></div>

                <Card className="bg-white/80 dark:bg-black/40 border-border/50 dark:border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden relative shadow-xl dark:shadow-none">
                    <div className="absolute top-0 right-0 p-4 opacity-10 dark:opacity-20 text-foreground">
                        <Zap size={100} strokeWidth={0.5} />
                    </div>

                    <CardContent className="p-6 relative z-10">
                        <p className="text-muted-foreground text-sm font-sans tracking-wide mb-1">TOTAL NET WORTH</p>
                        <div className="flex items-baseline space-x-1">
                            <h2 className="text-5xl font-sans font-bold text-foreground tracking-tighter text-shadow-sm dark:text-glow">{formatCurrency(totalBalance, currency, decimalFormat)}</h2>
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <div className="bg-muted/50 dark:bg-white/5 rounded-2xl p-3 border border-border dark:border-white/5 backdrop-blur-sm">
                                <div className="flex items-center space-x-1 mb-1 text-emerald-600 dark:text-emerald-400">
                                    <div className="bg-emerald-400/20 p-1 rounded-full"><ArrowUpRight size={12} /></div>
                                    <span className="text-xs font-bold tracking-wider">INCOME</span>
                                </div>
                                <span className="text-lg font-bold text-foreground block">{formatCurrency(totalIncome, currency, decimalFormat)}</span>
                            </div>
                            <div className="bg-muted/50 dark:bg-white/5 rounded-2xl p-3 border border-border dark:border-white/5 backdrop-blur-sm">
                                <div className="flex items-center space-x-1 mb-1 text-rose-600 dark:text-rose-400">
                                    <div className="bg-rose-400/20 p-1 rounded-full"><ArrowDownRight size={12} /></div>
                                    <span className="text-xs font-bold tracking-wider">EXPENSE</span>
                                </div>
                                <span className="text-lg font-bold text-foreground block">{formatCurrency(totalExpense, currency, decimalFormat)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Budget Progress */}
            <div className="py-2">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-medium text-muted-foreground tracking-wider">MONTHLY PROTOCOL</span>
                    <span className="text-xs font-bold text-primary">{Math.round(budgetProgress)}% UTILIZED</span>
                </div>
                <div className="h-2 bg-muted dark:bg-white/5 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary shadow-sm dark:shadow-[0_0_10px_currentColor] transition-all duration-1000 ease-out"
                        style={{ width: `${budgetProgress}%` }}
                    />
                </div>
                <div className="mt-2 text-right">
                    <span className="text-xs text-muted-foreground">{formatCurrency(remainingBudget, currency, decimalFormat)} REMAINING</span>
                </div>
            </div>

            {/* Recent Activity */}
            <div>
                <h3 className="text-lg font-serif italic text-foreground mb-4">Recent Transmissions</h3>
                <div className="space-y-3">
                    {transactions.slice(0, 5).map(tx => {
                        const cat = categories.find(c => c.id === tx.categoryId);
                        return (
                            <div key={tx.id} className="group flex items-center p-3 rounded-2xl hover:bg-muted/50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-border dark:hover:border-white/5">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center mr-4 text-white font-bold text-xs shadow-lg group-hover:scale-110 transition-transform"
                                    style={{ backgroundColor: cat?.color || '#333', boxShadow: `0 0 10px ${cat?.color}40` }}
                                >
                                    {cat?.icon ? <Icon icon={cat.icon} className="h-5 w-5" /> : cat?.name[0]}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-sm text-foreground">{tx.note || cat?.name}</p>
                                    <p className="text-xs text-muted-foreground font-mono mt-0.5">{new Date(tx.date).toLocaleDateString()}</p>
                                </div>
                                <div className={`font-mono font-medium ${tx.type === 'expense' ? 'text-foreground/80' : 'text-primary'}`}>
                                    {tx.type === 'expense' ? '-' : '+'}{formatCurrency(tx.amount, currency, decimalFormat)}
                                </div>
                            </div>
                        );
                    })}
                    {transactions.length === 0 && (
                        <div className="border border-dashed border-border dark:border-white/10 rounded-2xl p-8 text-center text-muted-foreground text-sm">
                            NO DATA GENERATED
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
