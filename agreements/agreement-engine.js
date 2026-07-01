/*==================================================
    SiteScop V4
    Agreement Engine
    Version 1.0
==================================================*/

"use strict";

/*==================================================
    Agreement Engine
==================================================*/

const AgreementEngine = {

    version: "1.0.0",

    async process(submission) {

        console.group("Agreement Engine");

        console.log("Starting agreement processing...");

        try {

            if (!submission) {

                throw new Error("No agreement submission supplied.");

            }

            console.log("Submission received.");

            const result = {

                success: true,

                agreementId: null,

                pdf: null,

                invoice: null,

                paymentStatus: "Pending",

                message: ""

            };

            /*------------------------------------------
                PARTS TO BE ADDED
            ------------------------------------------*/

          /*------------------------------------------
    PART 2
    Validate Agreement
------------------------------------------*/

const validation = AgreementEngine.validate(submission);

if (!validation.valid) {

    throw new Error(

        validation.errors.join("\n")

    );

}

engineLog("Validation successful.");

/*------------------------------------------
    PART 3
------------------------------------------*/

submission.agreementId =
AgreementEngine.generateAgreementID();

/*------------------------------------------
    PART 4
------------------------------------------*/

await AgreementEngine.generateSignedPDF(submission);

/*------------------------------------------
    PART 5
------------------------------------------*/

await AgreementEngine.generateInvoice(submission);

/*------------------------------------------
    PART 6
------------------------------------------*/

await AgreementEngine.saveReceivedAgreement(submission);

AgreementEngine.removeSentAgreement(submission);

/*------------------------------------------
    PART 7
------------------------------------------*/

await AgreementEngine.sendNotifications(submission);

/*------------------------------------------
    PART 8
------------------------------------------*/

await AgreementEngine.processPayment(submission);

/*------------------------------------------
    PART 9
------------------------------------------*/

if(

    AgreementEngine.isPaid(submission)

){

    await AgreementEngine.createInspectionJob(

        submission

    );

}

result.agreementId =

submission.agreementId;

result.pdf =

submission.pdf;

result.invoice =

submission.invoice;

result.paymentStatus =

submission.paymentStatus;

result.message =

"Agreement successfully processed.";

            console.log(result);

            console.groupEnd();

            return result;

        }

        catch (error) {

            console.error(error);

            console.groupEnd();

            return {

                success: false,

                message: error.message

            };

        }

    }

};

/*==================================================
    Helper Functions
==================================================*/

function engineLog(message){

    console.log("[Agreement Engine] " + message);

}
const validation = AgreementEngine.validate(submission);

if (!validation.valid) {

    throw new Error(

        validation.errors.join("\n")

    );

}

engineLog("Validation passed.");
function engineError(message){

    console.error("[Agreement Engine] " + message);

}

/*==================================================
    End of Part 1
==================================================*/
/*==================================================
    PART 2
    Validation Engine
==================================================*/

AgreementEngine.validate = function (submission) {

    engineLog("Running validation...");

    const errors = [];

    if (!submission) {

        errors.push("Agreement submission is missing.");

    } else {

        if (!submission.clientName || submission.clientName.trim() === "") {

            errors.push("Client Name is required.");

        }

        if (!submission.email || submission.email.trim() === "") {

            errors.push("Email Address is required.");

        }

        if (!submission.mobile || submission.mobile.trim() === "") {

            errors.push("Mobile Number is required.");

        }

        if (!submission.propertyAddress || submission.propertyAddress.trim() === "") {

            errors.push("Property Address is required.");

        }

        if (!submission.inspectionType || submission.inspectionType.trim() === "") {

            errors.push("Inspection Type is required.");

        }

        if (!submission.signature || submission.signature === "") {

            errors.push("Client signature is required.");

        }

        if (!submission.agreementAccepted) {

            errors.push("Agreement must be accepted.");

        }

    }

    return {

        valid: errors.length === 0,

        errors: errors

    };

}; 
/*==================================================
  PART 3
  Generate Agreement ID
==================================================*/

AgreementEngine.generateAgreementID = function () {

    const year = new Date().getFullYear();

    const counterKey = "agreementCounter";

    let counter = parseInt(localStorage.getItem(counterKey) || "0", 10);

    counter++;

    localStorage.setItem(counterKey, counter);

    const id = `AGR-${year}-${String(counter).padStart(6, "0")}`;

    engineLog("Agreement ID Generated: " + id);

    return id;

};
/*==================================================
  PART 4
  Generate Signed PDF
==================================================*/

AgreementEngine.generateSignedPDF = async function (agreement) {

    engineLog("Generating Signed PDF...");

    const pdfFileName = `${agreement.agreementId}.pdf`;

    // Placeholder for PDF generation.
    // This will later use jsPDF / html2pdf and embed:
    // - Client details
    // - Inspection details
    // - Terms & Conditions
    // - Client signature
    // - Inspector details
    // - Agreement ID
    // - Date submitted

    agreement.pdf = {
        generated: true,
        fileName: pdfFileName,
        created: new Date().toISOString()
    };

    engineLog("Signed PDF Ready: " + pdfFileName);

    return agreement;

};
/*==================================================
  PART 5
  Generate Invoice
==================================================*/

AgreementEngine.generateInvoice = async function (agreement) {

    engineLog("Generating Invoice...");

    const invoiceNumber =
        "INV-" +
        agreement.agreementId.replace("AGR-", "");

    agreement.invoice = {

        invoiceNumber: invoiceNumber,

        issueDate: new Date().toISOString(),

        dueDate: new Date().toISOString(),

        amount: agreement.totalPrice || 0,

        gst: agreement.gst || 0,

        total: agreement.totalPrice || 0,

        paymentStatus: "Pending",

        paidDate: null

    };

    agreement.paymentStatus = "Pending";

    engineLog("Invoice Created: " + invoiceNumber);

    return agreement;

}; 
/*==================================================
  PART 6
  Save Received Agreement
==================================================*/

