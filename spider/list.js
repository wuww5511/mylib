"use strict"

var Task = require('../task'),
    Queue = require('../queue'),
    EventProxy = require('eventproxy');

/**
 * 功能： 将多次的spider结果合并
 *
 ****/
class List extends Task {
    
    /**
     *  klass {Class} Spider或其子类
     *  url {Array|string} 需要抓取数据的数组
     *  datas {Array|Object} 需要合并的数据
     *  queue {Object|Queue} "../queue.js"的实例
     */
    constructor (_opts) {
        super();
        this.__queue = _opts.queue || new Queue();
        this.__klass = _opts.klass;
        this.__urls = _opts.urls;
        this.__datas = _opts.datas || [];
        this.__ep = new EventProxy();
    }
    
    __onTask () {
        if(this.__urls.length == 0) {
            this.emit("error");
            return;
        };
        
        this.__ep.after("oneTaskEnd", this.__urls.length, this.__onAllTaskEnd.bind(this));
        
        for(var _i = 0; _i < this.__urls.length; _i++) {
            
            let _spider = new this.__klass({
                url: this.__urls[_i],
                data: {
                    index: _i
                }
            });
            
            _spider
                .on("success", function (_data) {
                    this.__ep.emit("oneTaskEnd", _data);
                }.bind(this))
                .on("error", function () {
                    this.__ep.emit("oneTaskEnd", {});
                }.bind(this));
            
            this.__queue.push(_spider);
        }
        
        
    }
    
    __onAllTaskEnd (_results) {
        for(var _i = 0; _i < _results.length; _i++) {
            let _res = _results[_i];
            Object.assign(this.__datas[_res.index], _res);
            delete this.__datas[_res.index].index;
        }
        this.emit("success", this.__datas);
    }
    
    
}

module.exports = List;