document.addEventListener("DOMContentLoaded", function () {
    const logoInput = document.getElementById("logo-upload");
    const logoSection = document.querySelector(".logo-upload-section");
    const clientStateInput = document.getElementById("clientState");
    const placeOfSupply = document.getElementById("placeOfSupply");
    const invoiceDateInput = document.getElementById("invoiceDate");
    const dueDateInput = document.getElementById("dueDate");
    const invoiceNumber = document.getElementById("invoiceNumber");

   
    logoInput.addEventListener("change", function () {
      const file = this.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        logoInput.value = "";
        return;
      }

      if (file.size > 1024 * 1024) {
        alert("File size exceeds 1MB.");
        logoInput.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        logoSection.innerHTML = `
          <img src="${e.target.result}" alt="Uploaded Logo" class="logo-preview"/>
          <div class="upload-info">Uploaded Successfully</div>
        `;
      };

      reader.readAsDataURL(file);
    });

    clientStateInput.addEventListener("input", function () {
      placeOfSupply.textContent = clientStateInput.value || "State";
    });

    const today = new Date().toISOString().split("T")[0];
    invoiceDateInput.value = today;
    dueDateInput.value = today;

    const randomNum = Math.floor(100 + Math.random() * 900);
    invoiceNumber.textContent = `INV-${randomNum}`;
  });