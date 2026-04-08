var state = {
  salaryINR: 0,
  expensesINR: [],    
  currency: 'INR',
};

var pieChart      = null;
var categoryChart = null;
var isConverting  = false;
var editingId     = null;


var ratesCache = { INR: 1 };

var CURRENCY_SYMBOLS = { INR: '\u20B9', USD: '\u0024', EUR: '\u20AC', GBP: '\u00A3' };


var salaryInput     = document.getElementById('salaryInput');
var setSalaryBtn    = document.getElementById('setSalaryBtn');
var currencySelect  = document.getElementById('currencySelect');
var expenseName     = document.getElementById('expenseName');
var expenseCategory = document.getElementById('expenseCategory');
var expenseAmount   = document.getElementById('expenseAmount');
var expenseDate     = document.getElementById('expenseDate');
var addExpenseBtn   = document.getElementById('addExpenseBtn');
var expenseError    = document.getElementById('expenseError');
var expenseList     = document.getElementById('expenseList');
var displaySalary   = document.getElementById('displaySalary');
var displayExpenses = document.getElementById('displayExpenses');
var displayBalance  = document.getElementById('displayBalance');
var budgetAlert     = document.getElementById('budgetAlert');
var downloadPdfBtn  = document.getElementById('downloadPdfBtn');
var clearAllBtn     = document.getElementById('clearAllBtn');
var editModal       = document.getElementById('editModal');
var editName        = document.getElementById('editName');
var editCategory    = document.getElementById('editCategory');
var editAmount      = document.getElementById('editAmount');
var editDate        = document.getElementById('editDate');
var saveEditBtn     = document.getElementById('saveEditBtn');
var cancelEditBtn   = document.getElementById('cancelEditBtn');


function saveState() {
  localStorage.setItem('cashflow_state', JSON.stringify(state));
}

function loadState() {
  try {
    var saved = localStorage.getItem('cashflow_state');
    if (saved) {
      var parsed = JSON.parse(saved);
     
      if (parsed.salary !== undefined || parsed.expenses !== undefined) {
        state.salaryINR   = parsed.salary || 0;
        state.expensesINR = (parsed.expenses || []).map(function(e) {
          return { id: e.id, name: e.name, category: e.category || 'Other', date: e.date || '', amountINR: e.amount || 0 };
        });
        state.currency = parsed.currency || 'INR';
      } else {
        state.salaryINR   = parsed.salaryINR   || 0;
        state.expensesINR = parsed.expensesINR || [];
        state.currency    = parsed.currency    || 'INR';
      }
      currencySelect.value = state.currency;
    }
  } catch (e) {
    console.warn('Failed to load state, resetting.', e);
    localStorage.removeItem('cashflow_state');
  }
}


function fromINR(amountINR) {
  var rate = ratesCache[state.currency] || 1;
  return amountINR * rate;
}

async function fetchRates() {
  if (Object.keys(ratesCache).length > 1) return; // already fetched
  try {
    var res  = await fetch('https://api.frankfurter.app/latest?from=INR&to=USD,EUR,GBP');
    var data = await res.json();
    ratesCache.USD = data.rates.USD;
    ratesCache.EUR = data.rates.EUR;
    ratesCache.GBP = data.rates.GBP;
  } catch (e) {

    ratesCache = { INR: 1, USD: 0.01056, EUR: 0.0092, GBP: 0.0079 };
    console.warn('Using fallback rates:', ratesCache);
  }
}

