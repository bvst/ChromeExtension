document.addEventListener("mouseup", function(e) {
    var selectedArea = window.getSelection();
        if (selectedArea) {
            var selectedAreaString = selectedArea.toString();
            if (selectedAreaString !== undefined && selectedAreaString !== "") {
                var digits = /\d/;

                var selectedDigits = digits.exec(selectedAreaString);
                if (selectedDigits) {
                    var nok = 5.9355;
                    var selectedInt = parseInt(selectedDigits);
                    var dollarInNok = selectedInt * nok;

                    alert(dollarInNok);
                }
            }
        }
});