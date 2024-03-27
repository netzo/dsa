const menuPath = Deno.readTextFile("../database/menus.json");

async function loadMenu() {
  return await readJson(menuPath);
}

// Function to generate HTML content for the menu
function generateMenuHTML(menu) {
  let htmlContent =
    `<h1>${menu.name}</h1><p>${menu.description}</p><img src="${menu.image}" alt="Restaurant Logo">`;

  // Iterate through categories
  menu.categories.forEach((category) => {
    htmlContent += `<h2>${category.name}</h2><p>${category.caption}</p>`;

    // Filter items that belong to the current category
    const categoryItems = menu.items.filter((item) =>
      item.category === category.id
    );

    // Iterate through items in the category
    categoryItems.forEach((item) => {
      htmlContent += `<div><h3>${item.name}</h3><p>${item.description}</p>`;

      // Check if the item has variants
      if (item.variants) {
        item.variants.forEach((variant) => {
          htmlContent +=
            `<p>${variant.name}: ${variant.description} - $${variant.price}</p>`;
        });
      } else {
        htmlContent += `<p>Price: $${item.price}</p>`;
      }

      htmlContent += `</div>`;
    });
  });

  return htmlContent;
}
