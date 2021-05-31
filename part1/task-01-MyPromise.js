// 定义状态
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
class MyPromise {
    constructor(executor) {
        // 立即执行传入函数，并传入reslove reject方法
        executor(this.reslove, this.reject)
    }
    statues = PENDING; // 初始状态为pending
    value = undefined; // reslove 存储值
    reason = undefined; //  reject 存储值
    successCallback = []; // 成功 异步会掉数组
    failedCallback = []; // 失败 异步回调数组
    reslove = value => {
        if (this.statues !== PENDING) return; //只有pending才会向下执行，
        this.value = value;
        // 改变状态
        this.statues = FULFILLED;
        // 异步情况 当reslove执行是如果成功回调数组有值，依次执行
        while(this.successCallback.length) {
            this.successCallback.shift()();
        }
    }
    reject = reason => {
        if (this.statues !== PENDING) return;
        this.reason = reason;
        this.statues = REJECTED;
        // 异步情况 同成功
        while(this.failedCallback.length) {
            this.failedCallback.shift()();
        }
        
    }
    then (successCallback, failedCallback) {
        // 无实参时返回 valve
        successCallback ? successCallback : value => value;
        // 无实参跑出错误
        failedCallback ? failedCallback : reason => { throw reason }
        // then 返回值还是promise 链式调用
        const promise2 = new MyPromise((reslove, reject) => {
            if (this.statues === FULFILLED) {
                // 异步操作为获取promise2
                setTimeout(() => {
                    // try catch 抛出错误
                    try {
                        let x = successCallback(this.value);
                        reslovePromise(promise2, x, reslove, reject)
                    } catch (error) {
                        reject(error)
                    }
                }, 0)
            }
            else if (this.statues === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = failedCallback(this.reason);
                        reslovePromise(promise2, x, reslove, reject)
                    } catch (error) {
                        reject(error)
                    }
                }, 0)
            }
            else {
                // 异步处理
                this.successCallback = this.successCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = successCallback(this.value);
                            reslovePromise(promise2, x, reslove, reject)
                        } catch (error) {
                            reject(error)
                        }
                    }, 0)
                });
                this.failedCallback = this.failedCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = failedCallback(this.reason);
                            reslovePromise(promise2, x, reslove, reject)
                        } catch (error) {
                            reject(error)
                        }
                    }, 0)
                });
            }
        })
        return promise2
    }
    // 任意位置执行
    finally (callback) {
        return this.then((value) => {
            // 用Promise.reslove将传入值转化为promise。在调用.then方法将返回值传递下去
            return MyPromise.reslove(callback()).then(() => value);
        },
        reason => {
            return MyPromise.reslove(callback()).then(() => { throw reason })
        })
    }
    catch(failCallback) {
        // 抛出错误
        return this.then(undefined, failCallback)
    }
    static all (arry) {
        const result = [];
        // 防止异步 
        let index = 0;
        return new MyPromise((reslove, reject) => {
            // 将数组中每个元素值依传入顺序添加进 result
            function addData(key, value) {
                result[key] = value;
                index ++;
                // 当index与arry长度相等时，意味全部成功执行，将全部知reslove
                if (i === arry.length) {
                    reslove(result);
                }
            }
            for (let i = 0; i < arry.length; i++) {
                let current = arry[i];
                //
                if (current instanceof MyPromise) {
                    current.then(value => addData(i,value), reason => reject(reason))
                }
                else {
                    addData(i, current)
                }
            }
        })
    }
    // 将普通值转化为promise对象
    static reslove(value) {
        if (value instanceof MyPromise) return value
        return new MyPromise(reslove => reslove(value))
    }
}

function reslovePromise(promise, x, reslove, reject) {
    // 如果.then方法返回自身，抛出错误
    if (promise === x) {
        reject('error');
    }
    // 返回.then是个promise对象，执行.then方法
    if (x instanceof MyPromise) {
        x.then(reslove, reject);
    }
    else {
    // 普通值直接调用reslove向下传递
        reslove(x);
    }
}