var ciadc = function(){
    $('body').append($('<div class="save-message"></div>'));
    $message=$('.save-message');
};


ciadc.prototype.showMessage = function(text){
    $message.text(text);
    $message.addClass('shown');
    setTimeout(function(){
        $message.fadeOut(function(){
            $message.removeClass('shown').removeAttr('style');
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

ciadc.prototype.setupGlobalEvents = function(){
    var _this = this;
    window.onscroll = this.fixHeader;
    $('#save-page').live('click', function(){_this.savePage();});
};

ciadc.prototype.init = function(){
    this.setupGlobalEvents();
};


var app = new ciadc();
app.init();