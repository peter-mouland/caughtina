var fs = require('fs'),
    data = {
        posts: eval(fs.readFileSync('ciadc.posts.json')+'').sort(function(a,b){return (b.published && a.published != b.published);}),
        index: eval(fs.readFileSync('ciadc.index.json')+'')
    };

module.exports = {
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
            if (this._published && this._published[type]){  return this._published[type];     }
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
            if (!this._paged) {                  this._paged = {};                      }
            if (!this._paged[type]){             this._paged[type] = {};                }
            if (this._paged[type][page_number]){ return this._paged[type][page_number]; }
            var i= 0,
                parent = data[type],
                len = 0,
                pages = [],
                _return;
            if (!parent){return {items:0};} //no page items so you leave with nothing.

            len = (parent.length>this.items_per_page)? this.items_per_page : parent.length;
            if (page_number){
                i=((page_number-1)*(len));
                len=i+len;
            } else {
                page_number = 1;
            }
            for (i;i<len;i++){
                if (parent[i].published) { pages.push(parent[i]); }
            }
            _return = {items:pages,current:page_number, count:(Math.ceil(this.published(type).length/this.items_per_page))};
            this._paged[type][page_number] = _return;
            return _return;
        },

        metadata: function(type,url) { //todo: improve s will get slow with lots of posts
            if (!this._metadata){                this._metadata = {};              }
            if (!this._metadata[type]){          this._metadata[type] = {};        }
            if (this._metadata[type][url]){      return this._metadata[type][url]; }
            var i= 0,
                parent = data[type],
                len = parent.length,
                _return;
            for (i;i<len;i++){
                if (parent[i].url == url) {
                    _return = parent[i];
                    this._metadata[type][url] = _return;
                    return _return;
                }
            }
            return false;
        },

        urlHelper: function(type,url){
            var md = this.metadata(type,url);
            return '<a href="/'+ type + '/' + md.url + '" >' + md.title + '</a>'
        },

        urlHelper_subtitle: function(type,url){
            var md = this.metadata(type,url);
            return '<a href="/'+ type + '/' + md.url + '" >' + md.subtitle + '</a>'
        }
    }
};