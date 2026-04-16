let currentUser = null;
let transactions = [];
let budgets = {};
let currentType = 'expense';
let editId = null;

let viewMonth = new Date().getMonth();
let viewYear = new Date().getFullYear();

const catEmoji = {
  Food:'🍔', Transport:'🚗', Housing:'🏠', Shopping:'🛍️',
  Health:'💊', Entertainment:'🎬', Education:'📚', Utilities:'💡',
  Salary:'💼', Freelance:'💻', Investment:'📈', Gift:'🎁', Other:'💰'
};

const catColors = ['#c8f065','#f06565','#65c8f0','#f0b865','#b065f0','#65f0b0','#f065b0','#65a3f0','#f0e065','#a3f065','#f0a365'];

function toggleAuthView(view) {
  document.getElementById('login-error').style.display = 'none';
  document.getElementById('register-error').style.display = 'none';
  
  if (view === 'register') {
    document.getElementById('view-login').classList.add('hidden');
    document.getElementById('view-register').classList.remove('hidden');
  } else {
    document.getElementById('view-register').classList.add('hidden');
    document.getElementById('view-login').classList.remove('hidden');
  }
}

function checkAuth() {
  currentUser = localStorage.getItem('kite_currentUser');
  if (currentUser) {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app-container').style.display = 'flex';
    
    document.getElementById('display-username').textContent = currentUser;
    document.getElementById('display-avatar').textContent = currentUser.substring(0, 2).toUpperCase();

    transactions = JSON.parse(localStorage.getItem(`kite_tx_${currentUser}`) || '[]');
    budgets = JSON.parse(localStorage.getItem(`kite_budgets_${currentUser}`) || '{}');

    switchPage('dashboard');
  } else {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('app-container').style.display = 'none';
    toggleAuthView('login');
  }
}

function handleRegister(e) {
  e.preventDefault();
  const username = document.getElementById('reg-username').value.trim();
  const password = document.getElementById('reg-password').value;
  const errorDiv = document.getElementById('register-error');
  
  if (!username || !password) return;

  const usersDB = JSON.parse(localStorage.getItem('kite_users_db') || '{}');

  if (usersDB[username]) {
    errorDiv.textContent = "Username is already taken!";
    errorDiv.style.display = 'block';
    return;
  }

  usersDB[username] = { password: password };
  localStorage.setItem('kite_users_db', JSON.stringify(usersDB));
  
  localStorage.setItem('kite_currentUser', username);
  document.getElementById('register-form').reset();
  checkAuth();
}

function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const errorDiv = document.getElementById('login-error');
  
  if (!username || !password) return;

  const usersDB = JSON.parse(localStorage.getItem('kite_users_db') || '{}');

  if (!usersDB[username]) {
    errorDiv.textContent = "Account not found. Please sign up.";
    errorDiv.style.display = 'block';
    return;
  }

  if (usersDB[username].password !== password) {
    errorDiv.textContent = "Incorrect password. Please try again.";
    errorDiv.style.display = 'block';
    return;
  }
  
  localStorage.setItem('kite_currentUser', username);
  document.getElementById('login-form').reset();
  checkAuth();
}

function handleLogout() {
  localStorage.removeItem('kite_currentUser');
  checkAuth();
}

function save() {
  if (!currentUser) return;
  localStorage.setItem(`kite_tx_${currentUser}`, JSON.stringify(transactions));
  localStorage.setItem(`kite_budgets_${currentUser}`, JSON.stringify(budgets));
}

function switchPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  
  const page = document.getElementById('page-' + id);
  const navBtn = document.querySelector(`[data-page="${id}"]`);
  
  if (page) page.classList.add('active');
  if (navBtn) navBtn.classList.add('active');
  
  if (id === 'dashboard') renderDashboard();
  if (id === 'monthly') renderMonthly();
  if (id === 'transactions') renderAllTx();
  if (id === 'budget') renderBudget();
}

document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => switchPage(btn.dataset.page));
});

const fmt = n => '₹' + Number(n).toLocaleString('en-IN', {minimumFractionDigits:0, maximumFractionDigits:0});

function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

