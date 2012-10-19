var navigation_manager = function(){
    this.$login = $('#login');

    this.init();
};

navigation_manager.prototype.fixHeader = function(){
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

navigation_manager.prototype.giveFocus = function(){
    if ($("input",this.$login).size()==0) return;
    $("input",this.$login)[0].focus();
};

navigation_manager.prototype.toggleLogin = function(){
    this.$login.toggleClass('hover');
};

navigation_manager.prototype.hideLogin = function(){
    this.$login.removeClass('hover');
};

navigation_manager.prototype.init = function(){
    var _this = this;
    window.onscroll = this.fixHeader;
    this.$login.live('mouseenter',                       function(e){ e.preventDefault(); _this.giveFocus();        });
    $('a.login',this.$login).live('click',               function(e){ e.preventDefault(); _this.toggleLogin();      });
    $('input[type=submit]',this.$login).live('blur',     function(e){ e.preventDefault(); _this.hideLogin();        });
};

new navigation_manager();