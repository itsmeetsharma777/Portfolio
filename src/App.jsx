import { useEffect, useMemo, useState } from "react";

const API_BASE = "http://localhost:5001/api";
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
const expenseCategories = [
  "Food",
  "Transport",
  "Housing",
  "Shopping",
  "Health",
  "Entertainment",
  "Education",
  "Utilities",
  "Other"
];
const incomeCategories = ["Salary", "Freelance", "Investment", "Gift", "Other"];
const catEmoji = {
  Food: "🍔",
  Transport: "🚗",
  Housing: "🏠",
  Shopping: "🛍️",
  Health: "💊",
  Entertainment: "🎬",
  Education: "📚",
  Utilities: "💡",
  Salary: "💼",
  Freelance: "💻",
  Investment: "📈",
  Gift: "🎁",
  Other: "💰"
};
const catColors = [
  "#c8f065",
  "#f06565",
  "#65c8f0",
  "#f0b865",
  "#b065f0",
  "#65f0b0",
  "#f065b0",
  "#65a3f0",
  "#f0e065",
  "#a3f065",
  "#f0a365"
];

function fmt(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(amount || 0));
}

async function api(path, options = {}, userId) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (userId) {
    headers["x-user-id"] = userId;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

function App() {
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("kite_current_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [activePage, setActivePage] = useState("dashboard");
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [editingTxId, setEditingTxId] = useState(null);
  const [toast, setToast] = useState("");
  const [txFilters, setTxFilters] = useState({ search: "", type: "", category: "" });
  const [authForm, setAuthForm] = useState({
    loginUsername: "",
    loginPassword: "",
    registerUsername: "",
    registerPassword: ""
  });
  const [txForm, setTxForm] = useState({
    type: "expense",
    amount: "",
    desc: "",
    cat: "Food",
    date: new Date().toISOString().slice(0, 10),
    account: "cash"
  });
  const [budgetForm, setBudgetForm] = useState({
    cat: "Food",
    limit: ""
  });

  useEffect(() => {
    if (!user) {
      localStorage.removeItem("kite_current_user");
      setTransactions([]);
      setBudgets({});
      return;
    }

    localStorage.setItem("kite_current_user", JSON.stringify(user));
    loadAppData();
  }, [user]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = window.setTimeout(() => setToast(""), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  async function loadAppData() {
    if (!user?._id) {
      return;
    }

    setLoading(true);
    try {
      const [txRes, budgetRes] = await Promise.all([
        api("/transactions", {}, user._id),
        api("/budgets", {}, user._id)
      ]);
      setTransactions(txRes.transactions);
      setBudgets(budgetRes.budgets);
    } catch (error) {
      setToast(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(event) {
    event.preventDefault();
    setAuthError("");

    try {
      const payload = await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          username: authForm.registerUsername.trim(),
          password: authForm.registerPassword
        })
      });
      setUser(payload.user);
      setAuthForm((current) => ({
        ...current,
        registerUsername: "",
        registerPassword: "",
        loginPassword: ""
      }));
      setToast("Account created successfully.");
    } catch (error) {
      setAuthError(error.message);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    setAuthError("");

    try {
      const payload = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username: authForm.loginUsername.trim(),
          password: authForm.loginPassword
        })
      });
      setUser(payload.user);
      setAuthForm((current) => ({
        ...current,
        loginPassword: ""
      }));
      setToast("Welcome back.");
    } catch (error) {
      setAuthError(error.message);
    }
  }

  function handleLogout() {
    setUser(null);
    setAuthMode("login");
    setActivePage("dashboard");
    setToast("Logged out.");
  }

  const currentCategories = txForm.type === "income" ? incomeCategories : expenseCategories;

  useEffect(() => {
    if (!currentCategories.includes(txForm.cat)) {
      setTxForm((current) => ({
        ...current,
        cat: currentCategories[0]
      }));
    }
  }, [txForm.type]);

  const totals = useMemo(() => {
    const now = new Date();
    const thisMonth = transactions.filter((transaction) => {
      const date = new Date(transaction.date);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });
    const income = thisMonth
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const expense = thisMonth
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const balance =
      transactions
        .filter((transaction) => transaction.type === "income")
        .reduce((sum, transaction) => sum + transaction.amount, 0) -
      transactions
        .filter((transaction) => transaction.type === "expense")
        .reduce((sum, transaction) => sum + transaction.amount, 0);

    return {
      income,
      expense,
      savings: income - expense,
      balance,
      thisMonth
    };
  }, [transactions]);

  const recentTransactions = useMemo(
    () =>
      [...transactions]
        .sort((left, right) => new Date(right.date) - new Date(left.date))
        .slice(0, 5),
    [transactions]
  );

  const monthlyTransactions = useMemo(() => {
    return [...transactions]
      .filter((transaction) => {
        const date = new Date(transaction.date);
        return date.getMonth() === viewMonth && date.getFullYear() === viewYear;
      })
      .sort((left, right) => new Date(right.date) - new Date(left.date));
  }, [transactions, viewMonth, viewYear]);

  const monthlyStats = useMemo(() => {
    const income = monthlyTransactions
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const expense = monthlyTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    return {
      income,
      expense,
      saved: income - expense
    };
  }, [monthlyTransactions]);

  const filteredTransactions = useMemo(() => {
    const search = txFilters.search.toLowerCase().trim();
    return [...transactions]
      .sort((left, right) => new Date(right.date) - new Date(left.date))
      .filter((transaction) => {
        const matchesSearch =
          !search ||
          transaction.desc.toLowerCase().includes(search) ||
          transaction.cat.toLowerCase().includes(search);
        const matchesType = !txFilters.type || transaction.type === txFilters.type;
        const matchesCategory = !txFilters.category || transaction.cat === txFilters.category;
        return matchesSearch && matchesType && matchesCategory;
      });
  }, [transactions, txFilters]);

  const chartData = useMemo(() => {
    const now = new Date();
    const months = [];

    for (let index = 5; index >= 0; index -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
      const monthTransactions = transactions.filter((transaction) => {
        const itemDate = new Date(transaction.date);
        return itemDate.getMonth() === date.getMonth() && itemDate.getFullYear() === date.getFullYear();
      });

      months.push({
        label: date.toLocaleString("default", { month: "short" }),
        income: monthTransactions
          .filter((transaction) => transaction.type === "income")
          .reduce((sum, transaction) => sum + transaction.amount, 0),
        expense: monthTransactions
          .filter((transaction) => transaction.type === "expense")
          .reduce((sum, transaction) => sum + transaction.amount, 0)
      });
    }

    return months;
  }, [transactions]);

  const chartMax = Math.max(
    ...chartData.flatMap((item) => [item.income, item.expense]),
    1
  );

  const donutEntries = useMemo(() => {
    const expenseMap = {};
    totals.thisMonth
      .filter((transaction) => transaction.type === "expense")
      .forEach((transaction) => {
        expenseMap[transaction.cat] = (expenseMap[transaction.cat] || 0) + transaction.amount;
      });

    return Object.entries(expenseMap).sort((left, right) => right[1] - left[1]);
  }, [totals.thisMonth]);

  const budgetCards = useMemo(() => {
    const now = new Date();
    const monthlyExpenseMap = {};

    transactions
      .filter((transaction) => {
        const date = new Date(transaction.date);
        return (
          transaction.type === "expense" &&
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      })
      .forEach((transaction) => {
        monthlyExpenseMap[transaction.cat] = (monthlyExpenseMap[transaction.cat] || 0) + transaction.amount;
      });

    return Object.entries(budgets).map(([category, limit]) => {
      const spent = monthlyExpenseMap[category] || 0;
      const pct = Math.min((spent / limit) * 100 || 0, 100);
      const status =
        pct >= 100 ? ["over", "Over Budget"] : pct >= 80 ? ["warn", "Near Limit"] : ["ok", "On Track"];
      const color = pct >= 100 ? "var(--accent2)" : pct >= 80 ? "var(--accent4)" : "var(--accent)";
      return { category, limit, spent, pct, status, color };
    });
  }, [budgets, transactions]);

  function openTxModal(transaction = null) {
    if (transaction) {
      setEditingTxId(transaction._id);
      setTxForm({
        type: transaction.type,
        amount: transaction.amount,
        desc: transaction.desc,
        cat: transaction.cat,
        date: transaction.date.slice(0, 10),
        account: transaction.account
      });
    } else {
      setEditingTxId(null);
      setTxForm({
        type: "expense",
        amount: "",
        desc: "",
        cat: "Food",
        date: new Date().toISOString().slice(0, 10),
        account: "cash"
      });
    }
    setTxModalOpen(true);
  }

  function closeTxModal() {
    setTxModalOpen(false);
    setEditingTxId(null);
  }

  function openBudgetModal(category = null) {
    setBudgetModalOpen(true);
    if (category) {
      setBudgetForm({
        cat: category,
        limit: budgets[category]
      });
    } else {
      setBudgetForm({
        cat: expenseCategories[0],
        limit: ""
      });
    }
  }

  function closeBudgetModal() {
    setBudgetModalOpen(false);
  }

  async function saveTransaction() {
    if (!txForm.amount || Number(txForm.amount) <= 0) {
      setToast("Please enter a valid amount.");
      return;
    }

    if (!txForm.desc.trim() || !txForm.date) {
      setToast("Please fill all transaction details.");
      return;
    }

    const payload = {
      amount: Number(txForm.amount),
      desc: txForm.desc.trim(),
      cat: txForm.cat,
      date: txForm.date,
      account: txForm.account,
      type: txForm.type
    };

    try {
      if (editingTxId) {
        const response = await api(`/transactions/${editingTxId}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        }, user._id);
        setTransactions((current) =>
          current.map((transaction) =>
            transaction._id === editingTxId ? response.transaction : transaction
          )
        );
        setToast("Transaction updated.");
      } else {
        const response = await api("/transactions", {
          method: "POST",
          body: JSON.stringify(payload)
        }, user._id);
        setTransactions((current) => [response.transaction, ...current]);
        setToast("Transaction added.");
      }
      closeTxModal();
    } catch (error) {
      setToast(error.message);
    }
  }

  async function deleteTransaction(transactionId) {
    try {
      await api(`/transactions/${transactionId}`, { method: "DELETE" }, user._id);
      setTransactions((current) => current.filter((transaction) => transaction._id !== transactionId));
      setToast("Transaction deleted.");
    } catch (error) {
      setToast(error.message);
    }
  }

  async function saveBudget() {
    if (!budgetForm.limit || Number(budgetForm.limit) <= 0) {
      setToast("Enter a valid budget limit.");
      return;
    }

    try {
      const response = await api(
        `/budgets/${encodeURIComponent(budgetForm.cat)}`,
        {
          method: "PUT",
          body: JSON.stringify({ limit: Number(budgetForm.limit) })
        },
        user._id
      );
      setBudgets(response.budgets);
      setBudgetModalOpen(false);
      setToast(`Budget saved for ${budgetForm.cat}.`);
    } catch (error) {
      setToast(error.message);
    }
  }

  async function deleteBudget(category) {
    try {
      const response = await api(`/budgets/${encodeURIComponent(category)}`, { method: "DELETE" }, user._id);
      setBudgets(response.budgets);
      setToast("Budget removed.");
    } catch (error) {
      setToast(error.message);
    }
  }

  function exportCsv() {
    if (!transactions.length) {
      setToast("No transactions to export.");
      return;
    }

    const header = "Date,Type,Category,Description,Amount,Account\n";
    const rows = transactions
      .map(
        (transaction) =>
          `${transaction.date.slice(0, 10)},${transaction.type},${transaction.cat},"${transaction.desc.replaceAll("\"", "\"\"")}",${transaction.amount},${transaction.account}`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `kite-${user.username}-transactions.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    setToast("CSV exported.");
  }

  function renderDonutPaths() {
    if (!donutEntries.length) {
      return [
        <circle key="empty" cx="80" cy="80" r="55" fill="none" stroke="var(--border)" strokeWidth="20" />
      ];
    }

    const total = donutEntries.reduce((sum, [, amount]) => sum + amount, 0);
    let offset = -90;
    const parts = donutEntries.map(([category, amount], index) => {
      const pct = amount / total;
      const angle = pct * 360;
      const toRadians = (value) => (value * Math.PI) / 180;
      const x1 = 80 + 55 * Math.cos(toRadians(offset));
      const y1 = 80 + 55 * Math.sin(toRadians(offset));
      offset += angle;
      const x2 = 80 + 55 * Math.cos(toRadians(offset));
      const y2 = 80 + 55 * Math.sin(toRadians(offset));
      const largeArc = angle > 180 ? 1 : 0;

      return (
        <path
          key={category}
          d={`M80,80 L${x1},${y1} A55,55,0,${largeArc},1,${x2},${y2}Z`}
          fill={catColors[index % catColors.length]}
          opacity="0.85"
        />
      );
    });

    parts.push(<circle key="inner-circle" cx="80" cy="80" r="32" fill="var(--surface)" />);
    parts.push(
      <text
        key="inner-text"
        x="80"
        y="84"
        textAnchor="middle"
        fill="var(--text)"
        fontSize="11"
        fontFamily="Syne"
      >
        {`${donutEntries.length} cats`}
      </text>
    );

    return parts;
  }

  function changeMonth(step) {
    const next = new Date(viewYear, viewMonth + step, 1);
    setViewMonth(next.getMonth());
    setViewYear(next.getFullYear());
  }

  function updateAuthForm(field, value) {
    setAuthForm((current) => ({ ...current, [field]: value }));
  }

  function updateTxForm(field, value) {
    setTxForm((current) => ({ ...current, [field]: value }));
  }

  const uniqueCategories = [...new Set(transactions.map((transaction) => transaction.cat))];

  if (!user) {
    return (
      <div className="login-screen">
        <div className="login-box">
          <div className="login-logo">
            <div className="logo-icon">🪁</div>
            <span className="logo-text">
              Ki<span>te</span>
            </span>
          </div>

          {authMode === "login" ? (
            <div>
              <div className="login-title">Welcome Back</div>
              <form onSubmit={handleLogin}>
                {authError ? <div className="error-msg show">{authError}</div> : null}
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    className="form-input"
                    type="text"
                    value={authForm.loginUsername}
                    onChange={(event) => updateAuthForm("loginUsername", event.target.value)}
                    placeholder="Enter your username"
                    required
                  />
                </div>
                <div className="form-group auth-bottom-gap">
                  <label className="form-label">Password</label>
                  <input
                    className="form-input"
                    type="password"
                    value={authForm.loginPassword}
                    onChange={(event) => updateAuthForm("loginPassword", event.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                  Log In
                </button>
              </form>
              <div className="auth-switch">
                Do not have an account?{" "}
                <span onClick={() => setAuthMode("register")}>Sign up</span>
              </div>
            </div>
          ) : (
            <div>
              <div className="login-title">Create Account</div>
              <form onSubmit={handleRegister}>
                {authError ? <div className="error-msg show">{authError}</div> : null}
                <div className="form-group">
                  <label className="form-label">Choose a Username</label>
                  <input
                    className="form-input"
                    type="text"
                    value={authForm.registerUsername}
                    onChange={(event) => updateAuthForm("registerUsername", event.target.value)}
                    placeholder="e.g. Arjun"
                    required
                  />
                </div>
                <div className="form-group auth-bottom-gap">
                  <label className="form-label">Create a Password</label>
                  <input
                    className="form-input"
                    type="password"
                    value={authForm.registerPassword}
                    onChange={(event) => updateAuthForm("registerPassword", event.target.value)}
                    placeholder="Min 4 characters"
                    minLength={4}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                  Create Account
                </button>
              </form>
              <div className="auth-switch">
                Already have an account?{" "}
                <span onClick={() => setAuthMode("login")}>Log in</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div id="app-container">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">🪁</div>
          <div className="logo-text">
            Ki<span>te</span>
          </div>
        </div>

        <nav>
          {[
            ["dashboard", "Dashboard", "🏠"],
            ["monthly", "Monthly", "📅"],
            ["transactions", "Transactions", "💳"],
            ["budget", "Budget", "📋"]
          ].map(([key, label, icon]) => (
            <button
              key={key}
              className={`nav-item ${activePage === key ? "active" : ""}`}
              onClick={() => setActivePage(key)}
            >
              <span className="nav-icon">{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="user-pill">
            <div className="avatar">{user.username.slice(0, 2).toUpperCase()}</div>
            <div className="user-info">
              <div className="user-name">{user.username}</div>
              <div className="user-tag">Local Mongo User</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-block" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </aside>

      <main className="main">
        {loading ? <div className="loading-banner">Syncing data from MongoDB...</div> : null}

        {activePage === "dashboard" ? (
          <div className="page active">
            <div className="topbar">
              <div>
                <div className="page-title">Dashboard</div>
                <div className="page-sub">Your money flow at a glance</div>
              </div>
              <button className="btn btn-primary" onClick={() => openTxModal()}>
                + Add Transaction
              </button>
            </div>

            <div className="stats-grid">
              <div className="stat-card blue">
                <div className="stat-label">Current Balance</div>
                <div className="stat-value">{fmt(totals.balance)}</div>
              </div>
              <div className="stat-card green">
                <div className="stat-label">This Month Income</div>
                <div className="stat-value">{fmt(totals.income)}</div>
              </div>
              <div className="stat-card red">
                <div className="stat-label">This Month Expense</div>
                <div className="stat-value">{fmt(totals.expense)}</div>
              </div>
              <div className="stat-card orange">
                <div className="stat-label">This Month Savings</div>
                <div className="stat-value savings-value">{fmt(totals.savings)}</div>
              </div>
            </div>

            <div className="section-grid">
              <div className="card">
                <div className="card-title">Income vs Expense</div>
                <div className="bar-chart">
                  {chartData.map((item) => (
                    <div className="bar-group" key={item.label}>
                      <div className="bar-wrap">
                        <div
                          className="bar bar-income"
                          style={{ height: `${(item.income / chartMax) * 100}%` }}
                          title={`Income: ${fmt(item.income)}`}
                        />
                        <div
                          className="bar bar-expense"
                          style={{ height: `${(item.expense / chartMax) * 100}%` }}
                          title={`Expense: ${fmt(item.expense)}`}
                        />
                      </div>
                      <div className="bar-label">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="card-title">Expense Split</div>
                <div className="donut-wrap">
                  <svg className="donut-svg" viewBox="0 0 160 160">
                    {renderDonutPaths()}
                  </svg>
                  <div className="donut-legend">
                    {donutEntries.length ? (
                      donutEntries.slice(0, 5).map(([category, amount], index) => {
                        const total = donutEntries.reduce((sum, [, value]) => sum + value, 0) || 1;
                        return (
                          <div className="legend-item" key={category}>
                            <div
                              className="legend-dot"
                              style={{ background: catColors[index % catColors.length] }}
                            />
                            <span className="legend-label">
                              {catEmoji[category] || "💰"} {category}
                            </span>
                            <span className="legend-pct">{((amount / total) * 100).toFixed(0)}%</span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="empty-text muted-center">No expenses this month</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Recent Transactions</div>
              <div className="tx-list">
                {recentTransactions.length ? (
                  recentTransactions.map((transaction) => (
                    <TransactionRow
                      key={transaction._id}
                      transaction={transaction}
                      onEdit={() => openTxModal(transaction)}
                      onDelete={() => deleteTransaction(transaction._id)}
                    />
                  ))
                ) : (
                  <EmptyState icon="🧾" text="No transactions yet. Add one!" />
                )}
              </div>
            </div>
          </div>
        ) : null}

        {activePage === "monthly" ? (
          <div className="page active">
            <div className="topbar">
              <div>
                <div className="page-title">Monthly View</div>
                <div className="page-sub">Track your income and expenses month by month</div>
              </div>
              <div className="month-nav">
                <button onClick={() => changeMonth(-1)}>‹</button>
                <div className="month-display">{`${monthNames[viewMonth]} ${viewYear}`}</div>
                <button onClick={() => changeMonth(1)}>›</button>
              </div>
            </div>

            <div className="monthly-stats">
              <div className="stat-card blue">
                <div className="stat-label">Income</div>
                <div className="stat-value">{fmt(monthlyStats.income)}</div>
              </div>
              <div className="stat-card red">
                <div className="stat-label">Expense</div>
                <div className="stat-value">{fmt(monthlyStats.expense)}</div>
              </div>
              <div className="stat-card green">
                <div className="stat-label">Saved</div>
                <div className="stat-value">{fmt(monthlyStats.saved)}</div>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Transactions this Month</div>
              <div className="full-tx-list">
                {monthlyTransactions.length ? (
                  monthlyTransactions.map((transaction) => (
                    <TransactionRow
                      key={transaction._id}
                      transaction={transaction}
                      onEdit={() => openTxModal(transaction)}
                      onDelete={() => deleteTransaction(transaction._id)}
                    />
                  ))
                ) : (
                  <EmptyState icon="📭" text="No transactions for this month." />
                )}
              </div>
            </div>
          </div>
        ) : null}

        {activePage === "transactions" ? (
          <div className="page active">
            <div className="topbar">
              <div>
                <div className="page-title">Transactions</div>
                <div className="page-sub">All your income and expense entries</div>
              </div>
              <button className="btn btn-primary" onClick={() => openTxModal()}>
                + Add Transaction
              </button>
            </div>

            <div className="card filter-card">
              <input
                className="form-input inline-input"
                type="text"
                placeholder="Search..."
                value={txFilters.search}
                onChange={(event) => setTxFilters((current) => ({ ...current, search: event.target.value }))}
              />
              <select
                className="form-select inline-input"
                value={txFilters.type}
                onChange={(event) => setTxFilters((current) => ({ ...current, type: event.target.value }))}
              >
                <option value="">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <select
                className="form-select inline-input"
                value={txFilters.category}
                onChange={(event) => setTxFilters((current) => ({ ...current, category: event.target.value }))}
              >
                <option value="">All Categories</option>
                {uniqueCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <button className="btn btn-ghost export-btn" onClick={exportCsv}>
                Export CSV
              </button>
            </div>

            <div className="card">
              <div className="full-tx-list">
                {filteredTransactions.length ? (
                  filteredTransactions.map((transaction) => (
                    <TransactionRow
                      key={transaction._id}
                      transaction={transaction}
                      onEdit={() => openTxModal(transaction)}
                      onDelete={() => deleteTransaction(transaction._id)}
                    />
                  ))
                ) : (
                  <EmptyState icon="🔍" text="No transactions match." />
                )}
              </div>
            </div>
          </div>
        ) : null}

        {activePage === "budget" ? (
          <div className="page active">
            <div className="topbar">
              <div>
                <div className="page-title">Budget</div>
                <div className="page-sub">Set and track your category budgets</div>
              </div>
              <button className="btn btn-primary" onClick={() => openBudgetModal()}>
                + Set Budget
              </button>
            </div>

            <div className="budget-grid">
              {budgetCards.length ? (
                budgetCards.map((item) => (
                  <div className="budget-card" key={item.category}>
                    <div className="budget-card-top">
                      <div className="budget-cat-name">
                        <div className="budget-icon">{catEmoji[item.category] || "💰"}</div>
                        {item.category}
                      </div>
                      <span className={`budget-status ${item.status[0]}`}>{item.status[1]}</span>
                    </div>
                    <div className="budget-amounts">
                      Spent: <strong style={{ color: item.color }}>{fmt(item.spent)}</strong> / {fmt(item.limit)}
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${item.pct}%`, background: item.color }}
                      />
                    </div>
                    <div className="budget-actions">
                      <button className="btn btn-ghost small-btn" onClick={() => openBudgetModal(item.category)}>
                        Edit
                      </button>
                      <button className="btn btn-danger small-btn" onClick={() => deleteBudget(item.category)}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty budget-empty">
                  <div className="empty-icon">📋</div>
                  <div className="empty-text">No budgets set yet.</div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </main>

      <div className={`modal-overlay ${txModalOpen ? "open" : ""}`}>
        <div className="modal">
          <div className="modal-title">{editingTxId ? "Edit Transaction" : "Add Transaction"}</div>
          <div className="form-group">
            <label className="form-label">Type</label>
            <div className="type-toggle">
              <button
                className={`type-btn ${txForm.type === "income" ? "active-income" : ""}`}
                onClick={() => updateTxForm("type", "income")}
                type="button"
              >
                Income
              </button>
              <button
                className={`type-btn ${txForm.type === "expense" ? "active-expense" : ""}`}
                onClick={() => updateTxForm("type", "expense")}
                type="button"
              >
                Expense
              </button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Amount (INR)</label>
            <input
              className="form-input"
              type="number"
              min="0"
              value={txForm.amount}
              onChange={(event) => updateTxForm("amount", event.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              className="form-input"
              type="text"
              value={txForm.desc}
              onChange={(event) => updateTxForm("desc", event.target.value)}
              placeholder="e.g. Grocery shopping"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={txForm.cat}
              onChange={(event) => updateTxForm("cat", event.target.value)}
            >
              {currentCategories.map((category) => (
                <option key={category} value={category}>
                  {catEmoji[category]} {category}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              className="form-input"
              type="date"
              value={txForm.date}
              onChange={(event) => updateTxForm("date", event.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Account</label>
            <select
              className="form-select"
              value={txForm.account}
              onChange={(event) => updateTxForm("account", event.target.value)}
            >
              <option value="cash">Cash</option>
              <option value="bank">Bank</option>
              <option value="credit">Credit Card</option>
            </select>
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={closeTxModal} type="button">
              Cancel
            </button>
            <button className="btn btn-primary" onClick={saveTransaction} type="button">
              Save
            </button>
          </div>
        </div>
      </div>

      <div className={`modal-overlay ${budgetModalOpen ? "open" : ""}`}>
        <div className="modal">
          <div className="modal-title">Set Budget</div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={budgetForm.cat}
              onChange={(event) => setBudgetForm((current) => ({ ...current, cat: event.target.value }))}
            >
              {expenseCategories.map((category) => (
                <option key={category} value={category}>
                  {catEmoji[category]} {category}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Monthly Limit (INR)</label>
            <input
              className="form-input"
              type="number"
              min="0"
              value={budgetForm.limit}
              onChange={(event) => setBudgetForm((current) => ({ ...current, limit: event.target.value }))}
              placeholder="e.g. 5000"
            />
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={closeBudgetModal} type="button">
              Cancel
            </button>
            <button className="btn btn-primary" onClick={saveBudget} type="button">
              Save Budget
            </button>
          </div>
        </div>
      </div>

      <div className={`toast ${toast ? "show" : ""}`}>
        <span>{toast}</span>
      </div>
    </div>
  );
}

function EmptyState({ icon, text }) {
  return (
    <div className="empty">
      <div className="empty-icon">{icon}</div>
      <div className="empty-text">{text}</div>
    </div>
  );
}

function TransactionRow({ transaction, onEdit, onDelete }) {
  const color = transaction.type === "income" ? "rgba(200,240,101,0.12)" : "rgba(240,101,101,0.12)";

  return (
    <div className="tx-item">
      <div className="tx-icon" style={{ background: color }}>
        {catEmoji[transaction.cat] || "💰"}
      </div>
      <div className="tx-info">
        <div className="tx-name">{transaction.desc}</div>
        <div className="tx-date">
          {transaction.cat} ·{" "}
          {new Date(transaction.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
          })}
        </div>
      </div>
      <div className={`tx-amount ${transaction.type === "income" ? "credit" : "debit"}`}>
        {transaction.type === "income" ? "+" : "-"}
        {fmt(transaction.amount)}
      </div>
      <div className="tx-actions">
        <button className="icon-btn" onClick={onEdit} type="button">
          ✏️
        </button>
        <button className="icon-btn" onClick={onDelete} type="button">
          🗑️
        </button>
      </div>
    </div>
  );
}

export default App;
