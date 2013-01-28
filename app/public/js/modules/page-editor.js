var page_editor = function(){
    var self = this;
    $('#article').append($('<div class="edit-controls"><span class="plus">+</span><span class="minus">-</span></div>'));
    this.controls = $('div.edit-controls');
    this.articleWrapper = $('div.article div.copy');
    this.$login = $('#login')
    this.editableTags = $('h2,p,dt',this.articleWrapper);
    this.adminUser = false;

    self.init()
};

page_editor.prototype.savePageLocally = function(){
    OS.create_table('posts');
    OS.insert('posts',this.articleWrapper.html());
};

page_editor.prototype.savePageOnServer = function(){
    var html = this.articleWrapper.html(),
        file = document.location.pathname.split('/')[2];
    $.ajax({url:'/admin/update/' + file,
        type:'post',
        data: html,
        contentType:'text/html',
        processData:false
    }).done(function(data,status){
            $(window).trigger('show-message',{msg:'Page Saved successfully'});
        }).fail(function(data,status){
            console.log(status); //parseerror
        });
};

page_editor.prototype.savePage = function(){
    this.disableEdit();
    if (navigator.onLine){
        this.savePageOnServer();
    } else {
        this.savePageLocally();
    }
};


page_editor.prototype.enableEdit = function(){
    var self = this;
    this.editableTags.attr('contenteditable','true').bind('keydown',function(e) { self.setupKeys(e, this); });
    this.adminUser = true;
    $('a#edit-page',this.$login).text('save').attr('id','save-page');
};


page_editor.prototype.disableEdit = function(){
    var self = this;
    this.adminUser = false;
    this.editableTags.removeAttr('contenteditable').unbind('keydown');
    $('a#save-page',this.$login).text('edit').attr('id','edit-page');
    self.hideEditControls();
    self.disableDrag();
};


page_editor.prototype.addElement = function(){
    var el = this.controls.elementToEdit,
        newEl = el.clone();
    newEl.text('new section');
    newEl.insertAfter(el);
};

page_editor.prototype.removeElement = function(){
    var el = this.controls.elementToEdit;
    if (el.text()==''){
        el.remove();
    } else {
        $(window).trigger('show-message',{msg:'Cannot delete elements containing text!'});
    }
};

page_editor.prototype.setupKeys = function(e, el){
    if (e.keyCode==13){
        e.preventDefault();
    } else if (e.keyCode == 27 && document.execCommand){
        document.execCommand('undo');
    }
};

page_editor.prototype.showEditControls = function(el){
    if (!this.adminUser){ return; }
    var pos = el.position();
    this.controls.hovering = true;
    this.controls.elementToEdit = el;
    this.controls.addClass('show').css({'left':pos.left,'top':pos.top});
};

page_editor.prototype.hideEditControls = function(){
    var self = this,
        hideLater = function(){
            if (self.controls.hovering){ setTimeout(hideLater,1000); return; }
            self.controls.removeClass('show');
            self.clearEditVars();
        };
    setTimeout(hideLater,1000);
};

page_editor.prototype.clearEditVars = function(){
    this.controls.hovering = false;
    this.controls.elementToEdit = undefined;
};

page_editor.prototype.enableDrag = function(){
//    $('section',this.articleWrapper).sortable();
};

page_editor.prototype.disableDrag = function(){
//    $('section',this.articleWrapper).sortable('destroy');
};

page_editor.prototype.offlineMode = function(){
    $(window).trigger('show-message',{msg:'Site is now in Offline Mode.<br/>  Updates will be saved locally',time:-1});
};

page_editor.prototype.onlineMode = function(){
    OS.showRecords('posts', function(dataset){
        if (dataset.length>0){
            $(window).trigger('show-message',{msg:'Site is now Online. There is data to save on the server.',time:-1});
        } else {
            $(window).trigger('show-message',{msg:'Site is now Online.'});
        }
    });
};

page_editor.prototype.loadOfflineContent = function(){
    var self = this;
    OS.showRecords('posts', function(dataset){
        if (dataset.length>0){
            self.articleWrapper.html(dataset.item(dataset.length-1).content).addClass('offlineContent')
        }
    });
};

page_editor.prototype.init = function(){
    var self = this;
    this.editableTags.live('mouseenter',   function(e){ e.preventDefault(); self.showEditControls($(this));});
    this.editableTags.live('mouseleave',   function(e){ e.preventDefault(); self.controls.hovering = false; self.hideEditControls(); });
    this.controls.live('mouseenter',       function(){ self.controls.hovering = true; });
    this.controls.live('mouseleave',       function(){ self.clearEditVars(); });
    $('span.plus', this.controls).live('click',          function(){ self.addElement(); });
    $('span.minus',this.controls).live('click',          function(){ self.removeElement(); });
    $('a#save-page',this.$login).live('click',           function(e){ e.preventDefault(); self.savePage();         });
    $('a#edit-page',this.$login).live('click',           function(e){ e.preventDefault(); self.enableEdit(); self.enableDrag();      });

    $(window).bind('online', function(){ self.onlineMode(); });
    $(window).bind('offline', function(){ self.offlineMode(); });
    if (!navigator.onLine){ self.offlineMode(); }

    this.loadOfflineContent();
};

new page_editor();