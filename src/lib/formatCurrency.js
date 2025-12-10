export const formatNumber = (num, decimalFormat) => {
    if (isNaN(num)) return '0';

    const {
        decimalPlaces = 2,
        decimalSeparator = '.',
        thousandsSeparator = ',',
        showDecimals = true
    } = decimalFormat || {};

    // Determine effective decimal places
    const effectivePlaces = showDecimals ? decimalPlaces : 0;

    // Round to specified decimal places
    const rounded = Number(num).toFixed(effectivePlaces);

    // Split into integer and decimal parts
    const parts = rounded.split('.');

    // Add thousands separator to integer part
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);

    // Join with custom decimal separator
    return parts.join(decimalSeparator);
};

export const formatCurrency = (amount, currency, decimalFormat) => {
    const formatted = formatNumber(amount, decimalFormat);
    return `${currency}${formatted}`;
};