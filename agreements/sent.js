/*=========================================================
    SiteScop V4
    Sent Agreements
    sent.js
=========================================================*/

"use strict";

/*=========================================================
    Application
=========================================================*/

document.addEventListener("DOMContentLoaded", initialiseApp);

/*=========================================================
    Initialise
=========================================================*/

function initialiseApp() {

    initialiseTabs();

}

/*=========================================================
    Tabs
=========================================================*/

function initialiseTabs() {

    const sendTab = document.getElementById("tabSend");

    const listTab = document.getElementById("tabList");

    const sendPanel = document.getElementById("sendPanel");

    const listPanel = document.getElementById("listPanel");

    sendTab.addEventListener("click", () => {

        showSendAgreement();

    });

    listTab.addEventListener("click", () => {

        showSentAgreements();

    });

    function showSendAgreement() {

        sendTab.classList.add("active");

        listTab.classList.remove("active");

        sendPanel.classList.add("active");

        listPanel.classList.remove("active");

    }

    function showSentAgreements() {

        listTab.classList.add("active");

        sendTab.classList.remove("active");

        listPanel.classList.add("active");

        sendPanel.classList.remove("active");

    }

} 
/*=========================================================
    Form Submission
=========================================================*/

const agreementForm = document.getElementById("agreementForm");

if (agreementForm) {

    agreementForm.addEventListener("submit", sendAgreement);

}

/*=========================================================
    Send Agreement
=========================================================*/

function sendAgreement(event) {

    event.preventDefault();

    const clientName =
        document.getElementById("clientName").value.trim();

    const clientEmail =
        document.getElementById("clientEmail").value.trim();

    const clientMobile =
        document.getElementById("clientMobile").value.trim();

    const deliveryMethod =
        document.querySelector(
            'input[name="delivery"]:checked'
        ).value;

    /*---------------------------------------*/

    if (clientName === "") {

        alert("Please enter the client name.");

        return;

    }

    if (clientEmail === "" && clientMobile === "") {

        alert("Please enter an email address or mobile number.");

        return;

    }

    /*---------------------------------------*/

    const invitation = {

        id: Date.now(),

        clientName,

        clientEmail,

        clientMobile,

        deliveryMethod,

        status: "Invitation Sent",

        dateSent: new Date().toLocaleDateString("en-AU")

    };

    /*---------------------------------------*/

    const agreements = JSON.parse(

        localStorage.getItem("sentAgreements") || "[]"

    );

    agreements.push(invitation);

    localStorage.setItem(

        "sentAgreements",

        JSON.stringify(agreements)

    );

    /*---------------------------------------*/

    agreementForm.reset();

    document.querySelector(
        'input[value="Email"]'
    ).checked = true;

    alert(

        "Agreement invitation created successfully."

    );

   loadSentAgreements();

document.getElementById("tabList").click();

} 
/*=========================================================
    Load Sent Agreements
=========================================================*/

document.addEventListener("DOMContentLoaded", loadSentAgreements);

function loadSentAgreements() {

    const tableBody =
        document.getElementById("sentTableBody");

    if (!tableBody) return;

    const agreements = JSON.parse(

        localStorage.getItem("sentAgreements") || "[]"

    );

    tableBody.innerHTML = "";

    if (agreements.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td colspan="8" class="empty-table">

                    No agreements have been sent yet.

                </td>

            </tr>

        `;

        return;

    }

    agreements.forEach((agreement,index)=>{

        tableBody.innerHTML += `

        <tr>

            <td>Pending</td>

            <td>${agreement.clientName}</td>

            <td>${agreement.clientEmail}</td>

            <td>${agreement.clientMobile}</td>

            <td>${agreement.deliveryMethod}</td>

            <td>${agreement.status}</td>

            <td>${agreement.dateSent}</td>

            <td>

                <button
                    class="action-btn view-btn"
                    onclick="viewAgreement(${index})">

                    👁

                </button>

                <button
                    class="action-btn resend-btn"
                    onclick="resendAgreement(${index})">

                    📧

                </button>

                <button
                    class="action-btn delete-btn"
                    onclick="deleteAgreement(${index})">

                    🗑️

                </button>

            </td>

        </tr>

        `;

    });

}

/*=========================================================
    Refresh Table
=========================================================*/

function refreshSentTable(){

    loadSentAgreements();

} 
/*=========================================================
    View Agreement
=========================================================*/

function viewAgreement(index){

    const agreements = JSON.parse(

        localStorage.getItem("sentAgreements") || "[]"

    );

    const agreement = agreements[index];

    if(!agreement) return;

    alert(

`Client: ${agreement.clientName}

Email: ${agreement.clientEmail}

Mobile: ${agreement.clientMobile}

Method: ${agreement.deliveryMethod}

Status: ${agreement.status}

Date Sent: ${agreement.dateSent}`

    );

}

/*=========================================================
    Resend Agreement
=========================================================*/

/*=========================================================
    Agreement Link
=========================================================*/

const AGREEMENT_URL =
"https://sitescop.github.io/sitescop-inspection-platform-v4/client-agreement.html";

/*=========================================================
    Resend Agreement
=========================================================*/

function resendAgreement(index){

    const agreements = JSON.parse(

        localStorage.getItem("sentAgreements") || "[]"

    );

    const agreement = agreements[index];

    if(!agreement) return;

    switch(agreement.deliveryMethod){

        case "Email":

            window.location.href =
            `mailto:${agreement.clientEmail}?subject=SiteScop Client Agreement&body=Please complete your agreement using the link below:%0D%0A%0D%0A${AGREEMENT_URL}`;

            break;

        case "SMS":

            window.location.href =
            `sms:${agreement.clientMobile}?body=Please complete your SiteScop agreement: ${AGREEMENT_URL}`;

            break;

        case "WhatsApp":

            window.open(

                `https://wa.me/${agreement.clientMobile.replace(/\D/g,"")}?text=Please complete your SiteScop agreement: ${encodeURIComponent(AGREEMENT_URL)}`,

                "_blank"

            );

            break;

        case "Copy Link":

            navigator.clipboard.writeText(AGREEMENT_URL);

            alert("Agreement link copied to clipboard.");

            break;

        default:

            window.open(AGREEMENT_URL,"_blank");

    }

}

/*=========================================================
    Delete Agreement
=========================================================*/

function deleteAgreement(index){

    if(

        !confirm(

            "Delete this agreement invitation?"

        )

    ){

        return;

    }

    const agreements = JSON.parse(

        localStorage.getItem("sentAgreements") || "[]"

    );

    agreements.splice(index,1);

    localStorage.setItem(

        "sentAgreements",

        JSON.stringify(agreements)

    );

    loadSentAgreements();

} 
/*=========================================================
    Utilities
=========================================================*/

function showMessage(message){

    console.log(message);

}

/*=========================================================
    Refresh Page
=========================================================*/

function refreshPage(){

    loadSentAgreements();

}

/*=========================================================
    Future Integration
=========================================================*/

/*
Future Development

1.
When a client submits:

client-agreement.html

the agreement will automatically move from

Sent Agreements

to

Received Agreements.

2.
Agreement ID will be generated after the client submits.

Example:

AGR-2026-000001

3.
Signed PDF will be generated.

4.
Invoice will be generated.

5.
Payment status:

Pending
Paid
Overdue

6.
After payment:

Create Inspection Job

7.
Remove agreement from:

Sent Agreements

and automatically add to:

Received Agreements

then

Completed.
*/
