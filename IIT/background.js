// background.js
//mainbackground
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript({
    file: 'highlighter.js'
  });
});