function openModal(id) {
  editId = id || null;
  document.getElementById('tx-modal').classList.add('open');
  document.getElementById('tx-date').value = new Date().toISOString().slice(0,10);

  if (editId !== null) {
    const tx = transactions.find(t => t.id === editId);
    document.getElementById('modal-tx-title').textContent = 'Edit Transaction';
    document.getElementById('tx-amount').value = tx.amount;
    document.getElementById('tx-desc').value = tx.desc;
    document.getElementById('tx-cat').value = tx.cat;
    document.getElementById('tx-date').value = tx.date;
    document.getElementById('tx-account').value = tx.account;
    setType(tx.type);
  } else {
    document.getElementById('modal-tx-title').textContent = 'Add Transaction';
    document.getElementById('tx-amount').value = '';
    document.getElementById('tx-desc').value = '';
    setType('expense');
  }
}

function closeModal() { document.getElementById('tx-modal').classList.remove('open'); editId = null; }

function setType(t) {
  currentType = t;
  document.getElementById('btn-income').className = 'type-btn' + (t==='income' ? ' active-income' : '');
  document.getElementById('btn-expense').className = 'type-btn' + (t==='expense' ? ' active-expense' : '');
}

function saveTx() {
  const amount = parseFloat(document.getElementById('tx-amount').value);
  const desc = document.getElementById('tx-desc').value.trim();
  const cat = document.getElementById('tx-cat').value;
  const date = document.getElementById('tx-date').value;
  const account = document.getElementById('tx-account').value;

  if (!amount || amount <= 0) { alert('Please enter a valid amount.'); return; }
  if (!desc) { alert('Please add a description.'); return; }
  if (!date) { alert('Please pick a date.'); return; }

  if (editId !== null) {
    const idx = transactions.findIndex(t => t.id === editId);
    transactions[idx] = { ...transactions[idx], amount, desc, cat, date, account, type: currentType };
    showToast('Transaction updated!');
  } else {
    transactions.push({ id: Date.now(), amount, desc, cat, date, account, type: currentType });
    showToast('Transaction added!');
  }

  save();
  closeModal();
  renderDashboard();
  renderAllTx();
  renderBudget();
}

function deleteTx(id) {
  if (!confirm('Delete this transaction?')) return;
  transactions = transactions.filter(t => t.id !== id);
  save();
  renderDashboard();
  renderAllTx();
  renderMonthly();
  renderBudget();
  showToast('Transaction deleted.');
}

function txHTML(tx, showDelete=true) {
  const color = tx.type === 'income' ? 'rgba(200,240,101,0.12)' : 'rgba(240,101,101,0.12)';
  return `
    <div class="tx-item">
      <div class="tx-icon" style="background:${color}">${catEmoji[tx.cat] || '💰'}</div>
      <div class="tx-info">
        <div class="tx-name">${tx.desc}</div>
        <div class="tx-date">${tx.cat} · ${new Date(tx.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</div>
      </div>
      <div class="tx-amount ${tx.type === 'income' ? 'credit' : 'debit'}">
        ${tx.type==='income' ? '+' : '-'}${fmt(tx.amount)}
      </div>
      ${showDelete ? `
        <button onclick="openModal(${tx.id})" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:15px;padding:4px 6px;">✏️</button>
        <button onclick="deleteTx(${tx.id})" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:15px;padding:4px 6px;">🗑️</button>
      ` : ''}
    </div>
  `;
}

function renderDashboard() {
  const now = new Date();
  const thisMonth = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const income = thisMonth.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
  const expense = thisMonth.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
  const balance = transactions.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0) -
                  transactions.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);

  document.getElementById('stat-balance').textContent = fmt(balance);
  document.getElementById('stat-income').textContent = fmt(income);
  document.getElementById('stat-expense').textContent = fmt(expense);
  document.getElementById('stat-savings').textContent = fmt(income - expense);

  const net = income - expense;
  const s = document.getElementById('stat-savings');
  s.style.color = net >= 0 ? 'var(--accent)' : 'var(--accent2)';

  const recent = [...transactions].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0,5);
  const rEl = document.getElementById('recent-tx-list');
  rEl.innerHTML = recent.length ? recent.map(t => txHTML(t)).join('') :
    '<div class="empty"><div class="empty-icon">🧾</div><div class="empty-text">No transactions yet. Add one!</div></div>';

  renderBarChart();
  renderDonut(thisMonth);
}

