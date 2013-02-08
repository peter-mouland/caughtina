var navigation_manager = function(){
    this.$login = $('#login');
    this.$toggleResponsive = $('#toggle-responsive');
    this.init();
};


navigation_manager.prototype.toggleResponsive = function(type){
    if (($('body.responsive').size()===1 || type=='desktop')){
        $('body').removeClass('responsive');
        $.cookie('view','desktop', {path:'/'});
        this.$toggleResponsive.text('vew fitted site');
    } else {
        $('body').addClass('responsive');
        $.cookie('view','responsive', {path:'/'});
        this.$toggleResponsive.text('vew desktop site');
    }

};

navigation_manager.prototype.setView = function(){
//    console.log($('body.responsive').size(),$.cookie('view'))
    if ($.cookie('view') == 'desktop'){
        $('body').removeClass('responsive');
        this.toggleResponsive('desktop');
    }
};

navigation_manager.prototype.bindEvents = function(){
    this.$toggleResponsive.on('click', this.toggleResponsive.bind(this));
    $(window).on('load',this.setView.bind(this))
};

navigation_manager.prototype.init = function(){
    this.bindEvents();
};

new navigation_manager();