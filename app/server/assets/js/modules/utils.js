var Utils = function(){
    var self = this;
    $('body').append($('<div class="save-message"></div>'));
    this.$message=$('div.save-message');
    $(window).bind('show-message',function(e,cfg){ self.showMessage(e,cfg);});
};

Utils.prototype.showMessage = function(e,cfg){
    var self = this,
        msg = cfg.msg,
        time = cfg.time || 2000,
        hide = function(){
            self.$message.fadeOut(function(){
                self.$message.removeClass('shown').removeAttr('style');
            });
        };
    self.$message.html(msg).addClass('shown');
    if (time>0){
        setTimeout(hide,time);
    }
};


Utils.prototype.textToId = function(s){
    return s.toLowerCase().replace(/ /g,'-');
};

var utils = new Utils();