function fmt(amountINR) {
  var sym = CURRENCY_SYMBOLS[state.currency] || state.currency;
  return sym + Number(fromINR(amountINR)).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function fmtExpense(amountINR) {
  var sym = CURRENCY_SYMBOLS[state.currency] || state.currency;
  return '-' + sym + Number(fromINR(amountINR)).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}


function fmtDate(d) {
  if (!d) return 'Not set';
  var parts = d.split('-');
  if (parts.length !== 3) return d;
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return parts[2] + ' ' + months[parseInt(parts[1], 10) - 1] + ' ' + parts[0];
}
function render() {
  
  if (!Array.isArray(state.expensesINR)) state.expensesINR = [];

  var totalINR   = state.expensesINR.reduce(function(s, e) { return s + e.amountINR; }, 0);
  var balanceINR = state.salaryINR - totalINR;

  displaySalary.textContent   = fmt(state.salaryINR);
  displayExpenses.textContent = fmtExpense(totalINR);
  displayBalance.textContent  = fmt(balanceINR);

  var showAlert = state.salaryINR > 0 && balanceINR < state.salaryINR * 0.1;
  budgetAlert.classList.toggle('hidden', !showAlert);
  displayBalance.classList.toggle('balance-danger', showAlert);
  displayBalance.classList.toggle('text-emerald-400', !showAlert);

  renderExpenseList();
  renderChart(totalINR, balanceINR);
  saveState();
  if (window.lucide) lucide.createIcons();
}


var CAT_COLORS = {
  Food:          'bg-orange-900 text-orange-300',
  Rent:          'bg-blue-900 text-blue-300',
  Travel:        'bg-cyan-900 text-cyan-300',
  Shopping:      'bg-pink-900 text-pink-300',
  Health:        'bg-green-900 text-green-300',
  Education:     'bg-violet-900 text-violet-300',
  Entertainment: 'bg-yellow-900 text-yellow-300',
  Other:         'bg-slate-700 text-slate-300',
};

function renderExpenseList() {
  expenseList.innerHTML = '';
  if (state.expensesINR.length === 0) {
    expenseList.innerHTML = '<li class="text-slate-500 italic text-sm text-center py-2">No expenses yet.</li>';
    return;
  }
  state.expensesINR.forEach(function(exp) {
    var li = document.createElement('li');
    li.className = 'flex justify-between items-center py-2.5 border-b border-slate-700 last:border-0 gap-2';
    var cat      = exp.category || 'Other';
    var catClass = CAT_COLORS[cat] || CAT_COLORS['Other'];
    var dateStr  = exp.date ? '<span class="text-slate-500 text-xs ml-1">' + fmtDate(exp.date) + '</span>' : '';
    li.innerHTML =
      '<div class="flex-1 min-w-0">' +
        '<span class="text-sm text-slate-200">' + exp.name + '</span>' +
        '<span class="ml-2 text-xs px-1.5 py-0.5 rounded ' + catClass + '">' + cat + '</span>' +
        dateStr +
      '</div>' +
      '<span class="font-semibold text-red-400 text-sm mx-2 shrink-0">' + fmtExpense(exp.amountINR) + '</span>' +
      '<button class="edit-btn text-sky-400 border border-sky-500 hover:bg-sky-500 hover:text-white rounded-md px-2 py-1 text-xs transition-colors shrink-0" data-id="' + exp.id + '" title="Edit expense">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' +
      '</button>' +
      '<button class="delete-btn text-red-400 border border-red-500 hover:bg-red-500 hover:text-white rounded-md px-2 py-1 text-xs transition-colors shrink-0" data-id="' + exp.id + '" title="Delete expense">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>' +
      '</button>';
    expenseList.appendChild(li);
  });
}

function renderChart(totalINR, balanceINR) {
  var ctx = document.getElementById('pieChart').getContext('2d');
  var remaining = balanceINR > 0 ? fromINR(balanceINR) : 0;
  var expenses  = fromINR(totalINR);
  var dataValues = (state.salaryINR === 0 && totalINR === 0) ? [1, 0] : [remaining, expenses];

  if (pieChart) {
    pieChart.data.datasets[0].data = dataValues;
    pieChart.update();
  } else {
    pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Remaining Balance', 'Total Expenses'],
        datasets: [{ data: dataValues, backgroundColor: ['#38bdf8', '#ef4444'], borderColor: ['#0f172a', '#0f172a'], borderWidth: 3 }]
      },
      options: { plugins: { legend: { labels: { color: '#e2e8f0', font: { size: 12 } } } } }
    });
  }

  
  var catCtx = document.getElementById('categoryChart').getContext('2d');
  var catMap = {};
  state.expensesINR.forEach(function(e) {
    var c = e.category || 'Other';
    catMap[c] = (catMap[c] || 0) + fromINR(e.amountINR);
  });
  var catLabels = Object.keys(catMap);
  var catData   = catLabels.map(function(k) { return catMap[k]; });
  var palette   = ['#f87171','#fb923c','#fbbf24','#34d399','#38bdf8','#818cf8','#e879f9','#94a3b8'];

  if (categoryChart) {
    categoryChart.data.labels = catLabels.length ? catLabels : ['No data'];
    categoryChart.data.datasets[0].data = catData.length ? catData : [1];
    categoryChart.update();
  } else {
    categoryChart = new Chart(catCtx, {
      type: 'doughnut',
      data: {
        labels: catLabels.length ? catLabels : ['No data'],
        datasets: [{ data: catData.length ? catData : [1], backgroundColor: palette, borderColor: '#0f172a', borderWidth: 3 }]
      },
      options: { plugins: { legend: { labels: { color: '#e2e8f0', font: { size: 11 } } } } }
    });
  }
}


