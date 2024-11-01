// get the client ip address in initial render
const ip_text = document.getElementById("ip-text");
const startBtn = document.getElementById("start-btn");
const ip_section = document.getElementById("ip-section");
const main_section = document.querySelector(".main-section");
const search_bar = document.getElementById("search-bar");
let postOffices = [];

let ipInfo = {};
let userInfo = {};

// ip address fetch, Resource : https://www.geeksforgeeks.org/how-to-get-client-ip-address-using-javascript/#by-using-the-ipinfo
async function fetchIpAddress() {
  try {
    const response = await fetch("https://ipinfo.io/json");

    const data = await response.json();

    ipInfo = { ...data };

    console.log("Ip-info : ", ipInfo);

    if (ipInfo.ip) {
      ip_text.innerText = ipInfo.ip;
    }
  } catch (err) {
    console.log(err, "Error in fetching ip address");
  }
}

function appendPostOfficesInDOM(postOffices) {
  const postContainer = document.getElementById("post-container");

  postContainer.innerHTML = "";

  postOffices.map((post) => {
    const div = document.createElement("div");
    div.className = "post-office";
    console.log("POST : ", post);
    div.innerHTML = `<p>Name : <span>${post.Name}</span></p>
        <p>Branch Type : <span>${post.BranchType}</span></p>
        <p>Delivery Status : <span>${post.DeliveryStatus}</span></p>
        <p>District : <span>${post.District}</span></p>
        <p>Division " <span>${post.Division}</span></p>`;

    postContainer.appendChild(div);
  });
}

async function fetchPostOffices() {
  const pincode = userInfo.postal;

  console.log("Pincode Is : ", pincode);

  const response = await fetch(
    `https://api.postalpincode.in/pincode/${pincode}`
  );
  const data = await response.json();

  postOffices = [...data[0].PostOffice];
  console.log("Post Offices : ", postOffices);

  appendPostOfficesInDOM(postOffices);
}

// function to fetch user information using ip address
async function fetchUserInfo() {
  const response = await fetch(`https://ipapi.co/${ipInfo.ip}/json/`);

  const data = await response.json();
  userInfo = { ...data };
  console.log("User Infor : ", userInfo);

  const ipSectionIp = document.getElementById("ip-section-ip");

  ipSectionIp.innerText = userInfo.ip;

  // show the ip section and hide the landing page
  main_section.id = "display-none";
  ip_section.removeAttribute("class");

  // display the information in ip section
  //   <div id="lat">Lat:</div>
  //   <div id="city">City:</div>
  //   <div id="org">Organisation:</div>
  //   <div id="long">Long:</div>
  //   <div id="region">Region:</div>
  //   <div id="hostname">Hostname:</div>

  const lat = document.getElementById("lat");
  const long = document.getElementById("long");
  const hostname = document.getElementById("hostname");
  const region = document.getElementById("region");
  const city = document.getElementById("city");
  const org = document.getElementById("org");

  if (userInfo.latitude) {
    lat.innerText = "Lat : " + userInfo.latitude;
  }

  if (userInfo.longitude) {
    long.innerText = "Long : " + userInfo.longitude;
  }

  if (userInfo.city) {
    city.innerText = "City : " + userInfo.city;
  }

  if (userInfo.hostname) {
    hostname.innerText = "Hostname : " + userInfo.hostname;
  }

  if (userInfo.region) {
    region.innerText = "Region : " + userInfo.region;
  }

  if (userInfo.org) {
    org.innerText = "Organisation : " + userInfo.org;
  }

  // step 4 show the data in field (time zone etc)

  //   <p>Time Zone : <span id="time-zone"></span></p>
  //   <p>Date and Time : <span id="date-and-time"></span></p>
  //   <p>Pincode : <span id="pincode"></span></p>

  const timeZone = document.getElementById("time-zone");
  const dateAndTime = document.getElementById("data-and-time");
  const pincode = document.getElementById("pincode");

  if (userInfo.timezone) {
    timeZone.innerText = userInfo.timezone;
  }

  //   dateAndTime.innerText = new Date().toDateString();

  if (userInfo.postal) {
    pincode.innerText = userInfo.postal;
  }

  // step 5 find post offices
  fetchPostOffices();
}

// step 1 -> fetch the ip address in initial render
document.addEventListener("DOMContentLoaded", fetchIpAddress);

// step 2 -> fetch the user information using ip address saved in previous step
startBtn.addEventListener("click", fetchUserInfo);

// step 4, step 5, step 6 -> show the time zones(already done in step 2)

// step 6 (search functionality)

search_bar.addEventListener("change", (e) => {
  let value = e.target.value;
  value = value.toLowerCase();

  if (value) {
    let filteredPost = postOffices.filter((post) =>
      post.Name.toLowerCase().includes(value)
    );
    appendPostOfficesInDOM(filteredPost);
  }
});
