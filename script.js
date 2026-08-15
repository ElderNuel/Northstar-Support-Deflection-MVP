// Variable tracking the current active category section
let activeSection = 'home';

// Function to switch visible sections and navigation tabs
function showSection(section) {
  // Update current active section
  activeSection = section;
  
  // Remove active styling from all nav tabs
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  
  // Get references to UI panels
  const panel = document.getElementById('lookup-panel');
  const resultBox = document.getElementById('result-box');
  const title = document.getElementById('panel-title');
  const input = document.getElementById('lookup-input');
  
  // Reset result display
  resultBox.style.display = 'none';
  resultBox.innerHTML = '';
  input.value = '';

  // Handle Home section
  if (section === 'home') {
    // Set home tab as active
    document.getElementById('tab-home').classList.add('active');
    // Hide lookup panel
    panel.style.display = 'none';
    return;
  }

  // Show lookup panel for active category
  panel.style.display = 'block';

  // Configure panel for Order Tracking
  if (section === 'order') {
    document.getElementById('tab-order').classList.add('active');
    title.textContent = 'Track an Order';
    input.placeholder = 'Enter Order ID (e.g. NS-1001, NS-1003)...';
  } 
  // Configure panel for Stock Availability
  else if (section === 'stock') {
    document.getElementById('tab-stock').classList.add('active');
    title.textContent = 'Check Product & Size Availability';
    input.placeholder = 'Enter product name (e.g. Wireless Earbuds, Running Shoes)...';
  } 
  // Configure panel for Returns & Refunds
  else if (section === 'return') {
    document.getElementById('tab-return').classList.add('active');
    title.textContent = 'Returns & Refund Status';
    input.placeholder = 'Enter Return ID (e.g. RET-2001) or Order ID (e.g. NS-1001)...';
  }

  // Focus the input field automatically
  input.focus();
}

// Function to handle direct form lookup submissions
async function handleLookup(event) {
  // Prevent page reload on submit
  event.preventDefault();
  
  // Get input text value
  const query = document.getElementById('lookup-input').value.trim();
  // Get result box container
  const resultBox = document.getElementById('result-box');
  // Return early if query is empty
  if (!query) return;

  // Set loading state
  resultBox.style.display = 'block';
  resultBox.innerHTML = '<em>Searching database...</em>';

  // Start try block for network request
  try {
    let endpoint = '';
    let payload = {};

    // Determine target API endpoint and payload based on active category
    if (activeSection === 'order') {
      endpoint = '/api/lookup/order';
      payload = { order_id: query };
    } else if (activeSection === 'stock') {
      endpoint = '/api/lookup/stock';
      payload = { product_name: query };
    } else if (activeSection === 'return') {
      endpoint = '/api/lookup/return';
      payload = { identifier: query };
    }

    // Send POST request to FastAPI backend
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    // Parse response JSON
    const res = await response.json();

    // Check if query was successful
    if (res.success) {
      // Format Order result
      if (activeSection === 'order') {
        const order = res.data;
        resultBox.innerHTML = `
          <strong>Order ID:</strong> ${order.order_id} <br>
          <strong>Customer:</strong> ${order.customer_name} <br>
          <strong>Status:</strong> <span style="color:#0284C7; font-weight:600;">${order.status}</span> <br>
          <strong>Carrier:</strong> ${order.carrier || 'Processing'} (Tracking: ${order.tracking_number || 'Pending'}) <br>
          <strong>Estimated Delivery:</strong> ${order.estimated_delivery || 'TBD'} <br>
          <strong>Total:</strong> $${order.total_amount}
        `;
      } 
      // Format Stock results
      else if (activeSection === 'stock') {
        const items = res.data;
        let html = `<strong>Found ${items.length} matching item(s):</strong><hr style="margin:8px 0; border:0; border-top:1px solid #E2E8F0;">`;
        items.forEach(item => {
          const statusText = item.in_stock ? `<span style="color:#16A34A; font-weight:600;">In Stock (${item.stock_count} units)</span>` : `<span style="color:#DC2626; font-weight:600;">Out of Stock (Restock: ${item.restock_date || 'TBD'})</span>`;
          html += `<div style="margin-bottom:6px;">• <strong>${item.product_name}</strong> (${item.size}, ${item.color}) - $${item.price} &rarr; ${statusText}</div>`;
        });
        resultBox.innerHTML = html;
      } 
      // Format Return results
      else if (activeSection === 'return') {
        const ret = res.data;
        resultBox.innerHTML = `
          <strong>Return ID:</strong> ${ret.return_id} (Order: ${ret.order_id}) <br>
          <strong>Customer:</strong> ${ret.customer_name} <br>
          <strong>Item:</strong> ${ret.item_returned} (Qty: ${ret.qty_returned}) <br>
          <strong>Return Status:</strong> <span style="color:#0284C7; font-weight:600;">${ret.return_status}</span> <br>
          <strong>Refund:</strong> $${ret.refund_amount} via ${ret.refund_method} <br>
          <strong>Pickup Scheduled:</strong> ${ret.pickup_scheduled || 'Pending warehouse'}
        `;
      }
    } else {
      // Display failure message if record not found
      resultBox.innerHTML = `<span style="color:#DC2626;">${res.message}</span>`;
    }
  } catch (err) {
    // Display server connection error
    resultBox.innerHTML = `<span style="color:#DC2626;">Error communicating with server: ${err.message}</span>`;
  }
}

// Function to toggle the floating chatbot window
function toggleChat() {
  const chatWindow = document.getElementById('chat-window');
  chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
}

// Function to handle chatbot submission
async function handleChatSubmit(event) {
  event.preventDefault();
  const input = document.getElementById('chat-input');
  const msg = input.value.trim();
  if (!msg) return;

  const feed = document.getElementById('chat-messages');

  // Append user message bubble
  const userDiv = document.createElement('div');
  userDiv.className = 'chat-msg user';
  userDiv.textContent = msg;
  feed.appendChild(userDiv);
  input.value = '';
  feed.scrollTop = feed.scrollHeight;

  // Append temporary thinking indicator
  const typingDiv = document.createElement('div');
  typingDiv.className = 'chat-msg bot';
  typingDiv.textContent = 'Checking...';
  feed.appendChild(typingDiv);
  feed.scrollTop = feed.scrollHeight;

  try {
    // Send message to backend
    const res = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg })
    });
    const data = await res.json();
    typingDiv.remove();

    // Append bot response bubble
    const botDiv = document.createElement('div');
    botDiv.className = 'chat-msg bot';
    botDiv.innerHTML = data.reply.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    feed.appendChild(botDiv);
  } catch (err) {
    typingDiv.remove();
    const errDiv = document.createElement('div');
    errDiv.className = 'chat-msg bot';
    errDiv.textContent = 'Error contacting server: ' + err.message;
    feed.appendChild(errDiv);
  }
  feed.scrollTop = feed.scrollHeight;
}
