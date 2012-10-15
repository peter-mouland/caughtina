var ciadc = function(){
    $('body').append($('<div class="save-message"></div>'));
    this.$login = $('#login')
    this.$message=$('div.save-message');
};


ciadc.prototype.showMessage = function(text){
    var self = this;
    self.$message.text(text);
    self.$message.addClass('shown');
    setTimeout(function(){
        self.$message.fadeOut(function(){
            self.$message.removeClass('shown').removeAttr('style');
        });
    },1000);
};

ciadc.prototype.savePage = function(){
    var $content = $('.wrapper[contenteditable]'),
        html = $content.html(),
        file = document.location.pathname.split('/')[2],
        _this = this;
    $.ajax({url:'/admin/update/' + file,
            type:'post',
            data: html,
            contentType:'text/html',
            processData:false
        }).done(function(data,status){
            _this.showMessage('Page Updated successfully');
        }).fail(function(data,status){
            console.log(status); //parseerror
        });
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
ciadc.prototype.enableEdit = function(){
    $('#article div.wrapper').attr('contenteditable','true').addClass('editable');
    $('body').append($('<div class="edit-controls"><span class="plus">+</span><span class="minus">-</span><span class="move">=</span></div>'));
    this.controls = $('div.edit-controls');
    $('a#edit-page',this.$login).text('update').attr('id','save-page');
};

ciadc.prototype.showEditControls = function(el){
//    this.controls.addClass('show').css({'left':el.left(),'top':el.top()});
};
ciadc.prototype.hideEditControls = function(el){
    this.controls.removeClass('show');
};

ciadc.prototype.setupGlobalEvents = function(){
    var _this = this;
    window.onscroll = this.fixHeader;
    this.$login.live('mouseenter',   function(e){ e.preventDefault(); _this.giveFocus();});
    $('a.login',this.$login).live('click',   function(e){ e.preventDefault(); _this.toggleLogin();});
    $('a#save-page',this.$login).live('click', function(e){ e.preventDefault(); _this.savePage();  });
    $('a#edit-page',this.$login).live('click',   function(e){ e.preventDefault(); _this.enableEdit();});
    $('input[type=submit]',this.$login).live('blur',   function(e){ e.preventDefault(); _this.hideLogin();});
    $('h2, p,dt,dd',$('.editable ')).live('mouseenter',   function(e){ e.preventDefault(); _this.showEditControls($(this));});
    $('h2, p,dt,dd',$('.editable ')).live('mouseleave',   function(e){ e.preventDefault(); _this.hideEditControls($(this));});
};

ciadc.prototype.init = function(){
    this.setupGlobalEvents();
};


var app = new ciadc();
app.init();