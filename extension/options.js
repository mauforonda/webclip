function saveOptions(e) {
  
  let template = {
    new: document.querySelector("#template-new").value,
    append: document.querySelector("#template-append").value
  };
  let special = {
    domain: document.querySelector("#special_domain").value.replace(/https:\/\//g, "").replace(/http:\/\//g, ""),
    selector: document.querySelector("#special_selector").value.replace(/https:\/\//g, "").replace(/http:\/\//g, ""),
  };
  
  browser.storage.local.set({template, special});
  e.preventDefault();
};

function restoreOptions() {
  var gettingItem = browser.storage.local.get(['special','template']);
  gettingItem.then((result) => {
    document.querySelector("#template-new").value = result.template.new;
    document.querySelector("#template-append").value = result.template.append;
    document.querySelector("#special_domain").value = result.special.domain;
    document.querySelector("#special_selector").value = result.special.selector;
  });
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
