String.prototype.find = function(){
    console.log("this"+this);
    return /[0-9]+(?:\.[0-9]*)?/g.exec(this);
};

currencyValue: 0

Select = {
    internalEvent: {},
    polling: 0,
    bubbleDOM: '',
    selectionText: '',
    Listener: function(){
        document.body.addEventListener("mouseup", function(event){
            Select.internalEvent = event;
            Select.polling = window.setInterval(Select.onMouseUp(event), 200);
        });
        console.log("Select Actions listener attached.");
    },
    SetupBubble: function(){
        bubbleDOM = document.createElement('div');
        bubbleDOM.setAttribute('class', 'selection_bubble');
        document.body.appendChild(bubbleDOM);

        console.log("Setup bubble: " + bubbleDOM);
    },
    onMouseUp: function(event){
        window.clearInterval(Select.polling);
        if(Select.internalEvent == null){return;}
        if(Select.selecting == true){Select.HideBubble(); return;}/* Don't do anything if already selecting */

        /* Don't show the menu on right-click, b/c that'd be annoying. */
        if(Select.internalEvent.button == 0 /* Left-click only */ ) {
                Select.selectionText = Select._getSelection();
                console.log("selectionText" + Select.selectionText);
                if(Select.selectionText) { Select.BuildBubble(event.clientX, event.clientY, Select.selectionText); } /* Show menu only on selection of text */
        }
        Select.internalEvent = null;
    },
    _getSelection: function() {
        var w = window, d = document, s = '', u, currentInt, value;
        
        console.log(curencyValue);

        if (w.getSelection != u) { s = w.getSelection();}
        else if (d.getSelection != u) { s = d.getSelection(); }
        else if (d.selection) { s = d.selection.createRange().text; }
        else { return ''; }

        console.log("s before regex" + s);
        s = String(s).find();        
        console.log("s before parse" + s);
        currentInt = parseInt(s);

        console.log("s after parse" + s);
        value = currentInt * curencyValue;

        console.log("_getSelection value:" + value);
        return "USD: " + currentInt + ".- NOK: " + value + ".-";
    },
    BuildBubble: function(mouseX, mouseY, selection){
        console.log("mouseX: " + mouseX + "mouseY: " + mouseY + "Selection: " + selection);
        Select.selecting = true;
        bubbleDOM.innerHTML = selection;
        bubbleDOM.style.top = mouseY -25 + 'px';
        bubbleDOM.style.left = mouseX + 'px';
        bubbleDOM.style.visibility = 'visible';
        console.log("Bubble is buildt: " + bubbleDOM);
    },
    HideBubble: function(){
        Select.selecting = false;
        bubbleDOM.style.visibility = 'hidden';
        console.log("bubble is hidden: " + bubbleDOM);
    }
};

var currencyArea = {
    getCurrencyFeed_: 'http://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml',

    requestCurrency: function(){
        var req = new XMLHttpRequest();
        console.log("XML request: " + req);
        req.open("GET", this.getCurrencyFeed_, true);
        console.log("XML request after open: " + req);
        console.log(this.getCurrencies_.bind(this));
        req.onload = this.getCurrencies_.bind(this);
        req.send(null);
    },

    getCurrencies_: function(e){
        var currencies = e.target.responseXML.getElementsByTagName('Cube');
        for(var i = 0; i<currencies.length; i++){
            var currencyAttributes = currencies[i].attributes;

            for(var j = 0; j<currencyAttributes.length; j++){
                var currentAttribute = currencyAttributes[j];
                if(currentAttribute.nodeValue === "NOK"){
                    curencyValue = currencyAttributes[j+1].nodeValue;
                    console.log("NOK currency: " + currencyAttributes[j+1].nodeValue);
                }
            }
        }
    }
};

function AttachListner(){
    var t = window.setInterval(function(){
        if(/loaded|complete/.test(document.readyState)){
            window.clearInterval(t);            
            Select.Listener();
            Select.SetupBubble();
        }
    }, 10)
};

AttachListner();
currencyArea.requestCurrency();

// document.addEventListener("mouseup", function(e) {
//     var selectedArea = window.getSelection();
//         if (selectedArea) {
//             var selectedAreaString = selectedArea.toString();
//             if (selectedAreaString !== undefined && selectedAreaString !== "") {
//                 var digits = /\d/g;

//                 var selectedDigits = digits.exec(selectedAreaString);
//                 if (selectedDigits) {
//                     var nok = 5.9355;
//                     var selectedInt = parseInt(selectedDigits);
//                     var dollarInNok = selectedInt * nok;

//                     alert(dollarInNok);
//                 }
//             }
//         }
// });