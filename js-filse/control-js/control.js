// Firebase configuration and initialization
const firebaseConfig = {
  apiKey: "AIzaSyA2Yl1VfdSjLfa3WGEszCOs4uA9vLAJVN0",
  authDomain: "aeye-52e5c.firebaseapp.com",
  projectId: "aeye-52e5c",
  storageBucket: "aeye-52e5c.appspot.com",
  messagingSenderId: "721877823117",
  appId: "1:721877823117:web:5e789ac89e2baf9abffcc4",
  measurementId: "G-4NGC51320Q"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Global variables
let salesChart, expensesChart, incomeChart, salesTrendChart, comparisonChart;
let currentPeriod = 'day';
let allOrders = [];

// Format currency
function formatCurrency(amount) {
  return 'EG ' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Get status badge HTML
function getStatusBadge(status) {
  const statusClasses = {
    'Pending': 'status pending',
    'Processing': 'status processing',
    'Shipped': 'status shipped',
    'Delivered': 'status delivered',
    'Cancelled': 'status cancelled',
    'Paid': 'status completed'
  };
  
  const badgeClass = statusClasses[status] || 'status pending';
  return `<span class="${badgeClass}">${status}</span>`;
}

// Calculate time ago
function timeAgo(timestamp) {
  const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
    }
  }
  
  return 'Just now';
}

// Get date range based on period
function getDateRange(period) {
  const now = new Date();
  const start = new Date(now);
  
  switch(period) {
    case 'day':
      start.setHours(now.getHours() - 24);
      return { start, end: now, label: 'Last 24 hours' };
    case 'month':
      start.setMonth(now.getMonth() - 1);
      return { start, end: now, label: 'Last 30 days' };
    case 'year':
      start.setFullYear(now.getFullYear() - 1);
      return { start, end: now, label: 'Last 12 months' };
    case 'all':
      return { start: null, end: now, label: 'All Times' };
    default:
      return { start, end: now, label: 'Last 24 hours' };
  }
}

// Update period labels
function updatePeriodLabels(periodLabel) {
  document.getElementById('sales-period').textContent = periodLabel;
  document.getElementById('expenses-period').textContent = periodLabel;
  document.getElementById('income-period').textContent = periodLabel;
}

// Process orders and calculate metrics
function processOrders(orders, period) {
  let totalSales = 0;
  let totalExpenses = 0;
  const recentOrders = [];
  const salesData = {};
  const dateFormatOptions = { 
    day: '2-digit', 
    month: 'short' 
  };
  
  // Initialize sales data structure based on period
  const now = new Date();
  const tempDate = new Date(getDateRange(period).start || new Date(0));
  
  if (period === 'day') {
    // Group by hours for day view
    while (tempDate <= now) {
      const hour = tempDate.getHours();
      salesData[`${hour}:00`] = 0;
      tempDate.setHours(tempDate.getHours() + 1);
    }
  } else if (period === 'month') {
    // Group by days for month view
    while (tempDate <= now) {
      const dateStr = tempDate.toLocaleDateString('en-US', dateFormatOptions);
      salesData[dateStr] = 0;
      tempDate.setDate(tempDate.getDate() + 1);
    }
  } else {
    // Group by months for year/all view
    while (tempDate <= now) {
      const month = tempDate.toLocaleDateString('en-US', { month: 'short' });
      const year = tempDate.getFullYear();
      const key = period === 'year' ? month : `${month} ${year}`;
      salesData[key] = 0;
      tempDate.setMonth(tempDate.getMonth() + 1);
    }
  }
  
  // Process each order
  orders.forEach(order => {
    totalSales += order.totalPrice || 0;
    
    // Add to recent orders (only for display)
    if (recentOrders.length < 10) {
      recentOrders.push({
        id: order.id,
        customer: order.user?.name || 'unknown',
        payment: order.paymentMethod || 'unknown',
        status: order.paymentStatus || 'Pending',
        amount: order.totalPrice || 0,
        date: order.timestamp
      });
    }
    
    // Group sales data
    const orderDate = new Date(order.timestamp);
    let key;
    
    if (period === 'day') {
      key = `${orderDate.getHours()}:00`;
    } else if (period === 'month') {
      key = orderDate.toLocaleDateString('en-US', dateFormatOptions);
    } else {
      const month = orderDate.toLocaleDateString('en-US', { month: 'short' });
      const year = orderDate.getFullYear();
      key = period === 'year' ? month : `${month} ${year}`;
    }
    
    if (salesData[key] !== undefined) {
      salesData[key] = (salesData[key] || 0) + (order.totalPrice || 0);
    }
  });
  
  // Calculate expenses (30% of sales)
  totalExpenses = totalSales * 0.3;
  const totalIncome = totalSales - totalExpenses;
  
  return {
    totalSales,
    totalExpenses,
    totalIncome,
    recentOrders,
    salesData: Object.entries(salesData).map(([label, value]) => ({ label, value }))
  };
}

