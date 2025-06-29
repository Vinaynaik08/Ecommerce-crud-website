// categories.js
const categoryForm = document.querySelector("form");
const categoryNameInput = document.getElementById("category_name");
const descriptionInput = document.getElementById("description");
const categoryTableBody = document.querySelector("table tbody");

let categories = JSON.parse(localStorage.getItem("categories")) || [];

function renderCategories() {
  categoryTableBody.innerHTML = "";
  categories.forEach((cat, idx) => {
    categoryTableBody.innerHTML += `
      <tr>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${cat.id}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${cat.name}</td>
        <td class="px-6 py-4 text-sm text-gray-800">${cat.description}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm">
          <button class="text-blue-600 hover:text-blue-900 mr-4" onclick="editCategory(${idx})">Edit</button>
          <button class="text-red-600 hover:text-red-900" onclick="deleteCategory(${idx})">Delete</button>
        </td>
      </tr>
    `;
  });
}

function editCategory(index) {
  const cat = categories[index];
  categoryNameInput.value = cat.name;
  descriptionInput.value = cat.description;
  deleteCategory(index);
}

function deleteCategory(index) {
  categories.splice(index, 1);
  localStorage.setItem("categories", JSON.stringify(categories));
  renderCategories();
}

categoryForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const name = categoryNameInput.value.trim();
  const description = descriptionInput.value.trim();
  if (!name) return alert("Category name is required");

  const newCategory = {
    id: Date.now(),
    name,
    description
  };
  categories.push(newCategory);
  localStorage.setItem("categories", JSON.stringify(categories));
  categoryForm.reset();
  renderCategories();
});

renderCategories();
