const http = require('http');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://oadocexitbvbqhykwhhz.supabase.co';
const supabaseKey = 'sb_publishable_pssGEAECPVa4PpIIrppwEA_6byenS2d';
const supabase = createClient(supabaseUrl, supabaseKey);

const server = http.createServer(async (req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(getHTML());
  } else if (req.url === '/api/transactions') {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('trans_date', { ascending: false });
      
      if (error) throw error;
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

function getHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaction Analytics</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        /* Light Theme */
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            background: #f8fafc; 
            color: #1e293b;
            transition: all 0.3s ease;
        }
        .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .header h1 { color: #1e293b; font-size: 2rem; }
        .theme-toggle { 
            background: #e2e8f0; 
            border: none; 
            padding: 8px 16px; 
            border-radius: 8px; 
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .stat-card h3 { color: #64748b; font-size: 0.875rem; text-transform: uppercase; margin-bottom: 8px; }
        .stat-card .value { font-size: 1.5rem; font-weight: 600; }
        .income { color: #059669; }
        .expense { color: #dc2626; }
        .balance { color: #2563eb; }
        .table-container { background: white; border-radius: 12px; overflow-x: auto; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        table { width: 100%; border-collapse: collapse; min-width: 800px; }
        th { 
            background: #f1f5f9; 
            padding: 16px; 
            text-align: left; 
            font-weight: 600; 
            color: #374151; 
            cursor: pointer;
            user-select: none;
            position: relative;
        }
        th:hover { background: #e2e8f0; }
        th .sort-arrow { 
            margin-left: 8px; 
            font-size: 0.8rem; 
            opacity: 0.5; 
        }
        th.sorted .sort-arrow { opacity: 1; }
        td { padding: 16px; border-top: 1px solid #e2e8f0; }
        .amount { font-weight: 600; }
        .type-income { color: #059669; }
        .type-expense { color: #dc2626; }
        .loading { text-align: center; padding: 40px; color: #64748b; }

        /* Dark Theme */
        body.dark { background: #0f172a; color: #e2e8f0; }
        body.dark .header h1 { color: #e2e8f0; }
        body.dark .theme-toggle { background: #334155; color: #e2e8f0; }
        body.dark .stat-card { background: #1e293b; }
        body.dark .stat-card h3 { color: #94a3b8; }
        body.dark .table-container { background: #1e293b; }
        body.dark th { background: #334155; color: #e2e8f0; }
        body.dark th:hover { background: #475569; }
        body.dark td { border-top: 1px solid #334155; }
        body.dark .loading { color: #94a3b8; }

        @media (max-width: 768px) {
            .container { padding: 10px; }
            .header { flex-direction: column; gap: 15px; }
            .header h1 { font-size: 1.5rem; }
            th, td { padding: 12px 8px; font-size: 0.875rem; }
            .stats { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Transaction Analytics</h1>
            <button class="theme-toggle" onclick="toggleTheme()">🌙 Dark Mode</button>
        </div>
        
        <div class="stats" id="stats">
            <div class="stat-card">
                <h3>Total Income</h3>
                <div class="value income" id="totalIncome">₹0</div>
            </div>
            <div class="stat-card">
                <h3>Total Expense</h3>
                <div class="value expense" id="totalExpense">₹0</div>
            </div>
            <div class="stat-card">
                <h3>Current Balance</h3>
                <div class="value balance" id="currentBalance">₹0</div>
            </div>
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th onclick="sortTable('trans_date')">Date <span class="sort-arrow">↕</span></th>
                        <th onclick="sortTable('description')">Description <span class="sort-arrow">↕</span></th>
                        <th onclick="sortTable('trans_type')">Type <span class="sort-arrow">↕</span></th>
                        <th onclick="sortTable('amount')">Amount <span class="sort-arrow">↕</span></th>
                        <th onclick="sortTable('running_income')">Running Income <span class="sort-arrow">↕</span></th>
                        <th onclick="sortTable('running_expense')">Running Expense <span class="sort-arrow">↕</span></th>
                        <th onclick="sortTable('balance')">Balance <span class="sort-arrow">↕</span></th>
                    </tr>
                </thead>
                <tbody id="transactionTable">
                    <tr><td colspan="7" class="loading">Loading transactions...</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <script>
        let transactions = [];
        let sortColumn = 'trans_date';
        let sortDirection = 'desc';

        function toggleTheme() {
            document.body.classList.toggle('dark');
            const isDark = document.body.classList.contains('dark');
            document.querySelector('.theme-toggle').textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
            localStorage.setItem('darkMode', isDark);
        }

        // Load saved theme
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark');
            document.querySelector('.theme-toggle').textContent = '☀️ Light Mode';
        }

        function sortTable(column) {
            if (sortColumn === column) {
                sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                sortColumn = column;
                sortDirection = 'asc';
            }
            
            // Update header arrows
            document.querySelectorAll('th').forEach(th => {
                th.classList.remove('sorted');
                const arrow = th.querySelector('.sort-arrow');
                if (arrow) arrow.textContent = '↕';
            });
            
            const currentTh = document.querySelector('th[onclick*="' + column + '"]');
            currentTh.classList.add('sorted');
            const arrow = currentTh.querySelector('.sort-arrow');
            arrow.textContent = sortDirection === 'asc' ? '↑' : '↓';
            
            // Sort and render
            const sorted = [...transactions].sort((a, b) => {
                let aVal = a[column];
                let bVal = b[column];
                
                // Handle numeric columns
                if (['amount', 'running_income', 'running_expense', 'balance'].includes(column)) {
                    aVal = parseFloat(aVal) || 0;
                    bVal = parseFloat(bVal) || 0;
                }
                
                // Handle date column
                if (column === 'trans_date') {
                    aVal = new Date(aVal);
                    bVal = new Date(bVal);
                }
                
                if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
            
            renderTable(sorted);
        }

        async function loadTransactions() {
            try {
                const response = await fetch('/api/transactions');
                const data = await response.json();
                
                if (data.error) throw new Error(data.error);
                
                transactions = data;
                updateStats(transactions);
                sortTable(sortColumn); // Apply current sort
            } catch (error) {
                document.getElementById('transactionTable').innerHTML = 
                    '<tr><td colspan="7" style="color: #dc2626; text-align: center;">Error loading data: ' + error.message + '</td></tr>';
            }
        }

        function updateStats(transactions) {
            const latest = transactions[0] || {};
            document.getElementById('totalIncome').textContent = '₹' + (latest.running_income || '0');
            document.getElementById('totalExpense').textContent = '₹' + (latest.running_expense || '0');
            document.getElementById('currentBalance').textContent = '₹' + (latest.balance || '0');
        }

        function renderTable(data) {
            const tbody = document.getElementById('transactionTable');
            tbody.innerHTML = data.map(t => 
                '<tr>' +
                '<td>' + new Date(t.trans_date).toLocaleDateString() + '</td>' +
                '<td>' + t.description + '</td>' +
                '<td><span class="type-' + (t.trans_type === 'I' ? 'income">Income' : 'expense">Expense') + '</span></td>' +
                '<td class="amount ' + (t.trans_type === 'I' ? 'type-income' : 'type-expense') + '">₹' + t.amount + '</td>' +
                '<td class="amount type-income">₹' + t.running_income + '</td>' +
                '<td class="amount type-expense">₹' + t.running_expense + '</td>' +
                '<td class="amount">₹' + t.balance + '</td>' +
                '</tr>'
            ).join('');
        }

        loadTransactions();
        setInterval(loadTransactions, 30000); // Refresh every 30 seconds
    </script>
</body>
</html>`;
}

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