function renderBarChart() {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ label: d.toLocaleString('default',{month:'short'}), month: d.getMonth(), year: d.getFullYear() });
  }

  const data = months.map(m => {
    const txs = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === m.month && d.getFullYear() === m.year;
    });
    return {
      label: m.label,
      income: txs.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0),
      expense: txs.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0),
    };
  });

  const max = Math.max(...data.flatMap(d=>[d.income, d.expense]), 1);

  document.getElementById('bar-chart').innerHTML = data.map(d => `
    <div class="bar-group">
      <div class="bar-wrap">
        <div class="bar bar-income" style="height:${(d.income/max)*100}%" title="Income: ${fmt(d.income)}"></div>
        <div class="bar bar-expense" style="height:${(d.expense/max)*100}%" title="Expense: ${fmt(d.expense)}"></div>
      </div>
      <div class="bar-label">${d.label}</div>
    </div>
  `).join('');
}

function renderDonut(txs) {
  const expTx = txs.filter(t=>t.type==='expense');
  const cats = {};
  expTx.forEach(t => { cats[t.cat] = (cats[t.cat]||0) + t.amount; });
  const entries = Object.entries(cats).sort((a,b)=>b[1]-a[1]);
  const total = entries.reduce((s,[,v])=>s+v,0) || 1;

  const svg = document.getElementById('donut-svg');
  const legend = document.getElementById('donut-legend');

  if (!entries.length) {
    svg.innerHTML = `<circle cx="80" cy="80" r="55" fill="none" stroke="var(--border)" stroke-width="20"/>`;
    legend.innerHTML = `<div style="color:var(--muted);font-size:13px;text-align:center;">No expenses this month</div>`;
    return;
  }

  let offset = -90, paths = '';
  entries.forEach(([cat, amt], i) => {
    const pct = amt / total;
    const angle = pct * 360;
    const rad = (a) => (a * Math.PI) / 180;
    const x1 = 80 + 55 * Math.cos(rad(offset));
    const y1 = 80 + 55 * Math.sin(rad(offset));
    offset += angle;
    const x2 = 80 + 55 * Math.cos(rad(offset));
    const y2 = 80 + 55 * Math.sin(rad(offset));
    const large = angle > 180 ? 1 : 0;
    const color = catColors[i % catColors.length];
    paths += `<path d="M80,80 L${x1},${y1} A55,55,0,${large},1,${x2},${y2}Z" fill="${color}" opacity="0.85"/>`;
  });
  paths += `<circle cx="80" cy="80" r="32" fill="var(--surface)"/>`;
  paths += `<text x="80" y="84" text-anchor="middle" fill="var(--text)" font-size="11" font-family="Syne">${entries.length} cats</text>`;
  svg.innerHTML = paths;

  legend.innerHTML = entries.slice(0,5).map(([cat,amt],i) => `
    <div class="legend-item">
      <div class="legend-dot" style="background:${catColors[i % catColors.length]}"></div>
      <span class="legend-label">${catEmoji[cat]||'💰'} ${cat}</span>
      <span class="legend-pct">${((amt/total)*100).toFixed(0)}%</span>
    </div>
  `).join('');
}

const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function renderMonthly() {
  document.getElementById('month-display').textContent = `${monthNames[viewMonth]} ${viewYear}`;

  const txs = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === viewMonth && d.getFullYear() === viewYear;
  }).sort((a,b) => new Date(b.date) - new Date(a.date));

  const income = txs.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
  const expense = txs.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);

  document.getElementById('m-income').textContent = fmt(income);
  document.getElementById('m-expense').textContent = fmt(expense);
  document.getElementById('m-saved').textContent = fmt(income - expense);

  const el = document.getElementById('monthly-tx-list');
  el.innerHTML = txs.length ? txs.map(t => txHTML(t)).join('') :
    '<div class="empty"><div class="empty-icon">📭</div><div class="empty-text">No transactions for this month.</div></div>';
}

function prevMonth() {
  viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; }
  renderMonthly();
}

function nextMonth() {
  viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; }
  renderMonthly();
}

