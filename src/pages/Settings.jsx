import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Download, Upload, Moon, Sun, Trash2, Edit2, Grip, Check, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Icon } from '@iconify/react';
import { formatCurrency } from '../lib/formatCurrency';
// import jsPDF from "jspdf";

const Settings = () => {
    const {
        currency, setCurrency,
        theme, setTheme,
        monthlyBudget, setMonthlyBudget,
        decimalFormat, setDecimalFormat,
        categories, setCategories,
        transactions,
        wallets, setWallets,
        updateCategory,
        reorderCategories,
        updateWallet
    } = useAppContext();

    const [newCategory, setNewCategory] = useState({ name: '', color: '#000000', limit: 0, icon: 'mdi:shape-outline' });
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editFormData, setEditFormData] = useState({ name: '', color: '#000000', limit: 0, icon: 'mdi:shape-outline' });
    const [draggedCategory, setDraggedCategory] = useState(null);
    const [editIconPickerOpen, setEditIconPickerOpen] = useState(false);

    // Wallet states
    const [newWalletIcon, setNewWalletIcon] = useState('mdi:wallet-outline');
    const [isWalletIconPickerOpen, setIsWalletIconPickerOpen] = useState(false);
    const [editingWallet, setEditingWallet] = useState(null);
    const [editWalletIcon, setEditWalletIcon] = useState('mdi:wallet-outline');
    const [editWalletName, setEditWalletName] = useState('');
    const [isEditWalletIconPickerOpen, setIsEditWalletIconPickerOpen] = useState(false);

    // Wallet icons
    const walletIcons = [
        "mdi:cash", "mdi:credit-card-outline", "mdi:wallet-outline", "mdi:bank",
        "mdi:cash-multiple", "mdi:credit-card", "mdi:wallet", "mdi:bank-transfer",
        "mdi:paypal", "mdi:apple", "mdi:google", "mdi:microsoft",
        "mdi:bitcoin", "mdi:ethereum", "mdi:tether", "mdi:currency-usd",
        "mdi:currency-eur", "mdi:currency-gbp", "mdi:currency-jpy", "mdi:sack"
    ];

    // Curated list of icons suitable for budget categories (Material Line style as requested)
    const availableIcons = [
        "mdi:food-fork-drink", "mdi:cart-outline", "mdi:car-hatchback", "mdi:home-outline",
        "mdi:lightning-bolt-outline", "mdi:tshirt-crew-outline", "mdi:medical-bag", "mdi:school-outline",
        "mdi:gamepad-variant-outline", "mdi:airplane", "mdi:gift-outline", "mdi:paw",
        "mdi:phone-outline", "mdi:laptop", "mdi:run", "mdi:briefcase-outline",
        "mdi:baby-carriage", "mdi:flower-tulip-outline", "mdi:music-note-outline", "mdi:book-open-page-variant-outline",
        "mdi:hammer-wrench", "mdi:credit-card-outline", "mdi:cash-multiple", "mdi:piggy-bank-outline",
        "mdi:chart-line", "mdi:movie-open-outline", "mdi:glass-cocktail", "mdi:smoking",
        "mdi:bus", "mdi:train", "mdi:gas-station-outline", "mdi:hospital-box-outline"
    ];

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const exportCSV = () => {
        const headers = ['Date', 'Type', 'Category', 'Amount', 'Wallet', 'Note'];
        const rows = transactions.map(t => [
            t.date,
            t.type,
            categories.find(c => c.id === t.categoryId)?.name || 'Unknown',
            t.amount,
            wallets.find(w => w.id === t.walletId)?.name || 'Unknown',
            t.note
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "transactions.csv");
        document.body.appendChild(link);
        link.click();
    };

    const exportPDF = () => {
        alert("PDF export is currently disabled.");
        // const doc = new jsPDF();
        // doc.text("Transaction Report", 10, 10);
        // ... code remains
    };

    const handleAddCategory = () => {
        if (!newCategory.name) return;
        setCategories([...categories, { ...newCategory, id: Date.now().toString() }]);
        setNewCategory({ name: '', color: '#000000', limit: 0, icon: 'mdi:shape-outline' });
        setIsIconPickerOpen(false);
    };

    const handleDeleteCategory = (id) => {
        setCategories(categories.filter(c => c.id !== id));
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category.id);
        setEditFormData({
            name: category.name,
            color: category.color,
            limit: category.limit,
            icon: category.icon || 'mdi:shape-outline'
        });
    };

    const handleSaveEdit = () => {
        if (!editFormData.name) return;
        updateCategory(editingCategory, editFormData);
        setEditingCategory(null);
        setEditIconPickerOpen(false);
    };

    const handleCancelEdit = () => {
        setEditingCategory(null);
        setEditIconPickerOpen(false);
    };

    const handleDragStart = (e, index) => {
        setDraggedCategory(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        if (draggedCategory !== null && draggedCategory !== dropIndex) {
            reorderCategories(draggedCategory, dropIndex);
        }
        setDraggedCategory(null);
    };

    const handleEditWallet = (wallet) => {
        setEditingWallet(wallet.id);
        setEditWalletIcon(wallet.icon || 'mdi:wallet-outline');
        setEditWalletName(wallet.name);
    };

    const handleSaveWalletEdit = () => {
        updateWallet(editingWallet, { name: editWalletName, icon: editWalletIcon });
        setEditingWallet(null);
        setIsEditWalletIconPickerOpen(false);
    };

    const handleCancelWalletEdit = () => {
        setEditingWallet(null);
        setIsEditWalletIconPickerOpen(false);
    };

    return (
        <div className="pt-6 pb-24 space-y-8">
            <h1 className="text-3xl font-serif italic text-foreground text-shadow-sm dark:text-glow">Settings</h1>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-muted/50 dark:bg-black/40 p-1 rounded-full border border-border dark:border-white/10">
                    <TabsTrigger value="general" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-black transition-all">General</TabsTrigger>
                    <TabsTrigger value="data" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-black transition-all">Data & Categories</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6 pt-6">
                    {/* Theme */}
                    <Card className="bg-card/40 dark:bg-card/40 backdrop-blur-md border-border dark:border-white/10 shadow-sm dark:shadow-none">
                        <CardContent className="flex items-center justify-between p-6">
                            <div className="flex items-center space-x-4">
                                <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-primary/20 text-primary' : 'bg-orange-100 text-orange-500'}`}>
                                    {theme === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
                                </div>
                                <div>
                                    <p className="font-bold text-lg">Appearance</p>
                                    <p className="text-sm text-muted-foreground">{theme === 'dark' ? 'Dark Mode Active' : 'Light Mode Active'}</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={toggleTheme} className="rounded-full border-primary/50 text-foreground hover:bg-primary hover:text-black transition-colors">
                                Switch to {theme === 'dark' ? 'Light' : 'Dark'}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Currency */}
                    <Card className="bg-card/40 dark:bg-card/40 backdrop-blur-md border-border dark:border-white/10 shadow-sm dark:shadow-none">
                        <CardHeader>
                            <CardTitle className="text-base text-muted-foreground uppercase tracking-widest font-bold text-xs">Currency Symbol</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between">
                            <Input
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="max-w-[100px] text-center text-3xl font-bold bg-transparent border-b-2 border-primary border-t-0 border-x-0 rounded-none focus-visible:ring-0 px-0 h-16"
                            />
                            <div className="flex flex-col items-end space-y-3">
                                <div className="flex flex-col items-end space-y-2">
                                    <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Number Format</span>
                                    <div className="flex bg-muted/50 dark:bg-black/40 p-1 rounded-lg border border-border dark:border-white/10">
                                        <button
                                            onClick={() => setDecimalFormat({ ...decimalFormat, decimalSeparator: '.', thousandsSeparator: ',' })}
                                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${decimalFormat.decimalSeparator === '.' ? 'bg-primary text-black shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            1,234.56
                                        </button>
                                        <button
                                            onClick={() => setDecimalFormat({ ...decimalFormat, decimalSeparator: ',', thousandsSeparator: '.' })}
                                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${decimalFormat.decimalSeparator === ',' ? 'bg-primary text-black shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            1.234,56
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 pt-1">
                                    <Label htmlFor="show-decimals" className="text-xs text-muted-foreground uppercase tracking-widest font-bold cursor-pointer">Show Decimals</Label>
                                    <Switch
                                        id="show-decimals"
                                        checked={decimalFormat.showDecimals !== false}
                                        onCheckedChange={(checked) => setDecimalFormat({ ...decimalFormat, showDecimals: checked })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Monthly Budget */}
                    <Card className="bg-card/40 dark:bg-card/40 backdrop-blur-md border-border dark:border-white/10 shadow-sm dark:shadow-none">
                        <CardHeader>
                            <CardTitle className="text-base text-muted-foreground uppercase tracking-widest font-bold text-xs">Monthly Global Limit</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Input
                                type="number"
                                value={monthlyBudget}
                                onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                                className="text-2xl font-bold bg-transparent border border-input dark:border-white/10 rounded-xl focus-visible:ring-primary h-14"
                            />
                        </CardContent>
                    </Card>

                    {/* Number Format - Commented out for debugging */}
                    {/*
                    <Card className="bg-card/40 dark:bg-card/40 backdrop-blur-md border-border dark:border-white/10 shadow-sm dark:shadow-none">
                         ... content ...
                    </Card>
                    */}
                </TabsContent>

                <TabsContent value="data" className="space-y-6 pt-6">
                    {/* Export */}
                    <Card className="bg-card/40 dark:bg-card/40 backdrop-blur-md border-border dark:border-white/10 shadow-sm dark:shadow-none">
                        <CardHeader>
                            <CardTitle className="text-base text-muted-foreground uppercase tracking-widest font-bold text-xs">Export Data</CardTitle>
                        </CardHeader>
                        <CardContent className="flex space-x-4">
                            <Button variant="outline" onClick={exportCSV} className="flex-1 h-12 rounded-xl border-input dark:border-white/10 hover:bg-primary/10 hover:border-primary hover:text-primary transition-all">
                                <Download className="mr-2 h-4 w-4" /> CSV
                            </Button>
                            <Button variant="outline" onClick={exportPDF} className="flex-1 h-12 rounded-xl border-input dark:border-white/10 hover:bg-primary/10 hover:border-primary hover:text-primary transition-all opacity-50 cursor-not-allowed">
                                <Download className="mr-2 h-4 w-4" /> PDF
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Wallets Management */}
                    <Card className="bg-card/40 dark:bg-card/40 backdrop-blur-md border-border dark:border-white/10 shadow-sm dark:shadow-none">
                        <CardHeader>
                            <CardTitle className="text-base text-muted-foreground uppercase tracking-widest font-bold text-xs">Manage Wallets</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-3">
                                <Label>Add New Wallet</Label>
                                <div className="flex flex-col space-y-3">
                                    <div className="flex space-x-3">
                                        <Input
                                            placeholder="Wallet Name"
                                            id="new-wallet-name"
                                            className="bg-background/50 dark:bg-black/20 border-input dark:border-white/10 rounded-xl"
                                        />
                                        <Button
                                            variant="outline"
                                            className="justify-start text-left font-normal bg-background/50 dark:bg-black/20 border-input dark:border-white/10 rounded-xl h-10 px-3 w-48"
                                            onClick={() => setIsWalletIconPickerOpen(!isWalletIconPickerOpen)}
                                        >
                                            <div className="flex items-center">
                                                <Icon icon={newWalletIcon} className="mr-2 h-5 w-5" />
                                                <span>Icon</span>
                                            </div>
                                        </Button>
                                    </div>
                                    <Button
                                        onClick={() => {
                                            const name = document.getElementById('new-wallet-name').value;
                                            if (name) {
                                                setWallets([...wallets, { id: Date.now().toString(), name, type: 'custom', balance: 0, icon: newWalletIcon }]);
                                                document.getElementById('new-wallet-name').value = '';
                                                setNewWalletIcon('mdi:wallet-outline');
                                            }
                                        }}
                                        className="rounded-xl px-6 bg-primary text-black hover:bg-primary/80"
                                    >
                                        Add Wallet
                                    </Button>
                                    {isWalletIconPickerOpen && (
                                        <div className="grid grid-cols-6 gap-2 p-3 border border-border dark:border-white/10 rounded-xl bg-background/50 dark:bg-black/40 h-40 overflow-y-auto custom-scrollbar">
                                            {walletIcons.map(icon => (
                                                <button
                                                    key={icon}
                                                    onClick={() => {
                                                        setNewWalletIcon(icon);
                                                        setIsWalletIconPickerOpen(false);
                                                    }}
                                                    className={`p-2 rounded-lg flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors ${newWalletIcon === icon ? 'bg-primary/20 text-primary' : ''}`}
                                                >
                                                    <Icon icon={icon} className="h-6 w-6" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label>Existing Wallets</Label>
                                <div className="max-h-40 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                    {wallets.map(w => (
                                        <div key={w.id}>
                                            {editingWallet === w.id ? (
                                                // Edit Mode
                                                <div className="p-3 border border-primary dark:border-primary/50 rounded-xl bg-primary/5 dark:bg-primary/10 space-y-3">
                                                    <div className="space-y-3">
                                                        <div>
                                                            <Label className="text-sm text-muted-foreground">Wallet Name</Label>
                                                            <Input
                                                                value={editWalletName}
                                                                onChange={(e) => setEditWalletName(e.target.value)}
                                                                className="mt-1 bg-background/50 dark:bg-black/20 border-input dark:border-white/10 rounded-xl"
                                                            />
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-3">
                                                                <span className="text-muted-foreground">Balance: {formatCurrency(w.balance, currency, decimalFormat)}</span>
                                                            </div>
                                                            <div className="flex items-center space-x-1">
                                                                <Button onClick={handleSaveWalletEdit} size="sm" className="rounded-lg h-10 px-4 bg-green-500 hover:bg-green-600 text-white">
                                                                    <Check size={16} />
                                                                </Button>
                                                                <Button onClick={handleCancelWalletEdit} variant="outline" size="sm" className="rounded-lg h-10 w-10 p-0">
                                                                    <X size={16} />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Label className="text-sm text-muted-foreground">Select Icon</Label>
                                                        <div className="mt-2 grid grid-cols-6 gap-2 p-3 border border-border dark:border-white/10 rounded-xl bg-background/50 dark:bg-black/40 h-40 overflow-y-auto custom-scrollbar">
                                                            {walletIcons.map(icon => (
                                                                <button
                                                                    key={icon}
                                                                    onClick={() => {
                                                                        setEditWalletIcon(icon);
                                                                    }}
                                                                    className={`p-2 rounded-lg flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors ${editWalletIcon === icon ? 'bg-primary/20 text-primary' : ''}`}
                                                                >
                                                                    <Icon icon={icon} className="h-6 w-6" />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                // Display Mode
                                                <div className={`flex items-center justify-between p-3 border ${w.isPersistent ? 'border-muted-foreground/20 bg-muted/20 dark:bg-muted/10' : 'border-border dark:border-white/5 bg-background/50 dark:bg-white/5'} rounded-xl`}>
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`w-10 h-10 rounded-lg ${w.isPersistent ? 'bg-muted/30 dark:bg-muted/20' : 'bg-primary/10 dark:bg-primary/20'} flex items-center justify-center ${w.isPersistent ? 'text-muted-foreground' : 'text-primary'}`}>
                                                            <Icon icon={w.icon || 'mdi:wallet-outline'} className="h-6 w-6" />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center space-x-2">
                                                                <span className="font-medium">{w.name}</span>
                                                                {w.isPersistent && (
                                                                    <span className="text-xs text-muted-foreground bg-muted/50 dark:bg-muted/20 px-2 py-0.5 rounded-full">System</span>
                                                                )}
                                                            </div>
                                                            <span className="text-muted-foreground ml-2">({formatCurrency(w.balance, currency, decimalFormat)})</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        {!w.isPersistent && (
                                                            <Button variant="ghost" size="sm" onClick={() => handleEditWallet(w)} className="hover:bg-blue-500/10 hover:text-blue-500 rounded-lg h-8 w-8 p-0">
                                                                <Edit2 size={16} />
                                                            </Button>
                                                        )}
                                                        {/* Only show delete button for non-persistent wallets */}
                                                        {!w.isPersistent && (
                                                            <Button variant="ghost" size="sm" onClick={() => {
                                                                if (wallets.length > 1) {
                                                                    setWallets(wallets.filter(wall => wall.id !== w.id));
                                                                } else {
                                                                    alert("You must have at least one wallet.");
                                                                }
                                                            }} className="hover:bg-red-500/10 hover:text-red-500 rounded-lg h-8 w-8 p-0">
                                                                <Trash2 size={16} />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Categories Management */}
                    <Card className="bg-card/40 dark:bg-card/40 backdrop-blur-md border-border dark:border-white/10 shadow-sm dark:shadow-none">
                        <CardHeader>
                            <CardTitle className="text-base text-muted-foreground uppercase tracking-widest font-bold text-xs">Manage Categories</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-3">
                                <Label>Add New Category</Label>
                                <div className="flex flex-col space-y-3">
                                    <div className="flex space-x-3">
                                        <Input
                                            placeholder="Name"
                                            value={newCategory.name}
                                            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                            className="bg-background/50 dark:bg-black/20 border-input dark:border-white/10 rounded-xl"
                                        />
                                        <div className="relative w-12 h-10 rounded-xl overflow-hidden border border-input dark:border-white/10">
                                            <Input
                                                type="color"
                                                className="absolute -top-2 -left-2 w-16 h-16 p-0 border-0 cursor-pointer"
                                                value={newCategory.color}
                                                onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        {/* Icon Picker Trigger */}
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start text-left font-normal bg-background/50 dark:bg-black/20 border-input dark:border-white/10 rounded-xl h-10 px-3"
                                            onClick={() => setIsIconPickerOpen(!isIconPickerOpen)}
                                        >
                                            <div className="flex items-center">
                                                <Icon icon={newCategory.icon || 'mdi:shape-outline'} className="mr-2 h-5 w-5" />
                                                <span>{newCategory.icon ? newCategory.icon.split(':')[1] : 'Select Icon'}</span>
                                            </div>
                                        </Button>
                                        <Button onClick={handleAddCategory} className="rounded-xl px-6 bg-primary text-black hover:bg-primary/80">Add</Button>
                                    </div>

                                    {/* Icon Grid */}
                                    {isIconPickerOpen && (
                                        <div className="grid grid-cols-6 gap-2 p-3 border border-border dark:border-white/10 rounded-xl bg-background/50 dark:bg-black/40 h-40 overflow-y-auto custom-scrollbar">
                                            {availableIcons.map(icon => (
                                                <button
                                                    key={icon}
                                                    onClick={() => {
                                                        setNewCategory({ ...newCategory, icon });
                                                        setIsIconPickerOpen(false);
                                                    }}
                                                    className={`p-2 rounded-lg flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors ${newCategory.icon === icon ? 'bg-primary/20 text-primary' : ''}`}
                                                >
                                                    <Icon icon={icon} className="h-6 w-6" />
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label>Existing Categories (Drag to reorder)</Label>
                                <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                    {categories.map((cat, index) => (
                                        <div key={cat.id}>
                                            {editingCategory === cat.id ? (
                                                // Edit Mode
                                                <div className="p-3 border border-primary dark:border-primary/50 rounded-xl bg-primary/5 dark:bg-primary/10 space-y-3">
                                                    <div className="flex space-x-3">
                                                        <Input
                                                            value={editFormData.name}
                                                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                                            className="bg-background/50 dark:bg-black/20 border-input dark:border-white/10 rounded-xl"
                                                        />
                                                        <div className="relative w-12 h-10 rounded-xl overflow-hidden border border-input dark:border-white/10">
                                                            <Input
                                                                type="color"
                                                                className="absolute -top-2 -left-2 w-16 h-16 p-0 border-0 cursor-pointer"
                                                                value={editFormData.color}
                                                                onChange={(e) => setEditFormData({ ...editFormData, color: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <Button
                                                            variant="outline"
                                                            className="w-full justify-start text-left font-normal bg-background/50 dark:bg-black/20 border-input dark:border-white/10 rounded-xl h-10 px-3"
                                                            onClick={() => setEditIconPickerOpen(!editIconPickerOpen)}
                                                        >
                                                            <div className="flex items-center">
                                                                <Icon icon={editFormData.icon || 'mdi:shape-outline'} className="mr-2 h-5 w-5" />
                                                                <span>{editFormData.icon ? editFormData.icon.split(':')[1] : 'Select Icon'}</span>
                                                            </div>
                                                        </Button>
                                                        <Button onClick={handleSaveEdit} size="sm" className="rounded-lg h-10 px-4 bg-green-500 hover:bg-green-600 text-white">
                                                            <Check size={16} />
                                                        </Button>
                                                        <Button onClick={handleCancelEdit} variant="outline" size="sm" className="rounded-lg h-10 w-10 p-0">
                                                            <X size={16} />
                                                        </Button>
                                                    </div>
                                                    {editIconPickerOpen && (
                                                        <div className="grid grid-cols-6 gap-2 p-3 border border-border dark:border-white/10 rounded-xl bg-background/50 dark:bg-black/40 h-40 overflow-y-auto custom-scrollbar">
                                                            {availableIcons.map(icon => (
                                                                <button
                                                                    key={icon}
                                                                    onClick={() => {
                                                                        setEditFormData({ ...editFormData, icon });
                                                                        setEditIconPickerOpen(false);
                                                                    }}
                                                                    className={`p-2 rounded-lg flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors ${editFormData.icon === icon ? 'bg-primary/20 text-primary' : ''}`}
                                                                >
                                                                    <Icon icon={icon} className="h-6 w-6" />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                // Display Mode
                                                <div
                                                    draggable
                                                    onDragStart={(e) => handleDragStart(e, index)}
                                                    onDragOver={handleDragOver}
                                                    onDrop={(e) => handleDrop(e, index)}
                                                    className="flex items-center justify-between p-3 border border-border dark:border-white/5 rounded-xl bg-background/50 dark:bg-white/5 cursor-move hover:bg-background/70 dark:hover:bg-white/10 transition-colors"
                                                >
                                                    <div className="flex items-center flex-1">
                                                        <Grip size={16} className="mr-2 text-muted-foreground cursor-move" />
                                                        <div className="w-8 h-8 rounded-full mr-3 shadow-sm border border-white/10 flex items-center justify-center text-white" style={{ backgroundColor: cat.color }}>
                                                            {cat.icon ? <Icon icon={cat.icon} /> : cat.name[0]}
                                                        </div>
                                                        <span className="font-medium">{cat.name}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <Button variant="ghost" size="sm" onClick={() => handleEditCategory(cat)} className="hover:bg-blue-500/10 hover:text-blue-500 rounded-lg h-8 w-8 p-0">
                                                            <Edit2 size={16} />
                                                        </Button>
                                                        <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(cat.id)} className="hover:bg-red-500/10 hover:text-red-500 rounded-lg h-8 w-8 p-0">
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="text-center text-xs text-muted-foreground mt-10 opacity-50">
                <p>Personal Budget Tracker v1.2.0</p>
                <p>Local Storage Persistence</p>
            </div>
        </div>
    );
};

export default Settings;
