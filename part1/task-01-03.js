const { compose } = require('lodash/fp')
const fp = require('lodash/fp')
class MayBe {
    static of(value) {
        return new MayBe(value)
    }
    constructor (value) {
        this._value = value
    }
    map(fn) {
        return this.isNothing() ? MayBe.of(null) : MayBe.of(fn(this._value))
    }
    isNothing() {
        return this._value === undefined || this._value === null
    }
}
let maybe = MayBe.of(['122','233','5444'])
let ex1 = (a) => {
    return maybe.map(fp.map(item => {
        return fp.add(a, item)
    }))
}
console.log(ex1(2))

let ex2 = () => {
    return maybe.map(fp.map(item => {
        return fp.first(item)
    }))._value
}
console.log(ex2())


let safeProp = fp.curry(function(x, o) {
    return MayBe.of(o[x])
})
let user = {
    id: 2,
    name: 'Albert'
}
let ex3 = (x, o) => {
    return safeProp(x, o).map(fp.first)._value
}

console.log(ex3('name', user))

let ex4 = (x) => {
    return MayBe.of(x).map(parseInt)._value
}
console.log(ex4(4.4))

console.log(parseInt(null))

const food = ['披萨','面条']
const info = {lick: food[0]}
info.lick = '面条'
console.log(food)

