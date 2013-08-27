String.prototype.find = function(){
    return this.match(/[0-9]+(?:\.[0-9]*)?/g).join("");
};

String.prototype.numberformat = function(){
    return this.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

(function(currencyIntergrator, undefined){
    var internalEvent = {};
    var polling = 0;
    var selectionText = '';
    currencyIntergrator.isSelected = false;

    currencyIntergrator.listener = function(){
        document.body.addEventListener("mouseup", function(event){
            internalEvent = event;
            polling = window.setInterval(currencyIntergrator.onMouseUp(event), 200);
        });
    };
    
    currencyIntergrator.onMouseUp = function(event){
        window.clearInterval(polling);
        if(internalEvent == null)
            return;

        if(currencyIntergrator.isSelected === true){
            currencyIntergrator.isSelected = bubbleArea.hideBubble(); 
            return;
        }
        
        if(internalEvent.button == 0) {
                selectionText = currencyIntergrator._getSelection();
                console.log("selectionText" + selectionText);
                if(selectionText) { 
                    currencyIntergrator.isSelected = bubbleArea.buildBubble(event.clientX, event.clientY, 25, selectionText); 
                }
        }
        internalEvent = null;
    };



    currencyIntergrator._getSelection = function() {
        var w = window, d = document, s = '', u, currentInt, value, currencyValue, currentCurrency, newInt;

        if (w.getSelection != u) {
            s = w.getSelection().toString();
        }
        else if (d.getSelection != u) {
            s = d.getSelection().toString();
        }
        else if (d.selection) {
            s = d.selection.createRange().text;
        }
        else { 
            return ''; 
        }

        if(s === null || s === "") 
            return;
        //s = s.replace(",",".");
        s = String(s).find();
        if(s === null)
            return;
        currentInt = parseFloat(s);

        if(currentInt === null)
            return;
        currencyValue = currencyArea.requestCurrency("NOK");

        currentCurrency = currencyArea.requestCurrency("USD");

        newInt = currentInt / currentCurrency;

        value = newInt * currencyValue;

        value = value.toFixed(2);

        return "USD: " + String(currentInt).numberformat() + " = NOK: " + String(value).numberformat() + ".-";
    };
}(window.currencyIntergrator = window.currencyIntergrator || {}));

(function(bubbleArea, undefined){
    bubbleArea.bubbleDOM = '';
    bubbleArea.setupBubble = function(){
        bubbleArea.bubbleDOM = document.createElement('div');
        bubbleArea.bubbleDOM.setAttribute('class', 'selection_bubble');
        document.body.appendChild(bubbleArea.bubbleDOM);
    };

    bubbleArea.buildBubble = function(mouseX, mouseY, mouseYOffset, selectedText){
        console.log("mouseX: " + mouseX + "mouseY: " + mouseY + "Selection: " + selectedText);
        bubbleArea.bubbleDOM.innerHTML = selectedText;
        bubbleArea.bubbleDOM.style.top = mouseY - mouseYOffset + 'px';
        bubbleArea.bubbleDOM.style.left = mouseX + 'px';
        bubbleArea.bubbleDOM.style.visibility = 'visible';
        return true;
    };
    bubbleArea.hideBubble = function(){
        bubbleArea.bubbleDOM.style.visibility = 'hidden';
        return false;
    };
}(window.bubbleArea = window.bubbleArea || {}));


(function(currencyArea, undefined){

    var getCurrencyFeed_ = 'http://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml';
    var _currencyList = null;

    currencyArea.requestCurrency = function(value){
        if(_currencyList === null){
            var req = new XMLHttpRequest();
            req.open("GET", getCurrencyFeed_, false);
            req.send(null);
            _currencyList = req.responseXML;
        }
        return getCurrencies_(_currencyList, value);
    };

    function getCurrencies_(req, value){
        var cubeList = req.getElementsByTagName('Cube');
        var currencyValue;
        for(var i = 0; i<cubeList.length; i++){
            var currencyAttributes = cubeList[i].attributes;
            for(var j = 0; j<currencyAttributes.length; j++){
                var currentAttribute = currencyAttributes[j];
                if(currentAttribute.nodeValue === value){
                    currencyValue = currencyAttributes[j+1].nodeValue;
                }
            }
        }
        return currencyValue;
    };
}(window.currencyArea = window.currencyArea || {}));

function AttachListner(){
    var t = window.setInterval(function(){
        if(/loaded|complete/.test(document.readyState)){
            window.clearInterval(t);
            currencyIntergrator.listener();
            bubbleArea.setupBubble();
        }
    }, 10);
};
AttachListner();
