chrome.runtime.onInstalled.addListener(() => {
    console.log("Deepak Extension Installed");
  });


  chrome.runtime.onMessage.addListener(function(request) {
    chrome.tts.speak(request.toSay, 
                    { rate: 0.8, onEvent: function(event) {}}, function() {});
  });