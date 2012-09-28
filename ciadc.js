var fs = require('fs'),
    data = {
        posts: eval(fs.readFileSync('ciadc.posts.json')+'').sort(function(a,b){return (b.published && a.published != b.published);}),
        index: eval(fs.readFileSync('ciadc.index.json')+'')
    };

module.exports = {
    index: data['index'], //todo: dont expose this - use get* functions within config.js

    utils: {
        items_per_page: 5,
        get_previous:function(type, current){
            var parent = this.published(type);
            return parent[parent.indexOf(current)+1];
        },

        get_next:function(type, current){
            var parent = this.published(type);
            return parent[parent.indexOf(current)-1];
        },

        published: function(type){
            if (this._published && this._published[type]){
                return this._published[type];
            }
            this._published = {};
            var i= 0,
                parent = data[type],
                len = parent.length,
                items = [];
            for (i;i<len;i++){
                if (parent[i].published) { items.push(parent[i]); }
            }
            this._published[type] = items;
            return items;
        },

        paged: function(type,page_number){
            var i= 0,
                parent = data[type],
                len = 0,
                pages = [];
            if (!parent){return {items:0};} //no page items so you leave with nothing.

            len = (parent.length>this.items_per_page)? this.items_per_page : parent.length;
            if (page_number){
                i=((page_number-1)*(len));
                len=i+len;
            }
            for (i;i<len;i++){
                if (parent[i].published) { pages.push(parent[i]); }
            }
            return {items:pages,current:page_number || 1, count:(Math.ceil(this.published(type).count/this.items_per_page))};
        },

        metadata: function(type,url) { //todo: improve s will get slow with lots of posts
            var i= 0,
                parent = data[type],
                len = parent.length;
            for (i;i<len;i++){
                if (parent[i].url == url) { return parent[i]; }
            }
            return false;
        },

        urlHelper: function(type,url){
            var md = this.metadata(type,url); //todo: cache url result so dont have to look up again
            return '<a href="/'+ type + '/' + md.url + '" >' + md.title + '</a>'
        },

        urlHelper_subtitle: function(type,url){ //todo: cache url result so dont have to look up again
            var md = this.metadata(type,url);
            return '<a href="/'+ type + '/' + md.url + '" >' + md.subtitle + '</a>'
        }
    }
};
