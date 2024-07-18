window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOMContentLoaded!!');
    const {h1, p} = van.tags
    const author = 'ytyaru'
    van.add(document.querySelector('main'), 
        h1(van.tags.a({href:`https://github.com/${author}/Html.VanJS.types.20240714130857/`}, 'types')),
        p('JSの型utility。'),
//        p('JS type utility.'),
    )
    van.add(document.querySelector('footer'),  new Footer('ytyaru', '../').make())

    const a = new Assertion()
    class C {}
//    console.log(C.constructor.name)
//    console.log(Type.isClass(C))


    // ざっくりパターン試験
    const datas = {
        'Undefined': undefined,
        'Null': null,
        'Boolean': true,
        'NaN': NaN,
        'Number': Number(1),
        'Integer': parseInt(2),
        'PositiveInteger': parseInt(3),
        'NegativeInteger': parseInt(-1),
        'BigInt': BigInt(999999999999999),
        'Float': 1.1,
        'String': 'A',
        'Symbol': Symbol('Sym'),
        'Array': [1,'A'],
        'Object': {k:'v'},
        'Class': C,
        'Instance': new C(),
        'ErrorClass': Error,
        'ErrorInstance': new Error(),
        'Promise': new Promise((reject)=>reject()),
        'Iterator': [1,'A'],
        'Function': ()=>{},
        'AsyncFunction': async()=>{},
        'GeneratorFunction': function*(){yield undefined;},
        'AsyncGeneratorFunction': (async function*(){yield undefined;}),
        'Date': new Date(),
        'RegExp': new RegExp(),
        'URL': new URL('https://a.com/'),
        'Map': new Map(),
        'Set': new Set(),
        'Element': document.createElement('div'),
    }
