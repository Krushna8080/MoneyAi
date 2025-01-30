import json
import random
from datetime import datetime, timedelta

# Function to generate a list of random portfolio performance entries
def generate_portfolio_performance(num_entries):
    start_date = datetime(2025, 1, 1)
    performance = []

    for i in range(num_entries):
        date = start_date + timedelta(days=i)
        value = 10000 + random.uniform(-500, 500) * i  # Simulating value changes
        profit_loss = random.uniform(-100, 200)  # Random profit/loss
        win_rate = random.randint(50, 90)  # Random win rate
        strategy = random.choice(["Growth", "Income", "Balanced", "Aggressive"])  # Random strategy
        performance.append({
            "date": date.strftime("%Y-%m-%d"),
            "value": round(value, 2),
            "profitLoss": round(profit_loss, 2),
            "winRate": win_rate,
            "strategy": strategy
        })

    return performance

# Function to generate a list of random asset allocations
def generate_allocation(num_entries):
    allocations = []
    for _ in range(num_entries):
        asset_class = random.choice(["Stocks", "Bonds", "Real Estate", "Commodities", "Crypto"])
        value = random.randint(1000, 10000)  # Random allocation value
        allocations.append({
            "assetClass": asset_class,
            "value": value
        })

    return allocations

# Function to generate a list of random recent trades
def generate_recent_trades(num_entries):
    trades = []
    for _ in range(num_entries):
        symbol = random.choice(["AAPL", "TSLA", "MSFT", "GOOGL", "AMZN", "NVDA", "META"])
        action = random.choice(["Buy", "Sell"])
        quantity = random.randint(1, 50)  # Random quantity
        price = random.uniform(50, 500)  # Random price
        trades.append({
            "symbol": symbol,
            "action": action,
            "quantity": quantity,
            "price": round(price, 2)
        })

    return trades

# Main function to generate the dataset
def generate_large_dataset(num_performance, num_allocation, num_trades):
    dataset = {
        "portfolioPerformance": generate_portfolio_performance(num_performance),
        "allocation": generate_allocation(num_allocation),
        "recentTrades": generate_recent_trades(num_trades)
    }
    return dataset

# Generate large dataset
large_dataset = generate_large_dataset(num_performance=1000, num_allocation=100, num_trades=500)

# Save to JSON file
with open("large_dataset.json", "w") as file:
    json.dump(large_dataset, file, indent=2)

print("Large dataset generated and saved to 'large_dataset.json'")
