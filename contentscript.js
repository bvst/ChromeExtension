(function() {

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

            currentInt = currentInt / currencyArea.requestCurrency("USD");

            value = currentInt * curencyValue;

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

        requestCurrency: function(value){
            var req = new XMLHttpRequest();
            req.open("GET", currencyArea.getCurrencyFeed_, true);
            req.onload = currencyArea.getCurrencies_.bind(value, req);
            req.send(null);

            console.log(req.responseText);

            return req.responseText;
        },

        getCurrencies_: function(value, req){
            //console.log(value);
            console.log(this);
            console.log("e:");
            console.log(req);
            console.log("value:");
            console.log(value);
            var currencies = req.responseXML.getElementsByTagName('Cube');
            var currencyValue;
            for(var i = 0; i<currencies.length; i++){
                var currencyAttributes = currencies[i].attributes;

                for(var j = 0; j<currencyAttributes.length; j++){
                    var currentAttribute = currencyAttributes[j];
                    if(currentAttribute.nodeValue === value){
                        curencyValue = currencyAttributes[j+1].nodeValue;
                        console.log(value + " currency: " + currencyAttributes[j+1].nodeValue);
                    }
                }
            }

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

    AttachListner();
    currencyArea.requestCurrency("NOK");
})()
