// SITESCOP V4 DATABASE

const STORAGE_KEYS = {

    JOBS: "siteScop_jobs",

    COMPLETED: "siteScop_completed_jobs",

    DELETED: "siteScop_deleted_jobs",

    SETTINGS: "siteScop_settings",

    COUNTER: "siteScop_job_counter"

};

// =========================
// JOB NUMBER
// =========================

function generateJobNumber(){

    let counter =
    Number(localStorage.getItem(STORAGE_KEYS.COUNTER) || 1);

    const jobNumber =
    "SC-" + String(counter).padStart(4,"0");

    localStorage.setItem(
        STORAGE_KEYS.COUNTER,
        counter + 1
    );

    return jobNumber;
}

// =========================
// ACTIVE JOBS
// =========================

function getJobs(){

    return JSON.parse(
        localStorage.getItem(STORAGE_KEYS.JOBS)
    ) || [];

}

function saveJobs(jobs){

    localStorage.setItem(
        STORAGE_KEYS.JOBS,
        JSON.stringify(jobs)
    );

}

function addJob(job){

    const jobs = getJobs();

    jobs.push(job);

    saveJobs(jobs);

}

// =========================
// COMPLETED JOBS
// =========================

function getCompletedJobs(){

    return JSON.parse(
        localStorage.getItem(STORAGE_KEYS.COMPLETED)
    ) || [];

}

function saveCompletedJobs(jobs){

    localStorage.setItem(
        STORAGE_KEYS.COMPLETED,
        JSON.stringify(jobs)
    );

}

// =========================
// DELETED JOBS
// =========================

function getDeletedJobs(){

    return JSON.parse(
        localStorage.getItem(STORAGE_KEYS.DELETED)
    ) || [];

}

function saveDeletedJobs(jobs){

    localStorage.setItem(
        STORAGE_KEYS.DELETED,
        JSON.stringify(jobs)
    );

}

// =========================
// MOVE TO RECYCLE BIN
// =========================

function deleteJob(jobId){

    const jobs = getJobs();

    const deleted = getDeletedJobs();

    const job =
    jobs.find(j => j.id === jobId);

    if(!job) return;

    deleted.push(job);

    saveDeletedJobs(deleted);

    const updated =
    jobs.filter(j => j.id !== jobId);

    saveJobs(updated);

}

// =========================
// RESTORE JOB
// =========================

function restoreJob(jobId){

    const deleted =
    getDeletedJobs();

    const jobs =
    getJobs();

    const job =
    deleted.find(j => j.id === jobId);

    if(!job) return;

    jobs.push(job);

    saveJobs(jobs);

    const updated =
    deleted.filter(j => j.id !== jobId);

    saveDeletedJobs(updated);

}

// =========================
// COMPLETE JOB
// =========================

function completeJob(jobId){

    const jobs =
    getJobs();

    const completed =
    getCompletedJobs();

    const job =
    jobs.find(j => j.id === jobId);

    if(!job) return;

    completed.push(job);

    saveCompletedJobs(completed);

    const updated =
    jobs.filter(j => j.id !== jobId);

    saveJobs(updated);

}

// =========================
// SETTINGS
// =========================

function saveSettings(settings){

    localStorage.setItem(
        STORAGE_KEYS.SETTINGS,
        JSON.stringify(settings)
    );

}

function getSettings(){

    return JSON.parse(
        localStorage.getItem(STORAGE_KEYS.SETTINGS)
    ) || {};

}
