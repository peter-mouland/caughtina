var ciac = {};
(function(){
    var setupGlobalEvents = function(){
        window.onscroll = function(){
            var el = document.getElementsByTagName('body')[0],
                c = el.getAttribute('class') || el.className;
            if (window.pageYOffset > 168){
                if (c.indexOf('fixed')<0){
                    el.setAttribute('class',c + ' fixed');
                    el.className = c + ' fixed';
                }
            } else {
                el.setAttribute('class', c.replace('fixed',''));
                el.className = c.replace('fixed','');
            }
        };
    },
    init = function(){
        setupGlobalEvents();
    };
    init();
}());