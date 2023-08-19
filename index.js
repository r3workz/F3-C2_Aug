const startScreen = document.getElementById("start")
const loaderScreen = document.getElementById("loader")
const mainScreen = document.getElementById("mainPage")

const startBtn = document.getElementById("btnStart")

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

async function fillUserData() {

    // // This was redundant
    // const apiKey = 'NVM';
    // function json(url) {
    //     return fetch(url).then(res => res.json());
    // }
    // json(`https://api.ipdata.co?api-key=${apiKey}`)
    //     .then(data => {
    //    set dom data here
    //     });

    const request = await fetch("https://ipinfo.io/json?token=4e42a56b19eaad")
    const data = await request.json()

    console.log(data)

    ipAddressField.textContent = `${data.ip}`;
    cityField.textContent = `${data.city}`;
    regionField.textContent = `${data.region}, ${data.country}`;
    latitudeField.textContent = `${data.loc.split(',')[0]}`;
    longitudeField.textContent = `${data.loc.split(',')[1]}`;
    timeZoneField.textContent = `${data.timezone}`
    organisationField.textContent = `${data.org}`

    let formattedTime = new Date().toLocaleString("en-US",
        {
            timeZone: data.timezone,
            // format: "dd/MM/yyyy, HH:mm:ss"
        });
    dateTimeField.textContent = `${formattedTime}`
    pinCodeField.textContent = `${data.postal}`

    messageField.textContent = `Hello Welcome to my Contest Project`
    mapBox.innerHTML = `<iframe src="https://maps.google.com/maps?q=${data.loc}&z=13&output=embed"></iframe>`




}

document.addEventListener("DOMContentLoaded",()=>{
    startScreen.classList.remove('hidden');
    loaderScreen.classList.add('hidden')
})

startBtn.addEventListener("click",()=>{
    startScreen.classList.add('hidden');
    loaderScreen.classList.remove('hidden')
    fillUserData();
    setTimeout(()=> {
            mainScreen.classList.remove('hidden')
            loaderScreen.classList.add('hidden')
        }
        ,4000);


})

// TODO fetch & list PostOffices
