// Save this script as `options.js`

// Saves options to localStorage.
function save_options() {
  var currencyGroup = document.getElementsByName("clickSelection");
  var checkedButton = getCheckedRadio(currencyGroup);
  var buttonValue = parseInt(checkedButton.value);

  if(checkedButton !== undefined && buttonValue !== NaN)
  {
    chrome.storage.sync.set({'click_option': buttonValue}, function(){
      var status = document.getElementById("status");
      status.innerHTML = "Options Saved.";
      setTimeout(function() {
        status.innerHTML = "";
      }, 1000);
    });
  }
  else{
    status.innerHTML = "An error occured! :(";
  }  
}

chrome.storage.sync.get('click_option', function(items){
    if(items.click_option){
      var radioGroup = document.getElementsByName("clickSelection");
      for(var i=0; i<radioGroup.length;i++){
        var button = radioGroup[i];
        if(parseInt(button.value) === items.click_option)
        {
          button.checked = true;
          return;
        }
      }
    }
});

function getCheckedRadio(radioGroup){
  for(var i = 0; i<radioGroup.length; i++){
    var button = radioGroup[i];
    if(button.checked){
      return button;
    }
  }
  return undefined;
}
document.querySelector('#save').addEventListener('click', save_options);