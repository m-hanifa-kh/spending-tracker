import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Icon } from '@iconify/react';

// Simple direct textarea since shadcn might not have added it specifically yet or its just a styled primitive
const TextareaInput = (props) => (
    <textarea
        {...props}
        className="flex min-h-[100px] w-full rounded-xl border border-input dark:border-white/10 bg-white dark:bg-black/50 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 text-foreground dark:text-white transition-all shadow-sm dark:shadow-inner"
    />
);

const AddTransaction = () => {
    const { categories, wallets, addTransaction, currency } = useAppContext();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        amount: '',
        type: 'expense',
        categoryId: '',
        walletId: wallets[0]?.id || '',
        date: new Date().toISOString().split('T')[0],
        note: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.amount || !formData.categoryId || !formData.walletId) return;

        addTransaction(formData);
        navigate('/');
    };

    return (
        <div className="pt-6 pb-24 relative min-h-screen">
            {/* Background glow for the form - Hidden in Light Mode, Visible in Dark */}
            <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/20 blur-[100px] -z-10 rounded-full pointer-events-none hidden dark:block" />

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif italic text-foreground text-shadow-sm dark:text-glow">New Entry</h1>
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full hover:bg-muted dark:hover:bg-white/10 hover:text-foreground">
                    <X size={24} />
                </Button>
            </div>

            <Card className="bg-card/40 dark:bg-card/40 border-border dark:border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
                <CardContent className="pt-8 px-6 pb-8">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Type Selection */}
                        <div className="grid grid-cols-2 gap-4 p-1 bg-muted/50 dark:bg-black/40 rounded-2xl border border-border dark:border-white/5">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'expense' })}
                                className={`flex items-center justify-center py-3 rounded-xl transition-all duration-300 ${formData.type === 'expense'
                                    ? 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 dark:border-rose-500/50 shadow-sm dark:shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-white/5'
                                    }`}
                            >
                                <ArrowDownRight size={18} className="mr-2" />
                                <span className="font-bold tracking-wider text-sm">EXPENSE</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'income' })}
                                className={`flex items-center justify-center py-3 rounded-xl transition-all duration-300 ${formData.type === 'income'
                                    ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/50 shadow-sm dark:shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-white/5'
                                    }`}
                            >
                                <ArrowUpRight size={18} className="mr-2" />
                                <span className="font-bold tracking-wider text-sm">INCOME</span>
                            </button>
                        </div>

                        {/* Amount */}
                        <div className="space-y-2 group">
                            <Label htmlFor="amount" className="text-xs uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">Amount ({currency})</Label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-serif text-muted-foreground dark:text-white/50">$</span>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="0.00"
                                    className="pl-10 text-3xl font-bold h-16 bg-white dark:bg-black/50 border-input dark:border-white/10 rounded-2xl focus-visible:ring-primary/50 focus-visible:border-primary/50 text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-white/10 shadow-sm dark:shadow-inner"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div className="space-y-2 group">
                            <Label className="text-xs uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">Class</Label>
                            <Select
                                value={formData.categoryId}
                                onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
                            >
                                <SelectTrigger className="h-14 bg-white dark:bg-black/50 border-input dark:border-white/10 rounded-2xl text-foreground dark:text-white focus:ring-primary/50 focus:border-primary/50 shadow-sm">
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent className="bg-popover dark:bg-[#111] border-input dark:border-white/10 text-popover-foreground dark:text-white">
                                    {categories.map(cat => (
                                        <SelectItem key={cat.id} value={cat.id} className="focus:bg-muted dark:focus:bg-white/10 focus:text-primary cursor-pointer">
                                            <div className="flex items-center">
                                                <div className="w-6 h-6 rounded-full mr-3 shadow-md flex items-center justify-center text-white text-[10px]" style={{ backgroundColor: cat.color }}>
                                                    {cat.icon ? <Icon icon={cat.icon} /> : cat.name[0]}
                                                </div>
                                                {cat.name}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Wallet */}
                        <div className="space-y-2 group">
                            <Label className="text-xs uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">Source</Label>
                            <Select
                                value={formData.walletId}
                                onValueChange={(val) => setFormData({ ...formData, walletId: val })}
                            >
                                <SelectTrigger className="h-14 bg-white dark:bg-black/50 border-input dark:border-white/10 rounded-2xl text-foreground dark:text-white focus:ring-primary/50 focus:border-primary/50 shadow-sm">
                                    <SelectValue placeholder="Select Wallet" />
                                </SelectTrigger>
                                <SelectContent className="bg-popover dark:bg-[#111] border-input dark:border-white/10 text-popover-foreground dark:text-white">
                                    {wallets.map(w => (
                                        <SelectItem key={w.id} value={w.id} className="focus:bg-muted dark:focus:bg-white/10 focus:text-primary cursor-pointer">
                                            <div className="flex items-center">
                                                <div className="w-6 h-6 rounded-md mr-3 bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
                                                    <Icon icon={w.icon || 'mdi:wallet-outline'} className="h-4 w-4" />
                                                </div>
                                                {w.name}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Date */}
                        <div className="space-y-2 group">
                            <Label htmlFor="date" className="text-xs uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">Date</Label>
                            <Input
                                id="date"
                                type="date"
                                className="h-14 bg-white dark:bg-black/50 border-input dark:border-white/10 rounded-2xl text-foreground dark:text-white focus-visible:ring-primary/50 focus-visible:border-primary/50 shadow-sm"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>

                        {/* Note */}
                        <div className="space-y-2 group">
                            <Label htmlFor="note" className="text-xs uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">Memo</Label>
                            <TextareaInput
                                id="note"
                                placeholder="Details..."
                                value={formData.note}
                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={!formData.amount || !formData.categoryId || !formData.walletId}
                            className="w-full h-14 text-lg font-bold tracking-widest rounded-2xl bg-primary text-primary-foreground dark:text-black hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg dark:shadow-[0_0_20px_rgba(16,185,129,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            EXECUTE
                        </Button>

                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddTransaction;
