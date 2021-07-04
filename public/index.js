const API_URL = "https://xkcd.vercel.app/?comic=latest"; // Needs to be replaced

function getComicStrip() {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status === 200) {
      console.dir(xhr.responseText);
    } else {
      console.error(xhr.responseText);
    }
  };
  xhr.open("GET", API_URL);
  xhr.send();
}

window.onload = getComicStrip;
