var ciadc = function(){
    $('body').append($('<div class="save-message"></div>'));
    $('#article').append($('<div class="edit-controls"><span class="plus">+</span><span class="minus">-</span><span class="move">=</span></div>'));
    this.controls = $('div.edit-controls');
    this.$login = $('#login')
    this.$message=$('div.save-message');
    this.adminUser = false;
    this.editableTags = $('h2,p,dt,dd',$('#article div.wrapper'));
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
    this.disableEdit();
    var $content = $('#article div.wrapper'),
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
    var self = this;
    this.editableTags.attr('contenteditable','true').bind('keydown',function(e) { self.preventBadKeys(e, this); });
    this.adminUser = true;
    $('a#edit-page',this.$login).text('update').attr('id','save-page');
};

ciadc.prototype.disableEdit = function(){
    var self = this;
    this.adminUser = false;
    this.editableTags.removeAttr('contenteditable').unbind('keydown');
    $('a#save-page',this.$login).text('edit').attr('id','edit-page');
    self.hideEditControls();
};

ciadc.prototype.showEditControls = function(el){
    if (!this.adminUser){ return; }
    var pos = el.position();
    this.controls.hovering = true;
    this.controls.elementToEdit = el;
    this.controls.addClass('show').css({'left':pos.left,'top':pos.top});
};

ciadc.prototype.hideEditControls = function(){
    var self = this,
        hideLater = function(){
            if (self.controls.hovering){ setTimeout(hideLater,1000); return; }
            self.controls.removeClass('show');
            self.clearEditVars();
        };
    setTimeout(hideLater,1000);
};

ciadc.prototype.clearEditVars = function(){
    this.controls.hovering = false;
    this.controls.elementToEdit = undefined;
};

ciadc.prototype.addElement = function(){
    var el = this.controls.elementToEdit,
        newEl = el.clone();
    newEl.text('new section');
    newEl.insertAfter(el);
};

ciadc.prototype.removeElement = function(){
    var el = this.controls.elementToEdit;
    if (el.text()==''){
        el.remove();
    } else {
        this.showMessage('Cannot delete elements containing text!');
    }
};



ciadc.prototype.preventBadKeys = function(e, el){
    if (e.keyCode==13){
        e.preventDefault();
    }
};

ciadc.prototype.setupGlobalEvents = function(){
    var _this = this;
    window.onscroll = this.fixHeader;
    this.$login.live('mouseenter',                       function(e){ e.preventDefault(); _this.giveFocus();        });
    $('a.login',this.$login).live('click',               function(e){ e.preventDefault(); _this.toggleLogin();      });
    $('a#save-page',this.$login).live('click',           function(e){ e.preventDefault(); _this.savePage();         });
    $('a#edit-page',this.$login).live('click',           function(e){ e.preventDefault(); _this.enableEdit();       });
    $('input[type=submit]',this.$login).live('blur',     function(e){ e.preventDefault(); _this.hideLogin();        });
    this.editableTags.live('mouseenter',   function(e){ e.preventDefault(); _this.showEditControls($(this));});
    this.editableTags.live('mouseleave',   function(e){ e.preventDefault(); _this.controls.hovering = false; _this.hideEditControls(); });
    this.controls.live('mouseenter',       function(){ _this.controls.hovering = true; });
    this.controls.live('mouseleave',       function(){ _this.clearEditVars(); });
    $('span.plus',this.controls).live('click',           function(){ _this.addElement(); });
    $('span.minus',this.controls).live('click',          function(){ _this.removeElement(); });
};

ciadc.prototype.init = function(){
    this.setupGlobalEvents();
};

var app = new ciadc();
app.init();