window.addEventListener('DOMContentLoaded', function() {
  let websiteList = document.getElementById('websiteList');
  let addWebsiteButton = document.getElementById('addWebsite');
  let form = document.getElementById('optionsForm');
  let reverseSwitch = document.getElementById('reverseSwitch');
  let reverseExplanation = document.getElementById('reverseExplanation');

  // Function to add website input
  function addWebsiteInput(value = '') {
    let inputGroup = document.createElement('div');
    inputGroup.className = 'input-group mb-3';
    inputGroup.innerHTML = `
      <input type="text" class="form-control" placeholder="Website URL" value="${value}">
      <div class="input-group-append">
        <button class="btn btn-outline-danger removeWebsite" type="button" data-localizable="removeWebsite">Remove</button>
      </div>
    `;
    let removeButton = inputGroup.querySelector('.removeWebsite');
    removeButton.addEventListener('click', function() {
      inputGroup.remove();
    });
    websiteList.appendChild(inputGroup);

    // Localize dynamic text for the newly added inputGroup
    inputGroup.querySelectorAll('[data-localizable]').forEach(element => {
      element.textContent = chrome.i18n.getMessage(element.dataset.localizable);
    });
  }

  // Load the websites and reverse switch state from storage and populate the form
  chrome.storage.sync.get(['websites', 'reverse'], function(data) {
    let websites = data.websites || [];
    reverseSwitch.checked = data.reverse || false;
    reverseExplanation.textContent = reverseSwitch.checked ?
      chrome.i18n.getMessage("reverseOn") :
      chrome.i18n.getMessage("reverseOff");
    for (let i = 0; i < websites.length; i++) {
      addWebsiteInput(websites[i]);
    }
  });

  // Update the reverse explanation and save the new state when the reverse switch state changes
  reverseSwitch.addEventListener('change', function() {
    reverseExplanation.textContent = reverseSwitch.checked ?
      chrome.i18n.getMessage("reverseOn") :
      chrome.i18n.getMessage("reverseOff");
    chrome.storage.sync.set({ reverse: reverseSwitch.checked });
  });

  // Save the websites when the form is submitted
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let websites = [];
    let inputs = websiteList.getElementsByTagName('input');
    for (let i = 0; i < inputs.length; i++) {
      let website = inputs[i].value.trim();
      if (website) {
        websites.push(website);
      }
    }
    chrome.storage.sync.set({ websites: websites });
    alert(chrome.i18n.getMessage("websitesSaved"));
  });

  // Add a new input field when the 'Add Website' button is clicked
  addWebsiteButton.addEventListener('click', function() {
    addWebsiteInput();
  });

  // Localize static text
  document.querySelectorAll('[data-localizable]').forEach(element => {
    element.textContent = chrome.i18n.getMessage(element.dataset.localizable);
  });
});
