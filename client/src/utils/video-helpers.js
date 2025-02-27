export function setupVideoElement(videoElement, stream, isLocal = false) {
  if (!videoElement || !stream) return;

  videoElement.srcObject = stream;

  videoElement.style.backgroundColor = "black";

  videoElement.style.transform = "translateZ(0)";

  const attemptPlay = async (retries = 3) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      await videoElement.play();
    } catch (err) {
      console.error(
        `Error playing ${isLocal ? "local" : "remote"} video:`,
        err
      );

      if (err.name === "NotAllowedError") {
        const playOnClick = () => {
          videoElement.play().catch(console.error);
          document.removeEventListener("click", playOnClick);
        };
        document.addEventListener("click", playOnClick);
      } else if (err.name === "AbortError" && retries > 0) {
        console.log(`Retrying playback, ${retries} attempts remaining`);
        setTimeout(() => attemptPlay(retries - 1), 500);
      }
    }
  };

  attemptPlay();
}

export function checkVideoStream(stream) {
  if (!stream) return false;

  const videoTracks = stream.getVideoTracks();

  if (videoTracks.length === 0) {
    console.warn("No video tracks found in stream");
    return false;
  }

  const hasActiveTrack = videoTracks.some(
    (track) => track.enabled && track.readyState === "live"
  );

  if (!hasActiveTrack) {
    console.warn("No active video tracks found");
    return false;
  }

  return true;
}

export function getOptimalVideoConstraints() {
  return {
    video: {
      width: { ideal: 1280, max: 1920 },
      height: { ideal: 720, max: 1080 },
      frameRate: { ideal: 30, max: 60 },

      facingMode: "user",
    },
    audio: true,
  };
}
