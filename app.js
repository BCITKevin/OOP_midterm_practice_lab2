var demoClass = /** @class */ (function () {
    function demoClass() {
    }
    // add static keyword before method defination to make it static.
    demoClass.printMessage = function () {
        console.log(" Static method name printMessage is called.");
    };
    return demoClass;
}());
// call the static method by 
//taking class name as a reference
demoClass.printMessage();
