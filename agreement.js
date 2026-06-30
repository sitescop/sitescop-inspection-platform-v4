/*
==========================================================
SiteScop V4
Client Agreement System
agreement.js
Version 4.0
Part 1A
==========================================================
*/

class SiteScopAgreement {

    constructor() {

        /*
        ======================================================
        Configuration
        ======================================================
        */

        this.config = {

            version: "4.0",

            draftKey: "SiteScopAgreementDraft",

            legalFolders: {
                building: "legal/building/",
                pest: "legal/pest/",
                combined: "legal/combined/"
            },

            documents: {
                scope: "scope.html",
                limitations: "inspection-limitations.html",
                terms: "terms-conditions.html",
                privacy: "privacy-policy.html"
            }

        };

        /*
        ======================================================
        Application State
        ======================================================
        */

        this.state = {

            initialized: false,

            documentCache: new Map(),

            currentAccordion: null,

            inspectionType: "",

            signature: {

                drawing: false,

                dirty: false,

                points: []

            },

            agreement: null,

            submitting: false

        };

        /*
        ======================================================
        Canvas
        ======================================================
        */

        this.canvas = null;
        this.ctx = null;

        /*
        ======================================================
        DOM Cache
        ======================================================
        */

        this.dom = {};

    }

    /*
    ======================================================
    Initialise Application
    ======================================================
    */

    init() {

        if (this.state.initialized) {
            return;
        }

        this.cacheDom();

        this.bindEvents();

        this.setDefaultDates();

        this.state.initialized = true;

        console.log(
            `SiteScop Agreement ${this.config.version} Initialised`
        );

    }

    /*
    ======================================================
    Cache DOM
    ======================================================
    */

    cacheDom() {

        this.dom.app =
            document.getElementById("agreementApp");

        this.dom.card =
            document.getElementById("agreementCard");

        this.dom.success =
            document.getElementById("successMessage");

        this.dom.toast =
            document.getElementById("toastContainer");

        this.dom.loading =
            document.getElementById("loadingOverlay");

        this.dom.submissionStatus =
            document.getElementById("submissionStatus");

        this.dom.loadingIndicator =
            document.getElementById("loadingIndicator");

        this.dom.accordions =
            [...document.querySelectorAll(".accordion-header")];

        this.dom.contents =
            [...document.querySelectorAll(".accordion-content")];

        this.dom.signatureCanvas =
            document.getElementById("signatureCanvas");

        this.dom.clearSignature =
            document.getElementById("clearSignature");

        this.dom.downloadSignature =
            document.getElementById("downloadSignature");

        this.dom.submitAgreement =
            document.getElementById("submitAgreement");

        this.dom.saveDraft =
            document.getElementById("saveDraft");

        this.dom.resetAgreement =
            document.getElementById("resetAgreement");

        this.dom.closeSuccess =
            document.getElementById("closeSuccess");

        this.dom.inspectionType =
            document.getElementById("inspectionType");

        this.dom.agreementDate =
            document.getElementById("agreementDate");

    }

    /*
    ======================================================
    Default Values
    ======================================================
    */

    setDefaultDates() {

        if (this.dom.agreementDate) {

            this.dom.agreementDate.value =
                new Date().toISOString().split("T")[0];

        }

    }

    /*
    ======================================================
    Bind Events
    ======================================================
    */

    bindEvents() {

        this.dom.accordions.forEach(header => {

            header.addEventListener(
                "click",
                this.handleAccordionClick.bind(this)
            );

        });

    } 
    /*
    ======================================================
    Accordion Engine
    ======================================================
    */

    handleAccordionClick(event) {

        const header = event.currentTarget;
        const targetId = header.dataset.target;
        const content = document.getElementById(targetId);

        if (!content) {
            return;
        }

        if (
            this.state.currentAccordion &&
            this.state.currentAccordion !== header
        ) {

            this.closeAccordion(this.state.currentAccordion);

        }

        if (header.classList.contains("active")) {

            this.closeAccordion(header);
            this.state.currentAccordion = null;

        } else {

            this.openAccordion(header, content);
            this.state.currentAccordion = header;

        }

    }

    openAccordion(header, content) {

        header.classList.add("active");

        content.classList.add("active");

        content.style.maxHeight =
            `${content.scrollHeight}px`;

        const icon =
            header.querySelector(".accordion-icon");

        if (icon) {
            icon.textContent = "−";
        }

    }

