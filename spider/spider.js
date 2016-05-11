"use strict"

var _superagent = require('superagent'),
    _cheerio = require('cheerio'),
    Task = require("../task");

/**
 * 功能：抓取网页内容，提取数据
 **/
class Spider extends Task{
    constructor (_opts) {
        super();
        this.__url = _opts.url;
        this.__data = _opts.data || {};
    }
     
    __onTask () {
        this.__getHtml(this.__url, this.__onHtml.bind(this));
    }
    
    /**
     * 获取对应url的html
     * 异常情况：
     *      - 未能成功获取数据
     **/
    
    __getHtml (_url, _cb) {
        _superagent.get(_url).end(function (_err, _res) {
            
            if(_err) {
                this.emit("error");
                return;
            }
            
            _cb(_res.text);
            
        }.bind(this));
    }
    
    //获取html中数据，子类实现
    __getData (_$) {
        return {};
    }
    
    __onHtml (_html) {
        var _$ = _cheerio.load(_html);
        var _data = this.__getData(_$);
        Object.assign(this.__data, _data);
        this.emit("success", this.__data);
    }
}

module.exports = Spider;