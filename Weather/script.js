const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".location-container");
const formContainer=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const weatherScreen=document.querySelector(".weather-info");
const bgImage=document.querySelector(".container");
const giveError=document.querySelector(".error");

let currentTab = userTab;
const API_KEY = "e43e914d1ca29196fd6f2a323d9850e8";
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab != currentTab){            //pehle tab ka background color set kiye
        //bgImage.style.backgroundImage="linear-gradient(160deg, #112d4e 0%, #3f72af 100%)";
        giveError.classList.remove("active");
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        

        if(!formContainer.classList.contains("active")){     //form container ke liye check kiye aur add kiye
            weatherScreen.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            formContainer.classList.add("active");
            
        }

        else{
            //pehle search wale pe tha ab your weather ko visible krna hai
            formContainer.classList.remove("active");
            weatherScreen.classList.remove("active");
            
            //your weather tab me aa gaye, toh coordinates check karenge ki save kiya hai ya nahi
            getfromSessionStorage();
        }
    }
}

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
})

userTab.addEventListener("click", () => {
    switchTab(userTab);
})

//checks if coordinates are present in session storage
function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //local coordinate nahi mila
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon}=coordinates;
    //grantlocation screen se hata rahe
    grantAccessContainer.classList.remove("active");
    //loader visible 
    loadingScreen.classList.add("active");

    //ab API call
    try{
        const response =await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const data = await response.json();

        //loader ko hatana
        loadingScreen.classList.remove("active");
        weatherScreen.classList.add("active");

        //dynamically values dalne ke liye
        renderWeatherInfo(data);}

    
    catch(err){
        
        }
}

function renderWeatherInfo(weatherInfo){
    
    //background Image change
    const weatherID=weatherInfo?.weather?.[0]?.id;
    getbackgroundImage(weatherID);
    //first,fetch the elements
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-wind]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //fetch values from weatherINfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${(weatherInfo?.main?.temp - 273).toFixed(2)} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
    
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("Geolocation feature unsupported!");
    }
}

function showPosition(position){
    const userCoordinates={
        lat : position.coords.latitude,
        lon : position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

let searchInput=document.querySelector("[data-searchInput]");
formContainer.addEventListener("submit",(e) => {
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName === ""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response =await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
        if(!response.ok){
            loadingScreen.classList.remove("active");
            weatherScreen.classList.remove("active");
            giveError.classList.add("active");
        }
        else{
        const data = await response.json();

        //loader ko hatana
        loadingScreen.classList.remove("active");
        weatherScreen.classList.add("active");
        giveError.classList.remove("active");
        //dynamically values dalne ke liye
        renderWeatherInfo(data);
        }
    }
    catch(err){
        loadingScreen.classList.remove("active");
        //unfinished
    }
}

async function getbackgroundImage(id){
    let sID=id.toString();
    if(sID.startsWith("5")){
        bgImage.style.cssText=await "background-image: url(https://images.pexels.com/photos/414491/pexels-photo-414491.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2);background-size:cover;opacity:90%";
    }
    else
    if(sID.startsWith("3")){
        bgImage.style.cssText=await "background-image: url(https://images.pexels.com/photos/1488402/pexels-photo-1488402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2);background-size:cover;opacity:90%";
    }
    else
    if(sID.startsWith("2")){
        bgImage.style.cssText=await "background-image: url(https://images.pexels.com/photos/167755/pexels-photo-167755.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2);background-size:cover;opacity:90%";
    }
    else
    if(sID.startsWith("6")){
        bgImage.style.cssText=await "background-image: url(https://images.pexels.com/photos/54200/pexels-photo-54200.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2);background-size:cover;opacity:90%";
    }
    else
    if(sID.startsWith("7")){
        if(sID==="701" || sID==="741"){
            bgImage.style.cssText=await "background-image: url(https://images.pexels.com/photos/1367192/pexels-photo-1367192.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2);background-size:cover;";
        }
        else if(sID==="771" || sID==="781"){
            bgImage.style.cssText=await "background-image: url(https://images.pexels.com/photos/19481200/pexels-photo-19481200/free-photo-of-landscape-nature-sunset-clouds.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2);background-size:cover;";

        }
        else{
            bgImage.style.cssText=await "background-image: url(https://images.pexels.com/photos/257336/pexels-photo-257336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2);background-size:cover;opacity:90%";
        }
        
    }
    else
    if(sID==="800"){
        bgImage.style.cssText=await "background-image: url(https://images.pexels.com/photos/754419/pexels-photo-754419.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2);background-size:cover;opacity:90%";
    }
    else
    bgImage.style.cssText=await "background-image: url(https://images.pexels.com/photos/268917/pexels-photo-268917.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2);background-size:cover;opacity:90%";
}