//    console.log(Type.isDate(undefined))
//    console.log(Type.isDate(null))
    for (let [k,v] of Object.entries(datas)) {
        for (let K of Object.keys(datas)) {
            let expected = k===K
//            const nums = 'Number,Integer,PositiveInteger,NegativeInteger'.split(',')
//            expected = (nums.some(t=>t===k) && nums.some(t=>t===K)) ? true : expected
            if ((K==='Integer' && k==='Number') || // Type.isInteger(Number: 1)
                (K==='Number' && k==='Integer') || // Type.isNumber(Integer: 2)
                (K==='PositiveInteger' && k==='Number') ||  // Type.isPositiveInteger(Number: 1)
                (K==='Number' && k==='PositiveInteger') ||  // Type.isNumber(PositiveInteger: 3)
                (K==='PositiveInteger' && k==='Integer') || // Type.isPositiveInteger(Integer: 2)
                (K==='Integer' && k==='PositiveInteger') || // Type.isInteger(PositiveInteger: 3)
                (K==='Number' && k==='NegativeInteger') ||  // Type.isNumber(NegativeInteger: -1)
                (K==='Integer' && k==='NegativeInteger') || // Type.isInteger(NegativeInteger: -1)
                (K==='Number' && k==='Float') || // Type.isNumber(Float: 1.1)
                (K==='Iterator' && k==='String') || // Type.isIterator(String: A)
////                (K==='Instance' && k==='Array') || // Type.isInstance(Array: 1,A)
                (K==='Iterator' && k==='Array') || // Type.isIterator(Array: 1,A)
//                (K==='' && k==='') || // Type.isInstance(Class: class C {})
                (K==='Class' && k==='ErrorClass') || // Type.isClass(ErrorClass: function Error() { [native code] })
//                (K==='' && k==='') || // Type.isInstance(ErrorClass: function Error() { [native code] })
                (K==='Instance' && k==='ErrorInstance') || // Type.isInstance(ErrorInstance: Error)
                (K==='Instance' && k==='Promise') || // Type.isInstance(Promise: [object Promise])
                (K==='Array' && k==='Iterator') || // Type.isArray(Iterator: 1,A)
//                (K==='' && k==='') || // Type.isInstance(Iterator: 1,A)
                (K==='Function' && k==='AsyncFunction') || // Type.isFunction(AsyncFunction: async()=>{})
                (K==='Function' && k==='GeneratorFunction') || // Type.isFunction(GeneratorFunction: function*(){yield undefined;})
                (K==='Function' && k==='AsyncGeneratorFunction') || // Type.isFunction(AsyncGeneratorFunction: async function*(){yield undefined;})
                (K==='Instance' && k==='Date') || // Type.isInstance(Date: Thu Jul 18 2024 09:10:52 GMT+0900 (日本標準時))
                (K==='Instance' && k==='RegExp') || // Type.isInstance(RegExp: /(?:)/)
                (K==='Instance' && k==='URL') || // Type.isInstance(URL: https://a.com/)
////                (K==='Instance' && k==='Map') || // Type.isInstance(Map: [object Map])
                (K==='Iterator' && k==='Map') || // Type.isIterator(Map: [object Map])
////                (K==='Instance' && k==='Set') || // Type.isInstance(Set: [object Set])
                (K==='Iterator' && k==='Set') || // Type.isIterator(Set: [object Set])
                (K==='Instance' && k==='Element') // Type.isInstance(Element: [object HTMLDivElement])
//                (K==='Instance' && k==='Iterator') || // Type.isInstance(Iterator: 1,A)
                ) { expected = true }
            try {
                console.log(`Type.is${K}(${k}: ${v})`)
                if (expected) { a.t(Type[`is${K}`](v)) }
                else { a.f(Type[`is${K}`](v)) }
            } catch (err) {
                console.error(err)
            }
        }
    }
    // 意地悪テスト
    a.t(Type.isPrim(    String('A')))
    a.f(Type.isPrim(new String('A')))

    a.t(Type.isObject({}))
    a.f(Type.isObject(new String('A')))
    a.t('object'===typeof new String('A'))
    a.t('object'===typeof {})
    a.t(Type.isString(new String('A')))
    a.f(Type.isInstance(new String('A')))
    a.t(Type.isIterator(new String('A')))

    // 個別テスト
    a.t(Type.isIter([]))
    a.t(Type.isEmpty([]))
    a.f(Type.isEmpty([1]))
    a.f(Type.isIter({}))
    a.e(TypeError, 'Not iterator.', ()=>Type.isEmpty({})) // Iterでないものは例外発生させる
    /*
    */
    console.log(Type)

    // Number
    //   Integer
    //     Positive
    //     Negative
    //   Float
    // 偽であるべき所が真です。
    // Type.isInteger(Number: 1)
    // Type.isPositiveInteger(Number: 1)
    // Type.isNumber(Integer: 2)
    // Type.isPositiveInteger(Integer: 2)
    // Type.isNumber(PositiveInteger: 3)
    // Type.isInteger(PositiveInteger: 3)
    // Type.isNumber(NegativeInteger: -1)
    // Type.isInteger(NegativeInteger: -1)
    // Type.isNumber(Float: 1.1)
    // Type.isIterator(String: A)
    // Type.isInstance(Array: 1,A)
    // Type.isIterator(Array: 1,A)
    // Type.isFunction(Class: class C {})
    // Type.isFunction(ErrorClass: function Error() { [native code] })
    // Type.isInstance(ErrorInstance: Error)
    // Type.isInstance(Promise: [object Promise])
    // Type.isArray(Iterator: 1,A)
    // Type.isInstance(Iterator: 1,A)
    // Type.isFunction(AsyncFunction: async()=>{})
    // Type.isFunction(GeneratorFunction: function*(){yield undefined;})
    // Type.isFunction(AsyncGeneratorFunction: function AsyncGeneratorFunction() { [native code] })
    // Type.isInstance(Date: Wed Jul 17 2024 18:37:28 GMT+0900 (日本標準時))
    // Type.isInstance(RegExp: /(?:)/)
    // Type.isInstance(URL: https://a.com/)
    // Type.isMap(URL: https://a.com/)
    // Type.isSet(URL: https://a.com/)
    // Type.isInstance(Map: [object Map])
    // Type.isIterator(Map: [object Map])
    // Type.isInstance(Set: [object Set])
    // Type.isIterator(Set: [object Set])
    // Type.isInstance(Element: [object HTMLDivElement])
    // 
    // 
    // 
    // 
    // 





    // 真であるべき所が偽です。
    // Type.isClass(Class: class C {})
    // Type.isErrorClass(ErrorClass: function Error() { [native code] })
    // Type.isAsyncGeneratorFunction(AsyncGeneratorFunction: function AsyncGeneratorFunction() { [native code] })
    // Type.isMap(Map: [object Map])
    // Type.isSet(Set: [object Set])
    // 
    // 
    // 
    // 
    // 
    // 
    // 

    // 引数は真偽値かそれを返す関数であるべきです。
    // Type.isDate(Array: 1,A)
    // Type.isDate(Object: [object Object])
    // Type.isDate(Class: class C {})
    // Type.isDate(Instance: [object Object])
    // Type.isDate(ErrorClass: function Error() { [native code] })
    // Type.isDate(ErrorInstance: Error)
    // Type.isDate(Promise: [object Promise])
    // Type.isDate(Iterator: 1,A)
    // Type.isDate(Function: ()=>{})
    // Type.isDate(AsyncFunction: async()=>{})
    // Type.isDate(GeneratorFunction: function*(){yield undefined;})
    // Type.isDate(AsyncGeneratorFunction: function AsyncGeneratorFunction() { [native code] })
    // Type.isDate(RegExp: /(?:)/)
    // Type.isDate(URL: https://a.com/)
    // Type.isDate(Map: [object Map])
    // Type.isDate(Set: [object Set])
    // Type.isDate(Element: [object HTMLDivElement])
    // 
    // 
    // 
    // 
    // 
    // 
    // 
    // 
    // 
    // 

    // TypeError: Cannot convert a Symbol value to a string
    // Type.isElement(String: A)


    /*
    */
