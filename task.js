"use strict"

var Event = require("events");

class Task extends Event {
    constructor () {
        super();
    }
    
    run () {
        this.__onTask();
        return this;
    }
    
    __onTask () {
        var _result = {};
        this.emit("success", _result);
        this.emit("error", _result);
    }
}

module.exports = Task;