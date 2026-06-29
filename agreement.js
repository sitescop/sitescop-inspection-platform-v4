/*
==========================================
SiteScop Client Agreement
Version 2
==========================================
*/

document.addEventListener("DOMContentLoaded", () => {

    initialiseAgreement();

});

function initialiseAgreement() {

    initialiseAccordions();

    initialiseValidation();

   initialiseSubmit();

initialiseSignature();

}

function initialiseAccordions() {

    const accordions = document.querySelectorAll(".accordion");

    accordions.forEach(button => {

        button.addEventListener("click", function () {

            this.classList.toggle("active");

            const panel = this.nextElementSibling;

            if (panel.style.display === "block") {

                panel.style.display = "none";

                this.querySelector("span").textContent = "+";

            } else {

                panel.style.display = "block";

                this.querySelector("span").textContent = "−";

            }

        });

    });

}

function initialiseValidation() {

    const fields = document.querySelectorAll(
        "input, select, textarea"
    );

    fields.forEach(field => {

        field.addEventListener("input", updateProgress);

        field.addEventListener("change", updateProgress);

    });

    updateProgress();

}

function updateProgress() {

    const fields = document.querySelectorAll(
        "input, select, textarea"
    );

    let completed = 0;

    fields.forEach(field => {

        if (field.value.trim() !== "") {

            completed++;

            field.classList.add("valid");

            field.classList.remove("invalid");

        } else {

            field.classList.remove("valid");

            field.classList.add("invalid");

        }

    });

    const percentage = Math.round(
        (completed / fields.length) * 100
    );

    const progressFill =
        document.getElementById("progressFill");

    const progressText =
        document.getElementById("progressText");

    if (progressFill)
        progressFill.style.width = percentage + "%";

    if (progressText)
        progressText.textContent =
            percentage + "% Complete";

}

function initialiseSubmit() {

    const button =
        document.getElementById("submitAgreement");

    if (!button)
        return;

    button.addEventListener("click", submitAgreement);

}

function submitAgreement() {

    const required = document.querySelectorAll(
        "input[required], select[required]"
    );

    let valid = true;

    required.forEach(field => {

        if (field.value.trim() === "") {

            field.classList.add("invalid");

            valid = false;

        }

    });

    if (!valid) {

        alert(
            "Please complete all required fields."
        );

        return;

    }

    document.querySelector(".card:last-of-type")
        .style.display = "none";

    const thankYou =
        document.getElementById("thankYouMessage");

    if (thankYou) {

        thankYou.style.display = "block";

        thankYou.scrollIntoView({

            behavior: "smooth"

        });

    }

    console.log("Agreement Submitted");

}