setSalaryBtn.addEventListener('click', function() {
  var raw        = salaryInput.value.trim();
  var val        = Number(raw);
  var salaryError = document.getElementById('salaryError');

  if (raw === '' || isNaN(val) || val <= 0) {
    salaryInput.style.borderColor = '#ef4444';
    salaryError.textContent = raw === '' ? 'Please enter your salary.' : 'Salary must be a positive number.';
    salaryError.classList.remove('hidden');
    return;
  }

  salaryInput.style.borderColor = '';
  salaryError.classList.add('hidden');
  var rate = ratesCache[state.currency] || 1;
  state.salaryINR = +(val / rate).toFixed(6);
  salaryInput.value = '';
  render();
});

salaryInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') setSalaryBtn.click();
});


addExpenseBtn.addEventListener('click', function() {
  var name   = expenseName.value.trim();
  var amount = Number(expenseAmount.value);
  var cat    = expenseCategory.value;

  
  expenseName.style.borderColor     = '';
  expenseCategory.style.borderColor = '';
  expenseAmount.style.borderColor   = '';
  expenseDate.style.borderColor     = '';

  var errors = [];
  if (!name)                        { errors.push('name');     expenseName.style.borderColor     = '#ef4444'; }
  if (!cat)                         { errors.push('category'); expenseCategory.style.borderColor = '#ef4444'; }
  if (isNaN(amount) || amount <= 0) { errors.push('amount');   expenseAmount.style.borderColor   = '#ef4444'; }
  var date = expenseDate.value;
  if (!date)                        { errors.push('date');     expenseDate.style.borderColor     = '#ef4444'; }

  if (errors.length) {
    var msgs = { name: 'expense name', category: 'category', amount: 'valid amount', date: 'date' };
    expenseError.textContent = 'Please enter: ' + errors.map(function(e) { return msgs[e]; }).join(', ') + '.';
    expenseError.classList.remove('hidden');
    return;
  }

  expenseError.classList.add('hidden');
  expenseDate.style.borderColor = '';
  var rate = ratesCache[state.currency] || 1;
  state.expensesINR.push({
    id: Date.now(),
    name: name,
    category: cat,
    date: date,
    amountINR: +(amount / rate).toFixed(6),
  });
  expenseName.value     = '';
  expenseCategory.value = '';
  expenseAmount.value   = '';
  expenseDate.value     = '';
  render();
});

expenseAmount.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') addExpenseBtn.click();
});


expenseList.addEventListener('click', function(e) {
  var btn = e.target.closest('.delete-btn');
  if (btn) {
    state.expensesINR = state.expensesINR.filter(function(exp) {
      return exp.id !== Number(btn.dataset.id);
    });
    render();
    return;
  }
  var editBtn = e.target.closest('.edit-btn');
  if (editBtn) {
    var id  = Number(editBtn.dataset.id);
    var exp = state.expensesINR.find(function(e) { return e.id === id; });
    if (!exp) return;
    editingId = id;
    editName.value     = exp.name;
    editCategory.value = exp.category || 'Other';
    editAmount.value   = +fromINR(exp.amountINR).toFixed(2);
    editDate.value     = exp.date || '';
    editModal.classList.remove('hidden');
  }
});

saveEditBtn.addEventListener('click', function() {
  if (!editingId) return;
  var name   = editName.value.trim();
  var amount = Number(editAmount.value);
  var date   = editDate.value;
  var editError = document.getElementById('editError');

  
  editName.style.borderColor     = '';
  editAmount.style.borderColor   = '';
  editDate.style.borderColor     = '';

  var errors = [];
  if (!name)                        { errors.push('expense name'); editName.style.borderColor   = '#ef4444'; }
  if (isNaN(amount) || amount <= 0) { errors.push('valid amount'); editAmount.style.borderColor = '#ef4444'; }
  if (!date)                        { errors.push('date');         editDate.style.borderColor   = '#ef4444'; }

  if (errors.length) {
    editError.textContent = 'Please enter: ' + errors.join(', ') + '.';
    editError.classList.remove('hidden');
    return;
  }

  editError.classList.add('hidden');
  var rate = ratesCache[state.currency] || 1;
  state.expensesINR = state.expensesINR.map(function(exp) {
    if (exp.id !== editingId) return exp;
    return { id: exp.id, name: name, category: editCategory.value || 'Other', date: date, amountINR: +(amount / rate).toFixed(6) };
  });
  editingId = null;
  editModal.classList.add('hidden');
  render();
});

cancelEditBtn.addEventListener('click', function() {
  editingId = null;
  editName.style.borderColor     = '';
  editAmount.style.borderColor   = '';
  editDate.style.borderColor     = '';
  var editError = document.getElementById('editError');
  if (editError) editError.classList.add('hidden');
  editModal.classList.add('hidden');
});


