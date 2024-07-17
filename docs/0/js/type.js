(function() {
class Type {
    constructor() {
        this._types = {
            AsyncFunction: (async()=>{}).constructor,
            GeneratorFunction: (function*(){yield undefined;}).constructor,
            AsyncGeneratorFunction: (async function*(){yield undefined;}).constructor,
        }
        this._names = new Map()
        this._names.set('Null', [[], (v)=>null===v])
        this._names.set('Undefined', [['Und'], (v)=>undefined===v])
        this._names.set('NullOrUndefined', [['NU'], (v)=>null===v || undefined===v])
        this._names.set('Boolean', [['Bool', 'Bln', 'B'], (v)=>'boolean'===typeof v])
        this._names.set('NaN', [[], (v)=>Number.isNaN(v)])
        // https://github.com/lodash/lodash/blob/master/isNumber.js
        this._names.set('Number', [['Num', 'N'], (v)=>('number'===typeof v && !isNaN(v)) || (this.#isObjectLike(v) && this.#getTag(v)=='[object Number]')])
        this._names.set('Integer', [['Int', 'I'], (v)=>this.isNumber(v) && 0===v%1])
        this._names.set('PositiveInteger', [['PInt'], (v)=>this.isInteger(v) && 0<=v])
        this._names.set('NegativeInteger', [['NInt'], (v)=>this.isInteger(v) && v<0])
        this._names.set('BigInt', [['Big'], (v)=>'bigint'===typeof v])
        this._names.set('Float', [['Flt','F'], (v)=>this.isNumber(v) && (v % 1 !== 0 || 0===v)])
        this._names.set('String', [['Str', 'S'], (v)=>'string'===typeof v || v instanceof String])
        this._names.set('Symbol', [['Sym'], (v)=>'symbol'===typeof v])
        //this._names.set('Primitive', [['Prim'], (v)=>(!this.isNU(v) && !this.isFn(v) && 'object'!==typeof v))])
        //this._names.set('Primitive', [['Prim'], (v)=>'function,object'.split(',').every(x=>x!==typeof v)])
        //this._names.set('ValidPrimitive', [['VPrim', 'Vp'], (v)=>'null,undefined,function,object'.split(',').every(x=>x!==typeof v))]) // null,undefinedを抜いたprimitive
        this._names.set('Primitive', [['Prim'], (v)=>v !== Object(v)])
        this._names.set('ValidPrimitive', [['VPrim', 'Vp'], (v)=>this.isNullOrUndefined(v) ? false : this.isPrim(v)]) // null,undefinedを抜いたprimitive
        this._names.set('Array', [['Ary', 'A'], (v)=>Array.isArray(v)])
        // https://github.com/lodash/lodash/blob/master/isPlainObject.js
        this._names.set('Object', [['Obj', 'O'], (v)=>{
            if (!this.#isObjectLike(v) || this.#getTag(v) != '[object Object]') { return false }
            if (Object.getPrototypeOf(v) === null) { return true }
            let proto = v
            while (Object.getPrototypeOf(proto) !== null) { proto = Object.getPrototypeOf(proto) }
            return Object.getPrototypeOf(v) === proto
        }])
        this._names.set('Class', [['Cls'], (v)=>{
            if (this.isNullOrUndefined(v)) return false
            if (this.isPrimitive(v)) return false
            if (this.isFunction(v)) return false
            if ('Object'===v.constructor.name) return false
            if ('Function'!==v.constructor.name) return false
            return true
        }])
        this._names.set('ErrorClass', [['ErrCls'], (v)=>Error.isPrototypeOf(v)]) // Error.isPrototypeOf(TypeError)
        this._names.set('Instance', [['Ins'], (v, c)=>{
            if (this.isNullOrUndefined(v)) return false
            if (this.isPrimitive(v)) return false
            if (this.isFunction(v)) return false
            if ('Object'===v.constructor.name) return false   // Object
            if ('Function'===v.constructor.name) return false // Class
            return this.isClass(c) ? c===i.constructor : true // cがあるときはそのクラスのインスタンスであるか確認する
        }])
        this._names.set('ErrorInstance', [['ErrIns'], (v)=>v instanceof Error]) // new TypeError() instanceof Error
        this._names.set('Promise', [['Prms', 'Prm'], (v)=>v instanceof Promise])
        this._names.set('Iterator', [['Iter', 'Itr', 'It'], (v)=>{
            if (this.isNullOrUndefined(v)) { return false }
            return 'function'===typeof v[Symbol.iterator]
        }])
        this._names.set('Function', [['Func', 'Fn'], (v)=>'function'===typeof v])
        this._names.set('AsyncFunction', [['AsyncFunc', 'AsyncFn', 'AFn'], (v)=>v instanceof this._types.AsyncFunction])
        this._names.set('GeneratorFunction', [['GenFn', 'GFn'], (v)=>v instanceof this._types.GeneratorFunction])
        this._names.set('AsyncGeneratorFunction', [['AsyncGenFn', 'AGFn'], (v)=>v instanceof this._types.AsyncGeneratorFunction])

        // https://stackoverflow.com/questions/643782/how-to-check-whether-an-object-is-a-date
        this._names.set('Date', [['Dt','D'], (v)=>v && v.getMonth && typeof v.getMonth === 'function' && Object.prototype.toString.call(v) === '[object Date]' && !isNaN(v)])
        this._names.set('RegExp', [[], (v)=>v instanceof RegExp])

        this._names.set('Element', [['Elm', 'El', 'E'], (v)=>{
            try { return v instanceof HTMLElement; }
            catch(e){
                return (typeof v==='object') &&
                    (v.nodeType===1) && (typeof v.style === 'object') &&
                    (typeof v.ownerDocument==='object');
            }
        }])
        for (let [k,v] of this._names.entries()) {
            const fnName = `is${k}`
            //const getter = this[fnName]
            const [abbrs, fn] = v
            console.log(fnName, abbrs, fn)
            if ('function'!==typeof fn) { throw new Error(`${fnName}が未定義です。`)}
            this.#defineMain(fnName, fn) // 正式
            for (let name of abbrs) { this.#defineAbbr(`is${name}`, fn) } // 略名
            this.#defineMain(`${fnName}s`, (args)=>Array.isArray(args) && args.every(x=>getter(x))) // 複数形
        }
    }
    #isObjectLike(v) { return typeof v === 'object' && v !== null }
    #getTag(v) { return (v == null) ? (v === undefined ? '[object Undefined]' : '[object Null]') : toString.call(v) }
    #defineMain(name, getter) {
        Object.defineProperty(this, name, {
            value: (...args)=>getter(...args),
            writable: false,
            enumerable: true,
            configurable: false,
        })
    }
    #defineAbbr(name, getter) {
        Object.defineProperty(this, name, {
            value: (v)=>getter(v),
            writable: false,
            enumerable: false,
            configurable: false,
        })
    }
    isNUSome(...vs) { return vs.some(v=>this.isNU(v)) }
    isNUEvery(...vs) { return vs.every(v=>this.isNU(v)) }
    getName(v) {
        const name = typeof v
        if ('function'===name) {
            if (this.isAfn(v) || this.isGfn(v) || this.isAGfn(v)) { return v.constructor.name }
        } else if ('object'===name) {
            if (this.isClass(v)) { return v.name }
            else if (this.isInstance(v)) { return v.constructor.name }
        }
        return name[0].toUpperCase() + name.slice(1)
    }
    to(type, ...values) { // boxing  value:型変換したい値, type:型名(typeof)
        switch(type.toLowerCase()) {
            case 'undefined': return undefined
            case 'null': return null
            case 'object': return {}
            case 'array': return []
            case 'boolean': return ((values[0]) ? (['true','1'].some(v=>v===values[0].toString().toLowerCase())) : false)
            case 'number': return Number(values[0])
            case 'integer': return parseInt(values[0])
            case 'float': return parseFloat(values[0])
            case 'string': return String(values[0])
            case 'bigint': return BigInt(values[0])
            case 'symbol': return Symbol(values[0])
            case 'function': return new Function(values[0])
            //case 'class': return Function(`return (${values[0]})`)() // values[0]: Class名（new ClassName()） 未定義エラーになる…
            case 'class': return Function(`return class ${values[0]} {};`)() // values[0]: Class名（new ClassName()） 未定義エラーになる…
            case 'instance': return Reflect.construct(...values) // Class, [auguments]
            default: throw new Error('typeは次のいずれかのみ有効です:undefined,null,object,array,boolean,number,integer,float,string,bigint,symbol,function,class')
//            default: return Function('return (' + classname + ')')()
        }
    }

}
window.Type = new Type()
String.prototype.capitalize = function(str) { return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase() }
})()
