describe("Currency converter", function(){
	var currency;

	beforeEach(function(){
		currency = currencyArea;
		currencyArea.getScript();
	})

	it("should return USD", function(){
		var currencyToGet = "USD";
		
		var response = currency.requestCurrency(currencyToGet);

		expect(response).toHaveBeenCalled();
	});
});

describe("Bubble area", function(){
	var bubble;
	var bubbleDOM;
	beforeEach(function(){
		bubble = bubbleArea;
		bubble.setupBubble();
		bubbleDOM = bubble.bubbleDOM;
	})

	it("should setup bubble",function(){
		var isDiv = bubbleDOM.nodeName && (bubbleDOM.nodeName.toLowerCase() === 'div');
		expect(isDiv).toBe(true);
	});

	it("should show bubble", function(){
		var mouseXPosition = 100;
		var mouseYPostition = 100;
		var mouseYOffset = 25;
		var selectedText = "This is my text";

		var result = bubbleArea.buildBubble(mouseXPosition, mouseYPostition, mouseYOffset, selectedText);

		expect(result).toBe(true);
		expect(bubbleDOM.style.top).toBe(mouseYPostition - mouseYOffset + 'px');
		expect(bubbleDOM.style.left).toBe(mouseXPosition+'px');
		expect(bubbleDOM.innerHTML).toBe(selectedText);
	})

})


describe("String formatter", function(){
	it("should be 12.34", function(){
		var shouldBe = '12.34';
		var spaceSeperated = '1   2.    3   4';
		var lettersSeperated = '1qwe2.qwe3zzz4qwe';

		expect(String(spaceSeperated).find()).toBe(shouldBe);
		expect(String(lettersSeperated).find()).toBe(shouldBe);
	})
})

