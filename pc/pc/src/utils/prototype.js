Function.prototype.before = function(beforefn) {
    var self = this;    //保存原函数引用
    return function(){  //返回包含了原函数和新函数的 '代理函数'
        beforefn.apply(this, arguments);    //执行新函数，修正this
        return self.apply(this,arguments);  //执行原函数
    }
};

Function.prototype.after = function(afterfn) {
    var self = this;
    return function(){
        var ret = self.apply(this,arguments);
        afterfn.apply(this, arguments);
        return ret;
    }
};
