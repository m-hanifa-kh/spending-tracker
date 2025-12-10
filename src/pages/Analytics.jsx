import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ChevronDown } from 'lucide-react';
import { Icon } from '@iconify/react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '../lib/formatCurrency';

const Analytics = () => {
    const { transactions, categories, currency, wallets, decimalFormat } = useAppContext();
    const [range, setRange] = useState('month'); // month | all | custom
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedWallets, setSelectedWallets] = useState(wallets.map(w => w.id)); // Default: all wallets selected
    const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);

    // Close wallet dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isWalletDropdownOpen && !e.target.closest('.relative')) {
                setIsWalletDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isWalletDropdownOpen]);

    // Filter transactions based on range and selected wallets
    const filteredTransactions = transactions.filter(t => {
        // Filter by wallet
        if (selectedWallets.length > 0 && !selectedWallets.includes(t.walletId)) {
            return false;
        }

        // Filter by date range
        if (range === 'month') {
            const d = new Date(t.date);
            const now = new Date();
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        } else if (range === 'custom') {
            if (!startDate || !endDate) return true;
            const d = new Date(t.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            // Include end date fully
            end.setHours(23, 59, 59, 999);
            return d >= start && d <= end;
        }
        return true;
    });

    // 1. Expense Distribution by Category
    const expenseData = categories.map(cat => {
        const amount = filteredTransactions
            .filter(t => t.categoryId === cat.id && t.type === 'expense')
            .reduce((acc, t) => acc + Number(t.amount), 0);
        return { name: cat.name, value: amount, color: cat.color };
    }).filter(item => item.value > 0);

    // 2. Spending Trend (Filtered)
    const spendingByDate = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            const date = t.date;
            acc[date] = (acc[date] || 0) + Number(t.amount);
            return acc;
        }, {});

    const barChartData = Object.keys(spendingByDate).map(date => ({
        date: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        amount: spendingByDate[date],
        fullDate: date // for sorting
    })).sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));


    return (
        <div className="pt-6 pb-20 space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <h1 className="text-2xl font-bold">Analytics</h1>
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    {/* Wallet Selector */}
                    <div className="relative">
                        <Button
                            variant="outline"
                            onClick={() => setIsWalletDropdownOpen(!isWalletDropdownOpen)}
                            className="justify-between w-full sm:w-[200px]"
                        >
                            <span>Wallets ({selectedWallets.length})</span>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                        {isWalletDropdownOpen && (
                            <div className="absolute top-full mt-1 w-full sm:w-[250px] bg-background border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                                <div className="p-2 space-y-1">
                                    {wallets.map(wallet => (
                                        <label
                                            key={wallet.id}
                                            className="flex items-center space-x-2 p-2 hover:bg-accent rounded cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedWallets.includes(wallet.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedWallets([...selectedWallets, wallet.id]);
                                                    } else {
                                                        setSelectedWallets(selectedWallets.filter(id => id !== wallet.id));
                                                    }
                                                }}
                                                className="rounded"
                                            />
                                            <Icon icon={wallet.icon || 'mdi:wallet-outline'} className="h-4 w-4" />
                                            <span className="text-sm">{wallet.name}</span>
                                        </label>
                                    ))}
                                </div>
                                <div className="p-2 border-t">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedWallets(wallets.map(w => w.id))}
                                        className="w-full justify-start text-xs"
                                    >
                                        Select All
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedWallets([])}
                                        className="w-full justify-start text-xs"
                                    >
                                        Clear All
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    <Select value={range} onValueChange={setRange}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="all">All Time</SelectItem>
                            <SelectItem value="custom">Custom Date</SelectItem>
                        </SelectContent>
                    </Select>

                    {range === 'custom' && (
                        <div className="flex gap-2">
                            <input
                                type="date"
                                className="border rounded-md px-2 py-1 bg-background text-sm"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                            />
                            <input
                                type="date"
                                className="border rounded-md px-2 py-1 bg-background text-sm"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Selected Wallets Display */}
            {selectedWallets.length > 0 && selectedWallets.length < wallets.length && (
                <div className="flex flex-wrap gap-1">
                    {selectedWallets.map(walletId => {
                        const wallet = wallets.find(w => w.id === walletId);
                        return wallet ? (
                            <Badge key={wallet.id} variant="secondary" className="flex items-center gap-1">
                                <Icon icon={wallet.icon || 'mdi:wallet-outline'} className="h-3 w-3" />
                                {wallet.name}
                                <button
                                    onClick={() => setSelectedWallets(selectedWallets.filter(id => id !== walletId))}
                                    className="ml-1 hover:bg-accent rounded-full p-0.5"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ) : null;
                    })}
                </div>
            )}

            {/* Pie Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Expense Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    {expenseData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={expenseData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={100}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {expenseData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatCurrency(value, currency, decimalFormat)} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>
                    )}
                </CardContent>
            </Card>

            {/* Bar Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Spending Trend</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    {barChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barChartData}>
                                <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip formatter={(value) => formatCurrency(value, currency, decimalFormat)} />
                                <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Analytics;
