def format_inr(value):
    """Format number as Indian Rupee string."""
    try:
        value = float(value)
        if value >= 1e7:
            return f'₹{value/1e7:.2f} Cr'
        elif value >= 1e5:
            return f'₹{value/1e5:.2f} L'
        return f'₹{value:,.0f}'
    except (TypeError, ValueError):
        return str(value)


def safe_float(val, default=0.0):
    try:
        return float(val)
    except (TypeError, ValueError):
        return default
