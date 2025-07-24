const player = document.querySelector("#playback");
const songCards = document.querySelectorAll(".card.playable");
const video = document.querySelector(".video");
const sizePlayer = document.querySelector(".modal");
const currentTime = document.querySelector(".curr-time");
const totalTime = document.querySelector(".tot-time");
const progress = document.querySelector(".progress-bar");
const playbackIcon = document.querySelector(".play-btn");
const nextIcon = document.querySelector(".next");
const pervIcon = document.querySelector(".prev");
const playerImg = document.querySelector(".player-img");
const playerTitle = document.querySelector(".player-title");
const playerAuthor = document.querySelector(".player-author");
const volumeControl = document.querySelector("#volume");
const searchBox = document.querySelector(".searchbar");
const searchInput = document.querySelector(".search-input");
const nowPlaying = document.querySelector(".now_playing");
const lyricsBox = document.querySelector(".lyrics-box");
const Morning = document.querySelector(".width-760");
const hour = new Date().getHours();
const Setting = document.querySelector(".setting");
const Stacklinks = document.querySelector(".stack-links");
const StackClose = document.querySelector(".close-stack");
const ClosePremium = document.querySelector(".close-premium");
const PremiumDiv = document.querySelector(".premium-div");
const mobialProgress = document.querySelector(".prgerss-line")
// Hide stack-links by default
if (Stacklinks) {
  Stacklinks.style.display = "none";
}
function showCustomAlert(message) {
  const alertBox = document.getElementById("custom-alert");
  alertBox.textContent = message;
  alertBox.style.display = "block";
  setTimeout(() => {
    alertBox.style.display = "none";
  }, 4000);
}

songCards.forEach((card) => {
  card.addEventListener("click", () => {
    const songSrc = card.getAttribute("data-src");
    const songTitle = card.getAttribute("data-title");
    if (songSrc) {
      player.src = songSrc;
      player.play();
      showCustomAlert(`Now playing: ${songTitle}`);
      if (songTitle == "Never Gonna Give You Up") {
        setTimeout(() => {
          showCustomAlert(
            "Rick Trolled you! Thought you’d get real music? This is just a Spotify clone, genius."
          );
        }, 5000);
        setTimeout(() => {
          showCustomAlert("Thank you for using this clone!");
        }, 11000);
      }
    }
  });
});

player.addEventListener("timeupdate", () => {
  if (player.duration) {
    const progressValue = (player.currentTime / player.duration) * 100;
    progress.style.height = "0.3rem";
    progress.style.borderRadius = "100px";
    progress.style.marginTop = "-0.6rem";
    progress.style.background = `linear-gradient(90deg, #1db954 ${progressValue}%, #ddd ${progressValue}%)`;
    progress.value = progressValue; // This moves the thumb!
    currentTime.textContent = new Date(player.currentTime * 1000)
      .toISOString()
      .substr(11, 8);
    totalTime.textContent = new Date(player.duration * 1000)
      .toISOString()
      .substr(11, 8);
  }
});

progress.addEventListener("input", () => {
  const seekTime = (progress.value / 100) * player.duration;
  player.currentTime = seekTime;
});

nextIcon.addEventListener("click", () => {
  showCustomAlert("That's genius of you — this is a clone of Spotify!");
});

pervIcon.addEventListener("click", () => {
  showCustomAlert("That's genius of you — this is a clone of Spotify!");
});

songCards.forEach((card) => {
  card.addEventListener("click", () => {
    const songSrc = card.getAttribute("data-src");
    const videoSrc = card.getAttribute("data-video-src");
    const songTitle = card.getAttribute("data-title");
    const songAuthor = card.getAttribute("data-info");

    if (!songSrc || !videoSrc) {
      showCustomAlert("This song is not playable.");
      return;
    }

    player.src = songSrc;
    video.src = videoSrc;
    player.load();
    video.load();

    playerImg.style.display = "block";
    sizePlayer.style.display = "block";
    if (songAuthor) {
      player.src = songSrc;
      playerImg.src = card.querySelector(".card-img").src;
      playerTitle.textContent = songTitle;
      playerAuthor.textContent = songAuthor;
      player.play();
      video.play();
    }
  });
});

playbackIcon.addEventListener("click", () => {
  if (!player.src || !video.src) {
    showCustomAlert("No song selected yet!");
    return;
  }

  if (player.readyState < 2) {
    showCustomAlert("Audio is still loading...");
    return;
  }

  if (player.paused) {
    player.play().then(() => video.play());
  } else {
    player.pause();
    video.pause();
  }
});

volumeControl.addEventListener("input", () => {
  player.volume = volumeControl.value / 100;
  if (player.volume === 0) {
    showCustomAlert("Volume is muted");
  } else {
    showCustomAlert(`Volume set to ${volumeControl.value}%`);
  }
});

