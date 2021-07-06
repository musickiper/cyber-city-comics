const API_BASE_URL = "https://xkcd.vercel.app/?comic=";

function getComicStrip() {
  const currentUrl = new URL(document.location);
  const { pathname } = currentUrl;
  const id = parseInt(pathname.split("/")[1]);

  let apiUrl;

  if (id) {
    if (id <= 0) {
      window.alert("Comic Strip # must be positive!");
      window.location.href = "/";
    } else {
      apiUrl = `${API_BASE_URL}${id}`;
    }
  } else {
    apiUrl = `${API_BASE_URL}latest`;
  }

  fetch(apiUrl, { mode: "cors" })
    .then((response) => {
      if (response.status === 200) {
        response.json().then((comic) => {
          const {
            alt,
            day,
            img,
            month,
            num,
            safe_title,
            title,
            transcript,
            year,
          } = comic;

          // Write Strip Image
          const comicStripImg = document.querySelector(".comic-strip__image");
          comicStripImg.src = img;
          comicStripImg.alt = alt;

          // Write Strip Title
          const comicStripTitle = document.querySelector(".comic-strip__title");
          comicStripTitle.textContent = title || safe_title;

          // Write Strip Created At
          const comicStripCreatedAt =
            document.querySelector(".created-at__time");
          const monthFormat = `${parseInt(month) < 10 ? "0" : ""}${month}`;
          const dayFormat = `${parseInt(day) < 10 ? "0" : ""}${day}`;
          comicStripCreatedAt.textContent = `${year}-${monthFormat}-${dayFormat}`;

          // Write Strip Transcript
          const comicStripTranscript = document.querySelector(
            ".comic-strip__transcript"
          );
          const transcriptFormat = transcript.replaceAll("\n", "\n\n");
          comicStripTranscript.textContent = transcriptFormat;

          // Handle Buttons
          fetch(`${API_BASE_URL}latest`, { mode: "cors" })
            .then((response) => {
              if (response.status === 200) {
                response.json().then((latestComic) => {
                  const latestComicNum = latestComic.num;
                  const currentComicNum = num;

                  const prevBtn = document.querySelector("#prev-btn");
                  const nextBtn = document.querySelector("#next-btn");
                  const randBtn = document.querySelector("#rand-btn");

                  prevBtn.onclick = function () {
                    window.location.href = `/${currentComicNum - 1}`;
                  };

                  nextBtn.onclick = function () {
                    window.location.href = `/${currentComicNum + 1}`;
                  };

                  randBtn.onclick = function () {
                    const min = Math.ceil(0);
                    const max = Math.floor(currentComicNum);
                    const randomNum = Math.floor(
                      Math.random() * (max - min + 1) + min
                    );
                    window.location.href = `/${randomNum}`;
                  };

                  if (currentComicNum === 1) {
                    prevBtn.disabled = true;
                    prevBtn.classList.add("disabled");
                  } else if (currentComicNum === latestComicNum) {
                    nextBtn.disabled = true;
                    nextBtn.classList.add("disabled");
                  }
                });
              }
            })
            .catch((error) => {
              log("Request failed", error);
            });
        });

        // Increment view count and get it
        fetch(`/strip/${id}`, {
          method: "PUT",
        }).then((response) => {
          if (response.status === 200) {
            response.json().then((strip) => {
              const counterNumber = document.querySelector(".counter__number");
              counterNumber.textContent = strip.viewCount;
            });
          }
        });
      }
    })
    .then(() => {
      // Toggle loader after all contents are loaded
      const loaderContainer = document.querySelector(".loader-container");
      loaderContainer.classList.add("hidden");
    })
    .catch((error) => {
      log("Request failed", error);
    });
}

window.onload = getComicStrip;
