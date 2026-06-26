// ==========================================
// SiteScop V4 - Room Generator
// ==========================================

async function generateBathrooms() {

    const bathroomInput = document.getElementById("bathroomCount");
    if (!bathroomInput) return;

    const count = parseInt(bathroomInput.value) || 0;

    const container = document.getElementById("bathroomContainer");
    if (!container) return;

    container.innerHTML = "";

    if (count === 0) return;

    const response = await fetch("bathroom.html");
    const template = await response.text();

    for (let i = 1; i <= count; i++) {

        const accordion = document.createElement("div");
        accordion.className = "accordion";

        accordion.innerHTML = `
            <div class="accordion-header">
                Bathroom ${i}
            </div>

            <div class="accordion-content" style="display:none;">
                ${template}
            </div>
        `;

        const header = accordion.querySelector(".accordion-header");
        const content = accordion.querySelector(".accordion-content");

        header.addEventListener("click", () => {

            document.querySelectorAll("#bathroomContainer .accordion-content")
                .forEach(c => c.style.display = "none");

            document.querySelectorAll("#bathroomContainer .accordion-header")
                .forEach(h => h.classList.remove("active"));

            content.style.display = "block";
            header.classList.add("active");

        });

        container.appendChild(accordion);
    }

}
async function generateBedrooms() {

    const bedroomInput = document.getElementById("bedroomCount");
    if (!bedroomInput) return;

    const count = parseInt(bedroomInput.value) || 0;

    const container = document.getElementById("bedroomContainer");
    if (!container) return;

    container.innerHTML = "";

    if (count === 0) return;

    const response = await fetch("bedroom.html");
    const template = await response.text();

    for (let i = 1; i <= count; i++) {

        const accordion = document.createElement("div");
        accordion.className = "accordion";

        accordion.innerHTML = `
            <div class="accordion-header">
                Bedroom ${i}
            </div>

            <div class="accordion-content" style="display:none;">
                ${template}
            </div>
        `;

        const header = accordion.querySelector(".accordion-header");
        const content = accordion.querySelector(".accordion-content");

        header.addEventListener("click", () => {

            document.querySelectorAll("#bedroomContainer .accordion-content")
                .forEach(c => c.style.display = "none");

            document.querySelectorAll("#bedroomContainer .accordion-header")
                .forEach(h => h.classList.remove("active"));

            content.style.display = "block";
            header.classList.add("active");

        });

        container.appendChild(accordion);

    }

}
document.addEventListener("DOMContentLoaded", () => {

    const bathroomInput = document.getElementById("bathroomCount");

    if (bathroomInput) {
        bathroomInput.addEventListener("change", generateBathrooms);
    } 
const bedroomInput = document.getElementById("bedroomCount");

if (bedroomInput) {
    bedroomInput.addEventListener("change", generateBedrooms);
}
});