// Create/update mini charts
function updateMiniCharts(data) {
  // Sales chart
  if (salesChart) salesChart.destroy();
  salesChart = new Chart(
    document.getElementById('sales-chart').getContext('2d'),
    {
      type: 'line',
      data: {
        labels: data.salesData.map(d => d.label),
        datasets: [{
          label: 'Sales',
          data: data.salesData.map(d => d.value),
          borderColor: '#4361ee',
          backgroundColor: '#4361ee20',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false } },
        elements: { point: { radius: 0 } }
      }
    }
  );

  // Expenses chart
  if (expensesChart) expensesChart.destroy();
  expensesChart = new Chart(
    document.getElementById('expenses-chart').getContext('2d'),
    {
      type: 'line',
      data: {
        labels: data.salesData.map(d => d.label),
        datasets: [{
          label: 'Expenses',
          data: data.salesData.map(d => d.value * 0.3),
          borderColor: '#f72585',
          backgroundColor: '#f7258520',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false } },
        elements: { point: { radius: 0 } }
      }
    }
  );

  // Income chart
  if (incomeChart) incomeChart.destroy();
  incomeChart = new Chart(
    document.getElementById('income-chart').getContext('2d'),
    {
      type: 'line',
      data: {
        labels: data.salesData.map(d => d.label),
        datasets: [{
          label: 'income',
          data: data.salesData.map(d => d.value * 0.7),
          borderColor: '#4cc9f0',
          backgroundColor: '#4cc9f020',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false } },
        elements: { point: { radius: 0 } }
      }
    }
  );
}

// Create/update sales trend chart
function updateSalesTrendChart(data, period) {
  if (salesTrendChart) salesTrendChart.destroy();
  
  const periodLabel = 
    period === 'day' ? 'hours' : 
    period === 'month' ? 'days' : 'months';
  
  salesTrendChart = new Chart(
    document.getElementById('sales-trend-chart').getContext('2d'),
    {
      type: 'bar',
      data: {
        labels: data.salesData.map(d => d.label),
        datasets: [{
          label: 'Sales',
          data: data.salesData.map(d => d.value),
          backgroundColor: 'rgba(67, 97, 238, 0.7)',
          borderColor: 'rgba(67, 97, 238, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: `Sales trend (${periodLabel})` },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Sales: ${formatCurrency(context.raw)}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return formatCurrency(value).replace('$', '');
              }
            }
          }
        }
      }
    }
  );
}

// Create/update comparison chart
function updateComparisonChart(data) {
  if (comparisonChart) comparisonChart.destroy();
  
  comparisonChart = new Chart(
    document.getElementById('comparison-chart').getContext('2d'),
    {
      type: 'doughnut',
      data: {
        labels: ['income', 'Expenses'],
        datasets: [{
          data: [data.totalIncome, data.totalExpenses],
          backgroundColor: ['rgba(76, 201, 240, 0.7)', 'rgba(247, 37, 133, 0.7)'],
          borderColor: ['rgba(76, 201, 240, 1)', 'rgba(247, 37, 133, 1)'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.label}: ${formatCurrency(context.raw)}`;
              }
            }
          },
          legend: {
            position: 'bottom',
            labels: {
              font: {
                family: 'Tajawal',
                size: 14
              }
            }
          }
        }
      }
    }
  );
}

// Load all orders once and cache them
async function loadAllOrders() {
  try {
    const snapshot = await db.collection('orders')
      .orderBy('timestamp', 'desc')
      .get();
    
    allOrders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return allOrders;
  } catch (error) {
    console.error('Error loading all orders:', error);
    showToast('Failed to load order data', 'red');
    return [];
  }
}

// Filter orders by period
function filterOrdersByPeriod(orders, period) {
  if (period === 'all') return orders;
  
  const { start } = getDateRange(period);
  return orders.filter(order => 
    new Date(order.timestamp) >= start
  );
}

// Main function to load dashboard data
async function loadDashboardData(period = 'day') {
  try {
    currentPeriod = period;
    const { label } = getDateRange(period);
    updatePeriodLabels(label);
    
    // Load orders if not already loaded
    if (allOrders.length === 0) {
      document.getElementById('system-status').textContent = 'Loading data...';
      await loadAllOrders();
    }
    
    // Filter orders by period
    const filteredOrders = filterOrdersByPeriod(allOrders, period);
    
    // Process data
    const {
      totalSales,
      totalExpenses,
      totalIncome,
      recentOrders,
      salesData
    } = processOrders(filteredOrders, period);
    
    // Update dashboard cards
    document.getElementById('total-sales').textContent = formatCurrency(totalSales);
    document.getElementById('total-expenses').textContent = formatCurrency(totalExpenses);
    document.getElementById('total-income').textContent = formatCurrency(totalIncome);
    
    // Update recent orders table
    const ordersTable = document.getElementById('recent-orders-body');
    ordersTable.innerHTML = '';
    
    recentOrders.forEach(order => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${order.id.substring(0, 6)}...</td>
        <td>${order.customer}</td>
        <td>${order.payment}</td>
        <td>${getStatusBadge(order.status)}</td>
        <td>${formatCurrency(order.amount)}</td>
        <td>${timeAgo(order.date)}</td>
      `;
      ordersTable.appendChild(row);
    });
    
    // Update charts
    updateMiniCharts({ totalSales, totalExpenses, totalIncome, salesData });
    updateSalesTrendChart({ salesData }, period);
    updateComparisonChart({ totalSales, totalExpenses, totalIncome });
    
    // Update system status
    document.getElementById('system-status').textContent = 
      `Works efficiently • ${filteredOrders.length} Orders in ${label.toLowerCase()}`;
    
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    document.getElementById('system-status').textContent = 'Error loading data';
    showToast('Dashboard data loading failed', 'red');
  }
}

// Show toast notifications
function showToast(message, backgroundColor = 'red') {
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.style.backgroundColor = backgroundColor;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Load Chart.js dynamically
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
  script.onload = () => {
    // Load initial data
    loadDashboardData();
  };
  document.head.appendChild(script);
  
  // Set up period selector buttons
  document.querySelectorAll('.time-period-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.time-period-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      loadDashboardData(this.dataset.period);
    });
  });
  
  // Refresh data every 5 minutes
  setInterval(() => loadDashboardData(currentPeriod), 5 * 60 * 1000);
});