//    const a = new Assertion()

    /*
    a.t(Type.isNull(null))
    a.f(Type.isNull(undefined))
    a.f(Type.isUndefined(null))
    a.t(Type.isUndefined(undefined))
    a.f(Type.isUnd(null))
    a.t(Type.isUnd(undefined))
    a.t(Type.isNU(null))
    a.t(Type.isNU(undefined))
    a.f(Type.isNU(1))
    a.t(Type.isNUSome(null,undefined))
    a.t(Type.isNUSome(null,1))
    a.t(Type.isNUSome(1,undefined))
    a.f(Type.isNUSome(1,2))
    a.t(Type.isNUEvery(null,undefined))
    a.f(Type.isNUEvery(null,1))
    a.f(Type.isNUEvery(1,undefined))
    a.f(Type.isNUEvery(1,2))
    a.t(Type.isPrimitive(null))
    a.t(Type.isPrimitive(undefined))
    a.t(Type.isPrimitive(1))
    a.t(Type.isPrimitive(1.1))
    a.t(Type.isPrimitive('A'))
    a.t(Type.isPrimitive(true))
    a.t(Type.isPrimitive(false))
    a.t(Type.isPrimitive(Symbol()))
    a.f(Type.isPrimitive([]))
    a.f(Type.isPrimitive({}))
    a.f(Type.isPrimitive(new Date()))
    a.f(Type.isPrimitive(Map))
    a.f(Type.isPrimitive(new Map()))
    //class C {}
    a.f(Type.isPrimitive(C))
    a.f(Type.isPrimitive(new C))
    a.f(Type.isPrimitive(new C()))
    a.f(Type.isPrimitive(Type._types.AsyncFunction))
    a.f(Type.isPrimitive(Type._types.GeneratorFunction))
    a.f(Type.isPrimitive(Type._types.AsyncGeneratorFunction))
    a.f(Type.isPrimitive(new Promise((resolve)=>resolve())))

    a.t(Type.isSFn(()=>{}))
    a.f(Type.isSFn(async()=>{}))
    a.f(Type.isSFn(function*(){yield undefined}))
    a.f(Type.isSFn(async function*(){yield undefined}))
    a.f(Type.isAFn(()=>{}))
    a.t(Type.isAFn(async()=>{}))
    a.f(Type.isAFn(function*(){yield undefined}))
    a.f(Type.isAFn(async function*(){yield undefined}))
    a.f(Type.isGFn(()=>{}))
    a.f(Type.isGFn(async()=>{}))
    a.t(Type.isGFn(function*(){yield undefined}))
    a.f(Type.isGFn(async function*(){yield undefined}))
    a.f(Type.isSGFn(()=>{}))
    a.f(Type.isSGFn(async()=>{}))
    a.t(Type.isSGFn(function*(){yield undefined}))
    a.f(Type.isSGFn(async function*(){yield undefined}))
    a.f(Type.isAGFn(()=>{}))
    a.f(Type.isAGFn(async()=>{}))
    a.f(Type.isAGFn(function*(){yield undefined}))
    a.t(Type.isAGFn(async function*(){yield undefined}))
//    const AFn = (async()=>{}).constructor
//    console.log(AFn.name)

//    Type.to('class', )

    */
    a.fin()
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

