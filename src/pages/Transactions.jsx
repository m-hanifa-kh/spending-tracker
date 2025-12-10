import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Filter, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { formatCurrency } from '../lib/formatCurrency';

const Transactions = () => {
    const { transactions, categories, currency, deleteTransaction, wallets, decimalFormat } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filterType, setFilterType] = useState('all'); // all, income, expense
    const [filterWallet, setFilterWallet] = useState('all');

    const [txToDelete, setTxToDelete] = useState(null);

    // Group transactions by date
    const filteredTransactions = transactions
        .filter(t => {
            const term = searchTerm.toLowerCase();
            const noteMatch = (t.note || '').toLowerCase().includes(term);
            const categoryName = categories.find(c => c.id === t.categoryId)?.name || '';
            const categoryMatch = categoryName.toLowerCase().includes(term);
            const searchMatch = noteMatch || categoryMatch;

            const typeMatch = filterType === 'all' ? true : t.type === filterType;
            const walletMatch = filterWallet === 'all' ? true : t.walletId === filterWallet;

            return searchMatch && typeMatch && walletMatch;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    const grouped = filteredTransactions.reduce((acc, tx) => {
        const date = tx.date;
        if (!acc[date]) acc[date] = [];
        acc[date].push(tx);
        return acc;
    }, {});

    const handleDelete = () => {
        if (txToDelete) {
            deleteTransaction(txToDelete);
            setTxToDelete(null);
        }
    };

    return (
        <div className="pt-6 pb-32 space-y-6">
            {/* Delete Confirmation Dialog */}
            <Dialog open={!!txToDelete} onOpenChange={(open) => !open && setTxToDelete(null)}>
                <DialogContent className="sm:max-w-md bg-card dark:bg-[#111] border-border dark:border-white/10 text-foreground">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this transaction? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-end gap-2">
                        <Button variant="outline" onClick={() => setTxToDelete(null)} className="border-border dark:border-white/10 hover:bg-muted dark:hover:bg-white/5">
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-serif italic text-foreground text-shadow-sm dark:text-glow">Transactions</h1>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`rounded-full border-border bg-transparent hover:bg-muted dark:hover:bg-white/10 hover:text-primary transition-all ${showFilters ? 'bg-primary/10 text-primary border-primary' : ''}`}
                >
                    {showFilters ? <X size={20} /> : <Filter size={20} />}
                </Button>
            </div>

            <div className="space-y-4">
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-emerald-500/50 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500 hidden dark:block"></div>
                    <div className="relative flex items-center">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                        <Input
                            placeholder="Search notes or categories..."
                            className="pl-12 bg-white dark:bg-black border-border dark:border-white/10 rounded-full h-12 text-foreground dark:text-white placeholder:text-muted-foreground focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all shadow-sm dark:shadow-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="grid grid-cols-2 gap-3 p-4 bg-muted/30 dark:bg-white/5 rounded-2xl border border-border dark:border-white/5 animate-in slide-in-from-top-2 fade-in">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground ml-1">Type</label>
                            <Select value={filterType} onValueChange={setFilterType}>
                                <SelectTrigger className="bg-background dark:bg-black/40 border-border dark:border-white/10 rounded-xl">
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="income">Income</SelectItem>
                                    <SelectItem value="expense">Expense</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground ml-1">Wallet</label>
                            <Select value={filterWallet} onValueChange={setFilterWallet}>
                                <SelectTrigger className="bg-background dark:bg-black/40 border-border dark:border-white/10 rounded-xl">
                                    <SelectValue placeholder="All Wallets" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Wallets</SelectItem>
                                    {wallets.map(w => (
                                        <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-8">
                {Object.keys(grouped).length > 0 ? Object.keys(grouped).map(date => (
                    <div key={date} className="relative">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent"></div>
                            <h3 className="text-xs font-bold text-primary tracking-widest uppercase px-2">
                                {new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                            </h3>
                            <div className="h-px flex-1 bg-gradient-to-l from-primary/50 to-transparent"></div>
                        </div>

                        <div className="space-y-3">
                            {grouped[date].map(tx => {
                                const cat = categories.find(c => c.id === tx.categoryId);
                                return (
                                    <div key={tx.id} className="group relative">
                                        {/* Hover Glow */}
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-emerald-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500 hidden dark:block"></div>

                                        <Card className="relative p-0 border-border dark:border-white/5 bg-white/50 dark:bg-card/40 backdrop-blur-md rounded-2xl overflow-hidden hover:bg-muted/50 dark:hover:bg-white/5 transition-all shadow-sm hover:shadow-md dark:shadow-none">
                                            <div className="flex items-center p-4">
                                                <div className="flex items-center overflow-hidden flex-1">
                                                    <div
                                                        className="w-12 h-12 rounded-full flex items-center justify-center mr-4 text-white font-bold flex-shrink-0 shadow-md dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/10"
                                                        style={{ backgroundColor: cat?.color || '#333' }}
                                                    >
                                                        {cat?.icon ? <Icon icon={cat.icon} className="h-6 w-6" /> : cat?.name[0]}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-base text-foreground truncate group-hover:text-primary transition-colors">{tx.note || cat?.name}</p>
                                                        <p className="text-xs text-muted-foreground truncate font-mono mt-0.5">
                                                            {cat?.name} • <span className="text-foreground/60 dark:text-white/40">{wallets.find(w => w.id === tx.walletId)?.name}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end flex-shrink-0 ml-4">
                                                    <span className={`text-lg font-mono font-bold ${tx.type === 'expense' ? 'text-foreground dark:text-white' : 'text-primary dark:drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`}>
                                                        {tx.type === 'expense' ? '-' : '+'}{formatCurrency(tx.amount, currency, decimalFormat)}
                                                    </span>
                                                    <button
                                                        className="p-2 text-destructive/50 hover:text-destructive hover:bg-destructive/10 rounded-full transition-all"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setTxToDelete(tx.id);
                                                        }}
                                                        aria-label="Delete transaction"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-20">
                        <div className="inline-block p-4 rounded-full bg-muted dark:bg-white/5 mb-4 animate-pulse">
                            <Search size={32} className="text-muted-foreground dark:text-white/20" />
                        </div>
                        <p className="text-muted-foreground font-mono text-sm">NO DATA FOUND</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Transactions;
