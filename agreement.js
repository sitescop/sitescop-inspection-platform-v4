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

if(!hasSignature){

    alert(
        "Please sign before submitting."
    );

    return;

}

    document.querySelector(".card:last-of-type")
        .style.display = "none";

    const thankYou =
       document.getElementById("successMessage");

    if (thankYou) {

        thankYou.style.display = "block";

        thankYou.scrollIntoView({

            behavior: "smooth"

        });

    }

    console.log("Agreement Submitted");

}
let canvas;
let ctx;

let drawing = false;

let hasSignature = false;

function initialiseSignature(){

    canvas = document.getElementById("signatureCanvas");

    if(!canvas) return;

    ctx = canvas.getContext("2d");

    resizeCanvas();

    window.addEventListener("resize",resizeCanvas);

    canvas.addEventListener("mousedown",startDraw);

    canvas.addEventListener("mousemove",draw);

    canvas.addEventListener("mouseup",stopDraw);

    canvas.addEventListener("mouseleave",stopDraw);

    canvas.addEventListener("touchstart",startDraw);

    canvas.addEventListener("touchmove",draw);

    canvas.addEventListener("touchend",stopDraw);

   const clearButton = document.getElementById("clearSignature");

if (clearButton) {
    clearButton.addEventListener("click", clearSignature);
}

}

function resizeCanvas(){

    const rect=canvas.getBoundingClientRect();

    canvas.width=rect.width;

    canvas.height=rect.height;

}

function getPosition(e){

    const rect=canvas.getBoundingClientRect();

    if(e.touches){

        return{

            x:e.touches[0].clientX-rect.left,

            y:e.touches[0].clientY-rect.top

        };

    }

    return{

        x:e.offsetX,

        y:e.offsetY

    };

}

function startDraw(e){

    drawing=true;

    const p=getPosition(e);

    ctx.beginPath();

    ctx.moveTo(p.x,p.y);

}

function draw(e){

    if(!drawing) return;

    e.preventDefault();

    const p=getPosition(e);

    ctx.lineWidth=2;

    ctx.lineCap="round";

    ctx.strokeStyle="#000";

    ctx.lineTo(p.x,p.y);

    ctx.stroke();

    hasSignature=true;

}

function stopDraw(){

    drawing=false;

}

function clearSignature(){

    ctx.clearRect(

        0,

        0,

        canvas.width,

        canvas.height

    );

    hasSignature=false;

}
