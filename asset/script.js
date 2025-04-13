
function fixPrefix(input) {
  const prefix = input.dataset.prefix;
  if (!input.value.startsWith(prefix + ': ')) {
    input.value = prefix + ': ';
  }
}


function addItem() {
  const table = document.querySelector('.invoice-table');
  const newRow = table.insertRow(-1);

  newRow.innerHTML = `
    <td class="description">
      <textarea placeholder="Enter item name/description"></textarea>
      <input type="text" placeholder="HSN/SAC" class="item-desc" />
    </td>
    <td><input type="number" value="1" min="0" class="txt qty"></td>
    <td><input type="number" value="0.00" step="0.01" min="0" class="txt rate"></td>
    <td>
      <input type="number" value="0" min="0" class="txt sgst-rate"><br />
      <div class="subtext">0.00</div>
    </td>
    <td>
      <input type="number" value="0" min="0" class="txt cgst-rate"><br />
      <div class="subtext">0.00</div>
    </td>
    <td>
      <input type="number" value="0" min="0" class="txt cess-rate"><br />
      <div class="subtext">0.00</div>
    </td>
    <td><input type="number" value="0.00" step="0.01" min="0" class="txt amount" readonly></td>
  `;

  attachInputListeners();
  calculateTotal();
}

function calculateTotal() {
  const rows = document.querySelectorAll('.invoice-table tr:not(:first-child)');
  let subtotal = 0;
  let totalSGST = 0;
  let totalCGST = 0;
  let totalCess = 0;

  rows.forEach(row => {
    const qty = parseFloat(row.querySelector('.qty')?.value || 0);
    const rate = parseFloat(row.querySelector('.rate')?.value || 0);
    const sgstRate = parseFloat(row.querySelector('.sgst-rate')?.value || 0);
    const cgstRate = parseFloat(row.querySelector('.cgst-rate')?.value || 0);
    const cessRate = parseFloat(row.querySelector('.cess-rate')?.value || 0);

    const baseAmount = qty * rate;
    const sgst = baseAmount * (sgstRate / 100);
    const cgst = baseAmount * (cgstRate / 100);
    const cess = baseAmount * (cessRate / 100);
    const totalAmount = baseAmount + sgst + cgst + cess;

    row.querySelector('.amount').value = totalAmount.toFixed(2);
    row.querySelectorAll('.subtext')[0].innerText = sgst.toFixed(2);
    row.querySelectorAll('.subtext')[1].innerText = cgst.toFixed(2);
    row.querySelectorAll('.subtext')[2].innerText = cess.toFixed(2);

    subtotal += baseAmount;
    totalSGST += sgst;
    totalCGST += cgst;
    totalCess += cess;
  });

  const grandTotal = subtotal + totalSGST + totalCGST + totalCess;

  document.getElementById('subtotal').innerText = subtotal.toFixed(2);
  document.getElementById('sgst').innerText = totalSGST.toFixed(2);
  document.getElementById('cgst').innerText = totalCGST.toFixed(2);
  document.getElementById('total').innerText = grandTotal.toFixed(2);
}


function attachInputListeners() {
  const inputs = document.querySelectorAll('.invoice-table input');
  inputs.forEach(input => {
    input.removeEventListener('input', calculateTotal);
    input.addEventListener('input', calculateTotal);
  });


  const labelInputs = document.querySelectorAll('.label-input');
  labelInputs.forEach(input => {
    input.dataset.prefix = input.value.split(':')[0];
    input.removeEventListener('input', () => fixPrefix(input));
    input.addEventListener('input', () => fixPrefix(input));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  attachInputListeners();
  calculateTotal();


  const addItemBtn = document.getElementById('addItemBtn');
  if (addItemBtn) {
    addItemBtn.addEventListener('click', addItem);
  }
});