AgreementEngine.saveReceivedAgreement = async function (agreement) {

    engineLog("Saving agreement...");

    const receivedAgreements = JSON.parse(

        localStorage.getItem("receivedAgreements") || "[]"

    );

    agreement.receivedDate = new Date().toLocaleDateString("en-AU");

    agreement.status = "Processed";

    agreement.paymentStatus = "Pending";

    agreement.processed = true;

    agreement.processedDate = new Date().toISOString();

    receivedAgreements.push(agreement);

    localStorage.setItem(

        "receivedAgreements",

        JSON.stringify(receivedAgreements)

    );

    engineLog("Agreement saved to Received Agreements.");

    return agreement;

};

/*==================================================
  Remove From Sent Agreements
==================================================*/

AgreementEngine.removeSentAgreement = function (agreement) {

    const sentAgreements = JSON.parse(

        localStorage.getItem("sentAgreements") || "[]"

    );

    const updatedList = sentAgreements.filter(item => {

        return item.id !== agreement.id;

    });

    localStorage.setItem(

        "sentAgreements",

        JSON.stringify(updatedList)

    );

    engineLog("Agreement removed from Sent Agreements.");

}; 
/*==================================================
  PART 7
  Notification Engine
==================================================*/

AgreementEngine.sendNotifications = async function (agreement) {

    engineLog("Preparing notifications...");

    const notifications = {

        client: {

            email: agreement.email || "",

            subject:
                "SiteScop - Signed Inspection Agreement",

            attachments: [

                agreement.pdf?.fileName || null,

                agreement.invoice?.invoiceNumber || null

            ]

        },

        company: {

            email: "info@sitescop.com.au",

            subject:
                "New Client Agreement Submitted",

            attachments: [

                agreement.pdf?.fileName || null,

                agreement.invoice?.invoiceNumber || null

            ]

        }

    };

    /*
        Future Email Integration

        Client receives:

        ✓ Signed Agreement PDF
        ✓ Invoice PDF

        SiteScop receives:

        ✓ Signed Agreement PDF
        ✓ Invoice PDF
        ✓ Client Details
        ✓ Agreement ID

    */

    agreement.notifications = {

        sent: false,

        prepared: true,

        preparedDate: new Date().toISOString()

    };

    engineLog("Notifications prepared.");

    return agreement;

}; 
/*==================================================
  PART 8
  Payment Engine
==================================================*/

AgreementEngine.processPayment = async function (agreement) {

    engineLog("Creating payment record...");

    agreement.payment = {

        status: "Pending",

        invoiceNumber: agreement.invoice
            ? agreement.invoice.invoiceNumber
            : "",

        amount: agreement.invoice
            ? agreement.invoice.total
            : 0,

        paidAmount: 0,

        balance: agreement.invoice
            ? agreement.invoice.total
            : 0,

        paymentMethod: "",

        paymentReference: "",

        invoiceDate: new Date().toISOString(),

        dueDate: null,

        paidDate: null

    };

    agreement.paymentStatus = "Pending";

    engineLog("Payment record created.");

    return agreement;

};

/*==================================================
  Mark As Paid
==================================================*/

AgreementEngine.markAsPaid = function (agreement) {

    if (!agreement.payment) return agreement;

    agreement.payment.status = "Paid";

    agreement.payment.paidAmount =
        agreement.payment.amount;

    agreement.payment.balance = 0;

    agreement.payment.paidDate =
        new Date().toISOString();

    agreement.paymentStatus = "Paid";

    engineLog("Agreement marked as Paid.");

    return agreement;

};

/*==================================================
  Check Payment
==================================================*/

AgreementEngine.isPaid = function (agreement) {

    return agreement.paymentStatus === "Paid";

}; 
/*==================================================
  PART 9
  Inspection Job Engine
==================================================*/

AgreementEngine.createInspectionJob = async function (agreement) {

    engineLog("Creating inspection job...");

    const inspectionJobs = JSON.parse(

        localStorage.getItem("inspectionJobs") || "[]"

    );

    const jobNumber =

        "JOB-" +

        String(inspectionJobs.length + 1).padStart(6,"0");

    const inspectionJob = {

        jobId: jobNumber,

        agreementId: agreement.agreementId,

        invoiceNumber: agreement.invoice
            ? agreement.invoice.invoiceNumber
            : "",

        clientName: agreement.clientName,

        email: agreement.email,

        mobile: agreement.mobile,

        propertyAddress: agreement.propertyAddress,

        inspectionType: agreement.inspectionType,

        paymentStatus: agreement.paymentStatus,

        status: "Scheduled",

        createdDate: new Date().toISOString(),

        inspector: "",

        inspectionDate: "",

        inspectionTime: "",

        reportStatus: "Not Started"

    };

    inspectionJobs.push(inspectionJob);

    localStorage.setItem(

        "inspectionJobs",

        JSON.stringify(inspectionJobs)

    );

    agreement.jobId = jobNumber;

    agreement.jobCreated = true;

    agreement.jobCreatedDate = new Date().toISOString();

    engineLog("Inspection Job Created: " + jobNumber);

    return agreement;

};

/*==================================================
  Get Inspection Job
==================================================*/

AgreementEngine.getInspectionJob = function (jobId) {

    const inspectionJobs = JSON.parse(

        localStorage.getItem("inspectionJobs") || "[]"

    );

    return inspectionJobs.find(

        job => job.jobId === jobId

    );

}; 

window.AgreementEngine = AgreementEngine;
