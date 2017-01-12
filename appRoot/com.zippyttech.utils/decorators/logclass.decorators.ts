function logClass(target: any) {

    // save a reference to the original constructor
    var original = target;

    // a utility function to generate instances of a class
    function construct(constructor, args) {
        var c : any = function () {
            return constructor.apply(this, args);
        }

        c.prototype = constructor.prototype;
        return new c();
    }

    // the new constructor behaviour
    var f : any = function (...args) {
        console.log("New: " + original.name);
        return construct(original, args);
    }

    // copy prototype so intanceof operator still works
    f.prototype = original.prototype;
    console.log(original.name);
    // return new constructor (will override original)
    return f;
}