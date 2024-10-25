# 型一覧

<!-- more -->

名|意味
--|----
any|全型
ref|参照型
val|値型

# 備考

　JSは値型(Primitive)／参照型(Object)／null／undefined／NaN等、多数の値がある。そのせいで比較処理などが極めて煩雑になってしまう。また、クラス、インスタンス、オブジェクトを区別する機能がない等の問題もある。同様に、関数、コンストラクタ、メソッド、Staticメソッド、getter、setterを区別する機能もない。さらに`0`と`false`の等値も曖昧(`==`,`===`で変わる)。

```javascript
v === null             // == もあるが勝手に型変換してしまいややこしい…
v === undefined
v === 0
v === false
Number.isNaN(v)        // isNaN()もあるが勝手に型変換してしまいややこしい…
v instanceof SomeClass // 親や先祖が右辺型を継承していても真になってしまう…
'object'===typeof v    // v=null のときも 'object' が返ってしまう…
```

　これを解決したい。解決案として次の方法が考えられる。

* すべて参照型にする

　比較についてはシリアライズして文字列比較することで実現できそう。

```javascript
.serialize()   // インスタンスを文字列化して返す
.deserialize() // 文字列からインスタンスを復元して返す
```
```javascript
const i = Type.int(0);
i.serialize(); // '[Type:int, value:0, 制約:{}, cbFn:{}] '
i.serialize(); // 'new Type.int(0, 制約:{}, cbFn:{})'
i.serialize().deserialize(); // new Type.int(0, 制約:{}, cbFn:{})
```
```javascript
const a = Type.int(0);
const b = Type.int(0);
a.eq(b)
b.eq(a)
Type.eq(a,b)
```

　JSは演算子オーバーライドができないため、メソッドで代用する。

```javascripta
単項演算子
二項演算子
二項演算子

単項演算子(ビット)
&   
|   
^   
-   
<<  
>>  
>>> 

単項演算子(論理)
!   否定    not:()=>
&&  論理積  and:()=>
||  論理和  or:()=>

単項演算子(算術)
+   加算      add:()=>
-   減算      sub:()=>
*   乗算      mul:()=>
**  べき乗    exp:()=>
/   除算      div:()=>
%   剰余      surplus:()=>   
++  前置加算  binc incB
++  後置加算  ainc incA
--  前置減算  bdec decB
--  後置減算  adec decA

ニ項演算子(代入)
=    代入      assign:()=>
+=   加算代入  addAss:()=>
-=   減算代入  subAss:()=>
*=   乗算代入  mulAss:()=>
/=   除算代入  divAss:()=>
%=   剰余代入  surAss:()=>
&=   論理積代入 
|=   論理和代入
^=   排他的論理和代入
&&=  左辺値がtrueのときだけ代入
||=  左辺値がfalseのときだけ代入
??=  左の値がnull / undefinedの場合だけ代入
<<=  左辺の値を右辺の値だけ左シフトした結果を代入
>>=  左辺の値を右辺の値だけ右シフトした結果を代入
>>>= 左辺の値を右辺の値だけ右シフトした結果を代入　(符号なし)

ニ項演算子(比較)
==   左辺と右辺が等しいなら真を返す
!=   左辺と右辺が等しいなら真を返す
<    左辺が右辺より小さいなら真を返す
<=   左辺が右辺と同じか小さいなら真を返す
>    左辺が右辺より大きいなら真を返す
>=   左辺が右辺と同じか大きいなら真を返す
===  型を自動変換せず等値チェックする
!==  型を自動変換せず不等値チェックする
?? 

三項演算子(条件)
a ? x : y   aが真ならxを、偽ならyを返す

他の演算子
,           左右の式を続けて実行
delete      オブジェクトのプロパティや配列の要素を削除
in          指定されたプロパティがオブジェクトに存在するか判定
instanceof  オブジェクトが指定されたクラスのインスタンスか判定
new         新しいインスタンスを生成
typeof      オペランドのデータ型を取得
void        未定義値を返す

()          中にある式の優先度を上げる／関数を実行する。
[]          配列を宣言する
{}          複数行の式を含めるスコープ。
=>          ラムダ式（無名関数）を宣言する。`(x)=>{}`
```

# Zero, NULL, Empty, Blank, NaN

　各型には「存在しない」ことを意味する特殊な状態（値）がある。

```javascript
数            0/NaN
文字列        ''              0===s.length
参照型        null/undefined
配列          []              0===a.length
オブジェクト  {}              0===Object.getOwnPropertyNames(o).length  prototypeまで遡って存在確認した場合と区別すべき？
```

　独自型では`null`/`undefined`を使わない。代わりに`Type.NIL`を使う。どこも参照していないことを意味する。

```javascript
Type.NIL = symbol('nil')
```
```javascript
Type.isEmpty(v)    // 空配列[]なら真を返す（length/size === 0なら真。Map/Set型等も対象）
Type.isBlank(v)    // 空オブジェクト{}なら真を返す
Type.isOwnBlank(v) // 空オブジェクト{}なら真を返す（prototypeは遡らず自身が空であれば真）
```

# 代入ゲッター／セッター

```javascript
const v = Type.int(0)
v.v       // 実際の値を返す
v.v = 1
v.v = '2' // throw new TypeError
```

# 型に応じた演算子メソッド

```javascript
const v = Type.int(0)
v.isZero  // v.value.now === 0
v.isNil   // v.value.now === Type.NIL
v === 0   // false
```
```javascript
v.is(x)   // 参照 比較 ?
v.eq(x)   // 値   比較 ?
```
```javascript
v.eqRef(x)     // v === x
v.eqValue(x)   // v.value.now === (x.value.now ?? x)
v.eqType(x)    // v.constructor.name === x.constructor.name （制約やcbFnも比較したいがどこまで一致したかをどう区別するか）

v.eq[Ref|Value|Type][Or|And](x,y,z,...) // or/and で複数と比較する条件式を指定できる。some(),every()。

v.ne()
v.le()
v.ge()
```

　数は`<`,`>`,`<=`,`>=`のような比較式も持つべき。日付や文字列についても同じ。

