// ===================================
// SITESCOP V4 INSPECTION CORE
// ===================================

let currentJob = null;

// =============================
// LOAD CURRENT JOB
// =============================

function loadCurrentJob(){

    const job =
    localStorage.getItem("currentJob");

    if(!job){

        alert("No active job found");

        location.href = "index.html";

        return;

    }

    currentJob = JSON.parse(job);

}

// =============================
// SAVE CURRENT JOB
// =============================

function saveCurrentJob(){

    if(!currentJob) return;

    localStorage.setItem(
        "currentJob",
        JSON.stringify(currentJob)
    );

}

// =============================
// UPDATE JOB
// =============================

function updateJob(){

    if(!currentJob) return;

    const jobs = getJobs();

    const index =
    jobs.findIndex(
        j => j.id === currentJob.id
    );

    if(index === -1) return;

    jobs[index] = currentJob;

    saveJobs(jobs);

    localStorage.setItem(
        "currentJob",
        JSON.stringify(currentJob)
    );

    alert("Job Updated");

}

// =============================
// SAVE DRAFT
// =============================

function saveDraft(){

    currentJob.status =
    "Draft";

    updateJob();

    alert("Draft Saved");

}

// =============================
// COMPLETE JOB
// =============================

function completeCurrentJob(){

    const answer =
    confirm(
        "Complete this inspection?"
    );

    if(!answer) return;

    completeJob(
        currentJob.id
    );

    alert(
        "Job moved to Completed Jobs"
    );

    location.href =
    "completed-jobs.html";

}

// =============================
// ADD LINE
// =============================

function addLine(containerId){

    const container =
    document.getElementById(
        containerId
    );

    const input =
    document.createElement("input");

    input.type = "text";

    input.placeholder =
    "Enter details";

    input.className =
    "dynamic-line";

    container.appendChild(input);

}

// =============================
// ADD FINDING
// =============================

function addFinding(containerId){

    const container =
    document.getElementById(
        containerId
    );

    const box =
    document.createElement("textarea");

    box.rows = 4;

    box.placeholder =
    "Enter finding";

    box.className =
    "finding-box";

    container.appendChild(box);

}

// =============================
// GO BACK
// =============================

function goBack(){

    const answer =
    confirm(
        "Return to Dashboard?"
    );

    if(answer){

        location.href =
        "index.html";

    }

}

// =============================
// PREVIEW REPORT
// =============================

function previewReport(){

    alert(
        "Report Preview Coming Soon"
    );

}

// =============================
// GENERATE PDF
// =============================

function generatePDF(){

    alert(
        "PDF Engine Coming Soon"
    );

}
