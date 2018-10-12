let previousTab;

const listenKeyboard = () => {
  browser.commands.onCommand.addListener(
    function(command) {
      if (command == "webclip") {handleContent()}
    })
};

const handleContent = (selection, key) => {
  browser.tabs.query(
    {currentWindow: true, active: true},
    function (tabs){
      tab = tabs[0].id;
      if (tab == previousTab) {
	browser.tabs.sendMessage(tab, {});
      } else {
	browser.tabs.executeScript(tab, {file: '/getselection.js'});
	previousTab = tab;
      }
    }
  )
};

const toEmacs = (clip) => {
  let native = browser.runtime.connectNative("web.clip")
  native.postMessage(clip);
};

listenKeyboard();
browser.runtime.onMessage.addListener(toEmacs);
