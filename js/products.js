// products.js
const excelInput = document.getElementById("excel_file");
const productTableBody = document.querySelector("table tbody");

let categories = JSON.parse(localStorage.getItem("categories")) || [];
let products = JSON.parse(localStorage.getItem("products")) || [];

function renderProducts() {
  productTableBody.innerHTML = "";
  products.forEach((prod, idx) => {
    const category = categories.find(c => c.id == prod.category_id);
    productTableBody.innerHTML += `
      <tr>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${prod.id}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${prod.name}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${category ? category.name : "Unknown"}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">$${parseFloat(prod.price).toFixed(2)}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${prod.stock}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm">
          <button class="text-blue-600 hover:text-blue-900 mr-4" onclick="editProduct(${idx})">Edit</button>
          <button class="text-red-600 hover:text-red-900" onclick="deleteProduct(${idx})">Delete</button>
        </td>
      </tr>
    `;
  });
}

window.editProduct = function(index) {
  const prod = products[index];
  document.getElementById("edit_product_id").value = prod.id;
  document.getElementById("edit_product_name").value = prod.name;
  document.getElementById("edit_category_id").value = prod.category_id;
  document.getElementById("edit_price").value = prod.price;
  document.getElementById("edit_stock").value = prod.stock;
};

window.deleteProduct = function(index) {
  if (confirm("Are you sure you want to delete this product?")) {
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    renderProducts();
  }
};

document.querySelector("form[action='#']:not([enctype])")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const id = parseFloat(document.getElementById("edit_product_id").value);
  const name = document.getElementById("edit_product_name").value.trim();
  const category_id = parseInt(document.getElementById("edit_category_id").value);
  const price = parseFloat(document.getElementById("edit_price").value);
  const stock = parseInt(document.getElementById("edit_stock").value);

  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { id, name, category_id, price, stock };
    localStorage.setItem("products", JSON.stringify(products));
    renderProducts();
    this.reset();
    alert("Product updated successfully.");
  } else {
    alert("Product not found.");
  }
});

document.querySelector("form[enctype='multipart/form-data']")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const file = excelInput.files[0];
  if (!file) return alert("Please select an Excel file.");

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      let added = 0;
      rows.forEach(row => {
        if (row.product_name && row.category_id && row.price > 0 && row.stock >= 0) {
          const existingIndex = products.findIndex(p => p.name.toLowerCase() === row.product_name.toLowerCase() && p.category_id === parseInt(row.category_id));
          const newProduct = {
            id: Date.now() + Math.random(),
            name: row.product_name,
            category_id: parseInt(row.category_id),
            price: parseFloat(row.price),
            stock: parseInt(row.stock)
          };

          if (existingIndex !== -1) {
            products[existingIndex] = { ...products[existingIndex], ...newProduct }; // Update existing
          } else {
            products.push(newProduct); // Add new
          }
          added++;
        }
      });

      localStorage.setItem("products", JSON.stringify(products));
      alert(`${added} product(s) uploaded or updated.`);
      renderProducts();
    } catch (err) {
      alert("Error processing Excel file. Please check the format.");
      console.error(err);
    }
  };
  reader.readAsArrayBuffer(file);
});

renderProducts();
