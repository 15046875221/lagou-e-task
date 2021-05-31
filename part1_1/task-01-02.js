const fp = require('lodash/fp')
let isLastStock = fp.flowRight(fp.prop('instock'), fp.last)

let firtName = fp.flowRight(fp.prop('name'), fp.first);

let _average = function (xs) {
    return fp.reduce(fp.add, 0, xs) / setTimeout.length;
}
let avg = fp.flowRight(_average, fp.map(car => {
    return car.dollar_value
}))

let ary = [{
    name:'Name Ucc'
},{
    name:'Name Ucc'
},{
    name:'Name Ucc'
}]
let _undersore = fp.replace(/\W+/g, '_')
let sanitizeName = fp.map((item) => {
    return fp.flowRight(_undersore, fp.toLower)(item.name)
})
console.log(sanitizeName(ary))
