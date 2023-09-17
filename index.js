const userTab = document.querySelector("[data-userWeather]");

const searchTab = document.querySelector("[data-searchWeather]");

const userContainer = document.querySelector(".weather-container");

const grantAccesssContainer = document.querySelector(".grant-location-container");

const searchForm = document.querySelector("[data-searchForm]");

const loadingScreen = document.querySelector(".loading-container");

const userInfoConatiner = document.querySelector(".user-info-container");



let oldTab = userTab;
const API_KEY = "b848e945998bb19d9cb9be87e55386b0";
oldTab.classList.add("current-tab");
getfromSessionStorage();

//pennding??


function switchTab(newTab) {
    if (newTab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        newTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")) {
            //ky search form wla container is visible , if yes then make it visible
            userInfoConatiner.classList.remove("active");
            grantAccesssContainer.classList.remove("active");
            searchForm.classList.add("active");
        }

        else {
            //main phle search tab  pr tha, ab your wether tab visible krna hai
            searchForm.classList.remove("active");
            userInfoConatiner.classList.remove("active");
            //ab main your weather tab me aagya hu, toh weather bhi display krna padega so lets check local storage first
            // for coordinates, if we have saved them there.

            getfromSessionStorage();
        }
    }

}


userTab.addEventListener("click", () => {
    //pass clicked tab as input
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    //pass clicked tab as input
    switchTab(searchTab);
});

//check if cordinates are already present in session storage

function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if (!localCoordinates) {
        // agar localCoordinates nhii mile
        grantAccesssContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}

async function fetchUserWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;
    //make grant container invisible

    grantAccesssContainer.classList.remove("active");
    //make loader Visible
    loadingScreen.classList.add("active");

    //APi CaLL
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoConatiner.classList.add("active");

        renderWeatherInfo(data);

    }
    catch (err) {
        loadingScreen.classList.remove("active");
    }
}

function renderWeatherInfo(weatherInfo){
    //firstly we have to fetch the element
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");

    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");

    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
     const humidity = document.querySelector("[data-humidity]");
     const cloudiness = document.querySelector("[data-cloudiness]");

     //fetch values from api show in ui

     cityName.innerText = weatherInfo?.name;
     countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;

     desc.innerText = weatherInfo?.weather?.[0]?.description;
     weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;

     temp.innerText =  `${weatherInfo?.main?.temp} °C`;

     windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s` ;

     humidity.innerText = `${weatherInfo?.main?.humidity} %`;
     cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;


}

function getLocation() {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //show an alert for no geoloction available
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

let searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
    return;
    else
    fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoConatiner.classList.remove("active");
    grantAccesssContainer.classList.remove("active");

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoConatiner.classList.add("active");
        renderWeatherInfo(data);

    }
    catch(err){

    }
}


