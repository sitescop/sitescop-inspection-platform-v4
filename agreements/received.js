/*==================================================
SiteScop V4
Received Agreements
==================================================*/

"use strict";

/*==================================================
DOM
==================================================*/

const receivedTableBody =
document.getElementById("receivedTableBody");

/*==================================================
START
==================================================*/

document.addEventListener(

    "DOMContentLoaded",

    () => {

        loadReceivedAgreements();

    }

);

/*==================================================
LOAD AGREEMENTS
==================================================*/

function loadReceivedAgreements(){

    const agreements = JSON.parse(

        localStorage.getItem("receivedAgreements") || "[]"

    );

    renderReceivedTable(agreements);

} 
/*==================================================
RENDER TABLE
==================================================*/

function renderReceivedTable(agreements){

    if(!agreements.length){

        receivedTableBody.innerHTML = `

            <tr class="empty-row">

                <td colspan="6">

                    No received agreements found.

                </td>

            </tr>

        `;

        return;

    }

    receivedTableBody.innerHTML = "";

    agreements.forEach((agreement,index)=>{

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${agreement.agreementId || "-"}</td>

            <td>${agreement.clientName}</td>

            <td>${agreement.inspectionType || "-"}</td>

            <td>${agreement.submittedDate || "-"}</td>

            <td>

                <span class="payment-status">

                    ${agreement.paymentStatus || "Pending"}

                </span>

            </td>

            <td class="actions">

                <button
                    class="action-btn view-btn"
                    onclick="viewAgreement(${index})">

                    <i class="fa-solid fa-eye"></i>

                </button>

                <button
                    class="action-btn pdf-btn"
                    onclick="generatePDF(${index})">

                    <i class="fa-solid fa-file-pdf"></i>

                </button>

                <button
                    class="action-btn invoice-btn"
                    onclick="generateInvoice(${index})">

                    <i class="fa-solid fa-file-invoice-dollar"></i>

                </button>

                <button
                    class="action-btn paid-btn"
                    onclick="markPaid(${index})">

                    <i class="fa-solid fa-dollar-sign"></i>

                </button>

                <button
                    class="action-btn delete-btn"
                    onclick="deleteAgreement(${index})">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        `;

        receivedTableBody.appendChild(row);

    });

} 
/*==================================================
VIEW AGREEMENT
==================================================*/

function viewAgreement(index){

    const agreements = JSON.parse(

        localStorage.getItem("receivedAgreements") || "[]"

    );

    const agreement = agreements[index];

    if(!agreement) return;

    alert(

        "Agreement ID: " + (agreement.agreementId || "-") +

        "\n\nClient: " + agreement.clientName +

        "\nInspection: " + (agreement.inspectionType || "-") +

        "\nStatus: " + (agreement.paymentStatus || "Pending")

    );

}

/*==================================================
GENERATE PDF
==================================================*/

function generatePDF(index){

    alert(

        "PDF generation will be connected in the next stage."

    );

}

/*==================================================
GENERATE INVOICE
==================================================*/

function generateInvoice(index){

    alert(

        "Invoice generation will be connected in the next stage."

    );

}

/*==================================================
MARK AS PAID
==================================================*/

function markPaid(index){

    const agreements = JSON.parse(

        localStorage.getItem("receivedAgreements") || "[]"

    );

    if(!agreements[index]) return;

    agreements[index].paymentStatus = "Paid";

    localStorage.setItem(

        "receivedAgreements",

        JSON.stringify(agreements)

    );

    loadReceivedAgreements();

}

/*==================================================
DELETE AGREEMENT
==================================================*/

function deleteAgreement(index){

    if(

        !confirm(

            "Are you sure you want to delete this agreement?\n\nIt will be moved to the Recycle Bin."

        )

    ){

        return;

    }

    const agreements = JSON.parse(

        localStorage.getItem("receivedAgreements") || "[]"

    );

    const recycleBin = JSON.parse(

        localStorage.getItem("recycleBin") || "[]"

    );

    recycleBin.push(agreements[index]);

    agreements.splice(index,1);

    localStorage.setItem(

        "receivedAgreements",

        JSON.stringify(agreements)

    );

    localStorage.setItem(

        "recycleBin",

        JSON.stringify(recycleBin)

    );

    loadReceivedAgreements();

} 
/*==================================================
    Utilities
==================================================*/

function refreshReceivedAgreements(){

    loadReceivedAgreements();

}

/*==================================================
    Future Integration
==================================================*/

/*
Future Workflow

1.
Client receives agreement.

2.
Client opens:

client-agreement.html

3.
Client completes the agreement.

4.
Client signs the agreement.

5.
Client clicks Submit Agreement.

6.
System automatically:

• Removes the invitation from
  Sent Agreements List.

• Generates Agreement ID

• Creates Signed PDF

• Creates Invoice

• Saves into:

    Received Agreements

7.
Payment Status

Pending

↓

Paid

↓

Create Inspection Job

↓

Move to Completed

8.
Delete

Delete confirmation.

Move to Recycle Bin.

Never permanently delete from this page.

*/
