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
    a.f(Type.isPrimitive(null))
    a.f(Type.isPrimitive(undefined))
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
    class C {}
    a.f(Type.isPrimitive(C))
    a.f(Type.isPrimitive(new C))
    a.f(Type.isPrimitive(new C()))
    a.t(Type.isAfn(async()=>{}))
    a.f(Type.isAfn(()=>{}))
    const AFn = (async()=>{}).constructor
    console.log(AFn.name)
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

