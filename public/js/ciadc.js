var ciadc = function(){

};


ciadc.prototype.savePage = function(){
    var $content = $('.wrapper[contenteditable]'),
        html = $content.html(),
        key = $content.data('key'),
        file = document.location.pathname.split('/')[2]
    $.ajax({url:'/update/' + file,
            type:'post',
            data: html,
            contentType:'text/html',
            processData:false})
    //ajax response to save url
    //fade success message
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
    window.onscroll = this.fixHeader;
    $('#save-page').live('click', this.savePage)
};

ciadc.prototype.init = function(){
    this.setupGlobalEvents();
};


var app = new ciadc();
app.init();