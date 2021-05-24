let p1 = new Promise((resolve) => {
    resolve('hello')
})
let p2 = new Promise((resolve) => {
    resolve('lagou')
})
let p3 = new Promise((resolve) => {
    resolve('I love U')
})
Promise.all(p1, p2 ,p3).then((arry) => {
    const [a, b, c] = arry;
    console.log(a + b + c);
})