searchInput.addEventListener("focus", () => {
  searchBox.style.border = "2px solid #fff";
  searchBox.style.boxShadow = "0 0 5px #fff";
});

searchInput.addEventListener("blur", () => {
  searchBox.style.border = "";
  searchBox.style.boxShadow = "";
});

video.muted = true;

video.addEventListener("volumechange", () => {
  if (!video.muted) video.muted = true;
});

let lastSync = 0;

video.addEventListener("timeupdate", () => {
  const now = Date.now();
  const diff = Math.abs(player.currentTime - video.currentTime);

  if (diff > 0.5 && now - lastSync > 500) {
    player.currentTime = video.currentTime;
    lastSync = now;
  }

  const progressValue = (video.currentTime / video.duration) * 100;
  progress.value = progressValue;
  progress.style.background = `linear-gradient(90deg, #1db954 ${progressValue}%, #ddd ${progressValue}%)`;
  currentTime.textContent = new Date(video.currentTime * 1000)
    .toISOString()
    .substr(11, 8);
  totalTime.textContent = new Date(video.duration * 1000)
    .toISOString()
    .substr(11, 8);
});

player.addEventListener("timeupdate", () => {
  const now = Date.now();
  const diff = Math.abs(video.currentTime - player.currentTime);

  if (diff > 0.5 && now - lastSync > 500) {
    video.currentTime = player.currentTime;
    lastSync = now;
  }
});

nowPlaying.addEventListener("click", () => {
  if (sizePlayer.style.display === "block") {
    sizePlayer.style.display = "none";
  } else {
    sizePlayer.style.display = "block";
  }
});

let currentLyricIndex = -1;
let lyrics_sync = [];

function lyrics(lrcText) {
  const lines = lrcText.trim().split("\n");
  const result = [];

  for (const line of lines) {
    const match = line.match(/\[(\d{2}):(\d{2}(?:\.\d{1,2})?)\](.*)/);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseFloat(match[2]);
      const time = minutes * 60 + seconds;
      const text = match[3].trim();
      result.push({ time, text });
    }
  }

  return result;
}

function updateLyricsHighlight(index) {
  const lines = document.querySelectorAll(".lyrics-line");
  lines.forEach((line, i) => {
    if (i === index) {
      line.classList.add("active");
      line.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      line.classList.remove("active");
    }
  });
}

// When user clicks on song
songCards.forEach((card) => {
  card.addEventListener("click", () => {
    const title = card.getAttribute("data-title");

    fetch("./assets/lyrics.json")
      .then((res) => res.json())
      .then((data) => {
        const lrcText = data[title];
        if (!lrcText) {
          lyricsBox.innerHTML = "<p>No lyrics found.</p>";
          return;
        }

        lyrics_sync = lyrics(lrcText);
        currentLyricIndex = -1;

        lyricsBox.innerHTML = lyrics_sync
          .map(
            (line, index) =>
              `<p class="lyrics-line" data-index="${index}">${line.text}</p>`
          )
          .join("");
      });
  });
});

// Sync with audio player
player.addEventListener("timeupdate", () => {
  const currentTime = player.currentTime;

  for (let i = lyrics_sync.length - 1; i >= 0; i--) {
    if (currentTime >= lyrics_sync[i].time) {
      if (i !== currentLyricIndex) {
        updateLyricsHighlight(i);
        currentLyricIndex = i;
      }
      break;
    }
  }
});

if (hour >= 5 && hour < 12) {
  Morning.textContent = "Good Morning!";
} else if (hour >= 12 && hour < 17) {
  Morning.textContent = "Good Afternoon!";
} else if (hour >= 17 && hour < 20) {
  Morning.textContent = "Good Evening!";
} else {
  Morning.textContent = "Good Night!";
}

Setting.addEventListener("click", () => {
    Stacklinks.style.display = "block";
    Stacklinks.style.animation = "slidein 0.5s ease-in-out";
})
StackClose.addEventListener("click", () => {
  Stacklinks.style.display = "none";
})

ClosePremium.addEventListener("click", () => {
  PremiumDiv.style.display = "none";
})

if (window.innerWidth <= 768) {
  // Only run this if screen is mobile size
  mobialProgress.style.display = "block"; // Show the progress bar

  player.addEventListener("timeupdate", () => {
    if (player.duration) {
      const progressValue = (player.currentTime / player.duration) * 100;
      mobialProgress.style.width = `${progressValue}%`;
      progress.value = progressValue;
    }
  });
} else {
  // Optional: Hide it on desktop
  mobialProgress.style.display = "none";
}