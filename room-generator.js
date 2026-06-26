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

initialiseDynamicRooms();
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
initialiseDynamicRooms();
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
function initialiseDynamicRooms() {

    // Accordion headings
    document.querySelectorAll(".accordion-header").forEach(header => {

        if (header.dataset.initialised) return;

        header.dataset.initialised = "true";

        header.addEventListener("click", function () {

            const content = this.nextElementSibling;

            if (!content) return;

            content.style.display =
                content.style.display === "block"
                ? "none"
                : "block";

        });

    });


    // Bathroom fixture checkboxes
    document.querySelectorAll(".fixture-toggle").forEach(box => {

        if (box.dataset.initialised) return;

        box.dataset.initialised = "true";

        box.addEventListener("change", function () {

            const target =
                document.getElementById(this.dataset.target);

            if (!target) return;

            target.style.display =
                this.checked ? "block" : "none";

        });

    });

}
