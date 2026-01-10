# Transaction Analytics Dashboard

A modern, responsive Node.js web application that displays financial transaction analytics from Supabase database.

## Features

- 📊 **Real-time Analytics** - Live data from Supabase
- 🌓 **Dark/Light Theme** - Toggle with persistent preference
- 📱 **Responsive Design** - Mobile and desktop friendly
- 🔄 **Sortable Columns** - Click headers to sort data
- 💰 **Financial Overview** - Running totals and balance tracking

## Tech Stack

- **Backend**: Node.js (vanilla HTTP server)
- **Database**: Supabase
- **Frontend**: Vanilla JavaScript, CSS
- **Styling**: Modern CSS with dark theme support

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd transaction-analytics
```

2. Install dependencies:
```bash
npm install
```

3. Update Supabase credentials in `server.js`:
```javascript
const supabaseUrl = 'your-supabase-url';
const supabaseKey = 'your-supabase-anon-key';
```

4. Start the server:
```bash
npm start
```

5. Open http://localhost:3000 in your browser

## Database Schema

The application expects a `transactions` table with these columns:
- `id` - Primary key
- `trans_date` - Transaction date
- `amount` - Transaction amount
- `trans_type` - 'I' for Income, 'E' for Expense
- `description` - Transaction description
- `running_income` - Cumulative income total
- `running_expense` - Cumulative expense total
- `balance` - Current balance

## Usage

- **Sort Data**: Click any column header to sort
- **Theme Toggle**: Use the theme button in top-right corner
- **Auto-refresh**: Data updates every 30 seconds

## License

MIT License