    closeAccordion(header) {

        if (!header) {
            return;
        }

        const targetId = header.dataset.target;

        const content =
            document.getElementById(targetId);

        if (!content) {
            return;
        }

        header.classList.remove("active");

        content.style.maxHeight = "0px";

        content.classList.remove("active");

        const icon =
            header.querySelector(".accordion-icon");

        if (icon) {
            icon.textContent = "+";
        }

    }

    closeAllAccordions() {

        this.dom.accordions.forEach(header => {

            this.closeAccordion(header);

        });

        this.state.currentAccordion = null;

    }

    /*
    ======================================================
    Inspection Type Changed
    ======================================================
    */

    handleInspectionTypeChange(event) {

        this.state.inspectionType =
            event.target.value;

        this.loadLegalDocuments();

    } 
    /*
    ======================================================
    Legal Document Loader
    ======================================================
    */

    async loadLegalDocuments() {

        const inspectionType =
            this.dom.inspectionType.value || "building";

        await Promise.all([

            this.loadDocument(
                "scopeContent",
                inspectionType,
                this.config.documents.scope
            ),

            this.loadDocument(
                "limitationsContent",
                inspectionType,
                this.config.documents.limitations
            ),

            this.loadDocument(
                "termsContent",
                inspectionType,
                this.config.documents.terms
            ),

            this.loadDocument(
                "privacyContent",
                inspectionType,
                this.config.documents.privacy
            )

        ]);

    }

    async loadDocument(
        containerId,
        inspectionType,
        fileName
    ) {

        const container =
            document.getElementById(containerId);

        if (!container) {
            return;
        }

        const cacheKey =
            `${inspectionType}-${fileName}`;

        if (this.state.documentCache.has(cacheKey)) {

            container.innerHTML =
                this.state.documentCache.get(cacheKey);

            return;

        }

        const folder =
            this.config.legalFolders[inspectionType];

        try {

            container.innerHTML =
                '<div class="document-loading">Loading document...</div>';

            const response =
                await fetch(folder + fileName);

            if (!response.ok) {

                throw new Error(
                    `Failed to load ${fileName}`
                );

            }

            const html =
                await response.text();

            this.state.documentCache.set(
                cacheKey,
                html
            );

            container.innerHTML = html;

        }
        catch (error) {

            console.error(error);

            container.innerHTML = `
                <div class="document-error">
                    Unable to load document.
                </div>
            `;

        }

    } 

    /*
    ======================================================
    Signature Pad
    ======================================================
    */

    initialiseSignaturePad() {

        this.canvas = this.dom.signatureCanvas;

        if (!this.canvas) {
            return;
        }

        this.ctx = this.canvas.getContext("2d");

        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        this.ctx.lineWidth = 2.5;
        this.ctx.strokeStyle = "#000000";

        this.resizeCanvas();

        window.addEventListener(
            "resize",
            () => this.resizeCanvas()
        );

        this.canvas.addEventListener(
            "pointerdown",
            this.startSignature.bind(this)
        );

        this.canvas.addEventListener(
            "pointermove",
            this.drawSignature.bind(this)
        );

        this.canvas.addEventListener(
            "pointerup",
            this.endSignature.bind(this)
        );

        this.canvas.addEventListener(
            "pointerleave",
            this.endSignature.bind(this)
        );

        this.dom.clearSignature.addEventListener(
            "click",
            () => this.clearSignature()
        );

        this.dom.downloadSignature.addEventListener(
            "click",
            () => this.downloadSignature()
        );

    }

    resizeCanvas() {

        if (!this.canvas) {
            return;
        }

        const image =
            this.canvas.toDataURL();

        const rect =
            this.canvas.getBoundingClientRect();

        const ratio =
            window.devicePixelRatio || 1;

        this.canvas.width =
            rect.width * ratio;

        this.canvas.height =
            rect.height * ratio;

        this.ctx.scale(ratio, ratio);

        if (this.state.signature.dirty) {

            const img = new Image();

            img.onload = () => {

                this.ctx.drawImage(
                    img,
                    0,
                    0,
                    rect.width,
                    rect.height
                );

            };

            img.src = image;

        }

    }

    getPointerPosition(event) {

        const rect =
            this.canvas.getBoundingClientRect();

        return {

            x: event.clientX - rect.left,
            y: event.clientY - rect.top

        };

    }

