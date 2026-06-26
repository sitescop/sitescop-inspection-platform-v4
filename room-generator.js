// ======================================================
// SiteScop V4 - Dynamic Room Generator V2
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    const bathroomInput = document.getElementById("bathroomCount");
    const bedroomInput = document.getElementById("bedroomCount");

    if (bathroomInput) {
        bathroomInput.addEventListener("change", generateBathrooms);
    }

    if (bedroomInput) {
        bedroomInput.addEventListener("change", generateBedrooms);
    }

});


async function generateBathrooms(){

    await generateRoom({

        countId:"bathroomCount",

        containerId:"bathroomContainer",

        template:"./bathroom.html",

        title:"Bathroom"

    });

}


async function generateBedrooms(){

    await generateRoom({

        countId:"bedroomCount",

        containerId:"bedroomContainer",

        template:"./bedroom.html",

        title:"Bedroom"

    });

}


async function generateRoom(config){

    const input=document.getElementById(config.countId);

    if(!input) return;

    const count=parseInt(input.value)||0;

    const container=document.getElementById(config.containerId);

    if(!container) return;

    container.innerHTML="";

    if(count===0) return;

    const response=await fetch(config.template);

    const template=await response.text();

    for(let i=1;i<=count;i++){

        const room=document.createElement("div");

        room.className="accordion";

        room.innerHTML=`

<div class="accordion">

<div class="accordion-header">

${config.title} ${i}

</div>

<div class="accordion-content">

${template}

</div>

</div>

`;

        container.appendChild(room);

    }

    initialiseDynamicRooms();

} 
// ======================================================
// Initialise Dynamic Rooms
// ======================================================

function initialiseDynamicRooms() {

    // -----------------------------
    // Room Accordions
    // -----------------------------
    document.querySelectorAll(".accordion-header").forEach(header => {

        if (header.dataset.initialised) return;

        header.dataset.initialised = "true";

        header.addEventListener("click", function () {

            const content = this.nextElementSibling;

            if (!content) return;

            const room = this.closest(".accordion");

            if (!room) return;

            room.parentElement
                .querySelectorAll(":scope > .accordion > .accordion-content")
                .forEach(panel => {

                    if (panel !== content) {
                        panel.style.display = "none";
                    }

                });

            room.parentElement
                .querySelectorAll(":scope > .accordion > .accordion-header")
                .forEach(h => {

                    if (h !== this) {
                        h.classList.remove("active");
                    }

                });

            if (content.style.display === "block") {

                content.style.display = "none";
                this.classList.remove("active");

            } else {

                content.style.display = "block";
                this.classList.add("active");

            }

        });

    });

    // -----------------------------
    // Bathroom Fixture Toggle
    // -----------------------------
    document.querySelectorAll(".fixture-toggle").forEach(box => {

        if (box.dataset.initialised) return;

        box.dataset.initialised = "true";

        box.addEventListener("change", function () {

            const target =
                document.getElementById(this.dataset.target);

            if (!target) return;

            target.style.display =
                this.checked ? "block" : "none";

        });

    });

} 
// ======================================================
// Save / Restore Dynamic Rooms
// ======================================================

function saveRoomCounts() {

    const bathroomCount = document.getElementById("bathroomCount");
    const bedroomCount = document.getElementById("bedroomCount");

    localStorage.setItem(
        "sitescopBathroomCount",
        bathroomCount ? bathroomCount.value : 0
    );

    localStorage.setItem(
        "sitescopBedroomCount",
        bedroomCount ? bedroomCount.value : 0
    );

}

async function restoreRoomCounts() {

    const bathroomCount =
        localStorage.getItem("sitescopBathroomCount");

    const bedroomCount =
        localStorage.getItem("sitescopBedroomCount");

    if (bathroomCount !== null) {

        const input =
            document.getElementById("bathroomCount");

        if (input) {

            input.value = bathroomCount;

            await generateBathrooms();

        }

    }

    if (bedroomCount !== null) {

        const input =
            document.getElementById("bedroomCount");

        if (input) {

            input.value = bedroomCount;

            await generateBedrooms();

        }

    }

}

document.addEventListener("DOMContentLoaded", async () => {

    await restoreRoomCounts();

    const bathroomInput =
        document.getElementById("bathroomCount");

    if (bathroomInput) {

        bathroomInput.addEventListener("change", saveRoomCounts);

    }

    const bedroomInput =
        document.getElementById("bedroomCount");

    if (bedroomInput) {

        bedroomInput.addEventListener("change", saveRoomCounts);

    }

});
