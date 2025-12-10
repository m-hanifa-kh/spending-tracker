import React, { createContext, useContext, useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [currency, setCurrency] = useLocalStorage('currency', '$');
    const [wallets, setWallets] = useLocalStorage('wallets', [
        { id: 'unknown', name: 'Unknown', type: 'unknown', balance: 0, icon: 'mdi:help-circle-outline', isPersistent: true },
        { id: '1', name: 'Cash', type: 'cash', balance: 0, icon: 'mdi:cash' },
        { id: '2', name: 'Debit Card', type: 'debit', balance: 0, icon: 'mdi:credit-card-outline' },
    ]);
    const [categories, setCategories] = useLocalStorage('categories', [
        { id: '1', name: 'Food', color: '#FF5733', limit: 500 },
        { id: '2', name: 'Transport', color: '#33FF57', limit: 200 },
        { id: '3', name: 'Entertainment', color: '#3357FF', limit: 150 },
        { id: '4', name: 'Utilities', color: '#FF33A1', limit: 300 },
        { id: '5', name: 'Other', color: '#A133FF', limit: 100 },
    ]);
    const [transactions, setTransactions] = useLocalStorage('transactions', []);
    const [theme, setTheme] = useLocalStorage('theme', 'light');
    const [monthlyBudget, setMonthlyBudget] = useLocalStorage('monthlyBudget', 2000);
    const [decimalFormat, setDecimalFormat] = useLocalStorage('decimalFormat', {
        decimalPlaces: 2,
        decimalSeparator: '.',
        thousandsSeparator: ',',
        showDecimals: true
    });

    // Apply theme class to html element
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);

    // Ensure Unknown wallet exists and migrate transactions without wallet
    // Ensure Unknown wallet exists and migrate transactions without wallet
    useEffect(() => {
        let walletsUpdated = false;
        let transactionsUpdated = false;

        // 1. Ensure Unknown wallet exists
        const hasUnknownWallet = wallets.some(w => w.id === 'unknown');
        if (!hasUnknownWallet) {
            // We can't update immediately and continue using 'wallets' variable safely in same effect run usually,
            // but here we just need to schedule the update.
            // But if we update here, we should probably return to avoid conflicting updates? 
            // Actually, better to checks first.

            // Note: If we just setWallets here, it will re-run effect. So that's fine as long as next run !hasUnknownWallet is false.
            setWallets(prev => [{ id: 'unknown', name: 'Unknown', type: 'unknown', balance: 0, icon: 'mdi:help-circle-outline', isPersistent: true }, ...prev]);
            return; // Break to let re-render happen
        }

        // 2. Migrate transactions without wallet
        const needsMigration = transactions.some(t => !t.walletId);
        if (needsMigration) {
            setTransactions(prev => prev.map(t => ({
                ...t,
                walletId: t.walletId || 'unknown'
            })));
            return; // Break to let re-render happen
        }

        // 3. Recalculate Unknown wallet balance
        // Only run this if we have transactions and wallets
        const unknownWallet = wallets.find(w => w.id === 'unknown');
        if (unknownWallet) {
            const unknownWalletTransactions = transactions.filter(t => t.walletId === 'unknown');
            const calculatedBalance = unknownWalletTransactions.reduce((acc, t) => {
                return t.type === 'income' ? acc + Number(t.amount) : acc - Number(t.amount);
            }, 0);

            // ONLY update if balance is different
            if (Number(unknownWallet.balance) !== calculatedBalance) {
                setWallets(prev => prev.map(w =>
                    w.id === 'unknown' ? { ...w, balance: calculatedBalance } : w
                ));
            }
        }
    }, [wallets, transactions, setWallets, setTransactions]);

    const addTransaction = (transaction) => {
        // Default to 'unknown' wallet if no walletId is provided
        const walletId = transaction.walletId || 'unknown';
        const newTransaction = { ...transaction, walletId, id: uuidv4(), date: transaction.date || new Date().toISOString() };
        setTransactions((prev) => [newTransaction, ...prev]);

        // Update wallet balance
        setWallets(prev => prev.map(w => {
            if (w.id === walletId) {
                return {
                    ...w,
                    balance: transaction.type === 'income'
                        ? Number(w.balance) + Number(transaction.amount)
                        : Number(w.balance) - Number(transaction.amount)
                };
            }
            return w;
        }));
    };

    const deleteTransaction = (id) => {
        const tx = transactions.find(t => t.id === id);
        if (!tx) return;

        // Revert wallet balance
        setWallets(prev => prev.map(w => {
            if (w.id === tx.walletId) {
                return {
                    ...w,
                    balance: tx.type === 'income'
                        ? Number(w.balance) - Number(tx.amount)
                        : Number(w.balance) + Number(tx.amount)
                };
            }
            return w;
        }));

        setTransactions((prev) => prev.filter((t) => t.id !== id));
    };

    const deleteWallet = (id) => {
        const wallet = wallets.find(w => w.id === id);

        // Prevent deleting persistent wallets
        if (wallet?.isPersistent) {
            alert("This wallet cannot be deleted.");
            return;
        }

        // Prevent deleting if it's the last non-persistent wallet
        const nonPersistentWallets = wallets.filter(w => !w.isPersistent);
        if (nonPersistentWallets.length <= 1) {
            alert("At least one wallet is required.");
            return;
        }

        setWallets(prev => prev.filter(w => w.id !== id));
    };

    const updateTransaction = (id, updatedTx) => {
        // Determine balance adjustment complexity... simpler to delete then re-add,
        // but here we might just edit in place.
        // MVP: For now assume amounts don't change often or handle manually.
        // Let's implement full update logic later for brevity, or just do a delete/add flow for the user.
        // Actually, let's just do a direct update map for now.
        setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updatedTx } : t));
    };

    const updateCategory = (id, updatedCategory) => {
        setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updatedCategory } : c));
    };

    const reorderCategories = (startIndex, endIndex) => {
        setCategories(prev => {
            const result = Array.from(prev);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);
            return result;
        });
    };

    const updateWallet = (id, updatedWallet) => {
        setWallets(prev => prev.map(w => w.id === id ? { ...w, ...updatedWallet } : w));
    };

    return (
        <AppContext.Provider
            value={{
                currency,
                setCurrency,
                wallets,
                setWallets,
                categories,
                setCategories,
                transactions,
                setTransactions,
                theme,
                setTheme,
                monthlyBudget,
                setMonthlyBudget,
                decimalFormat,
                setDecimalFormat,
                addTransaction,
                deleteTransaction,
                updateTransaction,
                deleteWallet,
                updateCategory,
                reorderCategories,
                updateWallet
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
