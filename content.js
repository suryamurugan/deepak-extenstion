// Initialization of the speech recognition
const recognition = initializeRecognition();

// Event listeners for key actions
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

function initializeRecognition() {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = true;
  
  recognition.onresult = handleResult;
  recognition.onend = handleEnd;

  return recognition;
}

function handleKeyDown(event) {
  if (event.metaKey && event.code === 'KeyU') {
    toggleSpacebarDetection();
  }
  
  if (isRecognitionActive() && event.code === 'AltLeft') {
    console.log('Alt key is held down');
    startRecognition();
  }

  event.preventDefault();
}

function handleKeyUp(event) {
  if (isRecognitionActive() && event.code === 'AltLeft') {
    console.log('Alt key is released');
    stopRecognition();
  }
  event.preventDefault();
}

function toggleSpacebarDetection() {
  window.spacebarDetectionEnabled = !window.spacebarDetectionEnabled;
  console.log(`Spacebar detection ${window.spacebarDetectionEnabled ? 'enabled' : 'disabled'}`);
  showPopup(`Spacebar detection ${window.spacebarDetectionEnabled ? 'enabled' : 'disabled'}`);
}

function isRecognitionActive() {
  return window.spacebarDetectionEnabled;
}

function startRecognition() {
  if (!window.isRecognitionStarted) {
    recognition.start();
    window.isRecognitionStarted = true;
    console.log("Recognition started");
    pauseVideo();
    showListeningIcon()
  }
}

function stopRecognition() {
  recognition.stop();
  window.isRecognitionStarted = false;
  console.log("Recognition stopped");
  showPopup('Uploading...');
    hideListeningIcon();
}

function handleResult(event) {
  const transcript = event.results[event.results.length - 1][0].transcript;
  console.log('Transcript captured:', transcript);
  const videoTime = document.querySelector('video') ? document.querySelector('video').currentTime.toFixed(2) : 'N/A';
  uploadTranscript(transcript, window.location.href, videoTime);
}

function handleEnd() {
  console.log("Recognition ended");
  if (!recognition.manualStop) {
    recognition.start();
    console.log("Recognition restarted");
  }
}

function pauseVideo() {
  const video = document.querySelector('video');
  if (video) {
    video.pause();
    console.log(`Video paused at: ${video.currentTime.toFixed(2)}s`);
  }
}

function uploadTranscript(user_query, url, timestamp) {
  if (!user_query) {
    console.error('Transcript is empty, not uploading.');
    return;
  }

  const payload = { user_query, url, timestamp };
  console.log('Uploading payload:', payload);

  fetch('https://deepak.prashne.com/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error));
}

function showPopup(message) {
  const popup = document.createElement('div');
  popup.id = 'popup';
  popup.textContent = message;
  stylePopup(popup);
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 2000);
}

function stylePopup(popup) {
  popup.style = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    background-color: #000;
    color: #fff;
    border-radius: 5px;
    z-index: 1000;
  `;
}

function showListeningIcon() {
  let icon = document.getElementById('listeningIcon');
  if (!icon) {
    icon = document.createElement('div');
    icon.id = 'listeningIcon';
    icon.style = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      background-color: red;
      border-radius: 50%;
      z-index: 1000;
    `;
    document.body.appendChild(icon);
  }
  icon.style.display = 'block';
}

function hideListeningIcon() {
  const icon = document.getElementById('listeningIcon');
  if (icon) {
    icon.style.display = 'none';
  }
}