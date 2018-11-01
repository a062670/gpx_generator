const axios = require("axios");
const fs = require("fs");
const key = "";
const locations = [
  "22.935499,120.222572",
  "22.936431,120.226074",
  "22.937158,120.225944",
  "22.937207,120.227015",
  "22.937081,120.227528",
  "22.936440,120.227823",
  "22.935921,120.227803",
  "22.935626,120.226767",
  "22.935383,120.226193",
  "22.935121,120.224893",
  "22.934513,120.223461"
];
run();

async function run() {
  let wpts = [];
  for (let location of locations) {
    let geo = await getGeo(location);
    wpts.push(
      `<wpt lat="${geo.location.lat}" lon="${
        geo.location.lng
      }" ele="${geo.elevation.toFixed(6)}"></wpt>`
    );
  }
  let xml = `
<?xml version="1.0"?>
<gpx version="1.1" creator="pokego2">
${wpts.join("")}
</gpx>
  `;

  if (fs.existsSync("gpx.xml")) {
    fs.unlinkSync("gpx.xml");
  }

  fs.writeFileSync("gpx.xml", xml, "utf8");
}

function getGeo(location) {
  return new Promise(resolve => {
    axios({
      method: "get",
      url: `https://maps.googleapis.com/maps/api/elevation/json?locations=${location}&key=${key}`
    }).then(response => {
      console.log(response.data.results[0].elevation);
      resolve(response.data.results[0]);
    });
  });
}
