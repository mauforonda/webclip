
const tab = window.location.href;
let previousLink;

const init = () => {
  browser.storage.local.get(['special', 'template'])
    .then((user) => {
      makeClip(user)
    })
};
  
const makeClip = (user) => {
  if (user.special.domain != "" && tab.indexOf(user.special.domain) != -1) {
    clip = clipSpecial(user);
  } else {
    clip = clipNormal();
  }
  selection = window.getSelection();
  clip.selection = encodeURIComponent(clipSelection(selection));
  toBackground(clip, user);
};

const clipSpecial = (user) => {
  selector = window.document.querySelector(user.special.selector);
  link = encodeURIComponent(selector.getAttribute("href"));
  title = encodeURIComponent(selector.textContent);
  return {'link': link, 'title': title};
};

const clipNormal = () => {
  link = encodeURIComponent(tab);
  title = encodeURIComponent(window.document.title);
  return {'link': link, 'title': title};
}

const clipSelection = (selection) => {
  el = document.createElement("div");
  el.appendChild(selection.getRangeAt(0).cloneContents());
  formatLinks(el);
  return el.textContent;
}

const formatLinks = (el) =>  {
  el.querySelectorAll('A').forEach((a) => {
    parent = a.parentElement;
    href = a.href.toString();
    text = a.text.toString();
    if (href == "javascript:void(0)" || href == "#" || text == "") {
      parent.removeChild(a);
    } else{
      text = text.replace(/(\[|\])/g, "");
      formatted = document.createTextNode("[[" + href + "][" + text + "]]");
      parent.replaceChild(formatted, a);
    }
  })
};
  
const toBackground = (clip, user) => {
  if (clip.link == previousLink) {
    template = user.template.append;
  } else {
    template = user.template.new;
  };
  command =
    "org-protocol://capture?" +
    "template=" + template +
    "&url=" + clip.link +
    "&title=" + clip.title +
    "&body=" + clip.selection;
  chrome.runtime.sendMessage({'command':command});
  previousLink = clip.link;
}

init();
browser.runtime.onMessage.addListener(init);
