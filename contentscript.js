String.prototype.find = function(){
    return /\d/g.exec(this);
}

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
        var w = window, d = document, s = '', u, nok = 5.9355, currentInt, value;
        
        if (w.getSelection != u) { s = w.getSelection();}
        else if (d.getSelection != u) { s = d.getSelection(); }
        else if (d.selection) { s = d.selection.createRange().text; }
        else { return ''; }

        s = String(s).find();
        currentInt = parseInt(s);
        value = currentInt * nok;

        console.log("_getSelection value:" + value);
        return value;
    },
    BuildBubble: function(mouseX, mouseY, selection){
        console.log("mouseX: " + mouseX + "mouseY: " + mouseY + "Selection: " + selection);
        Select.selecting = true;
        bubbleDOM.innerHTML = selection;
        bubbleDOM.style.top = mouseY + 'px';
        bubbleDOM.style.left = mouseX + 'px';
        bubbleDOM.style.visibility = 'visible';
        console.log("Bubble is buildt: " + bubbleDOM);
    },
    HideBubble: function(){
        Select.selecting = false;
        bubbleDOM.style.visibility = 'hidden';
        console.log("bubble is hidden: " + bubbleDOM);
    }
}

function AttackListner(){
    var t = window.setInterval(function(){
        if(/loaded|complete/.test(document.readyState)){
            window.clearInterval(t);            
            Select.Listener();
            Select.SetupBubble();
        }
    }, 10)
};

AttackListner();


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