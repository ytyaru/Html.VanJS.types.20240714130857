(function() {
class Type {
    constructor() {
        this._names = new Map()
        this._names.set('Null', [])
        this._names.set('Undefined', ['Und'])
        this._names.set('NullOrUndefined', ['NU'])
        this._names.set('Boolean', ['Bool', 'B'])
        this._names.set('Number', ['Num', 'N'])
        this._names.set('Integer', ['Int', 'I'])
        this._names.set('BigInt', ['Big'])
        this._names.set('Float', ['Flt','F'])
        this._names.set('String', ['Str', 'S'])
        this._names.set('Date', ['Dt','D'])
        this._names.set('Symbol', ['Sym'])
        this._names.set('Array', ['Ary', 'A'])
        this._names.set('Object', ['Obj', 'O'])
        this._names.set('Function', ['Func', 'Fn'])
        this._names.set('Promise', ['Prms', 'Prm'])
        this._names.set('AsyncFunction', ['AsyncFunc', 'AsyncFn', 'Afn'])
        this._names.set('Element', ['Elm', 'El', 'E'])
    }
    #define(name, getter) {
        Object.defineProperty(this, name, {
            value: (v)=>getter(v),
            writable: false,
            enumerable: true,
            configurable: false,
        })
    }
    isNull(v) { return null===v }
    isUnd(v) { return this.#isUndefined(v) }
    isUndefined(v) { return this.#isUndefined(v) }
    #isUndefined(v) { return undefined===v }
    isNullOrUndefined(v) { return this.#isNU(v) }
    isNullOrUnd(v) { return this.#isNU(v) }
    isNU(v) { return this.#isNU(v) }
    #isNU(v) { return this.isNull(v) || this.#isUndefined(v) }
    isNUSome(...vs) { return vs.some(v=>this.isNU(v)) }
    isNUEvery(...vs) { return vs.every(v=>this.isNU(v)) }
    //isPrimitive(v) { return (!this.isNU(v) && !this.isObj(v) !this.isFn(v)) }
    isPrimitive(v) { return (!this.isNU(v) && !this.isFn(v) && 'object'!==typeof v) }

    isAsyncFunction(v) { return this.#isAfn(v) }
    isAsyncFn(v) { return this.#isAfn(v) }
    isAfn(v) { return this.#isAfn(v) }
    #isAfn(v) { return v instanceof (async()=>{}).constructor }
    isPromise(v) { return v instanceof Promise }

    isClass(v) {
        if (this.isNU(v)) return false
        if (this.isPrimitive(v)) return false
        if (undefined===v.prototype) return false  // 関数はこれ
        return true
//        return v?.constructor?.name
//        if(!v.hasOwnProperty('constructor')) { return false }
//        if(!v.constructor.hasOwnProperty('name')) { return false }
//        if('Function'!==v.constructor.name) { return false }
//        return true
    }
    // class C{};class D extends C{};class E extends D{};C.isPrototypeOf(E)//true   
    isInstance(i, c) { // i:instance, c:ClassType
        i.constructor===c
    }
//    #call(name, v) {
//        if (this.hasOwnProperty(name)) { return this[name](v) }
//        this[this._names]
//    }
    isString(v) { return typeof v === "string" || v instanceof String }
    isBoolean(v) { return 'boolean' === typeof v }
    //isNumber(v) { return 'number' === typeof v && !isNaN(v) }
    //isNumber(v) { return Number.isFinite(v) } // new Number(1) が false になってしまう
    isNumber(v) { return ('number'===typeof v && !isNaN(v)) || (this.#isObjectLike(v) && this.#getTag(v)=='[object Number]') } // https://github.com/lodash/lodash/blob/master/isNumber.js
    isInteger(v)   { return this.isNumber(v) && v % 1 === 0 }
    isPositiveInteger(v)   { return this.isInteger(v) && 0<=v }
    isNegativeInteger(v)   { return this.isInteger(v) && v<0 }
    isFloat(v) { return this.isNumber(v) && (v % 1 !== 0 || 0===v) }
    isDate(v) { return v && v.getMonth && typeof v.getMonth === 'function' && Object.prototype.toString.call(v) === '[object Date]' && !isNaN(v) } // https://stackoverflow.com/questions/643782/how-to-check-whether-an-object-is-a-date
    isBigInt(v) { return 'bigint' === typeof v }
    isSymbol(v) { return 'symbol' === typeof v }
    isElement(v) {
        try { return v instanceof HTMLElement; }
        catch(e){
            return (typeof v==="object") &&
                (v.nodeType===1) && (typeof v.style === "object") &&
                (typeof v.ownerDocument ==="object");
        }
    }
    isArray(v) { return Array.isArray(v) }
    isObject(v) { // https://github.com/lodash/lodash/blob/master/isPlainObject.js
        if (!this.#isObjectLike(v) || this.#getTag(v) != '[object Object]') { return false }
        if (Object.getPrototypeOf(v) === null) { return true }
        let proto = v
        while (Object.getPrototypeOf(proto) !== null) { proto = Object.getPrototypeOf(proto) }
        return Object.getPrototypeOf(v) === proto
    }
    #isObjectLike(v) { return typeof v === 'object' && v !== null }
    #getTag(v) { return (v == null) ? (v === undefined ? '[object Undefined]' : '[object Null]') : toString.call(v) }
    isFunction(v) { return typeof v === 'function' }
    isInstance(ins, cls) { return ins instanceof cls }

    isStr(v) { return this.isString(v) }
    isBool(v) { return this.isBoolean(v) }
    isNum(v) { return this.isNumber(v) }
    isInt(v) { return this.isInteger(v) }
    isPosInt(v) { return this.isPositiveInteger(v) }
    isNegInt(v) { return this.isNegativeInteger(v) }
    isEl(v) { return this.isElement(v) }
    isAry(v) { return this.isArray(v) }
    isObj(v) { return this.isObject(v) }
    isFn(v) { return this.isFunction(v) }
    isIns(ins, cls) { return ins instanceof cls }

    isS(v) { return this.isString(v) }
    isB(v) { return this.isBoolean(v) }
    isN(v) { return this.isNumber(v) }
    isI(v) { return this.isInteger(v) }
    isF(v) { return this.isFloat(v) }
    isD(v) { return this.isDate(v) }
    isE(v) { return this.isElement(v) }
    isA(v) { return this.isArray(v) }
    isO(v) { return this.isObject(v) }

    // array<T>
    isStrings(v) { return Array.isArray(v) && v.every(x=>this.isString(x)) }
    isNumbers(v) { return Array.isArray(v) && v.every(x=>this.isNumber(x)) }
    isIntegers(v) { return Array.isArray(v) && v.every(x=>this.isInteger(x)) }
    isPositiveIntegers(v) { return Array.isArray(v) && v.every(x=>this.isPositiveInteger(x)) }
    isNegativeIntegers(v) { return Array.isArray(v) && v.every(x=>this.isNegativeInteger(x)) }
    isFloats(v) { return Array.isArray(v) && v.every(x=>this.isFloat(x)) }
    isBooleans(v) { return Array.isArray(v) && v.every(x=>this.isBoolean(x)) }
    isDates(v) { return Array.isArray(v) && v.every(x=>this.isDate(x)) }
    isBigInts(v) { return Array.isArray(v) && v.every(x=>this.isBigInt(x)) }
    isSymbols(v) { return Array.isArray(v) && v.every(x=>this.isSymbol(x)) }
    isElements(v) { return Array.isArray(v) && v.every(x=>this.isElement(x)) }
    isArrays(v) { return Array.isArray(v) && v.every(x=>this.isArray(x)) }
    isObjects(v) { return Array.isArray(v) && v.every(x=>this.isObject(x)) }
    isFunctions(v) { return Array.isArray(v) && v.every(x=>this.isFunction(x)) }
    // array<T> short
    isStrs(v) { return Array.isArray(v) && v.every(x=>this.isString(x)) }
    isNums(v) { return Array.isArray(v) && v.every(x=>this.isNumber(x)) }
    isInts(v) { return Array.isArray(v) && v.every(x=>this.isInteger(x)) }
    isBools(v) { return Array.isArray(v) && v.every(x=>this.isBoolean(x)) }
    //isEls(v) { return Array.isArray(v) && v.every(x=>Type.Element(x)) }
    isEls(v) { return Array.isArray(v) && v.every(x=>this.isElement(x)) }
    isArys(v) { return Array.isArray(v) && v.every(x=>this.isArray(x)) }
    isObjs(v) { return Array.isArray(v) && v.every(x=>this.isObject(x)) }
    isFns(v) { return Array.isArray(v) && v.every(x=>this.isFunction(x)) }
    // array<T> short
    isSs(v) { return Array.isArray(v) && v.every(x=>this.isString(x)) }
    isNs(v) { return Array.isArray(v) && v.every(x=>this.isNumber(x)) }
    isIs(v) { return Array.isArray(v) && v.every(x=>this.isInteger(x)) }
    isFs(v) { return Array.isArray(v) && v.every(x=>this.isFloat(x)) }
    isDs(v) { return Array.isArray(v) && v.every(x=>this.isDate(x)) }
    isBs(v) { return Array.isArray(v) && v.every(x=>this.isBoolean(x)) }
    //isEs(v) { return Array.isArray(v) && v.every(x=>Type.Element(x)) }
    isEs(v) { return Array.isArray(v) && v.every(x=>this.isElement(x)) }
    isAs(v) { return Array.isArray(v) && v.every(x=>this.isArray(x)) }
    isOs(v) { return Array.isArray(v) && v.every(x=>this.isObject(x)) }

    to(type, value) { // boxing  value:型変換したい値, type:型名(typeof)
        switch(type.toLowerCase()) {
            case 'undefined': return undefined
            case 'null': return null
            case 'object': return {}
            case 'array': return []
            case 'boolean': return ((value) ? (['true','1'].some(v=>v===value.toString().toLowerCase())) : false)
            case 'number': return Number(value)
            case 'integer': return parseInt(value)
            case 'float': return parseFloat(value)
            case 'string': return String(value)
            case 'bigint': return BigInt(value)
            case 'symbol': return Symbol(value)
            case 'function': return new Function(value)
            case 'class': return Function(`return (${value})`)() // value: Class名（new ClassName()） 未定義エラーになる…
            default: throw new Error('typeは次のいずれかのみ有効です:undefined,null,object,array,boolean,number,integer,float,string,bigint,symbol,function,class')
//            default: return Function('return (' + classname + ')')()
        }
    }

}
window.Type = new Type()
String.prototype.capitalize = function(str) { return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase() }
})()
