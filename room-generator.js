// ==========================================
// SiteScop V4 - Room Generator
// Version 1.0
// ==========================================

// Generate Bathroom Accordions
async function generateBathrooms() {

    const bathroomInput = document.getElementById("bathroomCount");

    if (!bathroomInput) return;

    const count = parseInt(bathroomInput.value) || 0;

    const container = document.getElementById("bathroomContainer");

    if (!container) return;

    container.innerHTML = "";

    if (count === 0) {
        container.innerHTML = "<p>No bathrooms selected.</p>";
        return;
    }

    const response = await fetch("bathroom.html");
    const template = await response.text();

    for (let i = 1; i <= count; i++) {

        const accordion = document.createElement("div");
        accordion.className = "accordion";

        accordion.innerHTML = `
            <div class="accordion-header">
                Bathroom ${i}
            </div>

            <div class="accordion-content">
                ${template}
            </div>
        `;

        container.appendChild(accordion);

    }

}
// Run when Bathroom count changes
document.addEventListener("DOMContentLoaded", () => {

    const bathroomInput = document.getElementById("bathroomCount");

    if (bathroomInput) {

        bathroomInput.addEventListener("change", generateBathrooms);

    }

});
