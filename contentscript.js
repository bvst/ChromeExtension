String.prototype.find = function(){
    return this.match(/[0-9]+(?:\.[0-9]*)?/g).join("");
};

String.prototype.numberformat = function(){
    return this.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

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
    },
    SetupBubble: function(){
        bubbleDOM = document.createElement('div');
        bubbleDOM.setAttribute('class', 'selection_bubble');
        document.body.appendChild(bubbleDOM);
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
        var w = window, d = document, s = '', u, currentInt, value, currencyValue, currentCurrency, newInt;

        if (w.getSelection != u) { s = w.getSelection().toString();}
        else if (d.getSelection != u) { s = d.getSelection().toString(); }
        else if (d.selection) { s = d.selection.createRange().text; }
        else { return ''; }

        if(s === null || s === "") 
            return;

        console.log("s before regex" + s);
        s = s.replace(",",".");
        s = String(s).find();
        if(s === null)
            return;
        currentInt = parseFloat(s);

        if(currentInt === null)
            return;
        currencyValue = currencyArea.requestCurrency("NOK");

        console.log("NOK");
        console.log(currencyValue);

        currentCurrency = currencyArea.requestCurrency("USD");
        console.log("USD");
        console.log(currentCurrency);

        newInt = currentInt / currentCurrency;

        value = newInt * currencyValue;

        console.log("_getSelection value:" + value);

        value = value.toFixed(2);

        return "USD: " + currentInt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ".- NOK: " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ".-";
    },
    BuildBubble: function(mouseX, mouseY, selection){
        console.log("mouseX: " + mouseX + "mouseY: " + mouseY + "Selection: " + selection);
        Select.selecting = true;
        bubbleDOM.innerHTML = selection;
        bubbleDOM.style.top = mouseY -25 + 'px';
        bubbleDOM.style.left = mouseX + 'px';
        bubbleDOM.style.visibility = 'visible';
    },
    HideBubble: function(){
        Select.selecting = false;
        bubbleDOM.style.visibility = 'hidden';
    }
};

var CurrencyArea = CurrencyArea || {};

CurrencyArea._getCurrencyFeed = 'http://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml';

var currencyArea = {

    getCurrencyFeed_: 'http://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml',
    _currencyList: null,
    requestCurrency: function(value){
        if(this._currencyList === null){
            var req = new XMLHttpRequest();
            req.open("GET", this.getCurrencyFeed_, false);
            req.send(null);

            this._currencyList = req.responseXML;
        }

        console.log("_currencies");
        console.log(this._currencyList);

        var test = this.getCurrencies_(this._currencyList, value);

        console.log("requestCurrency value");
        console.log(test);

        return test;
    },

    getCurrencies_: function(req, value){
        var cubeList = req.getElementsByTagName('Cube');
        console.log("currencies");
        console.log(cubeList);
        var currencyValue;
        for(var i = 0; i<cubeList.length; i++){
            var currencyAttributes = cubeList[i].attributes;

            for(var j = 0; j<currencyAttributes.length; j++){
                var currentAttribute = currencyAttributes[j];
                if(currentAttribute.nodeValue === value){
                    currencyValue = currencyAttributes[j+1].nodeValue;
                    console.log(value + " currency: " + currencyAttributes[j+1].nodeValue);
                }
            }
        }
        console.log("retur value : ");
        console.log(currencyValue);
        return currencyValue;
    }
};

    // var languageManager = {
    //     var html = document.getElementsByTagName('html');
    //         console.log(html);
    //         for (var i = 0; i < html.length; i++) {
    //             if (html[i].getAttribute("lang")) {
    //                 console.log("lang: " + html[i].getAttribute("lang"));
    //                 return html[i].getAttribute("content");
    //             }                    
    //             else if (html[i].getAttribute("xml:lang")) {
    //                 console.log("xml lang: " + html[i].getAttribute("xml:lang"));
    //                 return html[i].getAttribute("content");
    //             }
    //         }

    //         getCorrectCountry: function(){
    //             var countryCode = "USE"
    //             switch(case this.html)
    //             {
    //             	case "en":
    //             		countryCode = "USE";
    //             		break;
    //             	case "no":
    //             		countryCode = "NOK";
    //             		break;
    //             }
    //             return countryCode;
    //         }
    // }

function AttachListner(){
    var t = window.setInterval(function(){
        if(/loaded|complete/.test(document.readyState)){
            window.clearInterval(t);            
            Select.Listener();
            Select.SetupBubble();
        }
    }, 10);
};

//languageManager.getCorrectCountry();
AttachListner();
