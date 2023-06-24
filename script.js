// console.log("Hello! Raghav");
// const API_KEY = "e06ff62defcc72dcc102db2ff6e75e39";

// async function fetchWeatherDetails() {
//   // let lattitude=15.3333;
//   // let longitude=74.0833;

//   try {
//     let city = "goa";

//     const response = await fetch(
//       `https://api.openweathermap.org/data/2.5/  weather?q=${city}&appid=${API_KEY}&units=metric`
//     );

//     const data = await response.json();
//     console.log("Weather Data:-> ", data);

//     renderWeatherInfo(data);
//   } catch (err) {
//     //handle error
//     // console.log("Hello");
//   }
// }

// function renderWeatherInfo(data) {
//   let newPara = document.createElement("p");
//   newPara.textContent = `${data?.main?.temp.toFixed(2)}`;
//   document.body.appendChild(newPara);
// }

// async function getCustomWeatherDetails() {
//   try {
//     let lat = 15.6333;
//     let lon = 18.3333;

//     let result = await fetch(
//       `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
//     );
//     let data = await result.json();
//     console.log(data);
//   } catch (err) {
//     //handle error
//     console.log("ERROR occured");
//   }
// }

// <----------START------------>

const userTab = document.querySelector("[data-userWeather]");

const searchTab = document.querySelector("[data-searchWeather]");

const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(
  ".grant-location-container"
);

const searchForm = document.querySelector("[data-searchForm]");

const loadingScreen = document.querySelector(".loading-container");

const userInfoContainer = document.querySelector(".user-info-container");

//initially variables needed
let currentTab = userTab;
const API_KEY = "e06ff62defcc72dcc102db2ff6e75e39";
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab) {
  if (clickedTab != currentTab) {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    if (!searchForm.classList.contains("active")) {
      //kya searchform wala container invisible h
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      //ab weather tab m agya toh weather display krna pdega so lets check local storage first for coordinates it may have been saved there
      searchForm.classList.add("active");
    } else {
      //mai phle search vale tab pr tha
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      getfromSessionStorage();
    }
  }
}

userTab.addEventListener("click", () => {
  //pass clicked tab as input parameter
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  switchTab(searchTab);
});

//check if coordinates are already present in session storage
function getfromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    //agar nhi mile
    grantAccessContainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  //make frantcontainer invisible
  grantAccessContainer.classList.remove("activec");

  //make loader visible
  loadingScreen.classList.add("active");

  // API call
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    loadingScreen.classList.remove("active");
    //HW
  }
}

function renderWeatherInfo(weatherInfo) {
  //firstly we have to fetvh the elements
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");

  //fetch values from data retrieval and put in ui
  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = weatherInfo?.main?.temp;
  windspeed.innerText = weatherInfo?.wind?.speed;
  humidity.innerText = weatherInfo?.main?.humidity;
  cloudiness.innerText = weatherInfo?.clouds?.all;
}

function geoLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    //hw -- show an alert for no geolocation available
    alert("not supported");
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.lattitude,
    lon: position.coords.longitude,
  };

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", geoLocation);

const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let cityName = searchInput.value;

  if (cityName === "") {
    return;
  } else {
    fetchSearchWeatherInfo(cityName);
  }
});

async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    //hw
  }
}
