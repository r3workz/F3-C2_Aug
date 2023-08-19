const startScreen = document.getElementById("start")
const loaderScreen = document.getElementById("loader")
const mainScreen = document.getElementById("mainPage")

const startBtn = document.getElementById("btnStart")

const ipHomeField = document.getElementById("ip")
const ipAddressField = document.getElementById("userIp")
const latitudeField = document.getElementById("userLat")
const longitudeField = document.getElementById("userLong")
const cityField = document.getElementById("userCity")
const regionField = document.getElementById("userReg")
const timeZoneField = document.getElementById("userTimeZone")
const organisationField = document.getElementById("userOrg")
const hostnameField = document.getElementById("userHost")
const dateTimeField = document.getElementById("userDateTime")
const pinCodeField = document.getElementById("userPin")
const messageField = document.getElementById("userMsg")

const mapBox = document.getElementById("mapBox")

const searchInput = document.getElementById("searchPO")

const poListContainer = document.getElementById("viewPostOffices")

let pCode;
let poData;

function json(url) {
    return fetch(url).then(res => res.json());
}

// fetch and return ip data
async function fetchData() {
    try {
        const request = await fetch("https://ipinfo.io/json?token=4e42a56b19eaad")
        return await request.json();

    } catch (error) {
        console.log(error)
        document.body.alert(error);
    }
}


async function fillUserData() {
    // // This was redundant
    // const apiKey = 'API_KEY';
    // function json(url) {
    //     return fetch(url).then(res => res.json());
    // }
    // json(`https://api.ipdata.co?api-key=${apiKey}`)
    //     .then(data => {
    //    set dom data here
    //     });
    fetchData().then(async (userData) => {
        pCode = userData.postal
        await getPOList(pCode).then((data) => poData = data)
            .catch((error) => {
                console.log(error)
                document.body.alert(error);
            })
        ipAddressField.textContent = `${userData.ip}`;
        cityField.textContent = `${userData.city}`;
        regionField.textContent = `${userData.region}, ${userData.country}`;
        latitudeField.textContent = `${userData.loc.split(',')[0]}`;
        longitudeField.textContent = `${userData.loc.split(',')[1]}`;
        timeZoneField.textContent = `${userData.timezone}`
        organisationField.textContent = `${userData.org}`

        let formattedTime = new Date().toLocaleString("en-US",
            {
                timeZone: userData.timezone,
                // format: "dd/MM/yyyy, HH:mm:ss"
            });
        dateTimeField.textContent = `${formattedTime}`
        pinCodeField.textContent = `${userData.postal}`
        messageField.textContent = `Hello Welcome to my Contest Project`
        mapBox.innerHTML = `<iframe src="https://maps.google.com/maps?q=${userData.loc}&z=13&output=embed"></iframe>`
        // Build PO List
        build(pCode)

    }).catch((error) => {
        console.log(error)
        document.body.alert(error);
    });


}


function getPOList(pinCode) {
    return json(`https://api.postalpincode.in/pincode/${pinCode}`);
}

function searchPOs(searchTerm, data) {
    const filteredPOs = [];
    for (const po of data[0].PostOffice) {
        if (po.Name.toLowerCase().includes(searchTerm.toLowerCase()) || po.BranchType.toLowerCase().includes(searchTerm.toLowerCase()) || po.District.toLowerCase().includes(searchTerm.toLowerCase())) {
            filteredPOs.push(po);
        }
    }
    return filteredPOs;
}

function build(pinCode) {
    console.log(poData)
    const filteredPOs = searchPOs(searchInput.value, poData);

    poListContainer.innerHTML = "";

    for (const postOffice of filteredPOs) {
        const div = document.createElement("div");
        div.classList.add("poListItem");

        const nameDiv = document.createElement("div");
        const nameSpan = document.createElement("span");
        nameSpan.id = "poName";
        nameSpan.innerText = postOffice.Name;
        nameDiv.innerHTML = `Name:`;
        nameDiv.appendChild(nameSpan)
        div.appendChild(nameDiv);

        const branchTypeDiv = document.createElement("div");
        branchTypeDiv.innerText = "Branch Type: ";
        const branchTypeSpan = document.createElement("span");
        branchTypeSpan.id = "poBranchType";
        branchTypeSpan.innerText = postOffice.BranchType;
        branchTypeDiv.appendChild(branchTypeSpan)
        div.appendChild(branchTypeDiv);

        const delStatsDiv = document.createElement("div");
        delStatsDiv.innerText = "Delivery Status: ";
        const delStatsSpan = document.createElement("span");
        delStatsSpan.id = "poDelStats";
        delStatsSpan.innerText = postOffice.DeliveryStatus;
        delStatsDiv.appendChild(delStatsSpan);
        div.appendChild(delStatsDiv);

        const distDiv = document.createElement("div");
        distDiv.innerText = "District: ";
        const distSpan = document.createElement("span");
        distSpan.id = "poDist";
        distSpan.innerText = postOffice.District;
        distDiv.appendChild(distSpan);
        div.appendChild(distDiv);

        const divDivision = document.createElement("div");
        divDivision.innerText = "Division: ";
        const divSpan = document.createElement("span");
        divSpan.id = "poDivision";
        divSpan.innerText = postOffice.Division;
        divDivision.appendChild(divSpan);
        div.appendChild(divDivision);

        poListContainer.appendChild(div)
    }

    // await getPOList(pinCode)

}


// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    fetchData().then((data) => {
        ipHomeField.innerText = data.ip;
    }).catch((error) => {
        console.log(error)
        document.body.alert(error);
    });
    startScreen.classList.remove('hidden');
    loaderScreen.classList.add('hidden')
})

startBtn.addEventListener("click", async () => {
    startScreen.classList.add('hidden');
    loaderScreen.classList.remove('hidden')
    await fillUserData();
    setTimeout(() => {
            mainScreen.classList.remove('hidden')
            loaderScreen.classList.add('hidden')
        },
        // 0
        2000
    );
})

searchInput.addEventListener("keyup", () => {
    build(pCode);
});

