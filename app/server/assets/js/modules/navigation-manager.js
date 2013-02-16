var navigation_manager = function(){
    this.$login = $('#login');
    this.$toggleResponsive = $('#toggle-responsive');
    this.$filters = $('#filter').find('a');
    this.$recentArticles = $('#recent_articles');
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
    if ($.cookie('view') == 'desktop'){
        $('body').removeClass('responsive');
        this.toggleResponsive('desktop');
    }
};



navigation_manager.prototype.addFilter = function($el){
    var filter = utils.textToId($el.text()),
        $loader =  this.$recentArticles.append('div.loader');
    $el.addClass('selected');
    this.$recentArticles.children().hide().filter('.tag-' + filter).show();
    $.getJSON('/tags/' + filter + '.json', function(data){
        $loader.remove();
        this.$recentArticles.append(data)
    });

};

navigation_manager.prototype.removeFilter = function($el){
    var filter = utils.textToId($el.text());
    $el.removeClass('selected');
    this.$recentArticles.show()

};

navigation_manager.prototype.filterTags = function(e){
    e.preventDefault();
    var $el = $(e.currentTarget);

    if ($el.hasClass('selected')){
        this.removeFilter($el);
    } else {
        this.addFilter($el);
    }
}

navigation_manager.prototype.bindEvents = function(){
    this.$toggleResponsive.on('click', this.toggleResponsive.bind(this));
    this.$filters.on('click', this.filterTags.bind(this));
    $(window).on('load',this.setView.bind(this));
};

navigation_manager.prototype.init = function(){
    this.bindEvents();
};

new navigation_manager();