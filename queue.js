"use strict"

var _async = require("async"),
    Event = require("events");


/**
 * task需要继承自Event并实现接口 ("/lib/task.js")
 *      - run {Function} 执行任务
 *      - 触发"success", "error" 事件
 **/
class Queue extends Event{
    constructor () {
        super();
        
        this.__concurrency = 5;
        
        this.__queue = _async.queue(function (_task, _cb) {
    
            _task.run().on("success", function () {
                _cb();
            })
            .on("error", function () {
                _cb();
            });

        }, this.__concurrency);
        
        this.__queue.drain = function () {
            this.emit("end");
        }.bind(this);
    }
    
    push (_task) {
        this.__queue.push(_task);
    }
}

module.exports = Queue;