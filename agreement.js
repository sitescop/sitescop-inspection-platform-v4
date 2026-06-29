/*======================================================
SiteScop V4
Agreement System
Part 1
======================================================*/

let inspectionType = "combined";

document.addEventListener("DOMContentLoaded", () => {

    initialiseAgreement();

});

function initialiseAgreement() {

    initialiseAccordions();

    initialiseInspectionSelector();

    loadLegalDocuments();

}

/*======================================================
Inspection Type
======================================================*/

function initialiseInspectionSelector() {

    const selector = document.getElementById("inspectionType");

    if (!selector) return;

    inspectionType = selector.value || "combined";

    selector.addEventListener("change", () => {

        inspectionType = selector.value || "combined";

        loadLegalDocuments();

    });

}

/*======================================================
Accordion
======================================================*/

function initialiseAccordions() {

    const accordions = document.querySelectorAll(".accordion");

    accordions.forEach(button => {

        button.addEventListener("click", function () {

            this.classList.toggle("active");

            const panel = this.nextElementSibling;

            const icon = this.querySelector(".accordion-icon");

            if (panel.style.display === "block") {

                panel.style.display = "none";

                if (icon) icon.textContent = "+";

            } else {

                panel.style.display = "block";

                if (icon) icon.textContent = "−";

            }

        });

    });

}

/*======================================================
Load Legal Documents
======================================================*/

async function loadLegalDocuments() {

    const folder = "legal/" + inspectionType + "/";

    loadSection(
        folder + "scope.html",
        "scopeContent"
    );

    loadSection(
        folder + "inspection-limitations.html",
        "limitationsContent"
    );

    loadSection(
        folder + "terms-conditions.html",
        "termsContent"
    );

    loadSection(
        folder + "privacy-policy.html",
        "privacyContent"
    );

    loadSection(
        folder + "client-declaration.html",
        "declarationContent"
    );

}

/*======================================================
Load Individual Section
======================================================*/

async function loadSection(file, targetId) {

    const target = document.getElementById(targetId);

    if (!target) return;

    try {

        const response = await fetch(file);

        if (!response.ok) {

            target.innerHTML = `
                <p>
                    Unable to load document.
                </p>
            `;

            return;

        }

        target.innerHTML = await response.text();

    }

    catch {

        target.innerHTML = `
            <p>
                Unable to load document.
            </p>
        `;

    }

}   
/*======================================================
Signature Pad
Part 2
======================================================*/

let canvas;
let ctx;

let drawing = false;
let hasSignature = false;

/*======================================================
Initialise Signature
======================================================*/

initialiseSignature();

function initialiseSignature() {

    canvas = document.getElementById("signatureCanvas");

    if (!canvas) return;

    ctx = canvas.getContext("2d");

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);

    canvas.addEventListener("touchstart", startDrawing);
    canvas.addEventListener("touchmove", draw);
    canvas.addEventListener("touchend", stopDrawing);

    const clearButton = document.getElementById("clearSignature");

    if (clearButton) {

        clearButton.addEventListener("click", clearSignature);

    }

}

/*======================================================
Resize Canvas
======================================================*/

function resizeCanvas() {

    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;

    canvas.height = rect.height;

    ctx.lineWidth = 2.5;

    ctx.lineCap = "round";

    ctx.lineJoin = "round";

    ctx.strokeStyle = "#222";

}

/*======================================================
Pointer Position
======================================================*/

function getPosition(event) {

    const rect = canvas.getBoundingClientRect();

    if (event.touches && event.touches.length > 0) {

        return {

            x: event.touches[0].clientX - rect.left,

            y: event.t       
            /*======================================================
Validation & Submit
Part 3
======================================================*/

function initialiseValidation() {

    const fields = document.querySelectorAll(

        "input[required], select[required], textarea[required]"

    );

    fields.forEach(field => {

        field.addEventListener("input", validateField);

        field.addEventListener("change", validateField);

    });

}

function validateField(event) {

    const field = event.target;

    if (field.value.trim() === "") {

        field.classList.remove("valid");

        field.classList.add("invalid");

    }

    else {

        field.classList.remove("invalid");

        field.classList.add("valid");

    }

}

/*======================================================
Submit
======================================================*/

initialiseSubmit();

function initialiseSubmit() {

    const button = document.getElementById("submitAgreement");

    if (!button) return;

    button.addEventListener("click", submitAgreement);

}

function submitAgreement() {

    let valid = true;

    const requiredFields = document.querySelectorAll(

        "input[required], select[required], textarea[required]"

    );

    requiredFields.forEach(field => {

        if (field.value.trim() === "") {

            field.classList.add("invalid");

            valid = false;

        }

        else {

            field.classList.remove("invalid");

            field.classList.add("valid");

        }

    });

    if (!hasSignature) {

        alert("Please sign the Inspection Agreement before submitting.");

        return;

    }

    if (!valid) {

        alert("Please complete all required fields.");

        return;

    }

    const agreementId = generateAgreementID();

    showSuccess(agreementId);

}

/*======================================================
Agreement ID
======================================================*/

function generateAgreementID() {

    const now = new Date();

    const year = now.getFullYear();

    const random = Math.floor(

        100000 + Math.random() * 900000

    );

    return `SSA-${year}-${random}`;

}
        /*======================================================
Success Screen
Part 4
======================================================*/

function showSuccess(agreementId) {

    const formCards = document.querySelectorAll(".card");

    formCards.forEach(card => {

        card.style.display = "none";

    });

    const success = document.getElementById("successMessage");

    if (!success) {

        alert("Agreement submitted successfully.");

        return;

    }

    success.style.display = "block";

    const reference = document.getElementById("agreementReference");

    if (reference) {

        reference.textContent = agreementId;

    }

    success.scrollIntoView({

        behavior: "smooth"

    });

}

/*======================================================
Accordion Animation
======================================================*/

document.querySelectorAll(".accordion").forEach(button => {

    button.addEventListener("click", function () {

        const panel = this.nextElementSibling;

        const icon = this.querySelector(".accordion-icon");

        if (panel.style.maxHeight) {

            panel.style.maxHeight = null;

            if (icon) icon.textContent = "+";

        } else {

            panel.style.maxHeight = panel.scrollHeight + "px";

            if (icon) icon.textContent = "−";

        }

    });

});

/*======================================================
Utilities
======================================================*/

function getSignatureImage() {

    if (!canvas) return null;

    return canvas.toDataURL("image/png");

}

function resetAgreement() {

    document
        .querySelectorAll("input, textarea")
        .forEach(field => {

            field.value = "";

            field.classList.remove("valid");

            field.classList.remove("invalid");

        });

    document
        .querySelectorAll("select")
        .forEach(select => {

            select.selectedIndex = 0;

            select.classList.remove("valid");

            select.classList.remove("invalid");

        });

    clearSignature();

}

/*======================================================
Future Hooks
======================================================*/

// saveAgreement();

// generatePDF();

// sendEmail();

// sendSMS();

// sendWhatsApp();

// uploadCloud();

/*======================================================
End of SiteScop V4
======================================================*/