clearAllBtn.addEventListener('click', function() {
  if (!confirm('Clear all data?')) return;
  state = { salaryINR: 0, expensesINR: [], currency: state.currency };
  if (pieChart)      { pieChart.destroy();      pieChart      = null; }
  if (categoryChart) { categoryChart.destroy(); categoryChart = null; }
  render();
});


currencySelect.addEventListener('change', async function() {
  if (isConverting) return;
  isConverting = true;
  currencySelect.disabled = true;

  await fetchRates(); 
  state.currency = currencySelect.value;

  currencySelect.disabled = false;
  isConverting = false;
  render(); 
});


downloadPdfBtn.addEventListener('click', function() {
  if (!Array.isArray(state.expensesINR)) state.expensesINR = [];

  var jsPDF      = window.jspdf.jsPDF;
  var doc        = new jsPDF({ unit: 'mm', format: 'a4' });
  var cur        = state.currency;
  var totalINR   = state.expensesINR.reduce(function(s, e) { return s + e.amountINR; }, 0);
  var balanceINR = state.salaryINR - totalINR;
  var now        = new Date().toLocaleDateString('en-GB');
  var isAlert    = state.salaryINR > 0 && balanceINR < state.salaryINR * 0.1;
  var pageW      = doc.internal.pageSize.getWidth();  
  var pageH      = doc.internal.pageSize.getHeight(); 
  var lx         = 15; 
  var rx         = pageW - 15; 

  
  function fP(n) {
    return cur + ' ' + Number(fromINR(n)).toLocaleString('en-IN', {
      minimumFractionDigits: 2, maximumFractionDigits: 2
    });
  }
  function fPExp(n) {
    return '-' + cur + ' ' + Number(fromINR(n)).toLocaleString('en-IN', {
      minimumFractionDigits: 2, maximumFractionDigits: 2
    });
  }

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageW, 28, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('Cash-Flow Report', lx, 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text('Generated on: ' + now, lx, 21);
  doc.text('Currency: ' + cur, rx, 21, { align: 'right' });

  
  var y = 38;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('SUMMARY', lx, y);

  y += 2;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.line(lx, y, rx, y);
  y += 7;

  var summaryData = [
    { label: 'Total Salary',      val: fP(state.salaryINR),  r: 2, g: 132, b: 199, bold: false },
    { label: 'Total Expenses',    val: fPExp(totalINR),       r: 220, g: 38, b: 38, bold: false },
    { label: 'Remaining Balance', val: fP(balanceINR),
      r: isAlert ? 220 : 5, g: isAlert ? 38 : 150, b: isAlert ? 38 : 105, bold: true },
  ];

  summaryData.forEach(function(row) {
    doc.setFont('helvetica', row.bold ? 'bold' : 'normal');
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105);
    doc.text(row.label, lx, y);
    doc.setTextColor(row.r, row.g, row.b);
    doc.text(row.val, rx, y, { align: 'right' });
    y += 8;
  });

  if (isAlert) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(220, 38, 38);
    doc.text('Warning: Balance is below 10% of salary', lx, y);
    y += 7;
  }


  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('EXPENSES BREAKDOWN', lx, y);
  y += 2;
  doc.setDrawColor(203, 213, 225);
  doc.line(lx, y, rx, y);

  if (state.expensesINR.length === 0) {
    y += 8;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text('No expenses recorded.', lx, y);
    y += 8;
  } else {
    doc.autoTable({
      startY: y + 3,
      head: [['#', 'Expense Name', 'Category', 'Date', 'Amount (' + cur + ')']],
      body: state.expensesINR.map(function(e, i) {
        return [i + 1, e.name, e.category || 'Other', fmtDate(e.date), fPExp(e.amountINR)];
      }),
      theme: 'striped',
      styles: { font: 'helvetica', fontSize: 10, cellPadding: 4, textColor: [30, 41, 59] },
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        4: { halign: 'right', textColor: [220, 38, 38], fontStyle: 'bold' },
      },
    });
    y = doc.lastAutoTable.finalY + 4;

  
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.5);
    doc.line(lx, y, rx, y);
    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text('Total Expenses', lx, y);
    doc.setTextColor(220, 38, 38);
    doc.text(fPExp(totalINR), rx, y, { align: 'right' });
    y += 8;
  }

  
  y += 4;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.line(lx, y, rx, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Generated by Cash-Flow Tracker', pageW / 2, y, { align: 'center' });

  doc.save('cashflow-report.pdf');
});

loadState();
fetchRates().then(function() {
  render();
  if (window.lucide) lucide.createIcons();
});
