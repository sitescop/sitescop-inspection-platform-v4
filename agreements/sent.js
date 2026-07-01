/*=========================================================
  SiteScop V4
  Sent Agreements
  sent.js
=========================================================*/

"use strict";

/*=========================================================
  Initialise
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    const sendButton = document.querySelector(".send-button");

    if (sendButton) {

        sendButton.addEventListener("click", sendAgreement);

    }

});

/*=========================================================
  Send Agreement
=========================================================*/

function sendAgreement() {

    const clientName =
        document.getElementById("clientName").value.trim();

    const clientEmail =
        document.getElementById("clientEmail").value.trim();

    const clientMobile =
        document.getElementById("clientMobile").value.trim();

    const method =
        document.querySelector('input[name="sendMethod"]:checked');

    /*--------------------------------------*/

    if (clientName === "") {

        alert("Please enter the client's name.");

        document.getElementById("clientName").focus();

        return;

    }

    if (clientEmail === "" && clientMobile === "") {

        alert("Please enter an Email Address or Mobile Number.");

        return;

    }

    if (!method) {

        alert("Please choose how you want to send the agreement.");

        return;

    }

    /*--------------------------------------*/

    const agreement = {

        clientName,

        clientEmail,

        clientMobile,

        sendMethod: method.nextElementSibling.innerText,

        status: "Invitation Sent",

        sentDate: new Date().toLocaleString(),

        submitted: false

    };

    /*--------------------------------------*/

    const agreements = JSON.parse(

        localStorage.getItem("sentAgreements") || "[]"

    );

    agreements.push(agreement);

    localStorage.setItem(

        "sentAgreements",

        JSON.stringify(agreements)

    );

    /*--------------------------------------*/

    alert(

        "Agreement invitation created successfully.\n\n" +

        "No Agreement ID is generated until the client submits the agreement."

    );

    clearForm();

}

/*=========================================================
  Clear Form
=========================================================*/

function clearForm() {

    document.getElementById("clientName").value = "";

    document.getElementById("clientEmail").value = "";

    document.getElementById("clientMobile").value = "";

    document.querySelector(
        'input[name="sendMethod"][checked]'
    );

    document.getElementById("clientName").focus();

}

/*=========================================================
  Return
=========================================================*/

function returnToDashboard() {

    window.location.href = "agreements.html";

}
