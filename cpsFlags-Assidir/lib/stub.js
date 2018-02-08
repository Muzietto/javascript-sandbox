
// consente verifica di chiamata, argomenti ed output
function stubFn(obj) {
    var fn = function () {
        fn.called = true;
        fn.args = Array.prototype.slice.call(arguments);
        return obj;
    };
    fn.called = false;
    return fn;
}

// consente verifica di chiamata, argomenti ed effettiva invocazione
function wrapFn(fn) {
    if (!fn instanceof Function) throw { msg: 'not wrapping a function' };
    var wrapper = function () {
        wrapper.called = true;
        wrapper.args = Array.prototype.slice.call(arguments);
        fn.apply(null, wrapper.args);
    };
    wrapper.called = false;
    return wrapper;
}
/* sembrerebbe che wrapFn(stubFn()) sia analogo a stbFnFromTheBook(retValue) */

function fakeXhr() {
    // occorre connettersi a ajax
    if (!tddjs.ajax.open)
        { ns.open = fakeXhr(); }
    }
    var _open = stubFn();
    return {
        open: wrapFn(_open)
    };
}