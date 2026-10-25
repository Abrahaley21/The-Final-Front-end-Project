
const API_URL = "https://api.thecatapi.com/v1";
const catResults = document.getElementById("catResults");
const message = document.getElementById("message");
const randomButton = document.getElementById("randomButton");
const searchButton = document.getElementById("searchButton");
const categorySelect = document.getElementById("categorySelect");
// Fetch cat images from the API
async function loadCats() {
    const category = categorySelect.value;
    message.textContent = "Loading cats... 🐾";
    catResults.replaceChildren();
    try {
        let url = `${API_URL}/images/search?limit=9`;
        if (category) {
            url += `&category_ids=${encodeURIComponent(category)}`;
        }
        // HTTP GET request
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }
        // Convert JSON response into JavaScript data
        const cats = await response.json();
        if (!cats.length) {
            message.textContent = "No cats found. Try another category.";
            return;
        }
        cats.forEach((cat) => {
            const column = document.createElement("div");
            column.className = "col-12 col-sm-6 col-lg-4";
            const card = document.createElement("div");
            card.className = "cat-card";
            const image = document.createElement("img");
            image.src = cat.url;
            image.alt = "Adorable cat";
            image.loading = "lazy";
            const button = document.createElement("button");
            button.className = "btn btn-outline-primary w-100";
            button.textContent = "View Full Image";
            button.addEventListener("click", () => {
                window.open(cat.url, "_blank", "noopener,noreferrer");
            });
            card.append(image, button);
            column.appendChild(card);
            catResults.appendChild(column);
        });
        message.textContent = `${cats.length} adorable cats found! 😻`;
    } catch (error) {
        console.error("Cat API error:", error);
        message.textContent =
            "Could not load cats. Please check your connection and try again.";
    }
}

// Load categories supported by The Cat API
async function loadCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) {
            throw new Error("Could not load categories");
        }
        const categories = await response.json();
        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error("Category API error:", error);
        message.textContent =
            "Categories could not be loaded. Random cats are still available.";
    }
}
// Button events
randomButton.addEventListener("click", () => {
    categorySelect.value = "";
    loadCats();
});
searchButton.addEventListener("click", loadCats);
// Load the website's initial content
async function initializeApp() {
    await loadCategories();
    await loadCats();
}
initializeApp();
