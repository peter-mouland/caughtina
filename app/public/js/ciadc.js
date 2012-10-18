var ciadc = function(){
    $('body').append($('<div class="save-message"></div>'));
    this.$login = $('#login')
    this.$message=$('div.save-message');
};


ciadc.prototype.showMessage = function(e,cfg){
    var self = this,
        msg = cfg.msg,
        time = cfg.time || 2000;
    self.$message.text(msg).addClass('shown');
    setTimeout(function(){
        self.$message.fadeOut(function(){
            self.$message.removeClass('shown').removeAttr('style');
        });
    },time);
};


ciadc.prototype.fixHeader = function(){
    var el = document.body,
        c = el.getAttribute('class') || el.className;
    if (window.pageYOffset > 168){
        if (c.indexOf('fixed')<0){
            el.setAttribute('class',c + ' fixed');
            el.className = c + ' fixed';
        }
    } else if(c.indexOf('fixed')>=0){
        el.setAttribute('class', c.replace('fixed',''));
        el.className = c.replace('fixed','');
    }
};

ciadc.prototype.giveFocus = function(){
    if ($("input",this.$login).size()==0) return;
    $("input",this.$login)[0].focus();
};

ciadc.prototype.toggleLogin = function(){
    this.$login.toggleClass('hover');
};

ciadc.prototype.hideLogin = function(){
    this.$login.removeClass('hover');
};


ciadc.prototype.setupGlobalEvents = function(){
    var _this = this;
    window.onscroll = this.fixHeader;
    this.$login.live('mouseenter',                       function(e){ e.preventDefault(); _this.giveFocus();        });
    $('a.login',this.$login).live('click',               function(e){ e.preventDefault(); _this.toggleLogin();      });
    $('input[type=submit]',this.$login).live('blur',     function(e){ e.preventDefault(); _this.hideLogin();        });
    $(window).bind('show-message',function(e,cfg){ _this.showMessage(e,cfg);});
};

ciadc.prototype.init = function(){
    this.setupGlobalEvents();
};

var app = new ciadc();
app.init();