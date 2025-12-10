# Personal Budget Tracker - Complete User Flows Documentation

## Table of Contents
1. [Application Entry Points](#1-application-entry-points)
2. [First-Time User Experience](#2-first-time-user-experience)
3. [Daily Usage Flows](#3-daily-usage-flows)
4. [Transaction Management Flows](#4-transaction-management-flows)
5. [Settings & Configuration Flows](#5-settings--configuration-flows)
6. [Analytics & Reporting Flows](#6-analytics--reporting-flows)
7. [Edge Cases & Error States](#7-edge-cases--error-states)
8. [PWA & Cross-Device Flows](#8-pwa--cross-device-flows)
9. [Data Management Flows](#9-data-management-flows)
10. [Accessibility Flows](#10-accessibility-flows)

---

## 1. Application Entry Points

### 1.1 Direct Browser Access
**Flow**: User types URL or clicks bookmark
```
Browser → Load App → Check LocalStorage → Initialize State → Show Dashboard
```

**States**:
- Fresh install (no data)
- Returning user (existing data)
- Browser with blocked LocalStorage

### 1.2 PWA Launch
**Flow**: User clicks installed app icon
```
App Icon → Launch PWA → Load from Cache → Initialize State → Show Dashboard
```

### 1.3 Deep Linking
**Possible Routes**:
- `/` - Dashboard (default)
- `/transactions` - Transaction list
- `/analytics` - Analytics view
- `/settings` - Settings page
- `/add` - Add transaction

---

## 2. First-Time User Experience (FTUE)

### 2.1 Fresh Install Flow
```
User Opens App → Welcome State → Empty Dashboard → Onboarding Prompts
                                    ↓
                              [Onboarding Messages]
                                    ↓
                            [Add First Transaction CTA]
```

**Key States**:
- **Empty Dashboard**: Shows 0 balance, "No transactions yet"
- **Empty Analytics**: "No data available" message
- **Default Categories**: Food, Transport, Entertainment, Utilities, Other
- **Default Wallets**: Cash, Debit Card

### 2.2 Implicit Onboarding
No explicit onboarding screens. Users learn through:
- Empty states with CTAs
- Intuitive UI patterns
- Progressive disclosure of features

---

## 3. Daily Usage Flows

### 3.1 Quick Transaction Entry (Most Common)
```
User Opens App → Sees Dashboard → Taps Floating + Button
                                        ↓
                              Select Transaction Type
                                        ↓
                                 Enter Amount
                                        ↓
                               Select Category
                                        ↓
                               Select Wallet
                                        ↓
                                 Add Note
                                        ↓
                                Save Transaction
                                        ↓
                            Return to Dashboard (Updated)
```

### 3.2 Balance Check Flow
```
User Opens App → Dashboard → View Total Balance
                                    ↓
                        View Income/Expense Summary
                                    ↓
                    Check Budget Progress Bar
                                    ↓
                    [Optional] View Recent Transactions
```

### 3.3 Transaction Review Flow
```
User Opens App → Dashboard → Scroll Recent Transactions
                                    ↓
                        Tap "Transactions" Tab
                                        ↓
                      View All Transactions (Grouped by Date)
                                    ↓
        [Actions] Search | Scroll | Delete Individual Transactions
```

---

## 4. Transaction Management Flows

### 4.1 Add Transaction Flow (Detailed)

**Entry Points**:
1. Floating + button on all screens
2. Direct navigation to `/add`

**Complete Flow**:
```
Add Transaction Screen
        ↓
Select Transaction Type (Income/Expense)
        ↓
Enter Amount (Numeric Keyboard)
        ↓
Select Category (Dropdown)
        ↓
Select Wallet (Dropdown)
        ↓
Select Date (Date Picker)
        ↓
Add Note (Optional)
        ↓
Tap "Save Transaction"
        ↓
[Validation Check]
        ↓
Update Wallet Balance → Add to Transaction List → Return to Previous Screen
```

**Validation Rules**:
- Amount: Required, must be > 0
- Category: Required selection
- Wallet: Required selection
- Date: Defaults to today, can be past/future

### 4.2 Delete Transaction Flow
```
Transaction List → Find Transaction → Tap "Delete"
                                        ↓
                          Confirmation Dialog
                                        ↓
                     [Yes] Reverse Wallet Balance → Remove from List
                     [No] Return to List
```

### 4.3 Search & Filter Flow
```
Transactions Page → Type in Search Bar
                                    ↓
                      Real-time Filter Results
                                    ↓
          Filter By: Note Content | Category Name
                                    ↓
          Clear Search → Show All Transactions
```

---

## 5. Settings & Configuration Flows

### 5.1 Settings Navigation Flow
```
Any Screen → Tap Settings Tab → Settings Page
                                    ↓
                    [Tab Selection] General | Data & Categories
```

### 5.2 Theme Toggle Flow
```
Settings → General Tab → Dark Mode Card
                                    ↓
                    Tap "Enable/Disable"
                                    ↓
                Immediate Theme Change → Save to LocalStorage
```

### 5.3 Currency Change Flow
```
Settings → General Tab → Currency Symbol
                                    ↓
                    Type New Symbol
                                    ↓
                Update Display Throughout App
```

### 5.4 Budget Setting Flow
```
Settings → General Tab → Monthly Global Limit
                                    ↓
                    Enter Amount
                                    ↓
                Update Dashboard Budget Calculations
```

### 5.5 Category Management Flow

**Add Category**:
```
Settings → Data Tab → Manage Categories
                                    ↓
                    Enter Category Name
                                    ↓
                    Select Color (Color Picker)
                                    ↓
                    Tap "Add"
                                    ↓
            New Category Appears in Dropdowns
```

**Delete Category**:
```
Settings → Data Tab → Find Category → Tap Trash Icon
                                    ↓
                    [No Confirmation] Immediate Delete
                                    ↓
        [Note: Existing transactions keep category ID, won't display name]
```

### 5.6 Data Export Flow

**CSV Export**:
```
Settings → Data Tab → Export Data → Tap "CSV"
                                    ↓
                    Generate File → Download Prompt
                                    ↓
            File Named "transactions.csv" Downloads
```

**PDF Export**:
```
Settings → Data Tab → Export Data → Tap "PDF"
                                    ↓
                    Alert: "PDF export is currently disabled"
```

---

## 6. Analytics & Reporting Flows

### 6.1 Analytics Navigation
```
Any Screen → Tap Analytics Tab → Analytics Page
                                    ↓
                    View Charts & Graphs
```

### 6.2 Time Range Selection Flow
```
Analytics Page → Time Range Dropdown
                                    ↓
            Select: "This Month" | "All Time"
                                    ↓
                    Charts Update Immediately
```

### 6.3 Chart Interaction Flow
```
Analytics Page → Hover Over Chart Segments
                                    ↓
                    Show Tooltip with Details
                                    ↓
                    [Pie Chart] View Category Percentages
                    [Bar Chart] View Daily Spending Amounts
```

---

## 7. Edge Cases & Error States

### 7.1 No Internet Connection
```
App Usage → All Features Work Normally
                                    ↓
                    [No error message needed]
                    App is offline-first
```

### 7.2 LocalStorage Blocked/Full
```
App Launch → Try to Access LocalStorage
                                    ↓
                    [Blocked/Full] Data won't persist
                                    ↓
            [Current behavior] App still works but data lost on refresh
                    [Potential] Show warning message
```

### 7.3 Invalid Data in LocalStorage
```
App Launch → Parse LocalStorage Data
                                    ↓
                    [Invalid/Corsupted] Use Defaults
                                    ↓
                    [Potential] Show "Data Reset" Message
```

### 7.4 Transaction Form Validation Errors
```
Add Transaction → Tap "Save" with Empty Fields
                                    ↓
                    [Current] Button does nothing
                    [Potential] Show validation messages
```

### 7.5 Category With No Transactions
```
Analytics/Charts → Filter Categories
                                    ↓
                    Skip Categories with Zero Amount
                                    ↓
                    Show "No data available" if All Empty
```

### 7.6 Very Large Numbers
```
Enter Large Amount → Display in Dashboard
                                    ↓
                    Format with .toLocaleString()
                                    ↓
            Charts scale appropriately
```

### 7.7 Future-Dated Transactions
```
Add Transaction → Select Future Date
                                    ↓
                    [Allowed] Transaction appears immediately
                    [Affects] Current month calculations
```

---

## 8. PWA & Cross-Device Flows

### 8.1 PWA Installation Flow
```
Browser Visits App → Browser Shows Install Prompt
                                    ↓
                    User Clicks Install
                                    ↓
                    App Installs on Device
                                    ↓
                    App Opens in Standalone Mode
```

### 8.2 App Update Flow
```
New Version Deployed → Service Worker Detects Update
                                    ↓
                    Download New Files in Background
                                    ↓
                    [On Next Launch] Use New Version
                    [Potential] Show "Update Available" Prompt
```

### 8.3 Cross-Device Sync (Not Supported)
```
User on Phone → Add Transaction
                                    ↓
        User on Computer → Transaction NOT visible
                                    ↓
                    [Current Behavior] Data stays on device
                    [Potential] Export/Import for manual sync
```

---

## 9. Data Management Flows

### 9.1 Initial Data Setup
```
First Launch → Create Default Categories
                                    ↓
                    Create Default Wallets
                                    ↓
                    Initialize Empty Transaction Array
                                    ↓
                    Set Default Theme (light)
                                    ↓
                    Set Default Currency ($)
                                    ↓
                    Set Default Budget ($2000)
```

### 9.2 Data Persistence Flow
```
Any Data Change → Update State in Memory
                                    ↓
                    Save to LocalStorage (Debounced)
                                    ↓
                    [On Reload] Restore from LocalStorage
```

### 9.3 Data Reset Flow
```
[Not Implemented] But would be:
Settings → Advanced → Reset All Data
                                    ↓
                    Confirmation Dialog
                                    ↓
                    Clear LocalStorage
                                    ↓
                    Reload Page → Fresh State
```

### 9.4 Data Import Flow
```
[Not Implemented] But would be:
Settings → Data Tab → Import CSV
                                    ↓
                    Select File
                                    ↓
                    Parse & Validate Data
                                    ↓
                    Merge with Existing Data
```

---

## 10. Accessibility Flows

### 10.1 Keyboard Navigation Flow
```
Tab Key → Navigate Interactive Elements
                                    ↓
                    Enter/Space → Activate Buttons
                                    ↓
                    Arrow Keys → Navigate Lists
                                    ↓
                    Escape → Close Dialogs
```

### 10.2 Screen Reader Flow
```
Page Load → Announce Page Title
                                    ↓
                    Announce Current Balance
                                    ↓
                    Navigate with VoiceOver/TalkBack
                                    ↓
                    ARIA Labels provide context
```

### 10.3 High Contrast Mode
```
System Preference → Detect prefers-contrast
                                    ↓
                    [Not Implemented] Would adjust colors
```

### 10.4 Reduced Motion Flow
```
System Preference → Detect prefers-reduced-motion
                                    ↓
                    [Not Implemented] Disable animations
```

---

## Additional Micro-Interactions

### Hover States
- Buttons: Color change + subtle scale
- Cards: Subtle shadow increase
- Links: Underline appearance

### Loading States
- [Currently Minimal] Charts show loading
- Transactions: Instant (no loading needed)
- Navigation: Instant (no loading needed)

### Success/Error Feedback
- Transaction Saved: Return to dashboard (implicit success)
- Delete: Confirmation dialog then immediate removal
- Export: File download notification

### Empty States
- Dashboard: "No transactions yet" message
- Analytics: "No data available" message
- Transactions: "No transactions found"

---

## Decision Points & User Choices

### Critical Decision Points:
1. **Transaction Type** (Income/Expense) - Determines color coding and balance impact
2. **Category Selection** - Affects analytics and budget tracking
3. **Wallet Selection** - Determines which balance to update
4. **Theme Preference** - Affects entire app appearance
5. **Currency Symbol** - Changes display throughout app
6. **Monthly Budget** - Affects budget progress calculations

### Consequences of Actions:
- **Add Expense**: Decreases wallet balance, increases spending total
- **Add Income**: Increases wallet balance, increases income total
- **Delete Transaction**: Reverts balance change
- **Change Theme**: Updates entire UI immediately
- **Delete Category**: Existing transactions lose category display
- **Clear Browser Data**: Permanently loses all app data

---

## Potential Improvements (Not Implemented)

### Missing User Flows:
1. **Transaction Edit Flow**: Currently only delete is supported
2. **Transaction Duplicate/Copy Flow**: For recurring expenses
3. **Bulk Operations**: Select multiple transactions to delete
4. **Advanced Filtering**: Filter by date range, amount, wallet
5. **Search in Analytics**: Find specific spending patterns
6. **Wallet Management**: Add/edit/delete wallets
7. **Category Budgets**: Per-category spending limits
8. **Transaction Reminders**: Notifications for recurring bills

### Error Handling Improvements:
1. **Graceful Degradation**: When LocalStorage fails
2. **Data Validation**: Prevent invalid transactions
3. **Conflict Resolution**: If data becomes corrupted
4. **Undo Functionality**: Restore deleted transactions
5. **Sync Indicators**: Show when data is saving

This comprehensive documentation covers every possible user interaction and state within the current version of the Personal Budget Tracker application.