function renderAllTx() {
  const search = document.getElementById('tx-search').value.toLowerCase();
  const fType = document.getElementById('tx-filter-type').value;
  const fCat = document.getElementById('tx-filter-cat').value;

  const cats = [...new Set(transactions.map(t=>t.cat))];
  const sel = document.getElementById('tx-filter-cat');
  const cur = sel.value;
  sel.innerHTML = '<option value="">All Categories</option>' + cats.map(c=>`<option value="${c}" ${c===cur?'selected':''}>${catEmoji[c]||''} ${c}</option>`).join('');

  let filtered = [...transactions].sort((a,b)=>new Date(b.date)-new Date(a.date));
  if (search) filtered = filtered.filter(t => t.desc.toLowerCase().includes(search) || t.cat.toLowerCase().includes(search));
  if (fType) filtered = filtered.filter(t => t.type === fType);
  if (fCat) filtered = filtered.filter(t => t.cat === fCat);

  const el = document.getElementById('all-tx-list');
  el.innerHTML = filtered.length ? filtered.map(t => txHTML(t)).join('') :
    '<div class="empty"><div class="empty-icon">🔍</div><div class="empty-text">No transactions match.</div></div>';
}

function openBudgetModal() { document.getElementById('budget-modal').classList.add('open'); }
function closeBudgetModal() { document.getElementById('budget-modal').classList.remove('open'); }

function saveBudget() {
  const cat = document.getElementById('budget-cat').value;
  const limit = parseFloat(document.getElementById('budget-limit').value);
  if (!limit || limit <= 0) { alert('Enter a valid budget limit.'); return; }
  budgets[cat] = limit;
  save();
  closeBudgetModal();
  renderBudget();
  showToast('Budget set for ' + cat + '!');
}

function renderBudget() {
  const now = new Date();
  const thisMonth = transactions.filter(t => {
    const d = new Date(t.date);
    return t.type === 'expense' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const spent = {};
  thisMonth.forEach(t => { spent[t.cat] = (spent[t.cat]||0) + t.amount; });

  const entries = Object.entries(budgets);
  const el = document.getElementById('budget-grid');

  if (!entries.length) {
    el.innerHTML = '<div class="empty" style="grid-column:1/-1"><div class="empty-icon">📋</div><div class="empty-text">No budgets set yet.</div></div>';
    return;
  }

  el.innerHTML = entries.map(([cat, limit]) => {
    const s = spent[cat] || 0;
    const pct = Math.min((s/limit)*100, 100);
    const status = pct >= 100 ? ['over','🔴 Over Budget'] : pct >= 80 ? ['warn','🟡 Near Limit'] : ['ok','🟢 On Track'];
    const color = pct >= 100 ? 'var(--accent2)' : pct >= 80 ? 'var(--accent4)' : 'var(--accent)';
    return `
      <div class="budget-card">
        <div class="budget-card-top">
          <div class="budget-cat-name">
            <div class="budget-icon" style="background:rgba(255,255,255,0.05)">${catEmoji[cat]||'💰'}</div>
            ${cat}
          </div>
          <span class="budget-status ${status[0]}">${status[1]}</span>
        </div>
        <div class="budget-amounts">Spent: <strong style="color:${color}">${fmt(s)}</strong> / ${fmt(limit)}</div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${pct}%;background:${color}"></div>
        </div>
        <div style="margin-top:10px;display:flex;gap:8px;">
          <button class="btn btn-ghost" style="padding:6px 12px;font-size:12px;" onclick="editBudget('${cat}')">Edit</button>
          <button class="btn btn-danger" style="padding:6px 12px;font-size:12px;" onclick="deleteBudget('${cat}')">Remove</button>
        </div>
      </div>
    `;
  }).join('');
}

function editBudget(cat) {
  document.getElementById('budget-cat').value = cat;
  document.getElementById('budget-limit').value = budgets[cat];
  openBudgetModal();
}

function deleteBudget(cat) {
  delete budgets[cat];
  save();
  renderBudget();
  showToast('Budget removed.');
}

function exportCSV() {
  if (!transactions.length) { alert('No transactions to export.'); return; }
  const header = 'Date,Type,Category,Description,Amount,Account\n';
  const rows = transactions.map(t =>
    `${t.date},${t.type},${t.cat},"${t.desc}",${t.amount},${t.account}`
  ).join('\n');
  const blob = new Blob([header + rows], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `kite-${currentUser}-transactions.csv`;
  a.click();
  showToast('CSV exported!');
}

document.addEventListener('DOMContentLoaded', checkAuth);