    startSignature(event) {

        this.state.signature.drawing = true;

        const point =
            this.getPointerPosition(event);

        this.ctx.beginPath();

        this.ctx.moveTo(
            point.x,
            point.y
        );

    }

    drawSignature(event) {

        if (!this.state.signature.drawing) {
            return;
        }

        const point =
            this.getPointerPosition(event);

        this.ctx.lineTo(
            point.x,
            point.y
        );

        this.ctx.stroke();

        this.state.signature.dirty = true;

        if (this.dom.signatureStatus) {

            this.dom.signatureStatus.textContent =
                "Signature captured";

        }

    }

    endSignature() {

        this.state.signature.drawing = false;

        this.ctx.closePath();

    } 
    /*
    ======================================================
    Signature Utilities
    ======================================================
    */

    clearSignature() {

        if (!this.canvas || !this.ctx) {
            return;
        }

        this.ctx.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        this.state.signature.dirty = false;
        this.state.signature.points = [];

        if (this.dom.signatureStatus) {

            this.dom.signatureStatus.textContent =
                "No signature";

        }

    }

    getSignatureImage() {

        if (
            !this.canvas ||
            !this.state.signature.dirty
        ) {
            return null;
        }

        return this.canvas.toDataURL("image/png");

    }

    downloadSignature() {

        if (!this.state.signature.dirty) {

            this.showToast(
                "Please sign before downloading.",
                "warning"
            );

            return;

        }

        const link =
            document.createElement("a");

        link.href =
            this.canvas.toDataURL("image/png");

        link.download =
            "SiteScop-Signature.png";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

    }
      /*
    ======================================================
    Validation Engine
    ======================================================
    */

    validateAgreement() {

        let valid = true;

        this.clearValidation();

        const requiredFields = [

            "inspectionType",
            "clientName",
            "clientEmail",
            "clientMobile",
            "propertyAddress",
            "propertySuburb",
            "propertyState",
            "propertyPostcode"

        ];

        requiredFields.forEach(id => {

            const field =
                document.getElementById(id);

            if (!field) {
                return;
            }

            if (field.value.trim() === "") {

                valid = false;

                field.classList.add("error");

            } else {

                field.classList.add("valid");

            }

        });

        if (!this.validateEmail()) {

            valid = false;

        }

        if (!this.validateAustralianMobile()) {

            valid = false;

        }

        if (!this.validateAustralianPostcode()) {

            valid = false;

        }

        if (!this.validateDeclaration()) {

            valid = false;

        }

        if (!this.validateSignature()) {

            valid = false;

        }

        if (!valid) {

            this.showToast(
                "Please correct the highlighted fields.",
                "error"
            );

            this.scrollToFirstError();

        }

        return valid;

    }

    clearValidation() {

        document
            .querySelectorAll(".error,.valid")
            .forEach(element => {

                element.classList.remove(
                    "error",
                    "valid"
                );

            });

    }

    validateEmail() {

        const field =
            document.getElementById("clientEmail");

        if (!field) {
            return false;
        }

        const regex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regex.test(field.value.trim())) {

            field.classList.add("error");

            return false;

        }

        field.classList.add("valid");

