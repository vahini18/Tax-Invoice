
function updateInvoice() {
    const rows = document.querySelectorAll('.invoice-table tr:not(:first-child)');
    let subtotal = 0;
    let totalSGST = 0;
    let totalCGST = 0;
  
    rows.forEach(row => {
      const inputs = row.querySelectorAll('input');
      const qty = parseFloat(inputs[1]?.value) || 0;
      const rate = parseFloat(inputs[2]?.value) || 0;
      const sgstRate = parseFloat(inputs[3]?.value) || 0;
      const cgstRate = parseFloat(inputs[4]?.value) || 0;
  
      const amount = qty * rate;
      const sgstAmount = (amount * sgstRate) / 100;
      const cgstAmount = (amount * cgstRate) / 100;
      const total = amount + sgstAmount + cgstAmount;
  
     
      const sgstSubtext = row.querySelectorAll('.subtext')[0];
      const cgstSubtext = row.querySelectorAll('.subtext')[1];
      if (sgstSubtext) sgstSubtext.textContent = sgstAmount.toFixed(2);
      if (cgstSubtext) cgstSubtext.textContent = cgstAmount.toFixed(2);
  
      
      const amountInput = inputs[6];
      if (amountInput) amountInput.value = total.toFixed(2);
  
      subtotal += amount;
      totalSGST += sgstAmount;
      totalCGST += cgstAmount;
    });
  
   
    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('sgst').textContent = totalSGST.toFixed(2);
    document.getElementById('cgst').textContent = totalCGST.toFixed(2);
  
    const grandTotal = subtotal + totalSGST + totalCGST;
    document.getElementById('total').textContent = grandTotal.toFixed(2);
  }
  
 
  function addItem() {
    const table = document.querySelector('.invoice-table');
    const rows = table.querySelectorAll('tr');
    const lastRow = rows[rows.length - 1];
    const newRow = lastRow.cloneNode(true);
  
   
    const inputs = newRow.querySelectorAll('input');
    const textarea = newRow.querySelector('textarea');
    const subtexts = newRow.querySelectorAll('.subtext');
  
    if (textarea) textarea.value = '';
    inputs.forEach((input, index) => {
      if (index === 1) input.value = 1; 
      else if (index === 2 || index === 6) input.value = "0.00"; 
      else input.value = 0;
    });
    subtexts.forEach(st => (st.textContent = "0.00"));
  
    table.appendChild(newRow);
    addListenersToRow(newRow);
    updateInvoice();
  }
  

  function fixPrefix(input) {
    const prefix = input.defaultValue?.split(':')[0] || input.defaultValue;
    input.value = prefix + ": ";
  }
  

  function addListenersToRow(row) {
    const inputs = row.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', updateInvoice);
    });
  }
  

  function initListeners() {
    document.querySelectorAll('.invoice-table tr:not(:first-child)').forEach(row => {
      addListenersToRow(row);
    });
  

    document.querySelectorAll('input[oninput="fixPrefix(this)"]').forEach(input => {
      input.addEventListener('input', function () {
        fixPrefix(this);
      });
    });
  
  
    document.querySelector('.add-item-btn')?.addEventListener('click', addItem);
  }
  

  window.addEventListener('load', () => {
    initListeners();
    updateInvoice();
  });

document.querySelector('.upload-box')?.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file && file.size <= 1024 * 1024) { 
        const reader = new FileReader();
        reader.onload = function (e) {
          const logoBox = document.querySelector('.upload-box');
          logoBox.innerHTML = `<img src="${e.target.result}" class="logo-preview" alt="Logo" />`;
        };
        reader.readAsDataURL(file);
      } else {
        alert("Please upload an image less than 1MB in size.");
      }
    };
  
    input.click();
  });
    