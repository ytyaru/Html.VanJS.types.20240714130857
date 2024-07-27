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
    for (let [k,v] of Object.entries(datas)) {
        for (let K of Object.keys(datas)) {
            let expected = k===K
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
                (K==='Iterator' && k==='Array') || // Type.isIterator(Array: 1,A)
                // Class と ErrorClass は違う。そもそもErrorはClassでなくFunctionだと思われる。
//                (K==='Class' && k==='ErrorClass') || // Type.isClass(ErrorClass: function Error() { [native code] })
                (K==='Instance' && k==='ErrorInstance') || // Type.isInstance(ErrorInstance: Error)
                (K==='Instance' && k==='Promise') || // Type.isInstance(Promise: [object Promise])
                (K==='Array' && k==='Iterator') || // Type.isArray(Iterator: 1,A)
                (K==='Function' && k==='AsyncFunction') || // Type.isFunction(AsyncFunction: async()=>{})
                (K==='Function' && k==='GeneratorFunction') || // Type.isFunction(GeneratorFunction: function*(){yield undefined;})
                (K==='Function' && k==='AsyncGeneratorFunction') || // Type.isFunction(AsyncGeneratorFunction: async function*(){yield undefined;})
                (K==='Instance' && k==='Date') || // Type.isInstance(Date: Thu Jul 18 2024 09:10:52 GMT+0900 (日本標準時))
                (K==='Instance' && k==='RegExp') || // Type.isInstance(RegExp: /(?:)/)
                (K==='Instance' && k==='URL') || // Type.isInstance(URL: https://a.com/)
                (K==='Iterator' && k==='Map') || // Type.isIterator(Map: [object Map])
                (K==='Iterator' && k==='Set') || // Type.isIterator(Set: [object Set])
                (K==='Instance' && k==='Element') // Type.isInstance(Element: [object HTMLDivElement])
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
    console.log(Type)
    a.t(Type.isNullOrUndefinedOrEmpty(null))
    a.t(Type.isNullOrUndefinedOrEmpty(undefined))
    a.t(Type.isNullOrUndefinedOrEmpty([]))
    a.f(Type.isNullOrUndefinedOrEmpty(1)) // Iterでないものでも例外発生せずfalseを返す
    a.t(Type.isNUE([]))

    
    a.t('Null'===Type.getName(null))
    a.t('Undefined'===Type.getName(undefined))
    a.t('Boolean'===Type.getName(false))
    a.t('Integer'===Type.getName(0))
    a.t('Float'===Type.getName(0.1))
    a.t('Integer'===Type.getName(-1))
    a.t('BigInt'===Type.getName(BigInt(9)))
    a.t('Symbol'===Type.getName(Symbol('')))
    a.t('String'===Type.getName(''))
    a.t('(NoNameClass)'===Type.getName(class {}))
    a.t('(NoNameClassInstance)'===Type.getName(new (class {})()))
    a.t('(Class C)'===Type.getName(class C{}))
    a.t('(Instance C)'===Type.getName(new C()))
    a.t('(ErrorClass Error)'===Type.getName(Error))
    a.t('(ErrorClass TypeError)'===Type.getName(TypeError))
    a.t('(ErrorInstance Error)'===Type.getName(new Error()))
    a.t('(ErrorInstance TypeError)'===Type.getName(new TypeError()))
    a.t('Function'===Type.getName(()=>{}))
    console.log(Type._types)
    console.log(Type._types.GeneratorFunction)
    console.log(Type._types.GeneratorFunction.name)
    console.log(Type.getName(Type._types.GeneratorFunction))
    console.log(Type.isGFn(Type._types.GeneratorFunction))
    a.t('GeneratorFunction'===Type.getName(Type._types.GeneratorFunction))
    a.t('AsyncFunction'===Type.getName(Type._types.AsyncFunction))
    a.t('AsyncGeneratorFunction'===Type.getName(Type._types.AsyncGeneratorFunction))

    a.t(Type.isFn(()=>{}))
    a.t(Type.isSFn(()=>{}))
    a.f(Type.isAFn(()=>{}))
    a.f(Type.isGFn(()=>{}))
    a.f(Type.isAGFn(()=>{}))
    console.log((async()=>{}).name)
    console.log((async()=>{}).constructor.name)
    console.log((async()=>{}) instanceof Type._types.AsyncFunction)
    a.t(Type.isAFn(async()=>{}))
    a.t(Type.isAFn((async()=>{})))

    console.log(Type.getName(new (class {})()))

    const SomeClass = Type.to('class', 'SomeClass')
    a.t(Type.isClass(SomeClass))
    a.t(Type.isIns(new SomeClass()))
    a.t(Type.isIns(Type.to('instance', SomeClass)))
    a.e(Error, 'コンストラクタが必要です。', ()=>Type.isIns(Type.to('instance')))
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