        return true;

    }

    validateAustralianMobile() {

        const field =
            document.getElementById("clientMobile");

        if (!field) {
            return false;
        }

        const regex =
            /^04\d{8}$/;

        if (!regex.test(field.value.trim())) {

            field.classList.add("error");

            return false;

        }

        field.classList.add("valid");

        return true;

    }

    validateAustralianPostcode() {

        const field =
            document.getElementById("propertyPostcode");

        if (!field) {
            return false;
        }

        const regex =
            /^\d{4}$/;

        if (!regex.test(field.value.trim())) {

            field.classList.add("error");

            return false;

        }

        field.classList.add("valid");

        return true;

    }

    validateDeclaration() {

        const checkbox =
            document.getElementById("clientDeclaration");

        const error =
            document.getElementById("declarationError");

        if (!checkbox.checked) {

            error.classList.remove("hidden");

            return false;

        }

        error.classList.add("hidden");

        return true;

    }

    validateSignature() {

        const error =
            document.getElementById("signatureError");

        if (!this.state.signature.dirty) {

            error.classList.remove("hidden");

            return false;

        }

        error.classList.add("hidden");

        return true;

    } 
    /*
    ======================================================
    Save Draft
    ======================================================
    */

    saveDraft() {

        const draft = {

            inspectionType:
                document.getElementById("inspectionType")?.value || "",

            clientName:
                document.getElementById("clientName")?.value || "",

            clientEmail:
                document.getElementById("clientEmail")?.value || "",

            clientMobile:
                document.getElementById("clientMobile")?.value || "",

            propertyAddress:
                document.getElementById("propertyAddress")?.value || "",

            propertySuburb:
                document.getElementById("propertySuburb")?.value || "",

            propertyState:
                document.getElementById("propertyState")?.value || "",

            propertyPostcode:
                document.getElementById("propertyPostcode")?.value || "",

            inspectorName:
                document.getElementById("inspectorName")?.value || "",

            inspectionDate:
                document.getElementById("inspectionDate")?.value || "",

            inspectionTime:
                document.getElementById("inspectionTime")?.value || "",

            declaration:
                document.getElementById("clientDeclaration")?.checked || false,

            saved:
                new Date().toISOString()

        };

        localStorage.setItem(
            this.config.draftKey,
            JSON.stringify(draft)
        );

        this.showToast(
            "Draft saved successfully.",
            "success"
        );

    }

    restoreDraft() {

        const data =
            localStorage.getItem(this.config.draftKey);

        if (!data) {
            return;
        }

        const draft =
            JSON.parse(data);

        Object.keys(draft).forEach(key => {

            const field =
                document.getElementById(key);

            if (!field) {
                return;
            }

            if (field.type === "checkbox") {

                field.checked = draft[key];

            } else {

                field.value = draft[key];

            }

        });

        this.showToast(
            "Draft restored.",
            "success"
        );

    }

    resetAgreement() {

        if (!confirm("Reset this agreement?")) {
            return;
        }

        localStorage.removeItem(
            this.config.draftKey
        );

        document
            .querySelectorAll("input, textarea, select")
            .forEach(field => {

                if (
                    field.type === "checkbox"
                ) {

                    field.checked = false;

                }
                else if (
                    field.type !== "hidden"
                ) {

                    field.value = "";

                }

            });

        this.clearSignature();

        this.setDefaultDates();

        this.clearValidation();

        this.showToast(
            "Agreement reset.",
            "success"
        );

    }
      /*
    ======================================================
    Agreement Object
    ======================================================
    */

    createAgreementObject() {

        return {

            agreementId: this.generateAgreementId(),

            timestamp: new Date().toISOString(),

            legalVersion:
                document.getElementById("legalDocumentVersion")?.value || "1.0",

            agreementVersion:
                document.getElementById("agreementVersion")?.value || "4.0",

            declarationAccepted:
                document.getElementById("clientDeclaration")?.checked || false,

            client: {

                name:
                    document.getElementById("clientName")?.value.trim(),

                email:
                    document.getElementById("clientEmail")?.value.trim(),

                mobile:
                    document.getElementById("clientMobile")?.value.trim()

            },

            property: {

                address:
                    document.getElementById("propertyAddress")?.value.trim(),

                suburb:
                    document.getElementById("propertySuburb")?.value.trim(),

                state:
                    document.getElementById("propertyState")?.value,

                postcode:
                    document.getElementById("propertyPostcode")?.value.trim()

            },

            inspection: {

                type:
                    document.getElementById("inspectionType")?.value,

                inspector:
                    document.getElementById("inspectorName")?.value.trim(),

                date:
                    document.getElementById("inspectionDate")?.value,

                time:
                    document.getElementById("inspectionTime")?.value

            },

            signature:
                this.getSignatureImage()

        };

    }

    generateAgreementId() {

        const now = new Date();

        const stamp =

            now.getFullYear().toString() +

            String(now.getMonth() + 1).padStart(2, "0") +

            String(now.getDate()).padStart(2, "0") +

            "-" +

            String(now.getHours()).padStart(2, "0") +

            String(now.getMinutes()).padStart(2, "0") +

            String(now.getSeconds()).padStart(2, "0");

        return `SSA-${stamp}`;

    } 
    /*
    ======================================================
    Submit Agreement
    ======================================================
    */

    async submitAgreement() {

        if (this.state.submitting) {
            return;
        }

        if (!this.validateAgreement()) {
            return;
        }

        this.state.submitting = true;

        this.dom.loadingIndicator.classList.remove("hidden");

        this.dom.submissionStatus.classList.remove("hidden");
        this.dom.submissionStatus.textContent =
            "Submitting agreement...";

        try {

            this.state.agreement =
                this.createAgreementObject();

           this.state.agreement.agreementId =
    this.generateAgreementId();

const agreementId = document.getElementById("agreementId");
if (agreementId) {
    agreementId.value = this.state.agreement.agreementId;
}

const submissionTimestamp = document.getElementById("submissionTimestamp");
if (submissionTimestamp) {
    submissionTimestamp.value = this.state.agreement.timestamp;
}

const agreementStatus = document.getElementById("agreementStatus");
if (agreementStatus) {
    agreementStatus.value = "Submitted";
}

            /*
            ==================================================
            Future Hooks
            ==================================================
            */

          console.log("1 - generatePDF");
await this.generatePDF();

console.log("2 - saveCRM");
await this.saveCRM();

console.log("3 - emailAgreement");
await this.emailAgreement();

console.log("4 - uploadCloud");
await this.uploadCloud();

console.log("5 - sendSMS");
await this.sendSMS();

console.log("6 - sendWhatsApp");
await this.sendWhatsApp();

console.log("7 - showSuccessScreen");
this.showSuccessScreen();

console.log("Finished");

            this.showToast(
                "Agreement submitted successfully.",
                "success"
            );

        }
        catch (error) {

            console.error(error);

            this.showToast(
                "Submission failed.",
                "error"
            );

        }
        finally {

            this.state.submitting = false;

            this.dom.loadingIndicator.classList.add(
                "hidden"
            );

            this.dom.submissionStatus.classList.add(
                "hidden"
            );

        }

    } 
    /*
    ======================================================
    Utilities
    ======================================================
    */

    showSuccessScreen() {

        this.dom.card.classList.add("hidden");

        this.dom.success.classList.remove("hidden");
        this.dom.success.classList.add("active");

        document.getElementById(
            "successAgreementId"
        ).textContent =
            this.state.agreement.agreementId;

        document.getElementById(
            "successDate"
        ).textContent =
            new Date().toLocaleString(
                "en-AU"
            );

    }

    scrollToFirstError() {

        const firstError = document.querySelector(".error");

        if (!firstError) {
            return;
        }

        firstError.scrollIntoView({

            behavior: "smooth",

            block: "center"

        });

        firstError.focus();

    }

    showToast(message, type = "success") {

        const template =
            document.getElementById(
                "toastTemplate"
            );

        if (!template) {
            return;
        }

        const toast =
            template.content.firstElementChild.cloneNode(true);

        toast.classList.add(type);

        const icon =
            toast.querySelector(".toast-icon");

        const text =
            toast.querySelector(".toast-message");

        const icons = {

            success: "✓",

            warning: "⚠",

            error: "✕"

        };

        icon.textContent =
            icons[type] || "ℹ";

        text.textContent =
            message;

        this.dom.toast.appendChild(toast);

        setTimeout(() => {

            toast.classList.add("fade-out");

            setTimeout(() => {

                toast.remove();

            }, 300);

        }, 3000);

    }

    /*
    ======================================================
    Future Hooks
    ======================================================
    */

    async generatePDF() {}

    async emailAgreement() {}

    async saveCRM() {}

    async uploadCloud() {}

    async sendSMS() {}

    async sendWhatsApp() {} 
    /*
    ======================================================
    Final Initialisation
    ======================================================
    */

    registerApplicationEvents() {

        if (this.dom.inspectionType) {

            this.dom.inspectionType.addEventListener(
                "change",
                this.handleInspectionTypeChange.bind(this)
            );

        }

        if (this.dom.saveDraft) {

            this.dom.saveDraft.addEventListener(
                "click",
                this.saveDraft.bind(this)
            );

        }

        if (this.dom.resetAgreement) {

            this.dom.resetAgreement.addEventListener(
                "click",
                this.resetAgreement.bind(this)
            );

        }

        if (this.dom.submitAgreement) {

            this.dom.submitAgreement.addEventListener(
                "click",
                this.submitAgreement.bind(this)
            );

        }

        if (this.dom.closeSuccess) {

            this.dom.closeSuccess.addEventListener(
                "click",
                () => location.reload()
            );

        }

    }

    start() {

        this.registerApplicationEvents();

        this.initialiseSignaturePad();

        this.restoreDraft();

        this.loadLegalDocuments();

    }

}

const app = new SiteScopAgreement();

document.addEventListener(
    "DOMContentLoaded",
    () => {

        app.init();

        app.start();

    }
);
