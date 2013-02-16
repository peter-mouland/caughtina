if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {},
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis
                    ? this
                    : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}
/*!
 * jQuery JavaScript Library v2.0.0b1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-1-14
 */
(function( window, undefined ) {
    "use strict";
    var
    // A central reference to the root jQuery(document)
        rootjQuery,

    // The deferred used on DOM ready
        readyList,

    // Use the correct document accordingly with window argument (sandbox)
        document = window.document,
        location = window.location,

    // Map over jQuery in case of overwrite
        _jQuery = window.jQuery,

    // Map over the $ in case of overwrite
        _$ = window.$,

    // [[Class]] -> type pairs
        class2type = {},

    // List of deleted data cache ids, so we can reuse them
        core_deletedIds = [],

        core_version = "2.0.0b1",

    // Save a reference to some core methods
        core_concat = core_deletedIds.concat,
        core_push = core_deletedIds.push,
        core_slice = core_deletedIds.slice,
        core_indexOf = core_deletedIds.indexOf,
        core_toString = class2type.toString,
        core_hasOwn = class2type.hasOwnProperty,
        core_trim = core_version.trim,

    // Define a local copy of jQuery
        jQuery = function( selector, context ) {
            // The jQuery object is actually just the init constructor 'enhanced'
            return new jQuery.fn.init( selector, context, rootjQuery );
        },

    // Used for matching numbers
        core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

    // Used for splitting on whitespace
        core_rnotwhite = /\S+/g,

    // A simple way to check for HTML strings
    // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
    // Strict HTML recognition (#11290: must start with <)
        rquickExpr = /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,

    // Match a standalone tag
        rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

    // Matches dashed string for camelizing
        rmsPrefix = /^-ms-/,
        rdashAlpha = /-([\da-z])/gi,

    // Used by jQuery.camelCase as callback to replace()
        fcamelCase = function( all, letter ) {
            return letter.toUpperCase();
        },

    // The ready event handler and self cleanup method
        DOMContentLoaded = function() {
            document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
            jQuery.ready();
        };

    jQuery.fn = jQuery.prototype = {
        // The current version of jQuery being used
        jquery: core_version,

        constructor: jQuery,
        init: function( selector, context, rootjQuery ) {
            var match, elem;

            // HANDLE: $(""), $(null), $(undefined), $(false)
            if ( !selector ) {
                return this;
            }

            // Handle HTML strings
            if ( typeof selector === "string" ) {
                if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
                    // Assume that strings that start and end with <> are HTML and skip the regex check
                    match = [ null, selector, null ];

                } else {
                    match = rquickExpr.exec( selector );
                }

                // Match html or make sure no context is specified for #id
                if ( match && (match[1] || !context) ) {

                    // HANDLE: $(html) -> $(array)
                    if ( match[1] ) {
                        context = context instanceof jQuery ? context[0] : context;

                        // scripts is true for back-compat
                        jQuery.merge( this, jQuery.parseHTML(
                            match[1],
                            context && context.nodeType ? context.ownerDocument || context : document,
                            true
                        ) );

                        // HANDLE: $(html, props)
                        if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
                            for ( match in context ) {
                                // Properties of context are called as methods if possible
                                if ( jQuery.isFunction( this[ match ] ) ) {
                                    this[ match ]( context[ match ] );

                                    // ...and otherwise set as attributes
                                } else {
                                    this.attr( match, context[ match ] );
                                }
                            }
                        }

                        return this;

                        // HANDLE: $(#id)
                    } else {
                        elem = document.getElementById( match[2] );

                        // Check parentNode to catch when Blackberry 4.6 returns
                        // nodes that are no longer in the document #6963
                        if ( elem && elem.parentNode ) {
                            // Handle the case where IE and Opera return items
                            // by name instead of ID
                            if ( elem.id !== match[2] ) {
                                return rootjQuery.find( selector );
                            }

                            // Otherwise, we inject the element directly into the jQuery object
                            this.length = 1;
                            this[0] = elem;
                        }

                        this.context = document;
                        this.selector = selector;
                        return this;
                    }

                    // HANDLE: $(expr, $(...))
                } else if ( !context || context.jquery ) {
                    return ( context || rootjQuery ).find( selector );

                    // HANDLE: $(expr, context)
                    // (which is just equivalent to: $(context).find(expr)
                } else {
                    return this.constructor( context ).find( selector );
                }

                // HANDLE: $(DOMElement)
            } else if ( selector.nodeType ) {
                this.context = this[0] = selector;
                this.length = 1;
                return this;

                // HANDLE: $(function)
                // Shortcut for document ready
            } else if ( jQuery.isFunction( selector ) ) {
                return rootjQuery.ready( selector );
            }

            if ( selector.selector !== undefined ) {
                this.selector = selector.selector;
                this.context = selector.context;
            }

            return jQuery.makeArray( selector, this );
        },

        // Start with an empty selector
        selector: "",

        // The default length of a jQuery object is 0
        length: 0,

        // The number of elements contained in the matched element set
        size: function() {
            return this.length;
        },

        toArray: function() {
            return core_slice.call( this );
        },

        // Get the Nth element in the matched element set OR
        // Get the whole matched element set as a clean array
        get: function( num ) {
            return num == null ?

                // Return a 'clean' array
                this.toArray() :

                // Return just the object
                ( num < 0 ? this[ this.length + num ] : this[ num ] );
        },

        // Take an array of elements and push it onto the stack
        // (returning the new matched element set)
        pushStack: function( elems ) {

            // Build a new jQuery matched element set
            var ret = jQuery.merge( this.constructor(), elems );

            // Add the old object onto the stack (as a reference)
            ret.prevObject = this;
            ret.context = this.context;

            // Return the newly-formed element set
            return ret;
        },

        // Execute a callback for every element in the matched set.
        // (You can seed the arguments with an array of args, but this is
        // only used internally.)
        each: function( callback, args ) {
            return jQuery.each( this, callback, args );
        },

        ready: function( fn ) {
            // Add the callback
            jQuery.ready.promise().done( fn );

            return this;
        },

        slice: function() {
            return this.pushStack( core_slice.apply( this, arguments ) );
        },

        first: function() {
            return this.eq( 0 );
        },

        last: function() {
            return this.eq( -1 );
        },

        eq: function( i ) {
            var len = this.length,
                j = +i + ( i < 0 ? len : 0 );
            return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
        },

        map: function( callback ) {
            return this.pushStack( jQuery.map(this, function( elem, i ) {
                return callback.call( elem, i, elem );
            }));
        },

        end: function() {
            return this.prevObject || this.constructor(null);
        },

        // For internal use only.
        // Behaves like an Array's method, not like a jQuery method.
        push: core_push,
        sort: [].sort,
        splice: [].splice
    };

// Give the init function the jQuery prototype for later instantiation
    jQuery.fn.init.prototype = jQuery.fn;

    jQuery.extend = jQuery.fn.extend = function() {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if ( typeof target === "boolean" ) {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
            target = {};
        }

        // extend jQuery itself if only one argument is passed
        if ( length === i ) {
            target = this;
            --i;
        }

        for ( ; i < length; i++ ) {
            // Only deal with non-null/undefined values
            if ( (options = arguments[ i ]) != null ) {
                // Extend the base object
                for ( name in options ) {
                    src = target[ name ];
                    copy = options[ name ];

                    // Prevent never-ending loop
                    if ( target === copy ) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
                        if ( copyIsArray ) {
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src : [];

                        } else {
                            clone = src && jQuery.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[ name ] = jQuery.extend( deep, clone, copy );

                        // Don't bring in undefined values
                    } else if ( copy !== undefined ) {
                        target[ name ] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    };

    jQuery.extend({
        noConflict: function( deep ) {
            if ( window.$ === jQuery ) {
                window.$ = _$;
            }

            if ( deep && window.jQuery === jQuery ) {
                window.jQuery = _jQuery;
            }

            return jQuery;
        },

        // Is the DOM ready to be used? Set to true once it occurs.
        isReady: false,

        // A counter to track how many items to wait for before
        // the ready event fires. See #6781
        readyWait: 1,

        // Hold (or release) the ready event
        holdReady: function( hold ) {
            if ( hold ) {
                jQuery.readyWait++;
            } else {
                jQuery.ready( true );
            }
        },

        // Handle when the DOM is ready
        ready: function( wait ) {

            // Abort if there are pending holds or we're already ready
            if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
                return;
            }

            // Remember that the DOM is ready
            jQuery.isReady = true;

            // If a normal DOM Ready event fired, decrement, and wait if need be
            if ( wait !== true && --jQuery.readyWait > 0 ) {
                return;
            }

            // If there are functions bound, to execute
            readyList.resolveWith( document, [ jQuery ] );

            // Trigger any bound ready events
            if ( jQuery.fn.trigger ) {
                jQuery( document ).trigger("ready").off("ready");
            }
        },

        // See test/unit/core.js for details concerning isFunction.
        // Since version 1.3, DOM methods and functions like alert
        // aren't supported. They return false on IE (#2968).
        isFunction: function( obj ) {
            return jQuery.type(obj) === "function";
        },

        isArray: Array.isArray,

        isWindow: function( obj ) {
            return obj != null && obj == obj.window;
        },

        isNumeric: function( obj ) {
            return !isNaN( parseFloat(obj) ) && isFinite( obj );
        },

        type: function( obj ) {
            if ( obj == null ) {
                return String( obj );
            }
            return typeof obj === "object" || typeof obj === "function" ?
                class2type[ core_toString.call(obj) ] || "object" :
                typeof obj;
        },

        isPlainObject: function( obj ) {
            // Not plain objects:
            // - Any object or value whose internal [[Class]] property is not "[object Object]"
            // - DOM nodes
            // - window
            if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
                return false;
            }

            // Support: Firefox >16
            // The try/catch supresses exceptions thrown when attempting to access
            // the "constructor" property of certain host objects, ie. |window.location|
            try {
                if ( obj.constructor &&
                    !core_hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
                    return false;
                }
            } catch ( e ) {
                return false;
            }

            // If the function hasn't returned already, we're confident that
            // |obj| is a plain object, created by {} or constructed with new Object
            return true;
        },

        isEmptyObject: function( obj ) {
            var name;
            for ( name in obj ) {
                return false;
            }
            return true;
        },

        error: function( msg ) {
            throw new Error( msg );
        },

        // data: string of html
        // context (optional): If specified, the fragment will be created in this context, defaults to document
        // keepScripts (optional): If true, will include scripts passed in the html string
        parseHTML: function( data, context, keepScripts ) {
            if ( !data || typeof data !== "string" ) {
                return null;
            }
            if ( typeof context === "boolean" ) {
                keepScripts = context;
                context = false;
            }
            context = context || document;

            var parsed = rsingleTag.exec( data ),
                scripts = !keepScripts && [];

            // Single tag
            if ( parsed ) {
                return [ context.createElement( parsed[1] ) ];
            }

            parsed = jQuery.buildFragment( [ data ], context, scripts );

            if ( scripts ) {
                jQuery( scripts ).remove();
            }

            return jQuery.merge( [], parsed.childNodes );
        },

        parseJSON: JSON.parse,

        // Cross-browser xml parsing
        parseXML: function( data ) {
            var xml, tmp;
            if ( !data || typeof data !== "string" ) {
                return null;
            }

            // Support: IE9
            try {
                tmp = new DOMParser();
                xml = tmp.parseFromString( data , "text/xml" );
            } catch ( e ) {
                xml = undefined;
            }

            if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
                jQuery.error( "Invalid XML: " + data );
            }
            return xml;
        },

        noop: function() {},

        // Evaluates a script in a global context
        globalEval: function( data ) {
            var indirect = eval;
            if ( jQuery.trim( data ) ) {
                indirect( data + ";" );
            }
        },

        // Convert dashed to camelCase; used by the css and data modules
        // Microsoft forgot to hump their vendor prefix (#9572)
        camelCase: function( string ) {
            return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
        },

        nodeName: function( elem, name ) {
            return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
        },

        // args is for internal usage only
        each: function( obj, callback, args ) {
            var value,
                i = 0,
                length = obj.length,
                isArray = isArraylike( obj );

            if ( args ) {
                if ( isArray ) {
                    for ( ; i < length; i++ ) {
                        value = callback.apply( obj[ i ], args );

                        if ( value === false ) {
                            break;
                        }
                    }
                } else {
                    for ( i in obj ) {
                        value = callback.apply( obj[ i ], args );

                        if ( value === false ) {
                            break;
                        }
                    }
                }

                // A special, fast, case for the most common use of each
            } else {
                if ( isArray ) {
                    for ( ; i < length; i++ ) {
                        value = callback.call( obj[ i ], i, obj[ i ] );

                        if ( value === false ) {
                            break;
                        }
                    }
                } else {
                    for ( i in obj ) {
                        value = callback.call( obj[ i ], i, obj[ i ] );

                        if ( value === false ) {
                            break;
                        }
                    }
                }
            }

            return obj;
        },

        trim: function( text ) {
            return text == null ? "" : core_trim.call( text );
        },

        // results is for internal usage only
        makeArray: function( arr, results ) {
            var ret = results || [];

            if ( arr != null ) {
                if ( isArraylike( Object(arr) ) ) {
                    jQuery.merge( ret,
                        typeof arr === "string" ?
                            [ arr ] : arr
                    );
                } else {
                    core_push.call( ret, arr );
                }
            }

            return ret;
        },

        inArray: function( elem, arr, i ) {
            return arr == null ? -1 : core_indexOf.call( arr, elem, i );
        },

        merge: function( first, second ) {
            var l = second.length,
                i = first.length,
                j = 0;

            if ( typeof l === "number" ) {
                for ( ; j < l; j++ ) {
                    first[ i++ ] = second[ j ];
                }
            } else {
                while ( second[j] !== undefined ) {
                    first[ i++ ] = second[ j++ ];
                }
            }

            first.length = i;

            return first;
        },

        grep: function( elems, callback, inv ) {
            var retVal,
                ret = [],
                i = 0,
                length = elems.length;
            inv = !!inv;

            // Go through the array, only saving the items
            // that pass the validator function
            for ( ; i < length; i++ ) {
                retVal = !!callback( elems[ i ], i );
                if ( inv !== retVal ) {
                    ret.push( elems[ i ] );
                }
            }

            return ret;
        },

        // arg is for internal usage only
        map: function( elems, callback, arg ) {
            var value,
                i = 0,
                length = elems.length,
                isArray = isArraylike( elems ),
                ret = [];

            // Go through the array, translating each of the items to their
            if ( isArray ) {
                for ( ; i < length; i++ ) {
                    value = callback( elems[ i ], i, arg );

                    if ( value != null ) {
                        ret[ ret.length ] = value;
                    }
                }

                // Go through every key on the object,
            } else {
                for ( i in elems ) {
                    value = callback( elems[ i ], i, arg );

                    if ( value != null ) {
                        ret[ ret.length ] = value;
                    }
                }
            }

            // Flatten any nested arrays
            return core_concat.apply( [], ret );
        },

        // A global GUID counter for objects
        guid: 1,

        // Bind a function to a context, optionally partially applying any
        // arguments.
        proxy: function( fn, context ) {
            var tmp, args, proxy;

            if ( typeof context === "string" ) {
                tmp = fn[ context ];
                context = fn;
                fn = tmp;
            }

            // Quick check to determine if target is callable, in the spec
            // this throws a TypeError, but we will just return undefined.
            if ( !jQuery.isFunction( fn ) ) {
                return undefined;
            }

            // Simulated bind
            args = core_slice.call( arguments, 2 );
            proxy = function() {
                return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
            };

            // Set the guid of unique handler to the same of original handler, so it can be removed
            proxy.guid = fn.guid = fn.guid || jQuery.guid++;

            return proxy;
        },

        // Multifunctional method to get and set values of a collection
        // The value/s can optionally be executed if it's a function
        access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
            var i = 0,
                length = elems.length,
                bulk = key == null;

            // Sets many values
            if ( jQuery.type( key ) === "object" ) {
                chainable = true;
                for ( i in key ) {
                    jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
                }

                // Sets one value
            } else if ( value !== undefined ) {
                chainable = true;

                if ( !jQuery.isFunction( value ) ) {
                    raw = true;
                }

                if ( bulk ) {
                    // Bulk operations run against the entire set
                    if ( raw ) {
                        fn.call( elems, value );
                        fn = null;

                        // ...except when executing function values
                    } else {
                        bulk = fn;
                        fn = function( elem, key, value ) {
                            return bulk.call( jQuery( elem ), value );
                        };
                    }
                }

                if ( fn ) {
                    for ( ; i < length; i++ ) {
                        fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
                    }
                }
            }

            return chainable ?
                elems :

                // Gets
                bulk ?
                    fn.call( elems ) :
                    length ? fn( elems[0], key ) : emptyGet;
        },

        now: Date.now
    });

    jQuery.ready.promise = function( obj ) {
        if ( !readyList ) {

            readyList = jQuery.Deferred();

            // Catch cases where $(document).ready() is called after the browser event has already occurred.
            // we once tried to use readyState "interactive" here, but it caused issues like the one
            // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
            if ( document.readyState === "complete" ) {
                // Handle it asynchronously to allow scripts the opportunity to delay ready
                setTimeout( jQuery.ready );

                // Standards-based browsers support DOMContentLoaded
            } else {
                // Use the handy event callback
                document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

                // A fallback to window.onload, that will always work
                window.addEventListener( "load", jQuery.ready, false );
            }
        }
        return readyList.promise( obj );
    };

// Populate the class2type map
    jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
        class2type[ "[object " + name + "]" ] = name.toLowerCase();
    });

    function isArraylike( obj ) {
        var length = obj.length,
            type = jQuery.type( obj );

        if ( jQuery.isWindow( obj ) ) {
            return false;
        }

        if ( obj.nodeType === 1 && length ) {
            return true;
        }

        return type === "array" || type !== "function" &&
            ( length === 0 ||
                typeof length === "number" && length > 0 && ( length - 1 ) in obj );
    }

// All jQuery objects should point back to these
    rootjQuery = jQuery(document);
// String to Object options format cache
    var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
    function createOptions( options ) {
        var object = optionsCache[ options ] = {};
        jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
            object[ flag ] = true;
        });
        return object;
    }

    /*
     * Create a callback list using the following parameters:
     *
     *	options: an optional list of space-separated options that will change how
     *			the callback list behaves or a more traditional option object
     *
     * By default a callback list will act like an event callback list and can be
     * "fired" multiple times.
     *
     * Possible options:
     *
     *	once:			will ensure the callback list can only be fired once (like a Deferred)
     *
     *	memory:			will keep track of previous values and will call any callback added
     *					after the list has been fired right away with the latest "memorized"
     *					values (like a Deferred)
     *
     *	unique:			will ensure a callback can only be added once (no duplicate in the list)
     *
     *	stopOnFalse:	interrupt callings when a callback returns false
     *
     */
    jQuery.Callbacks = function( options ) {

        // Convert options from String-formatted to Object-formatted if needed
        // (we check in cache first)
        options = typeof options === "string" ?
            ( optionsCache[ options ] || createOptions( options ) ) :
            jQuery.extend( {}, options );

        var // Last fire value (for non-forgettable lists)
            memory,
        // Flag to know if list was already fired
            fired,
        // Flag to know if list is currently firing
            firing,
        // First callback to fire (used internally by add and fireWith)
            firingStart,
        // End of the loop when firing
            firingLength,
        // Index of currently firing callback (modified by remove if needed)
            firingIndex,
        // Actual callback list
            list = [],
        // Stack of fire calls for repeatable lists
            stack = !options.once && [],
        // Fire callbacks
            fire = function( data ) {
                memory = options.memory && data;
                fired = true;
                firingIndex = firingStart || 0;
                firingStart = 0;
                firingLength = list.length;
                firing = true;
                for ( ; list && firingIndex < firingLength; firingIndex++ ) {
                    if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
                        memory = false; // To prevent further calls using add
                        break;
                    }
                }
                firing = false;
                if ( list ) {
                    if ( stack ) {
                        if ( stack.length ) {
                            fire( stack.shift() );
                        }
                    } else if ( memory ) {
                        list = [];
                    } else {
                        self.disable();
                    }
                }
            },
        // Actual Callbacks object
            self = {
                // Add a callback or a collection of callbacks to the list
                add: function() {
                    if ( list ) {
                        // First, we save the current length
                        var start = list.length;
                        (function add( args ) {
                            jQuery.each( args, function( _, arg ) {
                                var type = jQuery.type( arg );
                                if ( type === "function" ) {
                                    if ( !options.unique || !self.has( arg ) ) {
                                        list.push( arg );
                                    }
                                } else if ( arg && arg.length && type !== "string" ) {
                                    // Inspect recursively
                                    add( arg );
                                }
                            });
                        })( arguments );
                        // Do we need to add the callbacks to the
                        // current firing batch?
                        if ( firing ) {
                            firingLength = list.length;
                            // With memory, if we're not firing then
                            // we should call right away
                        } else if ( memory ) {
                            firingStart = start;
                            fire( memory );
                        }
                    }
                    return this;
                },
                // Remove a callback from the list
                remove: function() {
                    if ( list ) {
                        jQuery.each( arguments, function( _, arg ) {
                            var index;
                            while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
                                list.splice( index, 1 );
                                // Handle firing indexes
                                if ( firing ) {
                                    if ( index <= firingLength ) {
                                        firingLength--;
                                    }
                                    if ( index <= firingIndex ) {
                                        firingIndex--;
                                    }
                                }
                            }
                        });
                    }
                    return this;
                },
                // Control if a given callback is in the list
                has: function( fn ) {
                    return jQuery.inArray( fn, list ) > -1;
                },
                // Remove all callbacks from the list
                empty: function() {
                    list = [];
                    return this;
                },
                // Have the list do nothing anymore
                disable: function() {
                    list = stack = memory = undefined;
                    return this;
                },
                // Is it disabled?
                disabled: function() {
                    return !list;
                },
                // Lock the list in its current state
                lock: function() {
                    stack = undefined;
                    if ( !memory ) {
                        self.disable();
                    }
                    return this;
                },
                // Is it locked?
                locked: function() {
                    return !stack;
                },
                // Call all callbacks with the given context and arguments
                fireWith: function( context, args ) {
                    args = args || [];
                    args = [ context, args.slice ? args.slice() : args ];
                    if ( list && ( !fired || stack ) ) {
                        if ( firing ) {
                            stack.push( args );
                        } else {
                            fire( args );
                        }
                    }
                    return this;
                },
                // Call all the callbacks with the given arguments
                fire: function() {
                    self.fireWith( this, arguments );
                    return this;
                },
                // To know if the callbacks have already been called at least once
                fired: function() {
                    return !!fired;
                }
            };

        return self;
    };
    jQuery.extend({

        Deferred: function( func ) {
            var tuples = [
                    // action, add listener, listener list, final state
                    [ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
                    [ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
                    [ "notify", "progress", jQuery.Callbacks("memory") ]
                ],
                state = "pending",
                promise = {
                    state: function() {
                        return state;
                    },
                    always: function() {
                        deferred.done( arguments ).fail( arguments );
                        return this;
                    },
                    then: function( /* fnDone, fnFail, fnProgress */ ) {
                        var fns = arguments;
                        return jQuery.Deferred(function( newDefer ) {
                            jQuery.each( tuples, function( i, tuple ) {
                                var action = tuple[ 0 ],
                                    fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
                                // deferred[ done | fail | progress ] for forwarding actions to newDefer
                                deferred[ tuple[1] ](function() {
                                    var returned = fn && fn.apply( this, arguments );
                                    if ( returned && jQuery.isFunction( returned.promise ) ) {
                                        returned.promise()
                                            .done( newDefer.resolve )
                                            .fail( newDefer.reject )
                                            .progress( newDefer.notify );
                                    } else {
                                        newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
                                    }
                                });
                            });
                            fns = null;
                        }).promise();
                    },
                    // Get a promise for this deferred
                    // If obj is provided, the promise aspect is added to the object
                    promise: function( obj ) {
                        return obj != null ? jQuery.extend( obj, promise ) : promise;
                    }
                },
                deferred = {};

            // Keep pipe for back-compat
            promise.pipe = promise.then;

            // Add list-specific methods
            jQuery.each( tuples, function( i, tuple ) {
                var list = tuple[ 2 ],
                    stateString = tuple[ 3 ];

                // promise[ done | fail | progress ] = list.add
                promise[ tuple[1] ] = list.add;

                // Handle state
                if ( stateString ) {
                    list.add(function() {
                        // state = [ resolved | rejected ]
                        state = stateString;

                        // [ reject_list | resolve_list ].disable; progress_list.lock
                    }, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
                }

                // deferred[ resolve | reject | notify ]
                deferred[ tuple[0] ] = function() {
                    deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
                    return this;
                };
                deferred[ tuple[0] + "With" ] = list.fireWith;
            });

            // Make the deferred a promise
            promise.promise( deferred );

            // Call given func if any
            if ( func ) {
                func.call( deferred, deferred );
            }

            // All done!
            return deferred;
        },

        // Deferred helper
        when: function( subordinate /* , ..., subordinateN */ ) {
            var i = 0,
                resolveValues = core_slice.call( arguments ),
                length = resolveValues.length,

            // the count of uncompleted subordinates
                remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

            // the master Deferred. If resolveValues consist of only a single Deferred, just use that.
                deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

            // Update function for both resolve and progress values
                updateFunc = function( i, contexts, values ) {
                    return function( value ) {
                        contexts[ i ] = this;
                        values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
                        if( values === progressValues ) {
                            deferred.notifyWith( contexts, values );
                        } else if ( !( --remaining ) ) {
                            deferred.resolveWith( contexts, values );
                        }
                    };
                },

                progressValues, progressContexts, resolveContexts;

            // add listeners to Deferred subordinates; treat others as resolved
            if ( length > 1 ) {
                progressValues = new Array( length );
                progressContexts = new Array( length );
                resolveContexts = new Array( length );
                for ( ; i < length; i++ ) {
                    if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
                        resolveValues[ i ].promise()
                            .done( updateFunc( i, resolveContexts, resolveValues ) )
                            .fail( deferred.reject )
                            .progress( updateFunc( i, progressContexts, progressValues ) );
                    } else {
                        --remaining;
                    }
                }
            }

            // if we're not waiting on anything, resolve the master
            if ( !remaining ) {
                deferred.resolveWith( resolveContexts, resolveValues );
            }

            return deferred.promise();
        }
    });
    jQuery.support = (function() {

        var support, a, select, opt, input, fragment,
            div = document.createElement("div");

        div.innerHTML = "<a>a</a><input type='checkbox'/>";

        // Support tests won't run in some limited or non-browser environments
        a = div.getElementsByTagName("a")[ 0 ];
        if ( !a ) {
            return {};
        }

        // First batch of tests
        select = document.createElement("select");
        opt = select.appendChild( document.createElement("option") );
        input = div.getElementsByTagName("input")[ 0 ];

        a.style.cssText = "float:left;opacity:.5";
        support = {
            // Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
            checkOn: !!input.value,

            // Must access the parent to make an option select properly
            // Support: IE9, IE10
            optSelected: opt.selected,

            // jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
            boxModel: document.compatMode === "CSS1Compat",

            // Will be defined later
            reliableMarginRight: true,
            boxSizingReliable: true,
            pixelPosition: false
        };

        // Make sure checked status is properly cloned
        input.checked = true;
        support.noCloneChecked = input.cloneNode( true ).checked;

        // Make sure that the options inside disabled selects aren't marked as disabled
        // (WebKit marks them as disabled)
        select.disabled = true;
        support.optDisabled = !opt.disabled;

        // Check if an input maintains its value after becoming a radio
        input = document.createElement("input");
        input.value = "t";
        input.setAttribute( "type", "radio" );
        support.radioValue = input.value === "t";

        // #11217 - WebKit loses check when the name is after the checked attribute
        input.setAttribute( "checked", "t" );
        input.setAttribute( "name", "t" );

        fragment = document.createDocumentFragment();
        fragment.appendChild( input );

        // WebKit doesn't clone checked state correctly in fragments
        support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

        // Support: Firefox 17+
        // Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP), test/csp.php
        div.setAttribute( "onfocusin", "t" );
        support.focusinBubbles = "onfocusin" in window || div.attributes.onfocusin.expando === false;

        div.style.backgroundClip = "content-box";
        div.cloneNode( true ).style.backgroundClip = "";
        support.clearCloneStyle = div.style.backgroundClip === "content-box";

        // Run tests that need a body at doc ready
        jQuery(function() {
            var container, marginDiv, tds,
                divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
                body = document.getElementsByTagName("body")[0];

            if ( !body ) {
                // Return for frameset docs that don't have a body
                return;
            }

            container = document.createElement("div");
            container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

            // Check box-sizing and margin behavior
            body.appendChild( container ).appendChild( div );
            div.innerHTML = "";
            div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
            support.boxSizing = ( div.offsetWidth === 4 );
            support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

            // Use window.getComputedStyle because jsdom on node.js will break without it.
            if ( window.getComputedStyle ) {
                support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
                support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

                // Check if div with explicit width and no margin-right incorrectly
                // gets computed margin-right based on width of container. (#3333)
                // Fails in WebKit before Feb 2011 nightlies
                // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
                marginDiv = div.appendChild( document.createElement("div") );
                marginDiv.style.cssText = div.style.cssText = divReset;
                marginDiv.style.marginRight = marginDiv.style.width = "0";
                div.style.width = "1px";

                support.reliableMarginRight =
                    !parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
            }

            body.removeChild( container );

            // Null elements to avoid leaks in IE
            container = div = tds = marginDiv = null;
        });

        // Null elements to avoid leaks in IE
        select = fragment = opt = a = input = null;

        return support;
    })();

    var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
        rmultiDash = /([A-Z])/g;

    function internalData( elem, name, data, pvt /* Internal Use Only */ ){
        if ( !jQuery.acceptData( elem ) ) {
            return;
        }

        var thisCache, ret,
            internalKey = jQuery.expando,
            getByName = typeof name === "string",

        // We have to handle DOM nodes and JS objects differently because IE6-7
        // can't GC object references properly across the DOM-JS boundary
            isNode = elem.nodeType,

        // Only DOM nodes need the global jQuery cache; JS object data is
        // attached directly to the object so GC can occur automatically
            cache = isNode ? jQuery.cache : elem,

        // Only defining an ID for JS objects if its cache already exists allows
        // the code to shortcut on the same path as a DOM node with no cache
            id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

        // Avoid doing any more work than we need to when trying to get data on an
        // object that has no data at all
        if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
            return;
        }

        if ( !id ) {
            // Only DOM nodes need a new unique ID for each element since their data
            // ends up in the global cache
            if ( isNode ) {
                elem[ internalKey ] = id = core_deletedIds.pop() || jQuery.guid++;
            } else {
                id = internalKey;
            }
        }

        if ( !cache[ id ] ) {
            cache[ id ] = {};

            // Avoids exposing jQuery metadata on plain JS objects when the object
            // is serialized using JSON.stringify
            if ( !isNode ) {
                cache[ id ].toJSON = jQuery.noop;
            }
        }

        // An object can be passed to jQuery.data instead of a key/value pair; this gets
        // shallow copied over onto the existing cache
        if ( typeof name === "object" || typeof name === "function" ) {
            if ( pvt ) {
                cache[ id ] = jQuery.extend( cache[ id ], name );
            } else {
                cache[ id ].data = jQuery.extend( cache[ id ].data, name );
            }
        }

        thisCache = cache[ id ];

        // jQuery data() is stored in a separate object inside the object's internal data
        // cache in order to avoid key collisions between internal data and user-defined
        // data.
        if ( !pvt ) {
            if ( !thisCache.data ) {
                thisCache.data = {};
            }

            thisCache = thisCache.data;
        }

        if ( data !== undefined ) {
            thisCache[ jQuery.camelCase( name ) ] = data;
        }

        // Check for both converted-to-camel and non-converted data property names
        // If a data property was specified
        if ( getByName ) {

            // First Try to find as-is property data
            ret = thisCache[ name ];

            // Test for null|undefined property data
            if ( ret == null ) {

                // Try to find the camelCased property
                ret = thisCache[ jQuery.camelCase( name ) ];
            }
        } else {
            ret = thisCache;
        }

        return ret;
    }

    function internalRemoveData( elem, name, pvt /* For internal use only */ ){
        if ( !jQuery.acceptData( elem ) ) {
            return;
        }

        var thisCache, i, l,

            isNode = elem.nodeType,

        // See jQuery.data for more information
            cache = isNode ? jQuery.cache : elem,
            id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

        // If there is already no cache entry for this object, there is no
        // purpose in continuing
        if ( !cache[ id ] ) {
            return;
        }

        if ( name ) {

            thisCache = pvt ? cache[ id ] : cache[ id ].data;

            if ( thisCache ) {

                // Support array or space separated string names for data keys
                if ( !jQuery.isArray( name ) ) {

                    // try the string as a key before any manipulation
                    if ( name in thisCache ) {
                        name = [ name ];
                    } else {

                        // split the camel cased version by spaces unless a key with the spaces exists
                        name = jQuery.camelCase( name );
                        if ( name in thisCache ) {
                            name = [ name ];
                        } else {
                            name = name.split(" ");
                        }
                    }
                } else {
                    // If "name" is an array of keys...
                    // When data is initially created, via ("key", "val") signature,
                    // keys will be converted to camelCase.
                    // Since there is no way to tell _how_ a key was added, remove
                    // both plain key and camelCase key. #12786
                    // This will only penalize the array argument path.
                    name = name.concat( jQuery.map( name, jQuery.camelCase ) );
                }

                for ( i = 0, l = name.length; i < l; i++ ) {
                    delete thisCache[ name[i] ];
                }

                // If there is no data left in the cache, we want to continue
                // and let the cache object itself get destroyed
                if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
                    return;
                }
            }
        }

        // See jQuery.data for more information
        if ( !pvt ) {
            delete cache[ id ].data;

            // Don't destroy the parent cache unless the internal data object
            // had been the only thing left in it
            if ( !isEmptyDataObject( cache[ id ] ) ) {
                return;
            }
        }

        // Destroy the cache
        if ( isNode ) {
            jQuery.cleanData( [ elem ], true );

            // Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
        } else if ( jQuery.support.deleteExpando || cache != cache.window ) {
            delete cache[ id ];

            // When all else fails, null
        } else {
            cache[ id ] = null;
        }
    }

    jQuery.extend({
        cache: {},

        // Unique for each copy of jQuery on the page
        // Non-digits removed to match rinlinejQuery
        expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

        // The following elements throw uncatchable exceptions if you
        // attempt to add expando properties to them.
        noData: {
            "embed": true,
            // Ban all objects except for Flash (which handle expandos)
            "object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
            "applet": true
        },

        hasData: function( elem ) {
            elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
            return !!elem && !isEmptyDataObject( elem );
        },

        data: function( elem, name, data ) {
            return internalData( elem, name, data, false );
        },

        removeData: function( elem, name ) {
            return internalRemoveData( elem, name, false );
        },

        // For internal use only.
        _data: function( elem, name, data ) {
            return internalData( elem, name, data, true );
        },

        _removeData: function( elem, name ) {
            return internalRemoveData( elem, name, true );
        },

        // A method for determining if a DOM node can handle the data expando
        acceptData: function( elem ) {
            var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

            // nodes accept data unless otherwise specified; rejection can be conditional
            return !noData || noData !== true && elem.getAttribute("classid") === noData;
        }
    });

    jQuery.fn.extend({
        data: function( key, value ) {
            var attrs, name,
                elem = this[0],
                i = 0,
                data = null;

            // Gets all values
            if ( key === undefined ) {
                if ( this.length ) {
                    data = jQuery.data( elem );

                    if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
                        attrs = elem.attributes;
                        for ( ; i < attrs.length; i++ ) {
                            name = attrs[i].name;

                            if ( !name.indexOf( "data-" ) ) {
                                name = jQuery.camelCase( name.substring(5) );

                                dataAttr( elem, name, data[ name ] );
                            }
                        }
                        jQuery._data( elem, "parsedAttrs", true );
                    }
                }

                return data;
            }

            // Sets multiple values
            if ( typeof key === "object" ) {
                return this.each(function() {
                    jQuery.data( this, key );
                });
            }

            return jQuery.access( this, function( value ) {

                if ( value === undefined ) {
                    // Try to fetch any internally stored data first
                    return elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
                }

                this.each(function() {
                    jQuery.data( this, key, value );
                });
            }, null, value, arguments.length > 1, null, true );
        },

        removeData: function( key ) {
            return this.each(function() {
                jQuery.removeData( this, key );
            });
        }
    });

    function dataAttr( elem, key, data ) {
        // If nothing was found internally, try to fetch any
        // data from the HTML5 data-* attribute
        if ( data === undefined && elem.nodeType === 1 ) {

            var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

            data = elem.getAttribute( name );

            if ( typeof data === "string" ) {
                try {
                    data = data === "true" ? true :
                        data === "false" ? false :
                            data === "null" ? null :
                                // Only convert to a number if it doesn't change the string
                                +data + "" === data ? +data :
                                    rbrace.test( data ) ? jQuery.parseJSON( data ) :
                                        data;
                } catch( e ) {}

                // Make sure we set the data so it isn't changed later
                jQuery.data( elem, key, data );

            } else {
                data = undefined;
            }
        }

        return data;
    }

// checks a cache object for emptiness
    function isEmptyDataObject( obj ) {
        var name;
        for ( name in obj ) {

            // if the public data object is empty, the private is still empty
            if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
                continue;
            }
            if ( name !== "toJSON" ) {
                return false;
            }
        }

        return true;
    }
    jQuery.extend({
        queue: function( elem, type, data ) {
            var queue;

            if ( elem ) {
                type = ( type || "fx" ) + "queue";
                queue = jQuery._data( elem, type );

                // Speed up dequeue by getting out quickly if this is just a lookup
                if ( data ) {
                    if ( !queue || jQuery.isArray(data) ) {
                        queue = jQuery._data( elem, type, jQuery.makeArray(data) );
                    } else {
                        queue.push( data );
                    }
                }
                return queue || [];
            }
        },

        dequeue: function( elem, type ) {
            type = type || "fx";

            var queue = jQuery.queue( elem, type ),
                startLength = queue.length,
                fn = queue.shift(),
                hooks = jQuery._queueHooks( elem, type ),
                next = function() {
                    jQuery.dequeue( elem, type );
                };

            // If the fx queue is dequeued, always remove the progress sentinel
            if ( fn === "inprogress" ) {
                fn = queue.shift();
                startLength--;
            }

            hooks.cur = fn;
            if ( fn ) {

                // Add a progress sentinel to prevent the fx queue from being
                // automatically dequeued
                if ( type === "fx" ) {
                    queue.unshift( "inprogress" );
                }

                // clear up the last queue stop function
                delete hooks.stop;
                fn.call( elem, next, hooks );
            }

            if ( !startLength && hooks ) {
                hooks.empty.fire();
            }
        },

        // not intended for public consumption - generates a queueHooks object, or returns the current one
        _queueHooks: function( elem, type ) {
            var key = type + "queueHooks";
            return jQuery._data( elem, key ) || jQuery._data( elem, key, {
                empty: jQuery.Callbacks("once memory").add(function() {
                    jQuery._removeData( elem, type + "queue" );
                    jQuery._removeData( elem, key );
                })
            });
        }
    });

    jQuery.fn.extend({
        queue: function( type, data ) {
            var setter = 2;

            if ( typeof type !== "string" ) {
                data = type;
                type = "fx";
                setter--;
            }

            if ( arguments.length < setter ) {
                return jQuery.queue( this[0], type );
            }

            return data === undefined ?
                this :
                this.each(function() {
                    var queue = jQuery.queue( this, type, data );

                    // ensure a hooks for this queue
                    jQuery._queueHooks( this, type );

                    if ( type === "fx" && queue[0] !== "inprogress" ) {
                        jQuery.dequeue( this, type );
                    }
                });
        },
        dequeue: function( type ) {
            return this.each(function() {
                jQuery.dequeue( this, type );
            });
        },
        // Based off of the plugin by Clint Helfers, with permission.
        // http://blindsignals.com/index.php/2009/07/jquery-delay/
        delay: function( time, type ) {
            time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
            type = type || "fx";

            return this.queue( type, function( next, hooks ) {
                var timeout = setTimeout( next, time );
                hooks.stop = function() {
                    clearTimeout( timeout );
                };
            });
        },
        clearQueue: function( type ) {
            return this.queue( type || "fx", [] );
        },
        // Get a promise resolved when queues of a certain type
        // are emptied (fx is the type by default)
        promise: function( type, obj ) {
            var tmp,
                count = 1,
                defer = jQuery.Deferred(),
                elements = this,
                i = this.length,
                resolve = function() {
                    if ( !( --count ) ) {
                        defer.resolveWith( elements, [ elements ] );
                    }
                };

            if ( typeof type !== "string" ) {
                obj = type;
                type = undefined;
            }
            type = type || "fx";

            while( i-- ) {
                tmp = jQuery._data( elements[ i ], type + "queueHooks" );
                if ( tmp && tmp.empty ) {
                    count++;
                    tmp.empty.add( resolve );
                }
            }
            resolve();
            return defer.promise( obj );
        }
    });
    var nodeHook, boolHook,
        rclass = /[\t\r\n]/g,
        rreturn = /\r/g,
        rfocusable = /^(?:input|select|textarea|button|object)$/i,
        rclickable = /^(?:a|area)$/i,
        rboolean = /^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i;

    jQuery.fn.extend({
        attr: function( name, value ) {
            return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
        },

        removeAttr: function( name ) {
            return this.each(function() {
                jQuery.removeAttr( this, name );
            });
        },

        prop: function( name, value ) {
            return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
        },

        removeProp: function( name ) {
            name = jQuery.propFix[ name ] || name;
            return this.each(function() {
                // try/catch handles cases where IE balks (such as removing a property on window)
                try {
                    this[ name ] = undefined;
                    delete this[ name ];
                } catch( e ) {}
            });
        },

        addClass: function( value ) {
            var classes, elem, cur, clazz, j,
                i = 0,
                len = this.length,
                proceed = typeof value === "string" && value;

            if ( jQuery.isFunction( value ) ) {
                return this.each(function( j ) {
                    jQuery( this ).addClass( value.call( this, j, this.className ) );
                });
            }

            if ( proceed ) {
                // The disjunction here is for better compressibility (see removeClass)
                classes = ( value || "" ).match( core_rnotwhite ) || [];

                for ( ; i < len; i++ ) {
                    elem = this[ i ];
                    cur = elem.nodeType === 1 && ( elem.className ?
                        ( " " + elem.className + " " ).replace( rclass, " " ) :
                        " "
                        );

                    if ( cur ) {
                        j = 0;
                        while ( (clazz = classes[j++]) ) {
                            if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
                                cur += clazz + " ";
                            }
                        }
                        elem.className = jQuery.trim( cur );

                    }
                }
            }

            return this;
        },

        removeClass: function( value ) {
            var classes, elem, cur, clazz, j,
                i = 0,
                len = this.length,
                proceed = arguments.length === 0 || typeof value === "string" && value;

            if ( jQuery.isFunction( value ) ) {
                return this.each(function( j ) {
                    jQuery( this ).removeClass( value.call( this, j, this.className ) );
                });
            }
            if ( proceed ) {
                classes = ( value || "" ).match( core_rnotwhite ) || [];

                for ( ; i < len; i++ ) {
                    elem = this[ i ];
                    // This expression is here for better compressibility (see addClass)
                    cur = elem.nodeType === 1 && ( elem.className ?
                        ( " " + elem.className + " " ).replace( rclass, " " ) :
                        ""
                        );

                    if ( cur ) {
                        j = 0;
                        while ( (clazz = classes[j++]) ) {
                            // Remove *all* instances
                            while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
                                cur = cur.replace( " " + clazz + " ", " " );
                            }
                        }
                        elem.className = value ? jQuery.trim( cur ) : "";
                    }
                }
            }

            return this;
        },

        toggleClass: function( value, stateVal ) {
            var type = typeof value,
                isBool = typeof stateVal === "boolean";

            if ( jQuery.isFunction( value ) ) {
                return this.each(function( i ) {
                    jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
                });
            }

            return this.each(function() {
                if ( type === "string" ) {
                    // toggle individual class names
                    var className,
                        i = 0,
                        self = jQuery( this ),
                        state = stateVal,
                        classNames = value.match( core_rnotwhite ) || [];

                    while ( (className = classNames[ i++ ]) ) {
                        // check each className given, space separated list
                        state = isBool ? state : !self.hasClass( className );
                        self[ state ? "addClass" : "removeClass" ]( className );
                    }

                    // Toggle whole class name
                } else if ( type === "undefined" || type === "boolean" ) {
                    if ( this.className ) {
                        // store className if set
                        jQuery._data( this, "__className__", this.className );
                    }

                    // If the element has a class name or if we're passed "false",
                    // then remove the whole classname (if there was one, the above saved it).
                    // Otherwise bring back whatever was previously saved (if anything),
                    // falling back to the empty string if nothing was stored.
                    this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
                }
            });
        },

        hasClass: function( selector ) {
            var className = " " + selector + " ",
                i = 0,
                l = this.length;
            for ( ; i < l; i++ ) {
                if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
                    return true;
                }
            }

            return false;
        },

        val: function( value ) {
            var hooks, ret, isFunction,
                elem = this[0];

            if ( !arguments.length ) {
                if ( elem ) {
                    hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

                    if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
                        return ret;
                    }

                    ret = elem.value;

                    return typeof ret === "string" ?
                        // handle most common string cases
                        ret.replace(rreturn, "") :
                        // handle cases where value is null/undef or number
                        ret == null ? "" : ret;
                }

                return;
            }

            isFunction = jQuery.isFunction( value );

            return this.each(function( i ) {
                var val,
                    self = jQuery(this);

                if ( this.nodeType !== 1 ) {
                    return;
                }

                if ( isFunction ) {
                    val = value.call( this, i, self.val() );
                } else {
                    val = value;
                }

                // Treat null/undefined as ""; convert numbers to string
                if ( val == null ) {
                    val = "";
                } else if ( typeof val === "number" ) {
                    val += "";
                } else if ( jQuery.isArray( val ) ) {
                    val = jQuery.map(val, function ( value ) {
                        return value == null ? "" : value + "";
                    });
                }

                hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

                // If set returns undefined, fall back to normal setting
                if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
                    this.value = val;
                }
            });
        }
    });

    jQuery.extend({
        valHooks: {
            option: {
                get: function( elem ) {
                    // attributes.value is undefined in Blackberry 4.7 but
                    // uses .value. See #6932
                    var val = elem.attributes.value;
                    return !val || val.specified ? elem.value : elem.text;
                }
            },
            select: {
                get: function( elem ) {
                    var value, option,
                        options = elem.options,
                        index = elem.selectedIndex,
                        one = elem.type === "select-one" || index < 0,
                        values = one ? null : [],
                        max = one ? index + 1 : options.length,
                        i = index < 0 ?
                            max :
                            one ? index : 0;

                    // Loop through all the selected options
                    for ( ; i < max; i++ ) {
                        option = options[ i ];

                        // oldIE doesn't update selected after form reset (#2551)
                        if ( ( option.selected || i === index ) &&
                            // Don't return options that are disabled or in a disabled optgroup
                            ( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
                            ( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

                            // Get the specific value for the option
                            value = jQuery( option ).val();

                            // We don't need an array for one selects
                            if ( one ) {
                                return value;
                            }

                            // Multi-Selects return an array
                            values.push( value );
                        }
                    }

                    return values;
                },

                set: function( elem, value ) {
                    var values = jQuery.makeArray( value );

                    jQuery(elem).find("option").each(function() {
                        this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
                    });

                    if ( !values.length ) {
                        elem.selectedIndex = -1;
                    }
                    return values;
                }
            }
        },

        attr: function( elem, name, value ) {
            var ret, hooks, notxml,
                nType = elem.nodeType;

            // don't get/set attributes on text, comment and attribute nodes
            if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
                return;
            }

            // Fallback to prop when attributes are not supported
            if ( typeof elem.getAttribute === "undefined" ) {
                return jQuery.prop( elem, name, value );
            }

            notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

            // All attributes are lowercase
            // Grab necessary hook if one is defined
            if ( notxml ) {
                name = name.toLowerCase();
                hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
            }

            if ( value !== undefined ) {

                if ( value === null ) {
                    jQuery.removeAttr( elem, name );

                } else if ( hooks && notxml && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
                    return ret;

                } else {
                    elem.setAttribute( name, value + "" );
                    return value;
                }

            } else if ( hooks && notxml && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
                return ret;

            } else {

                // In IE9+, Flash objects don't have .getAttribute (#12945)
                // Support: IE9+
                if ( typeof elem.getAttribute !== "undefined" ) {
                    ret =  elem.getAttribute( name );
                }

                // Non-existent attributes return null, we normalize to undefined
                return ret == null ?
                    undefined :
                    ret;
            }
        },

        removeAttr: function( elem, value ) {
            var name, propName,
                i = 0,
                attrNames = value && value.match( core_rnotwhite );

            if ( attrNames && elem.nodeType === 1 ) {
                while ( (name = attrNames[i++]) ) {
                    propName = jQuery.propFix[ name ] || name;

                    // Boolean attributes get special treatment (#10870)
                    // Set corresponding property to false for boolean attributes
                    if ( rboolean.test( name ) ) {
                        elem[ propName ] = false;
                    }

                    elem.removeAttribute( name );
                }
            }
        },

        attrHooks: {
            type: {
                set: function( elem, value ) {
                    if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
                        // Setting the type on a radio button after the value resets the value in IE6-9
                        // Reset value to default in case type is set after value during creation
                        var val = elem.value;
                        elem.setAttribute( "type", value );
                        if ( val ) {
                            elem.value = val;
                        }
                        return value;
                    }
                }
            }
        },

        propFix: {
            tabindex: "tabIndex",
            readonly: "readOnly",
            "for": "htmlFor",
            "class": "className",
            maxlength: "maxLength",
            cellspacing: "cellSpacing",
            cellpadding: "cellPadding",
            rowspan: "rowSpan",
            colspan: "colSpan",
            usemap: "useMap",
            frameborder: "frameBorder",
            contenteditable: "contentEditable"
        },

        prop: function( elem, name, value ) {
            var ret, hooks, notxml,
                nType = elem.nodeType;

            // don't get/set properties on text, comment and attribute nodes
            if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
                return;
            }

            notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

            if ( notxml ) {
                // Fix name and attach hooks
                name = jQuery.propFix[ name ] || name;
                hooks = jQuery.propHooks[ name ];
            }

            if ( value !== undefined ) {
                if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
                    return ret;

                } else {
                    return ( elem[ name ] = value );
                }

            } else {
                if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
                    return ret;

                } else {
                    return elem[ name ];
                }
            }
        },

        propHooks: {
            tabIndex: {
                get: function( elem ) {
                    // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
                    // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
                    var attributeNode = elem.getAttributeNode("tabindex");

                    return attributeNode && attributeNode.specified ?
                        parseInt( attributeNode.value, 10 ) :
                        rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
                            0 :
                            undefined;
                }
            }
        }
    });

// Hook for boolean attributes
    boolHook = {
        get: function( elem, name ) {
            return elem.getAttribute( name ) !== null ?
                name.toLowerCase() :
                undefined;
        },
        set: function( elem, value, name ) {
            if ( value === false ) {
                // Remove boolean attributes when set to false
                jQuery.removeAttr( elem, name );
            } else {
                elem.setAttribute( name, name );
            }
            return name;
        }
    };

// Radios and checkboxes getter/setter
    if ( !jQuery.support.checkOn ) {
        jQuery.each([ "radio", "checkbox" ], function() {
            jQuery.valHooks[ this ] = {
                get: function( elem ) {
                    // Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
                    return elem.getAttribute("value") === null ? "on" : elem.value;
                }
            };
        });
    }
    jQuery.each([ "radio", "checkbox" ], function() {
        jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
            set: function( elem, value ) {
                if ( jQuery.isArray( value ) ) {
                    return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
                }
            }
        });
    });

// IE9/10 do not see a selected option inside an optgroup unless you access it
// Support: IE9, IE10
    if ( !jQuery.support.optSelected ) {
        jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
            get: function( elem ) {
                var parent = elem.parentNode;
                if ( parent && parent.parentNode ) {
                    parent.parentNode.selectedIndex;
                }
                return null;
            }
        });
    }
    var rkeyEvent = /^key/,
        rmouseEvent = /^(?:mouse|contextmenu)|click/,
        rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
        rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

    function returnTrue() {
        return true;
    }

    function returnFalse() {
        return false;
    }

    /*
     * Helper functions for managing events -- not part of the public interface.
     * Props to Dean Edwards' addEvent library for many of the ideas.
     */
    jQuery.event = {

        global: {},

        add: function( elem, types, handler, data, selector ) {

            var handleObjIn, eventHandle, tmp,
                events, t, handleObj,
                special, handlers, type, namespaces, origType,
            // Don't attach events to noData or text/comment nodes (but allow plain objects)
                elemData = elem.nodeType !== 3 && elem.nodeType !== 8 && jQuery._data( elem );

            if ( !elemData ) {
                return;
            }

            // Caller can pass in an object of custom data in lieu of the handler
            if ( handler.handler ) {
                handleObjIn = handler;
                handler = handleObjIn.handler;
                selector = handleObjIn.selector;
            }

            // Make sure that the handler has a unique ID, used to find/remove it later
            if ( !handler.guid ) {
                handler.guid = jQuery.guid++;
            }

            // Init the element's event structure and main handler, if this is the first
            if ( !(events = elemData.events) ) {
                events = elemData.events = {};
            }
            if ( !(eventHandle = elemData.handle) ) {
                eventHandle = elemData.handle = function( e ) {
                    // Discard the second event of a jQuery.event.trigger() and
                    // when an event is called after a page has unloaded
                    return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
                        jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
                        undefined;
                };
                // Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
                eventHandle.elem = elem;
            }

            // Handle multiple events separated by a space
            types = ( types || "" ).match( core_rnotwhite ) || [""];
            t = types.length;
            while ( t-- ) {
                tmp = rtypenamespace.exec( types[t] ) || [];
                type = origType = tmp[1];
                namespaces = ( tmp[2] || "" ).split( "." ).sort();

                // If event changes its type, use the special event handlers for the changed type
                special = jQuery.event.special[ type ] || {};

                // If selector defined, determine special event api type, otherwise given type
                type = ( selector ? special.delegateType : special.bindType ) || type;

                // Update special based on newly reset type
                special = jQuery.event.special[ type ] || {};

                // handleObj is passed to all event handlers
                handleObj = jQuery.extend({
                    type: type,
                    origType: origType,
                    data: data,
                    handler: handler,
                    guid: handler.guid,
                    selector: selector,
                    needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
                    namespace: namespaces.join(".")
                }, handleObjIn );

                // Init the event handler queue if we're the first
                if ( !(handlers = events[ type ]) ) {
                    handlers = events[ type ] = [];
                    handlers.delegateCount = 0;

                    // Only use addEventListener if the special events handler returns false
                    if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
                        if ( elem.addEventListener ) {
                            elem.addEventListener( type, eventHandle, false );
                        }
                    }
                }

                if ( special.add ) {
                    special.add.call( elem, handleObj );

                    if ( !handleObj.handler.guid ) {
                        handleObj.handler.guid = handler.guid;
                    }
                }

                // Add to the element's handler list, delegates in front
                if ( selector ) {
                    handlers.splice( handlers.delegateCount++, 0, handleObj );
                } else {
                    handlers.push( handleObj );
                }

                // Keep track of which events have ever been used, for event optimization
                jQuery.event.global[ type ] = true;
            }

            // Nullify elem to prevent memory leaks in IE
            elem = null;
        },

        // Detach an event or set of events from an element
        remove: function( elem, types, handler, selector, mappedTypes ) {

            var j, origCount, tmp,
                events, t, handleObj,
                special, handlers, type, namespaces, origType,
                elemData = jQuery.hasData( elem ) && jQuery._data( elem );

            if ( !elemData || !(events = elemData.events) ) {
                return;
            }

            // Once for each type.namespace in types; type may be omitted
            types = ( types || "" ).match( core_rnotwhite ) || [""];
            t = types.length;
            while ( t-- ) {
                tmp = rtypenamespace.exec( types[t] ) || [];
                type = origType = tmp[1];
                namespaces = ( tmp[2] || "" ).split( "." ).sort();

                // Unbind all events (on this namespace, if provided) for the element
                if ( !type ) {
                    for ( type in events ) {
                        jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
                    }
                    continue;
                }

                special = jQuery.event.special[ type ] || {};
                type = ( selector ? special.delegateType : special.bindType ) || type;
                handlers = events[ type ] || [];
                tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

                // Remove matching events
                origCount = j = handlers.length;
                while ( j-- ) {
                    handleObj = handlers[ j ];

                    if ( ( mappedTypes || origType === handleObj.origType ) &&
                        ( !handler || handler.guid === handleObj.guid ) &&
                        ( !tmp || tmp.test( handleObj.namespace ) ) &&
                        ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
                        handlers.splice( j, 1 );

                        if ( handleObj.selector ) {
                            handlers.delegateCount--;
                        }
                        if ( special.remove ) {
                            special.remove.call( elem, handleObj );
                        }
                    }
                }

                // Remove generic event handler if we removed something and no more handlers exist
                // (avoids potential for endless recursion during removal of special event handlers)
                if ( origCount && !handlers.length ) {
                    if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
                        jQuery.removeEvent( elem, type, elemData.handle );
                    }

                    delete events[ type ];
                }
            }

            // Remove the expando if it's no longer used
            if ( jQuery.isEmptyObject( events ) ) {
                delete elemData.handle;

                // removeData also checks for emptiness and clears the expando if empty
                // so use it instead of delete
                jQuery._removeData( elem, "events" );
            }
        },

        trigger: function( event, data, elem, onlyHandlers ) {

            var i, cur, tmp, bubbleType, ontype, handle, special,
                eventPath = [ elem || document ],
                type = event.type || event,
                namespaces = event.namespace ? event.namespace.split(".") : [];

            cur = tmp = elem = elem || document;

            // Don't do events on text and comment nodes
            if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
                return;
            }

            // focus/blur morphs to focusin/out; ensure we're not firing them right now
            if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
                return;
            }

            if ( type.indexOf(".") >= 0 ) {
                // Namespaced trigger; create a regexp to match event type in handle()
                namespaces = type.split(".");
                type = namespaces.shift();
                namespaces.sort();
            }
            ontype = type.indexOf(":") < 0 && "on" + type;

            // Caller can pass in a jQuery.Event object, Object, or just an event type string
            event = event[ jQuery.expando ] ?
                event :
                new jQuery.Event( type, typeof event === "object" && event );

            event.isTrigger = true;
            event.namespace = namespaces.join(".");
            event.namespace_re = event.namespace ?
                new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
                null;

            // Clean up the event in case it is being reused
            event.result = undefined;
            if ( !event.target ) {
                event.target = elem;
            }

            // Clone any incoming data and prepend the event, creating the handler arg list
            data = data == null ?
                [ event ] :
                jQuery.makeArray( data, [ event ] );

            // Allow special events to draw outside the lines
            special = jQuery.event.special[ type ] || {};
            if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
                return;
            }

            // Determine event propagation path in advance, per W3C events spec (#9951)
            // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
            if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

                bubbleType = special.delegateType || type;
                if ( !rfocusMorph.test( bubbleType + type ) ) {
                    cur = cur.parentNode;
                }
                for ( ; cur; cur = cur.parentNode ) {
                    eventPath.push( cur );
                    tmp = cur;
                }

                // Only add window if we got to document (e.g., not plain obj or detached DOM)
                if ( tmp === (elem.ownerDocument || document) ) {
                    eventPath.push( tmp.defaultView || tmp.parentWindow || window );
                }
            }

            // Fire handlers on the event path
            i = 0;
            while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

                event.type = i > 1 ?
                    bubbleType :
                    special.bindType || type;

                // jQuery handler
                handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
                if ( handle ) {
                    handle.apply( cur, data );
                }

                // Native handler
                handle = ontype && cur[ ontype ];
                if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
                    event.preventDefault();
                }
            }
            event.type = type;

            // If nobody prevented the default action, do it now
            if ( !onlyHandlers && !event.isDefaultPrevented() ) {

                if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
                    !(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

                    // Call a native DOM method on the target with the same name name as the event.
                    // Don't do default actions on window, that's where global variables be (#6170)
                    if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

                        // Don't re-trigger an onFOO event when we call its FOO() method
                        tmp = elem[ ontype ];

                        if ( tmp ) {
                            elem[ ontype ] = null;
                        }

                        // Prevent re-triggering of the same event, since we already bubbled it above
                        jQuery.event.triggered = type;
                        elem[ type ]();
                        jQuery.event.triggered = undefined;

                        if ( tmp ) {
                            elem[ ontype ] = tmp;
                        }
                    }
                }
            }

            return event.result;
        },

        dispatch: function( event ) {

            // Make a writable jQuery.Event from the native event object
            event = jQuery.event.fix( event );

            var i, j, ret, matched, handleObj,
                handlerQueue = [],
                args = core_slice.call( arguments ),
                handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
                special = jQuery.event.special[ event.type ] || {};

            // Use the fix-ed jQuery.Event rather than the (read-only) native event
            args[0] = event;
            event.delegateTarget = this;

            // Call the preDispatch hook for the mapped type, and let it bail if desired
            if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
                return;
            }

            // Determine handlers
            handlerQueue = jQuery.event.handlers.call( this, event, handlers );

            // Run delegates first; they may want to stop propagation beneath us
            i = 0;
            while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
                event.currentTarget = matched.elem;

                j = 0;
                while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

                    // Triggered event must either 1) have no namespace, or
                    // 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
                    if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

                        event.handleObj = handleObj;
                        event.data = handleObj.data;

                        ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
                            .apply( matched.elem, args );

                        if ( ret !== undefined ) {
                            if ( (event.result = ret) === false ) {
                                event.preventDefault();
                                event.stopPropagation();
                            }
                        }
                    }
                }
            }

            // Call the postDispatch hook for the mapped type
            if ( special.postDispatch ) {
                special.postDispatch.call( this, event );
            }

            return event.result;
        },

        handlers: function( event, handlers ) {
            var i, matches, sel, handleObj,
                handlerQueue = [],
                delegateCount = handlers.delegateCount,
                cur = event.target;

            // Find delegate handlers
            // Black-hole SVG <use> instance trees (#13180)
            // Avoid non-left-click bubbling in Firefox (#3861)
            if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

                for ( ; cur != this; cur = cur.parentNode || this ) {

                    // Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
                    if ( cur.disabled !== true || event.type !== "click" ) {
                        matches = [];
                        for ( i = 0; i < delegateCount; i++ ) {
                            handleObj = handlers[ i ];

                            // Don't conflict with Object.prototype properties (#13203)
                            sel = handleObj.selector + " ";

                            if ( matches[ sel ] === undefined ) {
                                matches[ sel ] = handleObj.needsContext ?
                                    jQuery( sel, this ).index( cur ) >= 0 :
                                    jQuery.find( sel, this, null, [ cur ] ).length;
                            }
                            if ( matches[ sel ] ) {
                                matches.push( handleObj );
                            }
                        }
                        if ( matches.length ) {
                            handlerQueue.push({ elem: cur, handlers: matches });
                        }
                    }
                }
            }

            // Add the remaining (directly-bound) handlers
            if ( delegateCount < handlers.length ) {
                handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
            }

            return handlerQueue;
        },

        // Includes some event props shared by KeyEvent and MouseEvent
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

        fixHooks: {},

        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function( event, original ) {

                // Add which for key events
                if ( event.which == null ) {
                    event.which = original.charCode != null ? original.charCode : original.keyCode;
                }

                return event;
            }
        },

        mouseHooks: {
            props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function( event, original ) {
                var eventDoc, doc, body,
                    button = original.button;

                // Calculate pageX/Y if missing and clientX/Y available
                if ( event.pageX == null && original.clientX != null ) {
                    eventDoc = event.target.ownerDocument || document;
                    doc = eventDoc.documentElement;
                    body = eventDoc.body;

                    event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
                    event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
                }

                // Add which for click: 1 === left; 2 === middle; 3 === right
                // Note: button is not normalized, so don't use it
                if ( !event.which && button !== undefined ) {
                    event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
                }

                return event;
            }
        },

        fix: function( event ) {
            if ( event[ jQuery.expando ] ) {
                return event;
            }

            // Create a writable copy of the event object and normalize some properties
            var i, prop,
                originalEvent = event,
                fixHook = jQuery.event.fixHooks[ event.type ] || {},
                copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

            event = new jQuery.Event( originalEvent );

            i = copy.length;
            while ( i-- ) {
                prop = copy[ i ];
                event[ prop ] = originalEvent[ prop ];
            }

            // Support: Chrome 23+, Safari?
            // Target should not be a text node (#504, #13143)
            if ( event.target.nodeType === 3 ) {
                event.target = event.target.parentNode;
            }

            return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
        },

        special: {
            load: {
                // Prevent triggered image.load events from bubbling to window.load
                noBubble: true
            },
            click: {
                // For checkbox, fire native event so checked state will be right
                trigger: function() {
                    if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
                        this.click();
                        return false;
                    }
                }
            },
            focus: {
                // Fire native event if possible so blur/focus sequence is correct
                trigger: function() {
                    if ( this !== document.activeElement && this.focus ) {
                        this.focus();
                        return false;
                    }
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    if ( this === document.activeElement && this.blur ) {
                        this.blur();
                        return false;
                    }
                },
                delegateType: "focusout"
            },

            beforeunload: {
                postDispatch: function( event ) {

                    // Support: Firefox 10+
                    if ( event.result !== undefined ) {
                        event.originalEvent.returnValue = event.result;
                    }
                }
            }
        },

        simulate: function( type, elem, event, bubble ) {
            // Piggyback on a donor event to simulate a different one.
            // Fake originalEvent to avoid donor's stopPropagation, but if the
            // simulated event prevents default then we do the same on the donor.
            var e = jQuery.extend(
                new jQuery.Event(),
                event,
                { type: type,
                    isSimulated: true,
                    originalEvent: {}
                }
            );
            if ( bubble ) {
                jQuery.event.trigger( e, null, elem );
            } else {
                jQuery.event.dispatch.call( elem, e );
            }
            if ( e.isDefaultPrevented() ) {
                event.preventDefault();
            }
        }
    };

    jQuery.removeEvent = function( elem, type, handle ) {
        if ( elem.removeEventListener ) {
            elem.removeEventListener( type, handle, false );
        }
    };

    jQuery.Event = function( src, props ) {
        // Allow instantiation without the 'new' keyword
        if ( !(this instanceof jQuery.Event) ) {
            return new jQuery.Event( src, props );
        }

        // Event object
        if ( src && src.type ) {
            this.originalEvent = src;
            this.type = src.type;

            // Events bubbling up the document may have been marked as prevented
            // by a handler lower down the tree; reflect the correct value.
            this.isDefaultPrevented = ( src.defaultPrevented ||
                src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

            // Event type
        } else {
            this.type = src;
        }

        // Put explicitly provided properties onto the event object
        if ( props ) {
            jQuery.extend( this, props );
        }

        // Create a timestamp if incoming event doesn't have one
        this.timeStamp = src && src.timeStamp || jQuery.now();

        // Mark it as fixed
        this[ jQuery.expando ] = true;
    };

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
    jQuery.Event.prototype = {
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse,

        preventDefault: function() {
            var e = this.originalEvent;

            this.isDefaultPrevented = returnTrue;

            if ( e && e.preventDefault ) {
                e.preventDefault();
            }
        },
        stopPropagation: function() {
            var e = this.originalEvent;

            this.isPropagationStopped = returnTrue;

            if ( e && e.stopPropagation ) {
                e.stopPropagation();
            }
        },
        stopImmediatePropagation: function() {
            this.isImmediatePropagationStopped = returnTrue;
            this.stopPropagation();
        }
    };

// Create mouseenter/leave events using mouseover/out and event-time checks
// Support: Chrome 15+
    jQuery.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    }, function( orig, fix ) {
        jQuery.event.special[ orig ] = {
            delegateType: fix,
            bindType: fix,

            handle: function( event ) {
                var ret,
                    target = this,
                    related = event.relatedTarget,
                    handleObj = event.handleObj;

                // For mousenter/leave call the handler if related is outside the target.
                // NB: No relatedTarget if the mouse left/entered the browser window
                if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
                    event.type = handleObj.origType;
                    ret = handleObj.handler.apply( this, arguments );
                    event.type = fix;
                }
                return ret;
            }
        };
    });

// Create "bubbling" focus and blur events
// Support: Firefox 10+
    if ( !jQuery.support.focusinBubbles ) {
        jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

            // Attach a single capturing handler while someone wants focusin/focusout
            var attaches = 0,
                handler = function( event ) {
                    jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
                };

            jQuery.event.special[ fix ] = {
                setup: function() {
                    if ( attaches++ === 0 ) {
                        document.addEventListener( orig, handler, true );
                    }
                },
                teardown: function() {
                    if ( --attaches === 0 ) {
                        document.removeEventListener( orig, handler, true );
                    }
                }
            };
        });
    }

    jQuery.fn.extend({

        on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
            var origFn, type;

            // Types can be a map of types/handlers
            if ( typeof types === "object" ) {
                // ( types-Object, selector, data )
                if ( typeof selector !== "string" ) {
                    // ( types-Object, data )
                    data = data || selector;
                    selector = undefined;
                }
                for ( type in types ) {
                    this.on( type, selector, data, types[ type ], one );
                }
                return this;
            }

            if ( data == null && fn == null ) {
                // ( types, fn )
                fn = selector;
                data = selector = undefined;
            } else if ( fn == null ) {
                if ( typeof selector === "string" ) {
                    // ( types, selector, fn )
                    fn = data;
                    data = undefined;
                } else {
                    // ( types, data, fn )
                    fn = data;
                    data = selector;
                    selector = undefined;
                }
            }
            if ( fn === false ) {
                fn = returnFalse;
            } else if ( !fn ) {
                return this;
            }

            if ( one === 1 ) {
                origFn = fn;
                fn = function( event ) {
                    // Can use an empty set, since event contains the info
                    jQuery().off( event );
                    return origFn.apply( this, arguments );
                };
                // Use same guid so caller can remove using origFn
                fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
            }
            return this.each( function() {
                jQuery.event.add( this, types, fn, data, selector );
            });
        },
        one: function( types, selector, data, fn ) {
            return this.on( types, selector, data, fn, 1 );
        },
        off: function( types, selector, fn ) {
            var handleObj, type;
            if ( types && types.preventDefault && types.handleObj ) {
                // ( event )  dispatched jQuery.Event
                handleObj = types.handleObj;
                jQuery( types.delegateTarget ).off(
                    handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
                    handleObj.selector,
                    handleObj.handler
                );
                return this;
            }
            if ( typeof types === "object" ) {
                // ( types-object [, selector] )
                for ( type in types ) {
                    this.off( type, selector, types[ type ] );
                }
                return this;
            }
            if ( selector === false || typeof selector === "function" ) {
                // ( types [, fn] )
                fn = selector;
                selector = undefined;
            }
            if ( fn === false ) {
                fn = returnFalse;
            }
            return this.each(function() {
                jQuery.event.remove( this, types, fn, selector );
            });
        },

        bind: function( types, data, fn ) {
            return this.on( types, null, data, fn );
        },
        unbind: function( types, fn ) {
            return this.off( types, null, fn );
        },

        delegate: function( selector, types, data, fn ) {
            return this.on( types, selector, data, fn );
        },
        undelegate: function( selector, types, fn ) {
            // ( namespace ) or ( selector, types [, fn] )
            return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
        },

        trigger: function( type, data ) {
            return this.each(function() {
                jQuery.event.trigger( type, data, this );
            });
        },
        triggerHandler: function( type, data ) {
            var elem = this[0];
            if ( elem ) {
                return jQuery.event.trigger( type, data, elem, true );
            }
        },

        hover: function( fnOver, fnOut ) {
            return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
        }
    });

    jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
        "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
        "change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

        // Handle event binding
        jQuery.fn[ name ] = function( data, fn ) {
            return arguments.length > 0 ?
                this.on( name, null, data, fn ) :
                this.trigger( name );
        };

        if ( rkeyEvent.test( name ) ) {
            jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
        }

        if ( rmouseEvent.test( name ) ) {
            jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
        }
    });
    /*!
     * Sizzle CSS Selector Engine
     * Copyright 2012 jQuery Foundation and other contributors
     * Released under the MIT license
     * http://sizzlejs.com/
     */
    (function( window, undefined ) {

        var i,
            cachedruns,
            Expr,
            getText,
            isXML,
            compile,
            hasDuplicate,
            outermostContext,

        // Local document vars
            setDocument,
            document,
            docElem,
            documentIsXML,
            rbuggyQSA,
            rbuggyMatches,
            matches,
            contains,
            sortOrder,

        // Instance-specific data
            expando = "sizzle" + -(new Date()),
            preferredDoc = window.document,
            support = {},
            dirruns = 0,
            done = 0,
            classCache = createCache(),
            tokenCache = createCache(),
            compilerCache = createCache(),

        // General-purpose constants
            strundefined = typeof undefined,
            MAX_NEGATIVE = 1 << 31,

        // Array methods
            arr = [],
            pop = arr.pop,
            push = arr.push,
            slice = arr.slice,
        // Use a stripped-down indexOf if we can't use a native one
            indexOf = arr.indexOf || function( elem ) {
                var i = 0,
                    len = this.length;
                for ( ; i < len; i++ ) {
                    if ( this[i] === elem ) {
                        return i;
                    }
                }
                return -1;
            },


        // Regular expressions

        // Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
            whitespace = "[\\x20\\t\\r\\n\\f]",
        // http://www.w3.org/TR/css3-syntax/#characters
            characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

        // Loosely modeled on CSS identifier characters
        // An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
        // Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
            identifier = characterEncoding.replace( "w", "w#" ),

        // Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
            operators = "([*^$|!~]?=)",
            attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
                "*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

        // Prefer arguments quoted,
        //   then not containing pseudos/brackets,
        //   then attribute selectors/non-parenthetical expressions,
        //   then anything else
        // These preferences are here to reduce the number of selectors
        //   needing tokenize in the PSEUDO preFilter
            pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

        // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
            rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

            rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
            rcombinators = new RegExp( "^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*" ),
            rpseudo = new RegExp( pseudos ),
            ridentifier = new RegExp( "^" + identifier + "$" ),

            matchExpr = {
                "ID": new RegExp( "^#(" + characterEncoding + ")" ),
                "CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
                "NAME": new RegExp( "^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]" ),
                "TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
                "ATTR": new RegExp( "^" + attributes ),
                "PSEUDO": new RegExp( "^" + pseudos ),
                "CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
                    "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
                    "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
                // For use in libraries implementing .is()
                // We use this for POS matching in `select`
                "needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
                    whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
            },

            rsibling = /[\x20\t\r\n\f]*[+~]/,

            rnative = /\{\s*\[native code\]\s*\}/,

        // Easily-parseable/retrievable ID or TAG or CLASS selectors
            rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

            rinputs = /^(?:input|select|textarea|button)$/i,
            rheader = /^h\d$/i,

            rescape = /'|\\/g,
            rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,

        // CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
            runescape = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,
            funescape = function( _, escaped ) {
                var high = "0x" + escaped - 0x10000;
                // NaN means non-codepoint
                return high !== high ?
                    escaped :
                    // BMP codepoint
                    high < 0 ?
                        String.fromCharCode( high + 0x10000 ) :
                        // Supplemental Plane codepoint (surrogate pair)
                        String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
            };

// Use a stripped-down slice if we can't use a native one
        try {
            slice.call( docElem.childNodes, 0 )[0].nodeType;
        } catch ( e ) {
            slice = function( i ) {
                var elem,
                    results = [];
                for ( ; (elem = this[i]); i++ ) {
                    results.push( elem );
                }
                return results;
            };
        }

        /**
         * For feature detection
         * @param {Function} fn The function to test for native support
         */
        function isNative( fn ) {
            return rnative.test( fn + "" );
        }

        /**
         * Create key-value caches of limited size
         * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
         *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
         *	deleting the oldest entry
         */
        function createCache() {
            var cache,
                keys = [];

            return (cache = function( key, value ) {
                // Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
                if ( keys.push( key += " " ) > Expr.cacheLength ) {
                    // Only keep the most recent entries
                    delete cache[ keys.shift() ];
                }
                return (cache[ key ] = value);
            });
        }

        /**
         * Mark a function for special use by Sizzle
         * @param {Function} fn The function to mark
         */
        function markFunction( fn ) {
            fn[ expando ] = true;
            return fn;
        }

        /**
         * Support testing using an element
         * @param {Function} fn Passed the created div and expects a boolean result
         */
        function assert( fn ) {
            var div = document.createElement("div");

            try {
                return fn( div );
            } catch (e) {
                return false;
            } finally {
                // release memory in IE
                div = null;
            }
        }

        function Sizzle( selector, context, results, seed ) {
            var match, elem, m, nodeType,
            // QSA vars
                i, groups, old, nid, newContext, newSelector;

            if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
                setDocument( context );
            }

            context = context || document;
            results = results || [];

            if ( !selector || typeof selector !== "string" ) {
                return results;
            }

            if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
                return [];
            }

            if ( !documentIsXML && !seed ) {

                // Shortcuts
                if ( (match = rquickExpr.exec( selector )) ) {
                    // Speed-up: Sizzle("#ID")
                    if ( (m = match[1]) ) {
                        if ( nodeType === 9 ) {
                            elem = context.getElementById( m );
                            // Check parentNode to catch when Blackberry 4.6 returns
                            // nodes that are no longer in the document #6963
                            if ( elem && elem.parentNode ) {
                                // Handle the case where IE, Opera, and Webkit return items
                                // by name instead of ID
                                if ( elem.id === m ) {
                                    results.push( elem );
                                    return results;
                                }
                            } else {
                                return results;
                            }
                        } else {
                            // Context is not a document
                            if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
                                contains( context, elem ) && elem.id === m ) {
                                results.push( elem );
                                return results;
                            }
                        }

                        // Speed-up: Sizzle("TAG")
                    } else if ( match[2] ) {
                        push.apply( results, slice.call(context.getElementsByTagName( selector ), 0) );
                        return results;

                        // Speed-up: Sizzle(".CLASS")
                    } else if ( (m = match[3]) && support.getByClassName && context.getElementsByClassName ) {
                        push.apply( results, slice.call(context.getElementsByClassName( m ), 0) );
                        return results;
                    }
                }

                // QSA path
                if ( support.qsa && !rbuggyQSA.test(selector) ) {
                    old = true;
                    nid = expando;
                    newContext = context;
                    newSelector = nodeType === 9 && selector;

                    // qSA works strangely on Element-rooted queries
                    // We can work around this by specifying an extra ID on the root
                    // and working up from there (Thanks to Andrew Dupont for the technique)
                    // IE 8 doesn't work on object elements
                    if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
                        groups = tokenize( selector );

                        if ( (old = context.getAttribute("id")) ) {
                            nid = old.replace( rescape, "\\$&" );
                        } else {
                            context.setAttribute( "id", nid );
                        }
                        nid = "[id='" + nid + "'] ";

                        i = groups.length;
                        while ( i-- ) {
                            groups[i] = nid + toSelector( groups[i] );
                        }
                        newContext = rsibling.test( selector ) && context.parentNode || context;
                        newSelector = groups.join(",");
                    }

                    if ( newSelector ) {
                        try {
                            push.apply( results, slice.call( newContext.querySelectorAll(
                                newSelector
                            ), 0 ) );
                            return results;
                        } catch(qsaError) {
                        } finally {
                            if ( !old ) {
                                context.removeAttribute("id");
                            }
                        }
                    }
                }
            }

            // All others
            return select( selector.replace( rtrim, "$1" ), context, results, seed );
        }

        /**
         * Detect xml
         * @param {Element|Object} elem An element or a document
         */
        isXML = Sizzle.isXML = function( elem ) {
            // documentElement is verified for cases where it doesn't yet exist
            // (such as loading iframes in IE - #4833)
            var documentElement = elem && (elem.ownerDocument || elem).documentElement;
            return documentElement ? documentElement.nodeName !== "HTML" : false;
        };

        /**
         * Sets document-related variables once based on the current document
         * @param {Element|Object} [doc] An element or document object to use to set the document
         * @returns {Object} Returns the current document
         */
        setDocument = Sizzle.setDocument = function( node ) {
            var doc = node ? node.ownerDocument || node : preferredDoc;

            // If no document and documentElement is available, return
            if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
                return document;
            }

            // Set our document
            document = doc;
            docElem = doc.documentElement;

            // Support tests
            documentIsXML = isXML( doc );

            // Check if getElementsByTagName("*") returns only elements
            support.tagNameNoComments = assert(function( div ) {
                div.appendChild( doc.createComment("") );
                return !div.getElementsByTagName("*").length;
            });

            // Check if attributes should be retrieved by attribute nodes
            support.attributes = assert(function( div ) {
                div.innerHTML = "<select></select>";
                var type = typeof div.lastChild.getAttribute("multiple");
                // IE8 returns a string for some attributes even when not present
                return type !== "boolean" && type !== "string";
            });

            // Check if getElementsByClassName can be trusted
            support.getByClassName = assert(function( div ) {
                // Opera can't find a second classname (in 9.6)
                div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
                if ( !div.getElementsByClassName || !div.getElementsByClassName("e").length ) {
                    return false;
                }

                // Safari 3.2 caches class attributes and doesn't catch changes
                div.lastChild.className = "e";
                return div.getElementsByClassName("e").length === 2;
            });

            // Check if getElementById returns elements by name
            // Check if getElementsByName privileges form controls or returns elements by ID
            support.getByName = assert(function( div ) {
                // Inject content
                div.id = expando + 0;
                div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
                docElem.insertBefore( div, docElem.firstChild );

                // Test
                var pass = doc.getElementsByName &&
                    // buggy browsers will return fewer than the correct 2
                    doc.getElementsByName( expando ).length === 2 +
                        // buggy browsers will return more than the correct 0
                        doc.getElementsByName( expando + 0 ).length;
                support.getIdNotName = !doc.getElementById( expando );

                // Cleanup
                docElem.removeChild( div );

                return pass;
            });

            // IE6/7 return modified attributes
            Expr.attrHandle = assert(function( div ) {
                div.innerHTML = "<a href='#'></a>";
                return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
                    div.firstChild.getAttribute("href") === "#";
            }) ?
            {} :
            {
                "href": function( elem ) {
                    return elem.getAttribute( "href", 2 );
                },
                "type": function( elem ) {
                    return elem.getAttribute("type");
                }
            };

            // ID find and filter
            if ( support.getIdNotName ) {
                Expr.find["ID"] = function( id, context ) {
                    if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
                        var m = context.getElementById( id );
                        // Check parentNode to catch when Blackberry 4.6 returns
                        // nodes that are no longer in the document #6963
                        return m && m.parentNode ? [m] : [];
                    }
                };
                Expr.filter["ID"] = function( id ) {
                    var attrId = id.replace( runescape, funescape );
                    return function( elem ) {
                        return elem.getAttribute("id") === attrId;
                    };
                };
            } else {
                Expr.find["ID"] = function( id, context ) {
                    if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
                        var m = context.getElementById( id );

                        return m ?
                            m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
                                [m] :
                                undefined :
                            [];
                    }
                };
                Expr.filter["ID"] =  function( id ) {
                    var attrId = id.replace( runescape, funescape );
                    return function( elem ) {
                        var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
                        return node && node.value === attrId;
                    };
                };
            }

            // Tag
            Expr.find["TAG"] = support.tagNameNoComments ?
                function( tag, context ) {
                    if ( typeof context.getElementsByTagName !== strundefined ) {
                        return context.getElementsByTagName( tag );
                    }
                } :
                function( tag, context ) {
                    var elem,
                        tmp = [],
                        i = 0,
                        results = context.getElementsByTagName( tag );

                    // Filter out possible comments
                    if ( tag === "*" ) {
                        for ( ; (elem = results[i]); i++ ) {
                            if ( elem.nodeType === 1 ) {
                                tmp.push( elem );
                            }
                        }

                        return tmp;
                    }
                    return results;
                };

            // Name
            Expr.find["NAME"] = support.getByName && function( tag, context ) {
                if ( typeof context.getElementsByName !== strundefined ) {
                    return context.getElementsByName( name );
                }
            };

            // Class
            Expr.find["CLASS"] = support.getByClassName && function( className, context ) {
                if ( typeof context.getElementsByClassName !== strundefined && !documentIsXML ) {
                    return context.getElementsByClassName( className );
                }
            };

            // QSA and matchesSelector support

            // matchesSelector(:active) reports false when true (IE9/Opera 11.5)
            rbuggyMatches = [];

            // qSa(:focus) reports false when true (Chrome 21),
            // no need to also add to buggyMatches since matches checks buggyQSA
            // A support test would require too much code (would include document ready)
            rbuggyQSA = [ ":focus" ];

            if ( (support.qsa = isNative(doc.querySelectorAll)) ) {
                // Build QSA regex
                // Regex strategy adopted from Diego Perini
                assert(function( div ) {
                    // Select is set to empty string on purpose
                    // This is to test IE's treatment of not explictly
                    // setting a boolean content attribute,
                    // since its presence should be enough
                    // http://bugs.jquery.com/ticket/12359
                    div.innerHTML = "<select><option selected=''></option></select>";

                    // IE8 - Some boolean attributes are not treated correctly
                    if ( !div.querySelectorAll("[selected]").length ) {
                        rbuggyQSA.push( "\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)" );
                    }

                    // Webkit/Opera - :checked should return selected option elements
                    // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                    // IE8 throws error here and will not see later tests
                    if ( !div.querySelectorAll(":checked").length ) {
                        rbuggyQSA.push(":checked");
                    }
                });

                assert(function( div ) {

                    // Opera 10-12/IE8 - ^= $= *= and empty values
                    // Should not select anything
                    div.innerHTML = "<input type='hidden' i=''/>";
                    if ( div.querySelectorAll("[i^='']").length ) {
                        rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:\"\"|'')" );
                    }

                    // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
                    // IE8 throws error here and will not see later tests
                    if ( !div.querySelectorAll(":enabled").length ) {
                        rbuggyQSA.push( ":enabled", ":disabled" );
                    }

                    // Opera 10-11 does not throw on post-comma invalid pseudos
                    div.querySelectorAll("*,:x");
                    rbuggyQSA.push(",.*:");
                });
            }

            if ( (support.matchesSelector = isNative( (matches = docElem.matchesSelector ||
                docElem.mozMatchesSelector ||
                docElem.webkitMatchesSelector ||
                docElem.oMatchesSelector ||
                docElem.msMatchesSelector) )) ) {

                assert(function( div ) {
                    // Check to see if it's possible to do matchesSelector
                    // on a disconnected node (IE 9)
                    support.disconnectedMatch = matches.call( div, "div" );

                    // This should fail with an exception
                    // Gecko does not error, returns false instead
                    matches.call( div, "[s!='']:x" );
                    rbuggyMatches.push( "!=", pseudos );
                });
            }

            rbuggyQSA = new RegExp( rbuggyQSA.join("|") );
            rbuggyMatches = new RegExp( rbuggyMatches.join("|") );

            // Element contains another
            // Purposefully does not implement inclusive descendent
            // As in, an element does not contain itself
            contains = isNative(docElem.contains) || docElem.compareDocumentPosition ?
                function( a, b ) {
                    var adown = a.nodeType === 9 ? a.documentElement : a,
                        bup = b && b.parentNode;
                    return a === bup || !!( bup && bup.nodeType === 1 && (
                        adown.contains ?
                            adown.contains( bup ) :
                            a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
                        ));
                } :
                function( a, b ) {
                    if ( b ) {
                        while ( (b = b.parentNode) ) {
                            if ( b === a ) {
                                return true;
                            }
                        }
                    }
                    return false;
                };

            // Document order sorting
            sortOrder = docElem.compareDocumentPosition ?
                function( a, b ) {
                    var compare;

                    if ( a === b ) {
                        hasDuplicate = true;
                        return 0;
                    }

                    if ( (compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b )) ) {
                        if ( compare & 1 || a.parentNode && a.parentNode.nodeType === 11 ) {
                            if ( a === doc || contains( preferredDoc, a ) ) {
                                return -1;
                            }
                            if ( b === doc || contains( preferredDoc, b ) ) {
                                return 1;
                            }
                            return 0;
                        }
                        return compare & 4 ? -1 : 1;
                    }

                    return a.compareDocumentPosition ? -1 : 1;
                } :
                function( a, b ) {
                    var cur,
                        i = 0,
                        aup = a.parentNode,
                        bup = b.parentNode,
                        ap = [ a ],
                        bp = [ b ];

                    // The nodes are identical, we can exit early
                    if ( a === b ) {
                        hasDuplicate = true;
                        return 0;

                        // Fallback to using sourceIndex (in IE) if it's available on both nodes
                    } else if ( a.sourceIndex && b.sourceIndex ) {
                        return ( ~b.sourceIndex || MAX_NEGATIVE ) - ( contains( preferredDoc, a ) && ~a.sourceIndex || MAX_NEGATIVE );

                        // Parentless nodes are either documents or disconnected
                    } else if ( !aup || !bup ) {
                        return a === doc ? -1 :
                            b === doc ? 1 :
                                aup ? -1 :
                                    bup ? 1 :
                                        0;

                        // If the nodes are siblings, we can do a quick check
                    } else if ( aup === bup ) {
                        return siblingCheck( a, b );
                    }

                    // Otherwise we need full lists of their ancestors for comparison
                    cur = a;
                    while ( (cur = cur.parentNode) ) {
                        ap.unshift( cur );
                    }
                    cur = b;
                    while ( (cur = cur.parentNode) ) {
                        bp.unshift( cur );
                    }

                    // Walk down the tree looking for a discrepancy
                    while ( ap[i] === bp[i] ) {
                        i++;
                    }

                    return i ?
                        // Do a sibling check if the nodes have a common ancestor
                        siblingCheck( ap[i], bp[i] ) :

                        // Otherwise nodes in our document sort first
                        ap[i] === preferredDoc ? -1 :
                            bp[i] === preferredDoc ? 1 :
                                0;
                };

            // Always assume the presence of duplicates if sort doesn't
            // pass them to our comparison function (as in Google Chrome).
            hasDuplicate = false;
            [0, 0].sort( sortOrder );
            support.detectDuplicates = hasDuplicate;

            return document;
        };

        Sizzle.matches = function( expr, elements ) {
            return Sizzle( expr, null, null, elements );
        };

        Sizzle.matchesSelector = function( elem, expr ) {
            // Set document vars if needed
            if ( ( elem.ownerDocument || elem ) !== document ) {
                setDocument( elem );
            }

            // Make sure that attribute selectors are quoted
            expr = expr.replace( rattributeQuotes, "='$1']" );

            // rbuggyQSA always contains :focus, so no need for an existence check
            if ( support.matchesSelector && !documentIsXML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && !rbuggyQSA.test(expr) ) {
                try {
                    var ret = matches.call( elem, expr );

                    // IE 9's matchesSelector returns false on disconnected nodes
                    if ( ret || support.disconnectedMatch ||
                        // As well, disconnected nodes are said to be in a document
                        // fragment in IE 9
                        elem.document && elem.document.nodeType !== 11 ) {
                        return ret;
                    }
                } catch(e) {}
            }

            return Sizzle( expr, document, null, [elem] ).length > 0;
        };

        Sizzle.contains = function( context, elem ) {
            // Set document vars if needed
            if ( ( context.ownerDocument || context ) !== document ) {
                setDocument( context );
            }
            return contains( context, elem );
        };

        Sizzle.attr = function( elem, name ) {
            var val;

            // Set document vars if needed
            if ( ( elem.ownerDocument || elem ) !== document ) {
                setDocument( elem );
            }

            if ( !documentIsXML ) {
                name = name.toLowerCase();
            }
            if ( (val = Expr.attrHandle[ name ]) ) {
                return val( elem );
            }
            if ( documentIsXML || support.attributes ) {
                return elem.getAttribute( name );
            }
            return ( (val = elem.getAttributeNode( name )) || elem.getAttribute( name ) ) && elem[ name ] === true ?
                name :
                val && val.specified ? val.value : null;
        };

        Sizzle.error = function( msg ) {
            throw new Error( "Syntax error, unrecognized expression: " + msg );
        };

// Document sorting and removing duplicates
        Sizzle.uniqueSort = function( results ) {
            var elem,
                duplicates = [],
                i = 1,
                j = 0;

            // Unless we *know* we can detect duplicates, assume their presence
            hasDuplicate = !support.detectDuplicates;
            results.sort( sortOrder );

            if ( hasDuplicate ) {
                for ( ; (elem = results[i]); i++ ) {
                    if ( elem === results[ i - 1 ] ) {
                        j = duplicates.push( i );
                    }
                }
                while ( j-- ) {
                    results.splice( duplicates[ j ], 1 );
                }
            }

            return results;
        };

        function siblingCheck( a, b ) {
            var cur = a && b && a.nextSibling;

            for ( ; cur; cur = cur.nextSibling ) {
                if ( cur === b ) {
                    return -1;
                }
            }

            return a ? 1 : -1;
        }

// Returns a function to use in pseudos for input types
        function createInputPseudo( type ) {
            return function( elem ) {
                var name = elem.nodeName.toLowerCase();
                return name === "input" && elem.type === type;
            };
        }

// Returns a function to use in pseudos for buttons
        function createButtonPseudo( type ) {
            return function( elem ) {
                var name = elem.nodeName.toLowerCase();
                return (name === "input" || name === "button") && elem.type === type;
            };
        }

// Returns a function to use in pseudos for positionals
        function createPositionalPseudo( fn ) {
            return markFunction(function( argument ) {
                argument = +argument;
                return markFunction(function( seed, matches ) {
                    var j,
                        matchIndexes = fn( [], seed.length, argument ),
                        i = matchIndexes.length;

                    // Match elements found at the specified indexes
                    while ( i-- ) {
                        if ( seed[ (j = matchIndexes[i]) ] ) {
                            seed[j] = !(matches[j] = seed[j]);
                        }
                    }
                });
            });
        }

        /**
         * Utility function for retrieving the text value of an array of DOM nodes
         * @param {Array|Element} elem
         */
        getText = Sizzle.getText = function( elem ) {
            var node,
                ret = "",
                i = 0,
                nodeType = elem.nodeType;

            if ( !nodeType ) {
                // If no nodeType, this is expected to be an array
                for ( ; (node = elem[i]); i++ ) {
                    // Do not traverse comment nodes
                    ret += getText( node );
                }
            } else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
                // Use textContent for elements
                // innerText usage removed for consistency of new lines (see #11153)
                if ( typeof elem.textContent === "string" ) {
                    return elem.textContent;
                } else {
                    // Traverse its children
                    for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
                        ret += getText( elem );
                    }
                }
            } else if ( nodeType === 3 || nodeType === 4 ) {
                return elem.nodeValue;
            }
            // Do not include comment or processing instruction nodes

            return ret;
        };

        Expr = Sizzle.selectors = {

            // Can be adjusted by the user
            cacheLength: 50,

            createPseudo: markFunction,

            match: matchExpr,

            find: {},

            relative: {
                ">": { dir: "parentNode", first: true },
                " ": { dir: "parentNode" },
                "+": { dir: "previousSibling", first: true },
                "~": { dir: "previousSibling" }
            },

            preFilter: {
                "ATTR": function( match ) {
                    match[1] = match[1].replace( runescape, funescape );

                    // Move the given value to match[3] whether quoted or unquoted
                    match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

                    if ( match[2] === "~=" ) {
                        match[3] = " " + match[3] + " ";
                    }

                    return match.slice( 0, 4 );
                },

                "CHILD": function( match ) {
                    /* matches from matchExpr["CHILD"]
                     1 type (only|nth|...)
                     2 what (child|of-type)
                     3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
                     4 xn-component of xn+y argument ([+-]?\d*n|)
                     5 sign of xn-component
                     6 x of xn-component
                     7 sign of y-component
                     8 y of y-component
                     */
                    match[1] = match[1].toLowerCase();

                    if ( match[1].slice( 0, 3 ) === "nth" ) {
                        // nth-* requires argument
                        if ( !match[3] ) {
                            Sizzle.error( match[0] );
                        }

                        // numeric x and y parameters for Expr.filter.CHILD
                        // remember that false/true cast respectively to 0/1
                        match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
                        match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

                        // other types prohibit arguments
                    } else if ( match[3] ) {
                        Sizzle.error( match[0] );
                    }

                    return match;
                },

                "PSEUDO": function( match ) {
                    var excess,
                        unquoted = !match[5] && match[2];

                    if ( matchExpr["CHILD"].test( match[0] ) ) {
                        return null;
                    }

                    // Accept quoted arguments as-is
                    if ( match[4] ) {
                        match[2] = match[4];

                        // Strip excess characters from unquoted arguments
                    } else if ( unquoted && rpseudo.test( unquoted ) &&
                        // Get excess from tokenize (recursively)
                        (excess = tokenize( unquoted, true )) &&
                        // advance to the next closing parenthesis
                        (excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

                        // excess is a negative index
                        match[0] = match[0].slice( 0, excess );
                        match[2] = unquoted.slice( 0, excess );
                    }

                    // Return only captures needed by the pseudo filter method (type and argument)
                    return match.slice( 0, 3 );
                }
            },

            filter: {

                "TAG": function( nodeName ) {
                    if ( nodeName === "*" ) {
                        return function() { return true; };
                    }

                    nodeName = nodeName.replace( runescape, funescape ).toLowerCase();
                    return function( elem ) {
                        return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
                    };
                },

                "CLASS": function( className ) {
                    var pattern = classCache[ className + " " ];

                    return pattern ||
                        (pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
                            classCache( className, function( elem ) {
                                return pattern.test( elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "" );
                            });
                },

                "ATTR": function( name, operator, check ) {
                    return function( elem ) {
                        var result = Sizzle.attr( elem, name );

                        if ( result == null ) {
                            return operator === "!=";
                        }
                        if ( !operator ) {
                            return true;
                        }

                        result += "";

                        return operator === "=" ? result === check :
                            operator === "!=" ? result !== check :
                                operator === "^=" ? check && result.indexOf( check ) === 0 :
                                    operator === "*=" ? check && result.indexOf( check ) > -1 :
                                        operator === "$=" ? check && result.substr( result.length - check.length ) === check :
                                            operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
                                                operator === "|=" ? result === check || result.substr( 0, check.length + 1 ) === check + "-" :
                                                    false;
                    };
                },

                "CHILD": function( type, what, argument, first, last ) {
                    var simple = type.slice( 0, 3 ) !== "nth",
                        forward = type.slice( -4 ) !== "last",
                        ofType = what === "of-type";

                    return first === 1 && last === 0 ?

                        // Shortcut for :nth-*(n)
                        function( elem ) {
                            return !!elem.parentNode;
                        } :

                        function( elem, context, xml ) {
                            var cache, outerCache, node, diff, nodeIndex, start,
                                dir = simple !== forward ? "nextSibling" : "previousSibling",
                                parent = elem.parentNode,
                                name = ofType && elem.nodeName.toLowerCase(),
                                useCache = !xml && !ofType;

                            if ( parent ) {

                                // :(first|last|only)-(child|of-type)
                                if ( simple ) {
                                    while ( dir ) {
                                        node = elem;
                                        while ( (node = node[ dir ]) ) {
                                            if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
                                                return false;
                                            }
                                        }
                                        // Reverse direction for :only-* (if we haven't yet done so)
                                        start = dir = type === "only" && !start && "nextSibling";
                                    }
                                    return true;
                                }

                                start = [ forward ? parent.firstChild : parent.lastChild ];

                                // non-xml :nth-child(...) stores cache data on `parent`
                                if ( forward && useCache ) {
                                    // Seek `elem` from a previously-cached index
                                    outerCache = parent[ expando ] || (parent[ expando ] = {});
                                    cache = outerCache[ type ] || [];
                                    nodeIndex = cache[0] === dirruns && cache[1];
                                    diff = cache[0] === dirruns && cache[2];
                                    node = nodeIndex && parent.childNodes[ nodeIndex ];

                                    while ( (node = ++nodeIndex && node && node[ dir ] ||

                                        // Fallback to seeking `elem` from the start
                                        (diff = nodeIndex = 0) || start.pop()) ) {

                                        // When found, cache indexes on `parent` and break
                                        if ( node.nodeType === 1 && ++diff && node === elem ) {
                                            outerCache[ type ] = [ dirruns, nodeIndex, diff ];
                                            break;
                                        }
                                    }

                                    // Use previously-cached element index if available
                                } else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
                                    diff = cache[1];

                                    // xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
                                } else {
                                    // Use the same loop as above to seek `elem` from the start
                                    while ( (node = ++nodeIndex && node && node[ dir ] ||
                                        (diff = nodeIndex = 0) || start.pop()) ) {

                                        if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
                                            // Cache the index of each encountered element
                                            if ( useCache ) {
                                                (node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
                                            }

                                            if ( node === elem ) {
                                                break;
                                            }
                                        }
                                    }
                                }

                                // Incorporate the offset, then check against cycle size
                                diff -= last;
                                return diff === first || ( diff % first === 0 && diff / first >= 0 );
                            }
                        };
                },

                "PSEUDO": function( pseudo, argument ) {
                    // pseudo-class names are case-insensitive
                    // http://www.w3.org/TR/selectors/#pseudo-classes
                    // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
                    // Remember that setFilters inherits from pseudos
                    var args,
                        fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
                            Sizzle.error( "unsupported pseudo: " + pseudo );

                    // The user may use createPseudo to indicate that
                    // arguments are needed to create the filter function
                    // just as Sizzle does
                    if ( fn[ expando ] ) {
                        return fn( argument );
                    }

                    // But maintain support for old signatures
                    if ( fn.length > 1 ) {
                        args = [ pseudo, pseudo, "", argument ];
                        return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
                            markFunction(function( seed, matches ) {
                                var idx,
                                    matched = fn( seed, argument ),
                                    i = matched.length;
                                while ( i-- ) {
                                    idx = indexOf.call( seed, matched[i] );
                                    seed[ idx ] = !( matches[ idx ] = matched[i] );
                                }
                            }) :
                            function( elem ) {
                                return fn( elem, 0, args );
                            };
                    }

                    return fn;
                }
            },

            pseudos: {
                // Potentially complex pseudos
                "not": markFunction(function( selector ) {
                    // Trim the selector passed to compile
                    // to avoid treating leading and trailing
                    // spaces as combinators
                    var input = [],
                        results = [],
                        matcher = compile( selector.replace( rtrim, "$1" ) );

                    return matcher[ expando ] ?
                        markFunction(function( seed, matches, context, xml ) {
                            var elem,
                                unmatched = matcher( seed, null, xml, [] ),
                                i = seed.length;

                            // Match elements unmatched by `matcher`
                            while ( i-- ) {
                                if ( (elem = unmatched[i]) ) {
                                    seed[i] = !(matches[i] = elem);
                                }
                            }
                        }) :
                        function( elem, context, xml ) {
                            input[0] = elem;
                            matcher( input, null, xml, results );
                            return !results.pop();
                        };
                }),

                "has": markFunction(function( selector ) {
                    return function( elem ) {
                        return Sizzle( selector, elem ).length > 0;
                    };
                }),

                "contains": markFunction(function( text ) {
                    return function( elem ) {
                        return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
                    };
                }),

                // "Whether an element is represented by a :lang() selector
                // is based solely on the element's language value
                // being equal to the identifier C,
                // or beginning with the identifier C immediately followed by "-".
                // The matching of C against the element's language value is performed case-insensitively.
                // The identifier C does not have to be a valid language name."
                // http://www.w3.org/TR/selectors/#lang-pseudo
                "lang": markFunction( function( lang ) {
                    // lang value must be a valid identifider
                    if ( !ridentifier.test(lang || "") ) {
                        Sizzle.error( "unsupported lang: " + lang );
                    }
                    lang = lang.replace( runescape, funescape ).toLowerCase();
                    return function( elem ) {
                        var elemLang;
                        do {
                            if ( (elemLang = documentIsXML ?
                                elem.getAttribute("xml:lang") || elem.getAttribute("lang") :
                                elem.lang) ) {

                                elemLang = elemLang.toLowerCase();
                                return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
                            }
                        } while ( (elem = elem.parentNode) && elem.nodeType === 1 );
                        return false;
                    };
                }),

                // Miscellaneous
                "target": function( elem ) {
                    var hash = window.location && window.location.hash;
                    return hash && hash.slice( 1 ) === elem.id;
                },

                "root": function( elem ) {
                    return elem === docElem;
                },

                "focus": function( elem ) {
                    return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
                },

                // Boolean properties
                "enabled": function( elem ) {
                    return elem.disabled === false;
                },

                "disabled": function( elem ) {
                    return elem.disabled === true;
                },

                "checked": function( elem ) {
                    // In CSS3, :checked should return both checked and selected elements
                    // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                    var nodeName = elem.nodeName.toLowerCase();
                    return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
                },

                "selected": function( elem ) {
                    // Accessing this property makes selected-by-default
                    // options in Safari work properly
                    if ( elem.parentNode ) {
                        elem.parentNode.selectedIndex;
                    }

                    return elem.selected === true;
                },

                // Contents
                "empty": function( elem ) {
                    // http://www.w3.org/TR/selectors/#empty-pseudo
                    // :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
                    //   not comment, processing instructions, or others
                    // Thanks to Diego Perini for the nodeName shortcut
                    //   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
                    for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
                        if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
                            return false;
                        }
                    }
                    return true;
                },

                "parent": function( elem ) {
                    return !Expr.pseudos["empty"]( elem );
                },

                // Element/input types
                "header": function( elem ) {
                    return rheader.test( elem.nodeName );
                },

                "input": function( elem ) {
                    return rinputs.test( elem.nodeName );
                },

                "button": function( elem ) {
                    var name = elem.nodeName.toLowerCase();
                    return name === "input" && elem.type === "button" || name === "button";
                },

                "text": function( elem ) {
                    var attr;
                    // IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
                    // use getAttribute instead to test this case
                    return elem.nodeName.toLowerCase() === "input" &&
                        elem.type === "text" &&
                        ( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
                },

                // Position-in-collection
                "first": createPositionalPseudo(function() {
                    return [ 0 ];
                }),

                "last": createPositionalPseudo(function( matchIndexes, length ) {
                    return [ length - 1 ];
                }),

                "eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
                    return [ argument < 0 ? argument + length : argument ];
                }),

                "even": createPositionalPseudo(function( matchIndexes, length ) {
                    var i = 0;
                    for ( ; i < length; i += 2 ) {
                        matchIndexes.push( i );
                    }
                    return matchIndexes;
                }),

                "odd": createPositionalPseudo(function( matchIndexes, length ) {
                    var i = 1;
                    for ( ; i < length; i += 2 ) {
                        matchIndexes.push( i );
                    }
                    return matchIndexes;
                }),

                "lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
                    var i = argument < 0 ? argument + length : argument;
                    for ( ; --i >= 0; ) {
                        matchIndexes.push( i );
                    }
                    return matchIndexes;
                }),

                "gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
                    var i = argument < 0 ? argument + length : argument;
                    for ( ; ++i < length; ) {
                        matchIndexes.push( i );
                    }
                    return matchIndexes;
                })
            }
        };

// Add button/input type pseudos
        for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
            Expr.pseudos[ i ] = createInputPseudo( i );
        }
        for ( i in { submit: true, reset: true } ) {
            Expr.pseudos[ i ] = createButtonPseudo( i );
        }

        function tokenize( selector, parseOnly ) {
            var matched, match, tokens, type,
                soFar, groups, preFilters,
                cached = tokenCache[ selector + " " ];

            if ( cached ) {
                return parseOnly ? 0 : cached.slice( 0 );
            }

            soFar = selector;
            groups = [];
            preFilters = Expr.preFilter;

            while ( soFar ) {

                // Comma and first run
                if ( !matched || (match = rcomma.exec( soFar )) ) {
                    if ( match ) {
                        // Don't consume trailing commas as valid
                        soFar = soFar.slice( match[0].length ) || soFar;
                    }
                    groups.push( tokens = [] );
                }

                matched = false;

                // Combinators
                if ( (match = rcombinators.exec( soFar )) ) {
                    matched = match.shift();
                    tokens.push( {
                        value: matched,
                        // Cast descendant combinators to space
                        type: match[0].replace( rtrim, " " )
                    } );
                    soFar = soFar.slice( matched.length );
                }

                // Filters
                for ( type in Expr.filter ) {
                    if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
                        (match = preFilters[ type ]( match ))) ) {
                        matched = match.shift();
                        tokens.push( {
                            value: matched,
                            type: type,
                            matches: match
                        } );
                        soFar = soFar.slice( matched.length );
                    }
                }

                if ( !matched ) {
                    break;
                }
            }

            // Return the length of the invalid excess
            // if we're just parsing
            // Otherwise, throw an error or return tokens
            return parseOnly ?
                soFar.length :
                soFar ?
                    Sizzle.error( selector ) :
                    // Cache the tokens
                    tokenCache( selector, groups ).slice( 0 );
        }

        function toSelector( tokens ) {
            var i = 0,
                len = tokens.length,
                selector = "";
            for ( ; i < len; i++ ) {
                selector += tokens[i].value;
            }
            return selector;
        }

        function addCombinator( matcher, combinator, base ) {
            var dir = combinator.dir,
                checkNonElements = base && combinator.dir === "parentNode",
                doneName = done++;

            return combinator.first ?
                // Check against closest ancestor/preceding element
                function( elem, context, xml ) {
                    while ( (elem = elem[ dir ]) ) {
                        if ( elem.nodeType === 1 || checkNonElements ) {
                            return matcher( elem, context, xml );
                        }
                    }
                } :

                // Check against all ancestor/preceding elements
                function( elem, context, xml ) {
                    var data, cache, outerCache,
                        dirkey = dirruns + " " + doneName;

                    // We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
                    if ( xml ) {
                        while ( (elem = elem[ dir ]) ) {
                            if ( elem.nodeType === 1 || checkNonElements ) {
                                if ( matcher( elem, context, xml ) ) {
                                    return true;
                                }
                            }
                        }
                    } else {
                        while ( (elem = elem[ dir ]) ) {
                            if ( elem.nodeType === 1 || checkNonElements ) {
                                outerCache = elem[ expando ] || (elem[ expando ] = {});
                                if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
                                    if ( (data = cache[1]) === true || data === cachedruns ) {
                                        return data === true;
                                    }
                                } else {
                                    cache = outerCache[ dir ] = [ dirkey ];
                                    cache[1] = matcher( elem, context, xml ) || cachedruns;
                                    if ( cache[1] === true ) {
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                };
        }

        function elementMatcher( matchers ) {
            return matchers.length > 1 ?
                function( elem, context, xml ) {
                    var i = matchers.length;
                    while ( i-- ) {
                        if ( !matchers[i]( elem, context, xml ) ) {
                            return false;
                        }
                    }
                    return true;
                } :
                matchers[0];
        }

        function condense( unmatched, map, filter, context, xml ) {
            var elem,
                newUnmatched = [],
                i = 0,
                len = unmatched.length,
                mapped = map != null;

            for ( ; i < len; i++ ) {
                if ( (elem = unmatched[i]) ) {
                    if ( !filter || filter( elem, context, xml ) ) {
                        newUnmatched.push( elem );
                        if ( mapped ) {
                            map.push( i );
                        }
                    }
                }
            }

            return newUnmatched;
        }

        function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
            if ( postFilter && !postFilter[ expando ] ) {
                postFilter = setMatcher( postFilter );
            }
            if ( postFinder && !postFinder[ expando ] ) {
                postFinder = setMatcher( postFinder, postSelector );
            }
            return markFunction(function( seed, results, context, xml ) {
                var temp, i, elem,
                    preMap = [],
                    postMap = [],
                    preexisting = results.length,

                // Get initial elements from seed or context
                    elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

                // Prefilter to get matcher input, preserving a map for seed-results synchronization
                    matcherIn = preFilter && ( seed || !selector ) ?
                        condense( elems, preMap, preFilter, context, xml ) :
                        elems,

                    matcherOut = matcher ?
                        // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
                        postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

                            // ...intermediate processing is necessary
                            [] :

                            // ...otherwise use results directly
                            results :
                        matcherIn;

                // Find primary matches
                if ( matcher ) {
                    matcher( matcherIn, matcherOut, context, xml );
                }

                // Apply postFilter
                if ( postFilter ) {
                    temp = condense( matcherOut, postMap );
                    postFilter( temp, [], context, xml );

                    // Un-match failing elements by moving them back to matcherIn
                    i = temp.length;
                    while ( i-- ) {
                        if ( (elem = temp[i]) ) {
                            matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
                        }
                    }
                }

                if ( seed ) {
                    if ( postFinder || preFilter ) {
                        if ( postFinder ) {
                            // Get the final matcherOut by condensing this intermediate into postFinder contexts
                            temp = [];
                            i = matcherOut.length;
                            while ( i-- ) {
                                if ( (elem = matcherOut[i]) ) {
                                    // Restore matcherIn since elem is not yet a final match
                                    temp.push( (matcherIn[i] = elem) );
                                }
                            }
                            postFinder( null, (matcherOut = []), temp, xml );
                        }

                        // Move matched elements from seed to results to keep them synchronized
                        i = matcherOut.length;
                        while ( i-- ) {
                            if ( (elem = matcherOut[i]) &&
                                (temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

                                seed[temp] = !(results[temp] = elem);
                            }
                        }
                    }

                    // Add elements to results, through postFinder if defined
                } else {
                    matcherOut = condense(
                        matcherOut === results ?
                            matcherOut.splice( preexisting, matcherOut.length ) :
                            matcherOut
                    );
                    if ( postFinder ) {
                        postFinder( null, results, matcherOut, xml );
                    } else {
                        push.apply( results, matcherOut );
                    }
                }
            });
        }

        function matcherFromTokens( tokens ) {
            var checkContext, matcher, j,
                len = tokens.length,
                leadingRelative = Expr.relative[ tokens[0].type ],
                implicitRelative = leadingRelative || Expr.relative[" "],
                i = leadingRelative ? 1 : 0,

            // The foundational matcher ensures that elements are reachable from top-level context(s)
                matchContext = addCombinator( function( elem ) {
                    return elem === checkContext;
                }, implicitRelative, true ),
                matchAnyContext = addCombinator( function( elem ) {
                    return indexOf.call( checkContext, elem ) > -1;
                }, implicitRelative, true ),
                matchers = [ function( elem, context, xml ) {
                    return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
                        (checkContext = context).nodeType ?
                            matchContext( elem, context, xml ) :
                            matchAnyContext( elem, context, xml ) );
                } ];

            for ( ; i < len; i++ ) {
                if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
                    matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
                } else {
                    matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

                    // Return special upon seeing a positional matcher
                    if ( matcher[ expando ] ) {
                        // Find the next relative operator (if any) for proper handling
                        j = ++i;
                        for ( ; j < len; j++ ) {
                            if ( Expr.relative[ tokens[j].type ] ) {
                                break;
                            }
                        }
                        return setMatcher(
                            i > 1 && elementMatcher( matchers ),
                            i > 1 && toSelector( tokens.slice( 0, i - 1 ) ).replace( rtrim, "$1" ),
                            matcher,
                            i < j && matcherFromTokens( tokens.slice( i, j ) ),
                            j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
                            j < len && toSelector( tokens )
                        );
                    }
                    matchers.push( matcher );
                }
            }

            return elementMatcher( matchers );
        }

        function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
            // A counter to specify which element is currently being matched
            var matcherCachedRuns = 0,
                bySet = setMatchers.length > 0,
                byElement = elementMatchers.length > 0,
                superMatcher = function( seed, context, xml, results, expandContext ) {
                    var elem, j, matcher,
                        setMatched = [],
                        matchedCount = 0,
                        i = "0",
                        unmatched = seed && [],
                        outermost = expandContext != null,
                        contextBackup = outermostContext,
                    // We must always have either seed elements or context
                        elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
                    // Nested matchers should use non-integer dirruns
                        dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.E);

                    if ( outermost ) {
                        outermostContext = context !== document && context;
                        cachedruns = matcherCachedRuns;
                    }

                    // Add elements passing elementMatchers directly to results
                    for ( ; (elem = elems[i]) != null; i++ ) {
                        if ( byElement && elem ) {
                            for ( j = 0; (matcher = elementMatchers[j]); j++ ) {
                                if ( matcher( elem, context, xml ) ) {
                                    results.push( elem );
                                    break;
                                }
                            }
                            if ( outermost ) {
                                dirruns = dirrunsUnique;
                                cachedruns = ++matcherCachedRuns;
                            }
                        }

                        // Track unmatched elements for set filters
                        if ( bySet ) {
                            // They will have gone through all possible matchers
                            if ( (elem = !matcher && elem) ) {
                                matchedCount--;
                            }

                            // Lengthen the array for every element, matched or not
                            if ( seed ) {
                                unmatched.push( elem );
                            }
                        }
                    }

                    // Apply set filters to unmatched elements
                    // `i` starts as a string, so matchedCount would equal "00" if there are no elements
                    matchedCount += i;
                    if ( bySet && i !== matchedCount ) {
                        for ( j = 0; (matcher = setMatchers[j]); j++ ) {
                            matcher( unmatched, setMatched, context, xml );
                        }

                        if ( seed ) {
                            // Reintegrate element matches to eliminate the need for sorting
                            if ( matchedCount > 0 ) {
                                while ( i-- ) {
                                    if ( !(unmatched[i] || setMatched[i]) ) {
                                        setMatched[i] = pop.call( results );
                                    }
                                }
                            }

                            // Discard index placeholder values to get only actual matches
                            setMatched = condense( setMatched );
                        }

                        // Add matches to results
                        push.apply( results, setMatched );

                        // Seedless set matches succeeding multiple successful matchers stipulate sorting
                        if ( outermost && !seed && setMatched.length > 0 &&
                            ( matchedCount + setMatchers.length ) > 1 ) {

                            Sizzle.uniqueSort( results );
                        }
                    }

                    // Override manipulation of globals by nested matchers
                    if ( outermost ) {
                        dirruns = dirrunsUnique;
                        outermostContext = contextBackup;
                    }

                    return unmatched;
                };

            return bySet ?
                markFunction( superMatcher ) :
                superMatcher;
        }

        compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
            var i,
                setMatchers = [],
                elementMatchers = [],
                cached = compilerCache[ selector + " " ];

            if ( !cached ) {
                // Generate a function of recursive functions that can be used to check each element
                if ( !group ) {
                    group = tokenize( selector );
                }
                i = group.length;
                while ( i-- ) {
                    cached = matcherFromTokens( group[i] );
                    if ( cached[ expando ] ) {
                        setMatchers.push( cached );
                    } else {
                        elementMatchers.push( cached );
                    }
                }

                // Cache the compiled function
                cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
            }
            return cached;
        };

        function multipleContexts( selector, contexts, results ) {
            var i = 0,
                len = contexts.length;
            for ( ; i < len; i++ ) {
                Sizzle( selector, contexts[i], results );
            }
            return results;
        }

        function select( selector, context, results, seed ) {
            var i, tokens, token, type, find,
                match = tokenize( selector );

            if ( !seed ) {
                // Try to minimize operations if there is only one group
                if ( match.length === 1 ) {

                    // Take a shortcut and set the context if the root selector is an ID
                    tokens = match[0] = match[0].slice( 0 );
                    if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
                        context.nodeType === 9 && !documentIsXML &&
                        Expr.relative[ tokens[1].type ] ) {

                        context = Expr.find["ID"]( token.matches[0].replace( runescape, funescape ), context )[0];
                        if ( !context ) {
                            return results;
                        }

                        selector = selector.slice( tokens.shift().value.length );
                    }

                    // Fetch a seed set for right-to-left matching
                    for ( i = matchExpr["needsContext"].test( selector ) ? -1 : tokens.length - 1; i >= 0; i-- ) {
                        token = tokens[i];

                        // Abort if we hit a combinator
                        if ( Expr.relative[ (type = token.type) ] ) {
                            break;
                        }
                        if ( (find = Expr.find[ type ]) ) {
                            // Search, expanding context for leading sibling combinators
                            if ( (seed = find(
                                token.matches[0].replace( runescape, funescape ),
                                rsibling.test( tokens[0].type ) && context.parentNode || context
                            )) ) {

                                // If seed is empty or no tokens remain, we can return early
                                tokens.splice( i, 1 );
                                selector = seed.length && toSelector( tokens );
                                if ( !selector ) {
                                    push.apply( results, slice.call( seed, 0 ) );
                                    return results;
                                }

                                break;
                            }
                        }
                    }
                }
            }

            // Compile and execute a filtering function
            // Provide `match` to avoid retokenization if we modified the selector above
            compile( selector, match )(
                seed,
                context,
                documentIsXML,
                results,
                rsibling.test( selector )
            );
            return results;
        }

// Deprecated
        Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Easy API for creating new setFilters
        function setFilters() {}
        Expr.filters = setFilters.prototype = Expr.pseudos;
        Expr.setFilters = new setFilters();

// Initialize with the default document
        setDocument();

// Override sizzle attribute retrieval
        Sizzle.attr = jQuery.attr;
        jQuery.find = Sizzle;
        jQuery.expr = Sizzle.selectors;
        jQuery.expr[":"] = jQuery.expr.pseudos;
        jQuery.unique = Sizzle.uniqueSort;
        jQuery.text = Sizzle.getText;
        jQuery.isXMLDoc = Sizzle.isXML;
        jQuery.contains = Sizzle.contains;


    })( window );
    var runtil = /Until$/,
        rparentsprev = /^(?:parents|prev(?:Until|All))/,
        isSimple = /^.[^:#\[\.,]*$/,
        rneedsContext = jQuery.expr.match.needsContext,
    // methods guaranteed to produce a unique set when starting from a unique set
        guaranteedUnique = {
            children: true,
            contents: true,
            next: true,
            prev: true
        };

    jQuery.fn.extend({
        find: function( selector ) {
            var self, matched, i,
                l = this.length;

            if ( typeof selector !== "string" ) {
                self = this;
                return this.pushStack( jQuery( selector ).filter(function() {
                    for ( i = 0; i < l; i++ ) {
                        if ( jQuery.contains( self[ i ], this ) ) {
                            return true;
                        }
                    }
                }) );
            }

            matched = [];
            for ( i = 0; i < l; i++ ) {
                jQuery.find( selector, this[ i ], matched );
            }

            // Needed because $( selector, context ) becomes $( context ).find( selector )
            matched = this.pushStack( jQuery.unique( matched ) );
            matched.selector = ( this.selector ? this.selector + " " : "" ) + selector;
            return matched;
        },

        has: function( target ) {
            var targets = jQuery( target, this ),
                l = targets.length;

            return this.filter(function() {
                var i = 0;
                for ( ; i < l; i++ ) {
                    if ( jQuery.contains( this, targets[i] ) ) {
                        return true;
                    }
                }
            });
        },

        not: function( selector ) {
            return this.pushStack( winnow(this, selector, false) );
        },

        filter: function( selector ) {
            return this.pushStack( winnow(this, selector, true) );
        },

        is: function( selector ) {
            return !!selector && (
                typeof selector === "string" ?
                    // If this is a positional/relative selector, check membership in the returned set
                    // so $("p:first").is("p:last") won't return true for a doc with two "p".
                    rneedsContext.test( selector ) ?
                        jQuery( selector, this.context ).index( this[ 0 ] ) >= 0 :
                        jQuery.filter( selector, this ).length > 0 :
                    this.filter( selector ).length > 0 );
        },

        closest: function( selectors, context ) {
            var cur,
                i = 0,
                l = this.length,
                matched = [],
                pos = ( rneedsContext.test( selectors ) || typeof selectors !== "string" ) ?
                    jQuery( selectors, context || this.context ) :
                    0;

            for ( ; i < l; i++ ) {
                cur = this[ i ];

                while ( cur && cur.ownerDocument && cur !== context ) {
                    if ( pos ? pos.index( cur ) > -1 : jQuery.find.matchesSelector( cur, selectors ) ) {
                        matched.push( cur );
                        break;
                    }
                    cur = cur.parentElement;
                }
            }

            return this.pushStack( matched.length > 1 ? jQuery.unique( matched ) : matched );
        },

        // Determine the position of an element within
        // the matched set of elements
        index: function( elem ) {

            // No argument, return index in parent
            if ( !elem ) {
                return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
            }

            // index in selector
            if ( typeof elem === "string" ) {
                return core_indexOf.call( jQuery( elem ), this[ 0 ] );
            }

            // Locate the position of the desired element
            return core_indexOf.call( this,

                // If it receives a jQuery object, the first element is used
                elem.jquery ? elem[ 0 ] : elem
            );
        },

        add: function( selector, context ) {
            var set = typeof selector === "string" ?
                    jQuery( selector, context ) :
                    jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
                all = jQuery.merge( this.get(), set );

            return this.pushStack( jQuery.unique(all) );
        },

        addBack: function( selector ) {
            return this.add( selector == null ?
                this.prevObject : this.prevObject.filter(selector)
            );
        }
    });

    jQuery.fn.andSelf = jQuery.fn.addBack;

    jQuery.each({
        parent: function( elem ) {
            return elem.parentElement;
        },
        parents: function( elem ) {
            return jQuery.dir( elem, "parentElement" );
        },
        parentsUntil: function( elem, i, until ) {
            return jQuery.dir( elem, "parentElement", until );
        },
        next: function( elem ) {
            return elem.nextElementSibling;
        },
        prev: function( elem ) {
            return elem.previousElementSibling;
        },
        nextAll: function( elem ) {
            return jQuery.dir( elem, "nextElementSibling" );
        },
        prevAll: function( elem ) {
            return jQuery.dir( elem, "previousElementSibling" );
        },
        nextUntil: function( elem, i, until ) {
            return jQuery.dir( elem, "nextElementSibling", until );
        },
        prevUntil: function( elem, i, until ) {
            return jQuery.dir( elem, "previousElementSibling", until );
        },
        siblings: function( elem ) {
            return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
        },
        children: function( elem ) {
            var children = elem.children;

            // documentFragment or document does not have children property
            return children ? jQuery.merge( [], children ) : jQuery.sibling( elem.firstChild );
        },
        contents: function( elem ) {
            return jQuery.nodeName( elem, "iframe" ) ?
                elem.contentDocument || elem.contentWindow.document :
                jQuery.merge( [], elem.childNodes );
        }
    }, function( name, fn ) {
        jQuery.fn[ name ] = function( until, selector ) {
            var matched = jQuery.map( this, fn, until );

            if ( !runtil.test( name ) ) {
                selector = until;
            }

            if ( selector && typeof selector === "string" ) {
                matched = jQuery.filter( selector, matched );
            }

            if ( this.length > 1 ) {
                if ( !guaranteedUnique[ name ] ) {
                    jQuery.unique( matched );
                }

                if ( rparentsprev.test( name ) ) {
                    matched.reverse();
                }
            }

            return this.pushStack( matched );
        };
    });

    jQuery.extend({
        filter: function( expr, elems, not ) {
            if ( not ) {
                expr = ":not(" + expr + ")";
            }

            return elems.length === 1 ?
                jQuery.find.matchesSelector( elems[ 0 ], expr ) ? [ elems[ 0 ] ] : [] :
                jQuery.find.matches( expr, elems );
        },

        dir: function( elem, dir, until ) {
            var cur = elem[ dir ],
                matched = [];

            while ( cur && ( !until || !jQuery( cur ).is( until ) ) ) {
                matched.push( cur );
                cur = cur[ dir ];
            }

            return matched;
        },

        sibling: function( n, elem ) {
            var matched = [];

            for ( ; n; n = n.nextSibling ) {
                if ( n.nodeType === 1 && n !== elem ) {
                    matched.push( n );
                }
            }

            return matched;
        }
    });

// Implement the identical functionality for filter and not
    function winnow( elements, qualifier, keep ) {

        // Can't pass null or undefined to indexOf in Firefox 4
        // Set to 0 to skip string check
        qualifier = qualifier || 0;

        var filtered;

        if ( jQuery.isFunction( qualifier ) ) {
            return jQuery.grep(elements, function( elem, i ) {
                var retVal = !!qualifier.call( elem, i, elem );
                return retVal === keep;
            });
        }

        if ( qualifier.nodeType ) {
            return jQuery.grep(elements, function( elem ) {
                return ( elem === qualifier ) === keep;
            });
        }

        if ( typeof qualifier === "string" ) {
            filtered = jQuery.grep(elements, function( elem ) {
                return elem.nodeType === 1;
            });

            if ( isSimple.test( qualifier ) ) {
                return jQuery.filter( qualifier, filtered, !keep );
            }

            qualifier = jQuery.filter( qualifier, filtered );
        }

        return jQuery.grep(elements, function( elem ) {
            return ( core_indexOf.call( qualifier, elem ) >= 0 ) === keep;
        });
    }
    var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        rtagName = /<([\w:]+)/,
        rhtml = /<|&#?\w+;/,
        rnoInnerhtml = /<(?:script|style|link)/i,
        manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
    // checked="checked" or checked
        rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
        rscriptType = /^$|\/(?:java|ecma)script/i,
        rscriptTypeMasked = /^true\/(.*)/,
        rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

    // We have to close these tags to support XHTML (#13200)
        wrapMap = {

            // Support: IE 9
            option: [ 1, "<select multiple='multiple'>", "</select>" ],

            tr: [ 1, "<table>", "</table>" ],
            td: [ 3, "<table><tr>", "</tr></table>" ],
            _default: [ 0, "", "" ]
        };

// Support: IE 9
    wrapMap.optgroup = wrapMap.option;

    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead = wrapMap.col = wrapMap.tr;
    wrapMap.th = wrapMap.td;

    jQuery.fn.extend({
        text: function( value ) {
            return jQuery.access( this, function( value ) {
                return value === undefined ?
                    jQuery.text( this ) :
                    this.empty().append( ( this[ 0 ] && this[ 0 ].ownerDocument || document ).createTextNode( value ) );
            }, null, value, arguments.length );
        },

        wrapAll: function( html ) {
            var wrap;

            if ( jQuery.isFunction( html ) ) {
                return this.each(function( i ) {
                    jQuery( this ).wrapAll( html.call(this, i) );
                });
            }

            if ( this[ 0 ] ) {

                // The elements to wrap the target around
                wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

                if ( this[ 0 ].parentNode ) {
                    wrap.insertBefore( this[ 0 ] );
                }

                wrap.map(function() {
                    var elem = this;

                    while ( elem.firstElementChild ) {
                        elem = elem.firstElementChild;
                    }

                    return elem;
                }).append( this );
            }

            return this;
        },

        wrapInner: function( html ) {
            if ( jQuery.isFunction( html ) ) {
                return this.each(function( i ) {
                    jQuery( this ).wrapInner( html.call(this, i) );
                });
            }

            return this.each(function() {
                var self = jQuery( this ),
                    contents = self.contents();

                if ( contents.length ) {
                    contents.wrapAll( html );

                } else {
                    self.append( html );
                }
            });
        },

        wrap: function( html ) {
            var isFunction = jQuery.isFunction( html );

            return this.each(function( i ) {
                jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
            });
        },

        unwrap: function() {
            return this.parent().each(function() {
                if ( !jQuery.nodeName( this, "body" ) ) {
                    jQuery( this ).replaceWith( this.childNodes );
                }
            }).end();
        },

        append: function() {
            return this.domManip(arguments, true, function( elem ) {
                if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
                    this.appendChild( elem );
                }
            });
        },

        prepend: function() {
            return this.domManip(arguments, true, function( elem ) {
                if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
                    this.insertBefore( elem, this.firstChild );
                }
            });
        },

        before: function() {
            return this.domManip(arguments, false, function( elem ) {
                if ( this.parentNode ) {
                    this.parentNode.insertBefore( elem, this );
                }
            });
        },

        after: function() {
            return this.domManip(arguments, false, function( elem ) {
                if ( this.parentNode ) {
                    this.parentNode.insertBefore( elem, this.nextSibling );
                }
            });
        },

        // keepData is for internal use only--do not document
        remove: function( selector, keepData ) {
            var elem,
                i = 0,
                l = this.length;

            for ( ; i < l; i++ ) {
                elem = this[ i ];

                if ( !selector || jQuery.filter( selector, [ elem ] ).length > 0 ) {
                    if ( !keepData && elem.nodeType === 1 ) {
                        jQuery.cleanData( getAll( elem ) );
                    }

                    if ( elem.parentNode ) {
                        if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
                            setGlobalEval( getAll( elem, "script" ) );
                        }
                        elem.parentNode.removeChild( elem );
                    }
                }
            }

            return this;
        },

        empty: function() {
            var elem,
                i = 0,
                l = this.length;

            for ( ; i < l; i++ ) {
                elem = this[ i ];

                if ( elem.nodeType === 1 ) {

                    // Prevent memory leaks
                    jQuery.cleanData( getAll( elem, false ) );

                    // Remove any remaining nodes
                    elem.textContent = "";
                }
            }

            return this;
        },

        clone: function( dataAndEvents, deepDataAndEvents ) {
            dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
            deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

            return this.map( function () {
                return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
            });
        },

        html: function( value ) {
            return jQuery.access( this, function( value ) {
                var elem = this[ 0 ] || {},
                    i = 0,
                    l = this.length;

                if ( value === undefined && elem.nodeType === 1 ) {
                    return elem.innerHTML;
                }

                // See if we can take a shortcut and just use innerHTML
                if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
                    !wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

                    value = value.replace( rxhtmlTag, "<$1></$2>" );

                    try {
                        for ( ; i < l; i++ ) {
                            elem = this[ i ] || {};

                            // Remove element nodes and prevent memory leaks
                            if ( elem.nodeType === 1 ) {
                                jQuery.cleanData( getAll( elem, false ) );
                                elem.innerHTML = value;
                            }
                        }

                        elem = 0;

                        // If using innerHTML throws an exception, use the fallback method
                    } catch( e ) {}
                }

                if ( elem ) {
                    this.empty().append( value );
                }
            }, null, value, arguments.length );
        },

        replaceWith: function( value ) {
            var isFunction = jQuery.isFunction( value );

            // Make sure that the elements are removed from the DOM before they are inserted
            // this can help fix replacing a parent with child elements
            if ( !isFunction && typeof value !== "string" ) {
                value = jQuery( value ).not( this ).detach();
            }

            return this.domManip( [ value ], true, function( elem ) {
                var next = this.nextSibling,
                    parent = this.parentNode;

                if ( parent && this.nodeType === 1 || this.nodeType === 11 ) {

                    jQuery( this ).remove();

                    if ( next ) {
                        next.parentNode.insertBefore( elem, next );
                    } else {
                        parent.appendChild( elem );
                    }
                }
            });
        },

        detach: function( selector ) {
            return this.remove( selector, true );
        },

        domManip: function( args, table, callback ) {

            // Flatten any nested arrays
            args = core_concat.apply( [], args );

            var fragment, first, scripts, hasScripts, node, doc,
                i = 0,
                l = this.length,
                set = this,
                iNoClone = l - 1,
                value = args[ 0 ],
                isFunction = jQuery.isFunction( value );

            // We can't cloneNode fragments that contain checked, in WebKit
            if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
                return this.each(function( index ) {
                    var self = set.eq( index );
                    if ( isFunction ) {
                        args[ 0 ] = value.call( this, index, table ? self.html() : undefined );
                    }
                    self.domManip( args, table, callback );
                });
            }

            if ( l ) {
                fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
                first = fragment.firstChild;

                if ( fragment.childNodes.length === 1 ) {
                    fragment = first;
                }

                if ( first ) {
                    table = table && jQuery.nodeName( first, "tr" );
                    scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
                    hasScripts = scripts.length;

                    // Use the original fragment for the last item instead of the first because it can end up
                    // being emptied incorrectly in certain situations (#8070).
                    for ( ; i < l; i++ ) {
                        node = fragment;

                        if ( i !== iNoClone ) {
                            node = jQuery.clone( node, true, true );

                            // Keep references to cloned scripts for later restoration
                            if ( hasScripts ) {
                                core_push.apply( scripts, getAll( node, "script" ) );
                            }
                        }

                        callback.call(
                            table && jQuery.nodeName( this[ i ], "table" ) ?
                                findOrAppend( this[ i ], "tbody" ) :
                                this[ i ],
                            node,
                            i
                        );
                    }

                    if ( hasScripts ) {
                        doc = scripts[ scripts.length - 1 ].ownerDocument;

                        // Reenable scripts
                        jQuery.map( scripts, restoreScript );

                        // Evaluate executable scripts on first document insertion
                        for ( i = 0; i < hasScripts; i++ ) {
                            node = scripts[ i ];
                            if ( rscriptType.test( node.type || "" ) &&
                                !jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

                                if ( node.src ) {
                                    // Hope ajax is available...
                                    jQuery.ajax({
                                        url: node.src,
                                        type: "GET",
                                        dataType: "script",
                                        async: false,
                                        global: false,
                                        "throws": true
                                    });
                                } else {
                                    jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
                                }
                            }
                        }
                    }
                }
            }

            return this;
        }
    });

    jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function( name, original ) {
        jQuery.fn[ name ] = function( selector ) {
            var elems,
                ret = [],
                insert = jQuery( selector ),
                last = insert.length - 1,
                i = 0;

            for ( ; i <= last; i++ ) {
                elems = i === last ? this : this.clone( true );
                jQuery( insert[ i ] )[ original ]( elems );

                core_push.apply( ret, elems );
            }

            return this.pushStack( ret );
        };
    });

    jQuery.extend({
        clone: function( elem, dataAndEvents, deepDataAndEvents ) {
            var i, l, srcElements, destElements,
                clone = elem.cloneNode( true ),
                inPage = jQuery.contains( elem.ownerDocument, elem );

            // Support: IE >=9
            // Fix Cloning issues
            if ( !jQuery.support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) && !jQuery.isXMLDoc( elem ) ) {

                // We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
                destElements = getAll( clone );
                srcElements = getAll( elem );

                for ( i = 0, l = srcElements.length; i < l; i++ ) {
                    fixInput( srcElements[ i ], destElements[ i ] );
                }
            }

            // Copy the events from the original to the clone
            if ( dataAndEvents ) {
                if ( deepDataAndEvents ) {
                    srcElements = srcElements || getAll( elem );
                    destElements = destElements || getAll( clone );

                    for ( i = 0, l = srcElements.length; i < l; i++ ) {
                        cloneCopyEvent( srcElements[ i ], destElements[ i ] );
                    }
                } else {
                    cloneCopyEvent( elem, clone );
                }
            }

            // Preserve script evaluation history
            destElements = getAll( clone, "script" );
            if ( destElements.length > 0 ) {
                setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
            }

            // Return the cloned set
            return clone;
        },

        buildFragment: function( elems, context, scripts, selection ) {
            var elem, tmp, tag, wrap, contains, j,
                i = 0,
                l = elems.length,
                fragment = context.createDocumentFragment(),
                nodes = [];

            for ( ; i < l; i++ ) {
                elem = elems[ i ];

                if ( elem || elem === 0 ) {

                    // Add nodes directly
                    if ( jQuery.type( elem ) === "object" ) {
                        core_push.apply( nodes, elem.nodeType ? [ elem ] : elem );

                        // Convert non-html into a text node
                    } else if ( !rhtml.test( elem ) ) {
                        nodes.push( context.createTextNode( elem ) );

                        // Convert html into DOM nodes
                    } else {
                        tmp = tmp || fragment.appendChild( context.createElement("div") );

                        // Deserialize a standard representation
                        tag = ( rtagName.exec( elem ) || ["", ""] )[ 1 ].toLowerCase();
                        wrap = wrapMap[ tag ] || wrapMap._default;
                        tmp.innerHTML = wrap[ 1 ] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[ 2 ];

                        // Descend through wrappers to the right content
                        j = wrap[ 0 ];
                        while ( j-- ) {
                            tmp = tmp.firstChild;
                        }

                        core_push.apply( nodes, tmp.childNodes );

                        // Remember the top-level container
                        tmp = fragment.firstChild;

                        // Fixes #12346
                        // Support: Webkit, IE
                        tmp.textContent = "";
                    }
                }
            }

            // Remove wrapper from fragment
            fragment.textContent = "";

            i = 0;
            while ( (elem = nodes[ i++ ]) ) {

                // #4087 - If origin and destination elements are the same, and this is
                // that element, do not do anything
                if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
                    continue;
                }

                contains = jQuery.contains( elem.ownerDocument, elem );

                // Append to fragment
                tmp = getAll( fragment.appendChild( elem ), "script" );

                // Preserve script evaluation history
                if ( contains ) {
                    setGlobalEval( tmp );
                }

                // Capture executables
                if ( scripts ) {
                    j = 0;
                    while ( (elem = tmp[ j++ ]) ) {
                        if ( rscriptType.test( elem.type || "" ) ) {
                            scripts.push( elem );
                        }
                    }
                }
            }

            return fragment;
        },

        cleanData: function( elems, /* internal */ acceptData ) {
            var id, data, elem, type,
                l = elems.length,
                i = 0,
                internalKey = jQuery.expando,
                cache = jQuery.cache,
                special = jQuery.event.special;

            for ( ; i < l; i++ ) {
                elem = elems[ i ];

                if ( acceptData || jQuery.acceptData( elem ) ) {

                    id = elem[ internalKey ];
                    data = id && cache[ id ];

                    if ( data ) {
                        for ( type in data.events ) {
                            if ( special[ type ] ) {
                                jQuery.event.remove( elem, type );

                                // This is a shortcut to avoid jQuery.event.remove's overhead
                            } else {
                                jQuery.removeEvent( elem, type, data.handle );
                            }
                        }

                        // Remove cache only if it was not already removed by jQuery.event.remove
                        if ( cache[ id ] ) {
                            delete cache[ id ];
                            delete elem[ internalKey ];
                        }
                    }
                }
            }
        }
    });

    function findOrAppend( elem, tag ) {
        return elem.getElementsByTagName( tag )[ 0 ] || elem.appendChild( elem.ownerDocument.createElement(tag) );
    }

// Replace/restore the type attribute of script elements for safe DOM manipulation
    function disableScript( elem ) {
        var attr = elem.getAttributeNode("type");
        elem.type = ( attr && attr.specified ) + "/" + elem.type;
        return elem;
    }
    function restoreScript( elem ) {
        var match = rscriptTypeMasked.exec( elem.type );

        if ( match ) {
            elem.type = match[ 1 ];

        } else {
            elem.removeAttribute("type");
        }

        return elem;
    }

// Mark scripts as having already been evaluated
    function setGlobalEval( elems, refElements ) {
        var l = elems.length,
            i = 0;

        for ( ; i < l; i++ ) {
            jQuery._data( elems[ i ], "globalEval", !refElements || jQuery._data( refElements[ i ], "globalEval" ) );
        }
    }

    function cloneCopyEvent( src, dest ) {

        if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
            return;
        }

        var i, l, type,
            oldData = jQuery._data( src ),
            curData = jQuery._data( dest, oldData ),
            events = oldData.events;

        if ( events ) {
            delete curData.handle;
            curData.events = {};

            for ( type in events ) {
                for ( i = 0, l = events[ type ].length; i < l; i++ ) {
                    jQuery.event.add( dest, type, events[ type ][ i ] );
                }
            }
        }

        // make the cloned public data object a copy from the original
        if ( curData.data ) {
            curData.data = jQuery.extend( {}, curData.data );
        }
    }

    function getAll( context, tag ) {
        var ret = context.getElementsByTagName ? context.getElementsByTagName( tag || "*" ) :
            context.querySelectorAll ? context.querySelectorAll( tag || "*" ) :
                [];

        return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
            jQuery.merge( [ context ], ret ) :
            ret;
    }

// Support: IE >= 9
    function fixInput( src, dest ) {
        var nodeName = dest.nodeName.toLowerCase();

        // Fails to persist the checked state of a cloned checkbox or radio button.
        if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
            dest.checked = src.checked;

            // Fails to return the selected option to the default selected state when cloning options
        } else if ( nodeName === "input" || nodeName === "textarea" ) {
            dest.defaultValue = src.defaultValue;
        }
    }
    var curCSS, iframe,
    // swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
    // see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
        rdisplayswap = /^(none|table(?!-c[ea]).+)/,
        rmargin = /^margin/,
        rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
        rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
        rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
        elemdisplay = { BODY: "block" },

        cssShow = { position: "absolute", visibility: "hidden", display: "block" },
        cssNormalTransform = {
            letterSpacing: 0,
            fontWeight: 400
        },

        cssExpand = [ "Top", "Right", "Bottom", "Left" ],
        cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
    function vendorPropName( style, name ) {

        // shortcut for names that are not vendor prefixed
        if ( name in style ) {
            return name;
        }

        // check for vendor prefixed names
        var capName = name.charAt(0).toUpperCase() + name.slice(1),
            origName = name,
            i = cssPrefixes.length;

        while ( i-- ) {
            name = cssPrefixes[ i ] + capName;
            if ( name in style ) {
                return name;
            }
        }

        return origName;
    }

    function isHidden( elem, el ) {
        // isHidden might be called from jQuery#filter function;
        // in that case, element will be second argument
        elem = el || elem;
        return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
    }

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
    function getStyles( elem ) {
        return window.getComputedStyle( elem, null );
    }

    function showHide( elements, show ) {
        var elem,
            values = [],
            index = 0,
            length = elements.length;

        for ( ; index < length; index++ ) {
            elem = elements[ index ];
            if ( !elem.style ) {
                continue;
            }
            values[ index ] = jQuery._data( elem, "olddisplay" );
            if ( show ) {
                // Reset the inline display of this element to learn if it is
                // being hidden by cascaded rules or not
                if ( !values[ index ] && elem.style.display === "none" ) {
                    elem.style.display = "";
                }

                // Set elements which have been overridden with display: none
                // in a stylesheet to whatever the default browser style is
                // for such an element
                if ( elem.style.display === "" && isHidden( elem ) ) {
                    values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
                }
            } else if ( !values[ index ] && !isHidden( elem ) ) {
                jQuery._data( elem, "olddisplay", jQuery.css( elem, "display" ) );
            }
        }

        // Set the display of most of the elements in a second loop
        // to avoid the constant reflow
        for ( index = 0; index < length; index++ ) {
            elem = elements[ index ];
            if ( !elem.style ) {
                continue;
            }
            if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
                elem.style.display = show ? values[ index ] || "" : "none";
            }
        }

        return elements;
    }

    jQuery.fn.extend({
        css: function( name, value ) {
            return jQuery.access( this, function( elem, name, value ) {
                var styles, len,
                    map = {},
                    i = 0;

                if ( jQuery.isArray( name ) ) {
                    styles = getStyles( elem );
                    len = name.length;

                    for ( ; i < len; i++ ) {
                        map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
                    }

                    return map;
                }

                return value !== undefined ?
                    jQuery.style( elem, name, value ) :
                    jQuery.css( elem, name );
            }, name, value, arguments.length > 1 );
        },
        show: function() {
            return showHide( this, true );
        },
        hide: function() {
            return showHide( this );
        },
        toggle: function( state ) {
            var bool = typeof state === "boolean";

            return this.each(function() {
                if ( bool ? state : isHidden( this ) ) {
                    jQuery( this ).show();
                } else {
                    jQuery( this ).hide();
                }
            });
        }
    });

    jQuery.extend({
        // Add in style property hooks for overriding the default
        // behavior of getting and setting a style property
        cssHooks: {
            opacity: {
                get: function( elem, computed ) {
                    if ( computed ) {
                        // We should always get a number back from opacity
                        var ret = curCSS( elem, "opacity" );
                        return ret === "" ? "1" : ret;
                    }
                }
            }
        },

        // Exclude the following css properties to add px
        cssNumber: {
            "columnCount": true,
            "fillOpacity": true,
            "fontWeight": true,
            "lineHeight": true,
            "opacity": true,
            "orphans": true,
            "widows": true,
            "zIndex": true,
            "zoom": true
        },

        // Add in properties whose names you wish to fix before
        // setting or getting the value
        cssProps: {
            // normalize float css property
            "float": "cssFloat"
        },

        // Get and set the style property on a DOM Node
        style: function( elem, name, value, extra ) {
            // Don't set styles on text and comment nodes
            if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
                return;
            }

            // Make sure that we're working with the right name
            var ret, type, hooks,
                origName = jQuery.camelCase( name ),
                style = elem.style;

            name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

            // gets hook for the prefixed version
            // followed by the unprefixed version
            hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

            // Check if we're setting a value
            if ( value !== undefined ) {
                type = typeof value;

                // convert relative number strings (+= or -=) to relative numbers. #7345
                if ( type === "string" && (ret = rrelNum.exec( value )) ) {
                    value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
                    // Fixes bug #9237
                    type = "number";
                }

                // Make sure that NaN and null values aren't set. See: #7116
                if ( value == null || type === "number" && isNaN( value ) ) {
                    return;
                }

                // If a number was passed in, add 'px' to the (except for certain CSS properties)
                if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
                    value += "px";
                }

                // Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
                // but it would mean to define eight (for every problematic property) identical functions
                if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
                    style[ name ] = "inherit";
                }

                // If a hook was provided, use that value, otherwise just set the specified value
                if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
                    style[ name ] = value;
                }

            } else {
                // If a hook was provided get the non-computed value from there
                if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
                    return ret;
                }

                // Otherwise just get the value from the style object
                return style[ name ];
            }
        },

        css: function( elem, name, extra, styles ) {
            var val, num, hooks,
                origName = jQuery.camelCase( name );

            // Make sure that we're working with the right name
            name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

            // gets hook for the prefixed version
            // followed by the unprefixed version
            hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

            // If a hook was provided get the computed value from there
            if ( hooks && "get" in hooks ) {
                val = hooks.get( elem, true, extra );
            }

            // Otherwise, if a way to get the computed value exists, use that
            if ( val === undefined ) {
                val = curCSS( elem, name, styles );
            }

            //convert "normal" to computed value
            if ( val === "normal" && name in cssNormalTransform ) {
                val = cssNormalTransform[ name ];
            }

            // Return, converting to number if forced or a qualifier was provided and val looks numeric
            if ( extra ) {
                num = parseFloat( val );
                return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
            }
            return val;
        },

        // A method for quickly swapping in/out CSS properties to get correct calculations
        swap: function( elem, options, callback, args ) {
            var ret, name,
                old = {};

            // Remember the old values, and insert the new ones
            for ( name in options ) {
                old[ name ] = elem.style[ name ];
                elem.style[ name ] = options[ name ];
            }

            ret = callback.apply( elem, args || [] );

            // Revert the old values
            for ( name in options ) {
                elem.style[ name ] = old[ name ];
            }

            return ret;
        }
    });

    curCSS = function( elem, name, _computed ) {
        var width, minWidth, maxWidth,
            computed = _computed || getStyles( elem ),

        // Support: IE9
        // getPropertyValue is only needed for .css('filter') in IE9, see #12537
            ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
            style = elem.style;

        if ( computed ) {

            if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
                ret = jQuery.style( elem, name );
            }

            // Support: Chrome <17, Safari 5.1
            // A tribute to the "awesome hack by Dean Edwards"
            // Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
            // Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
            // this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
            if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

                // Remember the original values
                width = style.width;
                minWidth = style.minWidth;
                maxWidth = style.maxWidth;

                // Put in the new values to get a computed value out
                style.minWidth = style.maxWidth = style.width = ret;
                ret = computed.width;

                // Revert the changed values
                style.width = width;
                style.minWidth = minWidth;
                style.maxWidth = maxWidth;
            }
        }

        return ret;
    };


    function setPositiveNumber( elem, value, subtract ) {
        var matches = rnumsplit.exec( value );
        return matches ?
            // Guard against undefined "subtract", e.g., when used as in cssHooks
            Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
            value;
    }

    function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
        var i = extra === ( isBorderBox ? "border" : "content" ) ?
                // If we already have the right measurement, avoid augmentation
                4 :
                // Otherwise initialize for horizontal or vertical properties
                name === "width" ? 1 : 0,

            val = 0;

        for ( ; i < 4; i += 2 ) {
            // both box models exclude margin, so add it if we want it
            if ( extra === "margin" ) {
                val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
            }

            if ( isBorderBox ) {
                // border-box includes padding, so remove it if we want content
                if ( extra === "content" ) {
                    val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
                }

                // at this point, extra isn't border nor margin, so remove border
                if ( extra !== "margin" ) {
                    val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
                }
            } else {
                // at this point, extra isn't content, so add padding
                val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

                // at this point, extra isn't content nor padding, so add border
                if ( extra !== "padding" ) {
                    val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
                }
            }
        }

        return val;
    }

    function getWidthOrHeight( elem, name, extra ) {

        // Start with offset property, which is equivalent to the border-box value
        var valueIsBorderBox = true,
            val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
            styles = getStyles( elem ),
            isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

        // some non-html elements return undefined for offsetWidth, so check for null/undefined
        // svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
        // MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
        if ( val <= 0 || val == null ) {
            // Fall back to computed then uncomputed css if necessary
            val = curCSS( elem, name, styles );
            if ( val < 0 || val == null ) {
                val = elem.style[ name ];
            }

            // Computed unit is not pixels. Stop here and return.
            if ( rnumnonpx.test(val) ) {
                return val;
            }

            // we need the check for style in case a browser which returns unreliable values
            // for getComputedStyle silently falls back to the reliable elem.style
            valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

            // Normalize "", auto, and prepare for extra
            val = parseFloat( val ) || 0;
        }

        // use the active box-sizing model to add/subtract irrelevant styles
        return ( val +
            augmentWidthOrHeight(
                elem,
                name,
                extra || ( isBorderBox ? "border" : "content" ),
                valueIsBorderBox,
                styles
            )
            ) + "px";
    }

// Try to determine the default display value of an element
    function css_defaultDisplay( nodeName ) {
        var doc = document,
            display = elemdisplay[ nodeName ];

        if ( !display ) {
            display = actualDisplay( nodeName, doc );

            // If the simple way fails, read from inside an iframe
            if ( display === "none" || !display ) {
                // Use the already-created iframe if possible
                iframe = ( iframe ||
                    jQuery("<iframe frameborder='0' width='0' height='0'/>")
                        .css( "cssText", "display:block !important" )
                    ).appendTo( doc.documentElement );

                // Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
                doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
                doc.write("<!doctype html><html><body>");
                doc.close();

                display = actualDisplay( nodeName, doc );
                iframe.detach();
            }

            // Store the correct default display
            elemdisplay[ nodeName ] = display;
        }

        return display;
    }

// Called ONLY from within css_defaultDisplay
    function actualDisplay( name, doc ) {
        var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
            display = jQuery.css( elem[0], "display" );
        elem.remove();
        return display;
    }

    jQuery.each([ "height", "width" ], function( i, name ) {
        jQuery.cssHooks[ name ] = {
            get: function( elem, computed, extra ) {
                if ( computed ) {
                    // certain elements can have dimension info if we invisibly show them
                    // however, it must have a current display style that would benefit from this
                    return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
                        jQuery.swap( elem, cssShow, function() {
                            return getWidthOrHeight( elem, name, extra );
                        }) :
                        getWidthOrHeight( elem, name, extra );
                }
            },

            set: function( elem, value, extra ) {
                var styles = extra && getStyles( elem );
                return setPositiveNumber( elem, value, extra ?
                    augmentWidthOrHeight(
                        elem,
                        name,
                        extra,
                        jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
                        styles
                    ) : 0
                );
            }
        };
    });

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
    jQuery(function() {
        if ( !jQuery.support.reliableMarginRight ) {
            jQuery.cssHooks.marginRight = {
                get: function( elem, computed ) {
                    if ( computed ) {
                        // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
                        // Work around by temporarily setting element display to inline-block
                        return jQuery.swap( elem, { "display": "inline-block" },
                            curCSS, [ elem, "marginRight" ] );
                    }
                }
            };
        }

        // Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
        // getComputedStyle returns percent when specified for top/left/bottom/right
        // rather than make the css module depend on the offset module, we just check for it here
        if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
            jQuery.each( [ "top", "left" ], function( i, prop ) {
                jQuery.cssHooks[ prop ] = {
                    get: function( elem, computed ) {
                        if ( computed ) {
                            computed = curCSS( elem, prop );
                            // if curCSS returns percentage, fallback to offset
                            return rnumnonpx.test( computed ) ?
                                jQuery( elem ).position()[ prop ] + "px" :
                                computed;
                        }
                    }
                };
            });
        }

    });

    if ( jQuery.expr && jQuery.expr.filters ) {
        jQuery.expr.filters.hidden = function( elem ) {
            return elem.offsetWidth === 0 && elem.offsetHeight === 0;
        };

        jQuery.expr.filters.visible = function( elem ) {
            return !jQuery.expr.filters.hidden( elem );
        };
    }

// These hooks are used by animate to expand properties
    jQuery.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function( prefix, suffix ) {
        jQuery.cssHooks[ prefix + suffix ] = {
            expand: function( value ) {
                var i = 0,
                    expanded = {},

                // assumes a single number if not a string
                    parts = typeof value === "string" ? value.split(" ") : [ value ];

                for ( ; i < 4; i++ ) {
                    expanded[ prefix + cssExpand[ i ] + suffix ] =
                        parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
                }

                return expanded;
            }
        };

        if ( !rmargin.test( prefix ) ) {
            jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
        }
    });
    var r20 = /%20/g,
        rbracket = /\[\]$/,
        rCRLF = /\r?\n/g,
        rsubmitterTypes = /^(?:submit|button|image|reset)$/i,
        rsubmittable = /^(?:input|select|textarea|keygen)/i;

    jQuery.fn.extend({
        serialize: function() {
            return jQuery.param( this.serializeArray() );
        },
        serializeArray: function() {
            return this.map(function(){
                // Can add propHook for "elements" to filter or add form elements
                var elements = jQuery.prop( this, "elements" );
                return elements ? jQuery.makeArray( elements ) : this;
            })
                .filter(function(){
                    var type = this.type;
                    // Use .is(":disabled") so that fieldset[disabled] works
                    return this.name && !jQuery( this ).is( ":disabled" ) &&
                        rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
                        ( this.checked || !manipulation_rcheckableType.test( type ) );
                })
                .map(function( i, elem ){
                    var val = jQuery( this ).val();

                    return val == null ?
                        null :
                        jQuery.isArray( val ) ?
                            jQuery.map( val, function( val ){
                                return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
                            }) :
                        { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
                }).get();
        }
    });

//Serialize an array of form elements or a set of
//key/values into a query string
    jQuery.param = function( a, traditional ) {
        var prefix,
            s = [],
            add = function( key, value ) {
                // If value is a function, invoke it and return its value
                value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
                s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
            };

        // Set traditional to true for jQuery <= 1.3.2 behavior.
        if ( traditional === undefined ) {
            traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
        }

        // If an array was passed in, assume that it is an array of form elements.
        if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
            // Serialize the form elements
            jQuery.each( a, function() {
                add( this.name, this.value );
            });

        } else {
            // If traditional, encode the "old" way (the way 1.3.2 or older
            // did it), otherwise encode params recursively.
            for ( prefix in a ) {
                buildParams( prefix, a[ prefix ], traditional, add );
            }
        }

        // Return the resulting serialization
        return s.join( "&" ).replace( r20, "+" );
    };

    function buildParams( prefix, obj, traditional, add ) {
        var name;

        if ( jQuery.isArray( obj ) ) {
            // Serialize array item.
            jQuery.each( obj, function( i, v ) {
                if ( traditional || rbracket.test( prefix ) ) {
                    // Treat each array item as a scalar.
                    add( prefix, v );

                } else {
                    // Item is non-scalar (array or object), encode its numeric index.
                    buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
                }
            });

        } else if ( !traditional && jQuery.type( obj ) === "object" ) {
            // Serialize object item.
            for ( name in obj ) {
                buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
            }

        } else {
            // Serialize scalar item.
            add( prefix, obj );
        }
    }
    var
    // Document location
        ajaxLocParts,
        ajaxLocation,

        ajax_nonce = jQuery.now(),

        ajax_rquery = /\?/,
        rhash = /#.*$/,
        rts = /([?&])_=[^&]*/,
        rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
    // #7653, #8125, #8152: local protocol detection
        rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
        rnoContent = /^(?:GET|HEAD)$/,
        rprotocol = /^\/\//,
        rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

    // Keep a copy of the old load method
        _load = jQuery.fn.load,

    /* Prefilters
     * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
     * 2) These are called:
     *    - BEFORE asking for a transport
     *    - AFTER param serialization (s.data is a string if s.processData is true)
     * 3) key is the dataType
     * 4) the catchall symbol "*" can be used
     * 5) execution will start with transport dataType and THEN continue down to "*" if needed
     */
        prefilters = {},

    /* Transports bindings
     * 1) key is the dataType
     * 2) the catchall symbol "*" can be used
     * 3) selection will start with transport dataType and THEN go to "*" if needed
     */
        transports = {},

    // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
        allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
    try {
        ajaxLocation = location.href;
    } catch( e ) {
        // Use the href attribute of an A element
        // since IE will modify it given document.location
        ajaxLocation = document.createElement( "a" );
        ajaxLocation.href = "";
        ajaxLocation = ajaxLocation.href;
    }

// Segment location into parts
    ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
    function addToPrefiltersOrTransports( structure ) {

        // dataTypeExpression is optional and defaults to "*"
        return function( dataTypeExpression, func ) {

            if ( typeof dataTypeExpression !== "string" ) {
                func = dataTypeExpression;
                dataTypeExpression = "*";
            }

            var dataType,
                i = 0,
                dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

            if ( jQuery.isFunction( func ) ) {
                // For each dataType in the dataTypeExpression
                while ( (dataType = dataTypes[i++]) ) {
                    // Prepend if requested
                    if ( dataType[0] === "+" ) {
                        dataType = dataType.slice( 1 ) || "*";
                        (structure[ dataType ] = structure[ dataType ] || []).unshift( func );

                        // Otherwise append
                    } else {
                        (structure[ dataType ] = structure[ dataType ] || []).push( func );
                    }
                }
            }
        };
    }

// Base inspection function for prefilters and transports
    function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

        var inspected = {},
            seekingTransport = ( structure === transports );

        function inspect( dataType ) {
            var selected;
            inspected[ dataType ] = true;
            jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
                var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
                if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
                    options.dataTypes.unshift( dataTypeOrTransport );
                    inspect( dataTypeOrTransport );
                    return false;
                } else if ( seekingTransport ) {
                    return !( selected = dataTypeOrTransport );
                }
            });
            return selected;
        }

        return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
    }

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
    function ajaxExtend( target, src ) {
        var key, deep,
            flatOptions = jQuery.ajaxSettings.flatOptions || {};

        for ( key in src ) {
            if ( src[ key ] !== undefined ) {
                ( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
            }
        }
        if ( deep ) {
            jQuery.extend( true, target, deep );
        }

        return target;
    }

    jQuery.fn.load = function( url, params, callback ) {
        if ( typeof url !== "string" && _load ) {
            return _load.apply( this, arguments );
        }

        var selector, type, response,
            self = this,
            off = url.indexOf(" ");

        if ( off >= 0 ) {
            selector = url.slice( off, url.length );
            url = url.slice( 0, off );
        }

        // If it's a function
        if ( jQuery.isFunction( params ) ) {

            // We assume that it's the callback
            callback = params;
            params = undefined;

            // Otherwise, build a param string
        } else if ( params && typeof params === "object" ) {
            type = "POST";
        }

        // If we have elements to modify, make the request
        if ( self.length > 0 ) {
            jQuery.ajax({
                url: url,

                // if "type" variable is undefined, then "GET" method will be used
                type: type,
                dataType: "html",
                data: params
            }).done(function( responseText ) {

                    // Save response for use in complete callback
                    response = arguments;

                    self.html( selector ?

                        // If a selector was specified, locate the right elements in a dummy div
                        // Exclude scripts to avoid IE 'Permission Denied' errors
                        jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

                        // Otherwise use the full result
                        responseText );

                }).complete( callback && function( jqXHR, status ) {
                    self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
                });
        }

        return this;
    };

// Attach a bunch of functions for handling common AJAX events
    jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
        jQuery.fn[ type ] = function( fn ){
            return this.on( type, fn );
        };
    });

    jQuery.each( [ "get", "post" ], function( i, method ) {
        jQuery[ method ] = function( url, data, callback, type ) {
            // shift arguments if data argument was omitted
            if ( jQuery.isFunction( data ) ) {
                type = type || callback;
                callback = data;
                data = undefined;
            }

            return jQuery.ajax({
                url: url,
                type: method,
                dataType: type,
                data: data,
                success: callback
            });
        };
    });

    jQuery.extend({

        // Counter for holding the number of active queries
        active: 0,

        // Last-Modified header cache for next request
        lastModified: {},
        etag: {},

        ajaxSettings: {
            url: ajaxLocation,
            type: "GET",
            isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
            global: true,
            processData: true,
            async: true,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            /*
             timeout: 0,
             data: null,
             dataType: null,
             username: null,
             password: null,
             cache: null,
             throws: false,
             traditional: false,
             headers: {},
             */

            accepts: {
                "*": allTypes,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },

            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },

            responseFields: {
                xml: "responseXML",
                text: "responseText"
            },

            // Data converters
            // Keys separate source (or catchall "*") and destination types with a single space
            converters: {

                // Convert anything to text
                "* text": window.String,

                // Text to html (true = no transformation)
                "text html": true,

                // Evaluate text as a json expression
                "text json": jQuery.parseJSON,

                // Parse text as xml
                "text xml": jQuery.parseXML
            },

            // For options that shouldn't be deep extended:
            // you can add your own custom options here if
            // and when you create one that shouldn't be
            // deep extended (see ajaxExtend)
            flatOptions: {
                url: true,
                context: true
            }
        },

        // Creates a full fledged settings object into target
        // with both ajaxSettings and settings fields.
        // If target is omitted, writes into ajaxSettings.
        ajaxSetup: function( target, settings ) {
            return settings ?

                // Building a settings object
                ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

                // Extending ajaxSettings
                ajaxExtend( jQuery.ajaxSettings, target );
        },

        ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
        ajaxTransport: addToPrefiltersOrTransports( transports ),

        // Main method
        ajax: function( url, options ) {

            // If url is an object, simulate pre-1.5 signature
            if ( typeof url === "object" ) {
                options = url;
                url = undefined;
            }

            // Force options to be an object
            options = options || {};

            var transport,
            // URL without anti-cache param
                cacheURL,
            // Response headers
                responseHeadersString,
                responseHeaders,
            // timeout handle
                timeoutTimer,
            // Cross-domain detection vars
                parts,
            // To know if global events are to be dispatched
                fireGlobals,
            // Loop variable
                i,
            // Create the final options object
                s = jQuery.ajaxSetup( {}, options ),
            // Callbacks context
                callbackContext = s.context || s,
            // Context for global events is callbackContext if it is a DOM node or jQuery collection
                globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
                    jQuery( callbackContext ) :
                    jQuery.event,
            // Deferreds
                deferred = jQuery.Deferred(),
                completeDeferred = jQuery.Callbacks("once memory"),
            // Status-dependent callbacks
                statusCode = s.statusCode || {},
            // Headers (they are sent all at once)
                requestHeaders = {},
                requestHeadersNames = {},
            // The jqXHR state
                state = 0,
            // Default abort message
                strAbort = "canceled",
            // Fake xhr
                jqXHR = {
                    readyState: 0,

                    // Builds headers hashtable if needed
                    getResponseHeader: function( key ) {
                        var match;
                        if ( state === 2 ) {
                            if ( !responseHeaders ) {
                                responseHeaders = {};
                                while ( (match = rheaders.exec( responseHeadersString )) ) {
                                    responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
                                }
                            }
                            match = responseHeaders[ key.toLowerCase() ];
                        }
                        return match == null ? null : match;
                    },

                    // Raw string
                    getAllResponseHeaders: function() {
                        return state === 2 ? responseHeadersString : null;
                    },

                    // Caches the header
                    setRequestHeader: function( name, value ) {
                        var lname = name.toLowerCase();
                        if ( !state ) {
                            name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
                            requestHeaders[ name ] = value;
                        }
                        return this;
                    },

                    // Overrides response content-type header
                    overrideMimeType: function( type ) {
                        if ( !state ) {
                            s.mimeType = type;
                        }
                        return this;
                    },

                    // Status-dependent callbacks
                    statusCode: function( map ) {
                        var code;
                        if ( map ) {
                            if ( state < 2 ) {
                                for ( code in map ) {
                                    // Lazy-add the new callback in a way that preserves old ones
                                    statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
                                }
                            } else {
                                // Execute the appropriate callbacks
                                jqXHR.always( map[ jqXHR.status ] );
                            }
                        }
                        return this;
                    },

                    // Cancel the request
                    abort: function( statusText ) {
                        var finalText = statusText || strAbort;
                        if ( transport ) {
                            transport.abort( finalText );
                        }
                        done( 0, finalText );
                        return this;
                    }
                };

            // Attach deferreds
            deferred.promise( jqXHR ).complete = completeDeferred.add;
            jqXHR.success = jqXHR.done;
            jqXHR.error = jqXHR.fail;

            // Remove hash character (#7531: and string promotion)
            // Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
            // Handle falsy url in the settings object (#10093: consistency with old signature)
            // We also use the url parameter if available
            s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

            // Alias method option to type as per ticket #12004
            s.type = options.method || options.type || s.method || s.type;

            // Extract dataTypes list
            s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

            // A cross-domain request is in order when we have a protocol:host:port mismatch
            if ( s.crossDomain == null ) {
                parts = rurl.exec( s.url.toLowerCase() );
                s.crossDomain = !!( parts &&
                    ( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
                        ( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
                            ( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
                    );
            }

            // Convert data if not already a string
            if ( s.data && s.processData && typeof s.data !== "string" ) {
                s.data = jQuery.param( s.data, s.traditional );
            }

            // Apply prefilters
            inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

            // If request was aborted inside a prefilter, stop there
            if ( state === 2 ) {
                return jqXHR;
            }

            // We can fire global events as of now if asked to
            fireGlobals = s.global;

            // Watch for a new set of requests
            if ( fireGlobals && jQuery.active++ === 0 ) {
                jQuery.event.trigger("ajaxStart");
            }

            // Uppercase the type
            s.type = s.type.toUpperCase();

            // Determine if request has content
            s.hasContent = !rnoContent.test( s.type );

            // Save the URL in case we're toying with the If-Modified-Since
            // and/or If-None-Match header later on
            cacheURL = s.url;

            // More options handling for requests with no content
            if ( !s.hasContent ) {

                // If data is available, append data to url
                if ( s.data ) {
                    cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
                    // #9682: remove data so that it's not used in an eventual retry
                    delete s.data;
                }

                // Add anti-cache in url if needed
                if ( s.cache === false ) {
                    s.url = rts.test( cacheURL ) ?

                        // If there is already a '_' parameter, set its value
                        cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

                        // Otherwise add one to the end
                        cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
                }
            }

            // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
            if ( s.ifModified ) {
                if ( jQuery.lastModified[ cacheURL ] ) {
                    jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
                }
                if ( jQuery.etag[ cacheURL ] ) {
                    jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
                }
            }

            // Set the correct header, if data is being sent
            if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
                jqXHR.setRequestHeader( "Content-Type", s.contentType );
            }

            // Set the Accepts header for the server, depending on the dataType
            jqXHR.setRequestHeader(
                "Accept",
                s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
                    s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
                    s.accepts[ "*" ]
            );

            // Check for headers option
            for ( i in s.headers ) {
                jqXHR.setRequestHeader( i, s.headers[ i ] );
            }

            // Allow custom headers/mimetypes and early abort
            if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
                // Abort if not done already and return
                return jqXHR.abort();
            }

            // aborting is no longer a cancellation
            strAbort = "abort";

            // Install callbacks on deferreds
            for ( i in { success: 1, error: 1, complete: 1 } ) {
                jqXHR[ i ]( s[ i ] );
            }

            // Get transport
            transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

            // If no transport, we auto-abort
            if ( !transport ) {
                done( -1, "No Transport" );
            } else {
                jqXHR.readyState = 1;

                // Send global event
                if ( fireGlobals ) {
                    globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
                }
                // Timeout
                if ( s.async && s.timeout > 0 ) {
                    timeoutTimer = setTimeout(function() {
                        jqXHR.abort("timeout");
                    }, s.timeout );
                }

                try {
                    state = 1;
                    transport.send( requestHeaders, done );
                } catch ( e ) {
                    // Propagate exception as error if not done
                    if ( state < 2 ) {
                        done( -1, e );
                        // Simply rethrow otherwise
                    } else {
                        throw e;
                    }
                }
            }

            // Callback for when everything is done
            function done( status, nativeStatusText, responses, headers ) {
                var isSuccess, success, error, response, modified,
                    statusText = nativeStatusText;

                // Called once
                if ( state === 2 ) {
                    return;
                }

                // State is "done" now
                state = 2;

                // Clear timeout if it exists
                if ( timeoutTimer ) {
                    clearTimeout( timeoutTimer );
                }

                // Dereference transport for early garbage collection
                // (no matter how long the jqXHR object will be used)
                transport = undefined;

                // Cache response headers
                responseHeadersString = headers || "";

                // Set readyState
                jqXHR.readyState = status > 0 ? 4 : 0;

                // Get response data
                if ( responses ) {
                    response = ajaxHandleResponses( s, jqXHR, responses );
                }

                // If successful, handle type chaining
                if ( status >= 200 && status < 300 || status === 304 ) {

                    // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
                    if ( s.ifModified ) {
                        modified = jqXHR.getResponseHeader("Last-Modified");
                        if ( modified ) {
                            jQuery.lastModified[ cacheURL ] = modified;
                        }
                        modified = jqXHR.getResponseHeader("etag");
                        if ( modified ) {
                            jQuery.etag[ cacheURL ] = modified;
                        }
                    }

                    // If not modified
                    if ( status === 304 ) {
                        isSuccess = true;
                        statusText = "notmodified";

                        // If we have data
                    } else {
                        isSuccess = ajaxConvert( s, response );
                        statusText = isSuccess.state;
                        success = isSuccess.data;
                        error = isSuccess.error;
                        isSuccess = !error;
                    }
                } else {
                    // We extract error from statusText
                    // then normalize statusText and status for non-aborts
                    error = statusText;
                    if ( status || !statusText ) {
                        statusText = "error";
                        if ( status < 0 ) {
                            status = 0;
                        }
                    }
                }

                // Set data for the fake xhr object
                jqXHR.status = status;
                jqXHR.statusText = ( nativeStatusText || statusText ) + "";

                // Success/Error
                if ( isSuccess ) {
                    deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
                } else {
                    deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
                }

                // Status-dependent callbacks
                jqXHR.statusCode( statusCode );
                statusCode = undefined;

                if ( fireGlobals ) {
                    globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
                        [ jqXHR, s, isSuccess ? success : error ] );
                }

                // Complete
                completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

                if ( fireGlobals ) {
                    globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
                    // Handle the global AJAX counter
                    if ( !( --jQuery.active ) ) {
                        jQuery.event.trigger("ajaxStop");
                    }
                }
            }

            return jqXHR;
        },

        getScript: function( url, callback ) {
            return jQuery.get( url, undefined, callback, "script" );
        },

        getJSON: function( url, data, callback ) {
            return jQuery.get( url, data, callback, "json" );
        }
    });

    /* Handles responses to an ajax request:
     * - sets all responseXXX fields accordingly
     * - finds the right dataType (mediates between content-type and expected dataType)
     * - returns the corresponding response
     */
    function ajaxHandleResponses( s, jqXHR, responses ) {

        var ct, type, finalDataType, firstDataType,
            contents = s.contents,
            dataTypes = s.dataTypes,
            responseFields = s.responseFields;

        // Fill responseXXX fields
        for ( type in responseFields ) {
            if ( type in responses ) {
                jqXHR[ responseFields[type] ] = responses[ type ];
            }
        }

        // Remove auto dataType and get content-type in the process
        while( dataTypes[ 0 ] === "*" ) {
            dataTypes.shift();
            if ( ct === undefined ) {
                ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
            }
        }

        // Check if we're dealing with a known content-type
        if ( ct ) {
            for ( type in contents ) {
                if ( contents[ type ] && contents[ type ].test( ct ) ) {
                    dataTypes.unshift( type );
                    break;
                }
            }
        }

        // Check to see if we have a response for the expected dataType
        if ( dataTypes[ 0 ] in responses ) {
            finalDataType = dataTypes[ 0 ];
        } else {
            // Try convertible dataTypes
            for ( type in responses ) {
                if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
                    finalDataType = type;
                    break;
                }
                if ( !firstDataType ) {
                    firstDataType = type;
                }
            }
            // Or just use first one
            finalDataType = finalDataType || firstDataType;
        }

        // If we found a dataType
        // We add the dataType to the list if needed
        // and return the corresponding response
        if ( finalDataType ) {
            if ( finalDataType !== dataTypes[ 0 ] ) {
                dataTypes.unshift( finalDataType );
            }
            return responses[ finalDataType ];
        }
    }

// Chain conversions given the request and the original response
    function ajaxConvert( s, response ) {

        var conv, conv2, current, tmp,
            converters = {},
            i = 0,
        // Work with a copy of dataTypes in case we need to modify it for conversion
            dataTypes = s.dataTypes.slice(),
            prev = dataTypes[ 0 ];

        // Apply the dataFilter if provided
        if ( s.dataFilter ) {
            response = s.dataFilter( response, s.dataType );
        }

        // Create converters map with lowercased keys
        if ( dataTypes[ 1 ] ) {
            for ( conv in s.converters ) {
                converters[ conv.toLowerCase() ] = s.converters[ conv ];
            }
        }

        // Convert to each sequential dataType, tolerating list modification
        for ( ; (current = dataTypes[++i]); ) {

            // There's only work to do if current dataType is non-auto
            if ( current !== "*" ) {

                // Convert response if prev dataType is non-auto and differs from current
                if ( prev !== "*" && prev !== current ) {

                    // Seek a direct converter
                    conv = converters[ prev + " " + current ] || converters[ "* " + current ];

                    // If none found, seek a pair
                    if ( !conv ) {
                        for ( conv2 in converters ) {

                            // If conv2 outputs current
                            tmp = conv2.split(" ");
                            if ( tmp[ 1 ] === current ) {

                                // If prev can be converted to accepted input
                                conv = converters[ prev + " " + tmp[ 0 ] ] ||
                                    converters[ "* " + tmp[ 0 ] ];
                                if ( conv ) {
                                    // Condense equivalence converters
                                    if ( conv === true ) {
                                        conv = converters[ conv2 ];

                                        // Otherwise, insert the intermediate dataType
                                    } else if ( converters[ conv2 ] !== true ) {
                                        current = tmp[ 0 ];
                                        dataTypes.splice( i--, 0, current );
                                    }

                                    break;
                                }
                            }
                        }
                    }

                    // Apply converter (if not an equivalence)
                    if ( conv !== true ) {

                        // Unless errors are allowed to bubble, catch and return them
                        if ( conv && s["throws"] ) {
                            response = conv( response );
                        } else {
                            try {
                                response = conv( response );
                            } catch ( e ) {
                                return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
                            }
                        }
                    }
                }

                // Update prev for next iteration
                prev = current;
            }
        }

        return { state: "success", data: response };
    }
// Install script dataType
    jQuery.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function( text ) {
                jQuery.globalEval( text );
                return text;
            }
        }
    });

// Handle cache's special case and global
    jQuery.ajaxPrefilter( "script", function( s ) {
        if ( s.cache === undefined ) {
            s.cache = false;
        }
        if ( s.crossDomain ) {
            s.type = "GET";
            s.global = false;
        }
    });

// Bind script tag hack transport
    jQuery.ajaxTransport( "script", function(s) {

        // This transport only deals with cross domain requests
        if ( s.crossDomain ) {

            var script,
                head = document.head || jQuery("head")[0] || document.documentElement;

            return {

                send: function( _, callback ) {

                    script = document.createElement("script");

                    script.async = true;

                    if ( s.scriptCharset ) {
                        script.charset = s.scriptCharset;
                    }

                    script.src = s.url;

                    // Attach handlers for all browsers
                    script.onload = script.onreadystatechange = function( _, isAbort ) {

                        if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

                            // Handle memory leak in IE
                            script.onload = script.onreadystatechange = null;

                            // Remove the script
                            if ( script.parentNode ) {
                                script.parentNode.removeChild( script );
                            }

                            // Dereference the script
                            script = null;

                            // Callback if not abort
                            if ( !isAbort ) {
                                callback( 200, "success" );
                            }
                        }
                    };

                    // Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
                    // Use native DOM manipulation to avoid our domManip AJAX trickery
                    head.insertBefore( script, head.firstChild );
                },

                abort: function() {
                    if ( script ) {
                        script.onload( undefined, true );
                    }
                }
            };
        }
    });
    var oldCallbacks = [],
        rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
    jQuery.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
            this[ callback ] = true;
            return callback;
        }
    });

// Detect, normalize options and install callbacks for jsonp requests
    jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

        var callbackName, overwritten, responseContainer,
            jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
                "url" :
                typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
                );

        // Handle iff the expected data type is "jsonp" or we have a parameter to set
        if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

            // Get callback name, remembering preexisting value associated with it
            callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
                s.jsonpCallback() :
                s.jsonpCallback;

            // Insert callback into url or form data
            if ( jsonProp ) {
                s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
            } else if ( s.jsonp !== false ) {
                s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
            }

            // Use data converter to retrieve json after script execution
            s.converters["script json"] = function() {
                if ( !responseContainer ) {
                    jQuery.error( callbackName + " was not called" );
                }
                return responseContainer[ 0 ];
            };

            // force json dataType
            s.dataTypes[ 0 ] = "json";

            // Install callback
            overwritten = window[ callbackName ];
            window[ callbackName ] = function() {
                responseContainer = arguments;
            };

            // Clean-up function (fires after converters)
            jqXHR.always(function() {
                // Restore preexisting value
                window[ callbackName ] = overwritten;

                // Save back as free
                if ( s[ callbackName ] ) {
                    // make sure that re-using the options doesn't screw things around
                    s.jsonpCallback = originalSettings.jsonpCallback;

                    // save the callback name for future use
                    oldCallbacks.push( callbackName );
                }

                // Call if it was a function and we have a response
                if ( responseContainer && jQuery.isFunction( overwritten ) ) {
                    overwritten( responseContainer[ 0 ] );
                }

                responseContainer = overwritten = undefined;
            });

            // Delegate to script
            return "script";
        }
    });
    jQuery.ajaxSettings.xhr = function() {
        try {
            return new XMLHttpRequest();
        } catch( e ) {}
    };

    var xhrSupported = jQuery.ajaxSettings.xhr(),
        xhrSuccessStatus = {
            // file protocol always yields status code 0, assume 200
            0: 200,
            // Support: IE9
            // #1450: sometimes IE returns 1223 when it should be 204
            1223: 204
        },
    // Support: IE9
    // We need to keep track of outbound xhr and abort them manually
    // because IE is not smart enough to do it all by itself
        xhrId = 0,
        xhrCallbacks = {};

    if ( window.ActiveXObject ) {
        jQuery( window ).on( "unload", function() {
            for( var key in xhrCallbacks ) {
                xhrCallbacks[ key ]();
            }
            xhrCallbacks = undefined;
        });
    }

    jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
    jQuery.support.ajax = xhrSupported = !!xhrSupported;

    jQuery.ajaxTransport(function( options ) {
        var callback;
        // Cross domain only allowed if supported through XMLHttpRequest
        if ( jQuery.support.cors || xhrSupported && !options.crossDomain ) {
            return {
                send: function( headers, complete ) {
                    var i, id,
                        xhr = options.xhr();
                    xhr.open( options.type, options.url, options.async, options.username, options.password );
                    // Apply custom fields if provided
                    if ( options.xhrFields ) {
                        for ( i in options.xhrFields ) {
                            xhr[ i ] = options.xhrFields[ i ];
                        }
                    }
                    // Override mime type if needed
                    if ( options.mimeType && xhr.overrideMimeType ) {
                        xhr.overrideMimeType( options.mimeType );
                    }
                    // X-Requested-With header
                    // For cross-domain requests, seeing as conditions for a preflight are
                    // akin to a jigsaw puzzle, we simply never set it to be sure.
                    // (it can always be set on a per-request basis or even using ajaxSetup)
                    // For same-domain requests, won't change header if already provided.
                    if ( !options.crossDomain && !headers["X-Requested-With"] ) {
                        headers["X-Requested-With"] = "XMLHttpRequest";
                    }
                    // Set headers
                    for ( i in headers ) {
                        xhr.setRequestHeader( i, headers[ i ] );
                    }
                    // Callback
                    callback = function( type ) {
                        return function() {
                            if ( callback ) {
                                delete xhrCallbacks[ id ];
                                callback = xhr.onload = xhr.onerror = null;
                                if ( type === "abort" ) {
                                    xhr.abort();
                                } else if ( type === "error" ) {
                                    complete(
                                        // file protocol always yields status 0, assume 404
                                        xhr.status || 404,
                                        xhr.statusText
                                    );
                                } else {
                                    complete(
                                        xhrSuccessStatus[ xhr.status ] || xhr.status,
                                        xhr.statusText,
                                        // Support: IE9
                                        // #11426: When requesting binary data, IE9 will throw an exception
                                        // on any attempt to access responseText
                                        typeof xhr.responseText === "string" ? {
                                            text: xhr.responseText
                                        } : undefined,
                                        xhr.getAllResponseHeaders()
                                    );
                                }
                            }
                        };
                    };
                    // Listen to events
                    xhr.onload = callback();
                    xhr.onerror = callback("error");
                    // Create the abort callback
                    callback = xhrCallbacks[( id = xhrId++ )] = callback("abort");
                    // Do send the request
                    // This may raise an exception which is actually
                    // handled in jQuery.ajax (so no try/catch here)
                    xhr.send( options.hasContent && options.data || null );
                },
                abort: function() {
                    if ( callback ) {
                        callback();
                    }
                }
            };
        }
    });
    var fxNow, timerId,
        rfxtypes = /^(?:toggle|show|hide)$/,
        rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
        rrun = /queueHooks$/,
        animationPrefilters = [ defaultPrefilter ],
        tweeners = {
            "*": [function( prop, value ) {
                var end, unit,
                    tween = this.createTween( prop, value ),
                    parts = rfxnum.exec( value ),
                    target = tween.cur(),
                    start = +target || 0,
                    scale = 1,
                    maxIterations = 20;

                if ( parts ) {
                    end = +parts[2];
                    unit = parts[3] || ( jQuery.cssNumber[ prop ] ? "" : "px" );

                    // We need to compute starting value
                    if ( unit !== "px" && start ) {
                        // Iteratively approximate from a nonzero starting point
                        // Prefer the current property, because this process will be trivial if it uses the same units
                        // Fallback to end or a simple constant
                        start = jQuery.css( tween.elem, prop, true ) || end || 1;

                        do {
                            // If previous iteration zeroed out, double until we get *something*
                            // Use a string for doubling factor so we don't accidentally see scale as unchanged below
                            scale = scale || ".5";

                            // Adjust and apply
                            start = start / scale;
                            jQuery.style( tween.elem, prop, start + unit );

                            // Update scale, tolerating zero or NaN from tween.cur()
                            // And breaking the loop if scale is unchanged or perfect, or if we've just had enough
                        } while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
                    }

                    tween.unit = unit;
                    tween.start = start;
                    // If a +=/-= token was provided, we're doing a relative animation
                    tween.end = parts[1] ? start + ( parts[1] + 1 ) * end : end;
                }
                return tween;
            }]
        };

// Animations created synchronously will run synchronously
    function createFxNow() {
        setTimeout(function() {
            fxNow = undefined;
        });
        return ( fxNow = jQuery.now() );
    }

    function createTweens( animation, props ) {
        jQuery.each( props, function( prop, value ) {
            var collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
                index = 0,
                length = collection.length;
            for ( ; index < length; index++ ) {
                if ( collection[ index ].call( animation, prop, value ) ) {

                    // we're done with this property
                    return;
                }
            }
        });
    }

    function Animation( elem, properties, options ) {
        var result,
            stopped,
            index = 0,
            length = animationPrefilters.length,
            deferred = jQuery.Deferred().always( function() {
                // don't match elem in the :animated selector
                delete tick.elem;
            }),
            tick = function() {
                if ( stopped ) {
                    return false;
                }
                var currentTime = fxNow || createFxNow(),
                    remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
                // archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
                    temp = remaining / animation.duration || 0,
                    percent = 1 - temp,
                    index = 0,
                    length = animation.tweens.length;

                for ( ; index < length ; index++ ) {
                    animation.tweens[ index ].run( percent );
                }

                deferred.notifyWith( elem, [ animation, percent, remaining ]);

                if ( percent < 1 && length ) {
                    return remaining;
                } else {
                    deferred.resolveWith( elem, [ animation ] );
                    return false;
                }
            },
            animation = deferred.promise({
                elem: elem,
                props: jQuery.extend( {}, properties ),
                opts: jQuery.extend( true, { specialEasing: {} }, options ),
                originalProperties: properties,
                originalOptions: options,
                startTime: fxNow || createFxNow(),
                duration: options.duration,
                tweens: [],
                createTween: function( prop, end ) {
                    var tween = jQuery.Tween( elem, animation.opts, prop, end,
                        animation.opts.specialEasing[ prop ] || animation.opts.easing );
                    animation.tweens.push( tween );
                    return tween;
                },
                stop: function( gotoEnd ) {
                    var index = 0,
                    // if we are going to the end, we want to run all the tweens
                    // otherwise we skip this part
                        length = gotoEnd ? animation.tweens.length : 0;
                    if ( stopped ) {
                        return this;
                    }
                    stopped = true;
                    for ( ; index < length ; index++ ) {
                        animation.tweens[ index ].run( 1 );
                    }

                    // resolve when we played the last frame
                    // otherwise, reject
                    if ( gotoEnd ) {
                        deferred.resolveWith( elem, [ animation, gotoEnd ] );
                    } else {
                        deferred.rejectWith( elem, [ animation, gotoEnd ] );
                    }
                    return this;
                }
            }),
            props = animation.props;

        propFilter( props, animation.opts.specialEasing );

        for ( ; index < length ; index++ ) {
            result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
            if ( result ) {
                return result;
            }
        }

        createTweens( animation, props );

        if ( jQuery.isFunction( animation.opts.start ) ) {
            animation.opts.start.call( elem, animation );
        }

        jQuery.fx.timer(
            jQuery.extend( tick, {
                elem: elem,
                anim: animation,
                queue: animation.opts.queue
            })
        );

        // attach callbacks from options
        return animation.progress( animation.opts.progress )
            .done( animation.opts.done, animation.opts.complete )
            .fail( animation.opts.fail )
            .always( animation.opts.always );
    }

    function propFilter( props, specialEasing ) {
        var index, name, easing, value, hooks;

        // camelCase, specialEasing and expand cssHook pass
        for ( index in props ) {
            name = jQuery.camelCase( index );
            easing = specialEasing[ name ];
            value = props[ index ];
            if ( jQuery.isArray( value ) ) {
                easing = value[ 1 ];
                value = props[ index ] = value[ 0 ];
            }

            if ( index !== name ) {
                props[ name ] = value;
                delete props[ index ];
            }

            hooks = jQuery.cssHooks[ name ];
            if ( hooks && "expand" in hooks ) {
                value = hooks.expand( value );
                delete props[ name ];

                // not quite $.extend, this wont overwrite keys already present.
                // also - reusing 'index' from above because we have the correct "name"
                for ( index in value ) {
                    if ( !( index in props ) ) {
                        props[ index ] = value[ index ];
                        specialEasing[ index ] = easing;
                    }
                }
            } else {
                specialEasing[ name ] = easing;
            }
        }
    }

    jQuery.Animation = jQuery.extend( Animation, {

        tweener: function( props, callback ) {
            if ( jQuery.isFunction( props ) ) {
                callback = props;
                props = [ "*" ];
            } else {
                props = props.split(" ");
            }

            var prop,
                index = 0,
                length = props.length;

            for ( ; index < length ; index++ ) {
                prop = props[ index ];
                tweeners[ prop ] = tweeners[ prop ] || [];
                tweeners[ prop ].unshift( callback );
            }
        },

        prefilter: function( callback, prepend ) {
            if ( prepend ) {
                animationPrefilters.unshift( callback );
            } else {
                animationPrefilters.push( callback );
            }
        }
    });

    function defaultPrefilter( elem, props, opts ) {
        /*jshint validthis:true */
        var index, prop, value, length, dataShow, toggle, tween, hooks, oldfire,
            anim = this,
            style = elem.style,
            orig = {},
            handled = [],
            hidden = elem.nodeType && isHidden( elem );

        // handle queue: false promises
        if ( !opts.queue ) {
            hooks = jQuery._queueHooks( elem, "fx" );
            if ( hooks.unqueued == null ) {
                hooks.unqueued = 0;
                oldfire = hooks.empty.fire;
                hooks.empty.fire = function() {
                    if ( !hooks.unqueued ) {
                        oldfire();
                    }
                };
            }
            hooks.unqueued++;

            anim.always(function() {
                // doing this makes sure that the complete handler will be called
                // before this completes
                anim.always(function() {
                    hooks.unqueued--;
                    if ( !jQuery.queue( elem, "fx" ).length ) {
                        hooks.empty.fire();
                    }
                });
            });
        }

        // height/width overflow pass
        if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
            // Make sure that nothing sneaks out
            // Record all 3 overflow attributes because IE does not
            // change the overflow attribute when overflowX and
            // overflowY are set to the same value
            opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

            // Set display property to inline-block for height/width
            // animations on inline elements that are having width/height animated
            if ( jQuery.css( elem, "display" ) === "inline" &&
                jQuery.css( elem, "float" ) === "none" ) {

                style.display = "inline-block";
            }
        }

        if ( opts.overflow ) {
            style.overflow = "hidden";
            anim.done(function() {
                style.overflow = opts.overflow[ 0 ];
                style.overflowX = opts.overflow[ 1 ];
                style.overflowY = opts.overflow[ 2 ];
            });
        }


        // show/hide pass
        for ( index in props ) {
            value = props[ index ];
            if ( rfxtypes.exec( value ) ) {
                delete props[ index ];
                toggle = toggle || value === "toggle";
                if ( value === ( hidden ? "hide" : "show" ) ) {
                    continue;
                }
                handled.push( index );
            }
        }

        length = handled.length;
        if ( length ) {
            dataShow = jQuery._data( elem, "fxshow" ) || jQuery._data( elem, "fxshow", {} );
            if ( "hidden" in dataShow ) {
                hidden = dataShow.hidden;
            }

            // store state if its toggle - enables .stop().toggle() to "reverse"
            if ( toggle ) {
                dataShow.hidden = !hidden;
            }
            if ( hidden ) {
                jQuery( elem ).show();
            } else {
                anim.done(function() {
                    jQuery( elem ).hide();
                });
            }
            anim.done(function() {
                var prop;
                jQuery._removeData( elem, "fxshow" );
                for ( prop in orig ) {
                    jQuery.style( elem, prop, orig[ prop ] );
                }
            });
            for ( index = 0 ; index < length ; index++ ) {
                prop = handled[ index ];
                tween = anim.createTween( prop, hidden ? dataShow[ prop ] : 0 );
                orig[ prop ] = dataShow[ prop ] || jQuery.style( elem, prop );

                if ( !( prop in dataShow ) ) {
                    dataShow[ prop ] = tween.start;
                    if ( hidden ) {
                        tween.end = tween.start;
                        tween.start = prop === "width" || prop === "height" ? 1 : 0;
                    }
                }
            }
        }
    }

    function Tween( elem, options, prop, end, easing ) {
        return new Tween.prototype.init( elem, options, prop, end, easing );
    }
    jQuery.Tween = Tween;

    Tween.prototype = {
        constructor: Tween,
        init: function( elem, options, prop, end, easing, unit ) {
            this.elem = elem;
            this.prop = prop;
            this.easing = easing || "swing";
            this.options = options;
            this.start = this.now = this.cur();
            this.end = end;
            this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
        },
        cur: function() {
            var hooks = Tween.propHooks[ this.prop ];

            return hooks && hooks.get ?
                hooks.get( this ) :
                Tween.propHooks._default.get( this );
        },
        run: function( percent ) {
            var eased,
                hooks = Tween.propHooks[ this.prop ];

            if ( this.options.duration ) {
                this.pos = eased = jQuery.easing[ this.easing ](
                    percent, this.options.duration * percent, 0, 1, this.options.duration
                );
            } else {
                this.pos = eased = percent;
            }
            this.now = ( this.end - this.start ) * eased + this.start;

            if ( this.options.step ) {
                this.options.step.call( this.elem, this.now, this );
            }

            if ( hooks && hooks.set ) {
                hooks.set( this );
            } else {
                Tween.propHooks._default.set( this );
            }
            return this;
        }
    };

    Tween.prototype.init.prototype = Tween.prototype;

    Tween.propHooks = {
        _default: {
            get: function( tween ) {
                var result;

                if ( tween.elem[ tween.prop ] != null &&
                    (!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
                    return tween.elem[ tween.prop ];
                }

                // passing a non empty string as a 3rd parameter to .css will automatically
                // attempt a parseFloat and fallback to a string if the parse fails
                // so, simple values such as "10px" are parsed to Float.
                // complex values such as "rotate(1rad)" are returned as is.
                result = jQuery.css( tween.elem, tween.prop, "auto" );
                // Empty strings, null, undefined and "auto" are converted to 0.
                return !result || result === "auto" ? 0 : result;
            },
            set: function( tween ) {
                // use step hook for back compat - use cssHook if its there - use .style if its
                // available and use plain properties where available
                if ( jQuery.fx.step[ tween.prop ] ) {
                    jQuery.fx.step[ tween.prop ]( tween );
                } else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
                    jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
                } else {
                    tween.elem[ tween.prop ] = tween.now;
                }
            }
        }
    };

// Remove in 2.0 - this supports IE8's panic based approach
// to setting things on disconnected nodes

    Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
        set: function( tween ) {
            if ( tween.elem.nodeType && tween.elem.parentNode ) {
                tween.elem[ tween.prop ] = tween.now;
            }
        }
    };

    jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
        var cssFn = jQuery.fn[ name ];
        jQuery.fn[ name ] = function( speed, easing, callback ) {
            return speed == null || typeof speed === "boolean" ?
                cssFn.apply( this, arguments ) :
                this.animate( genFx( name, true ), speed, easing, callback );
        };
    });

    jQuery.fn.extend({
        fadeTo: function( speed, to, easing, callback ) {

            // show any hidden elements after setting opacity to 0
            return this.filter( isHidden ).css( "opacity", 0 ).show()

                // animate to the value specified
                .end().animate({ opacity: to }, speed, easing, callback );
        },
        animate: function( prop, speed, easing, callback ) {
            var empty = jQuery.isEmptyObject( prop ),
                optall = jQuery.speed( speed, easing, callback ),
                doAnimation = function() {
                    // Operate on a copy of prop so per-property easing won't be lost
                    var anim = Animation( this, jQuery.extend( {}, prop ), optall );
                    doAnimation.finish = function() {
                        anim.stop( true );
                    };
                    // Empty animations, or finishing resolves immediately
                    if ( empty || jQuery._data( this, "finish" ) ) {
                        anim.stop( true );
                    }
                };
            doAnimation.finish = doAnimation;

            return empty || optall.queue === false ?
                this.each( doAnimation ) :
                this.queue( optall.queue, doAnimation );
        },
        stop: function( type, clearQueue, gotoEnd ) {
            var stopQueue = function( hooks ) {
                var stop = hooks.stop;
                delete hooks.stop;
                stop( gotoEnd );
            };

            if ( typeof type !== "string" ) {
                gotoEnd = clearQueue;
                clearQueue = type;
                type = undefined;
            }
            if ( clearQueue && type !== false ) {
                this.queue( type || "fx", [] );
            }

            return this.each(function() {
                var dequeue = true,
                    index = type != null && type + "queueHooks",
                    timers = jQuery.timers,
                    data = jQuery._data( this );

                if ( index ) {
                    if ( data[ index ] && data[ index ].stop ) {
                        stopQueue( data[ index ] );
                    }
                } else {
                    for ( index in data ) {
                        if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
                            stopQueue( data[ index ] );
                        }
                    }
                }

                for ( index = timers.length; index--; ) {
                    if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
                        timers[ index ].anim.stop( gotoEnd );
                        dequeue = false;
                        timers.splice( index, 1 );
                    }
                }

                // start the next in the queue if the last step wasn't forced
                // timers currently will call their complete callbacks, which will dequeue
                // but only if they were gotoEnd
                if ( dequeue || !gotoEnd ) {
                    jQuery.dequeue( this, type );
                }
            });
        },
        finish: function( type ) {
            if ( type !== false ) {
                type = type || "fx";
            }
            return this.each(function() {
                var index,
                    data = jQuery._data( this ),
                    queue = data[ type + "queue" ],
                    hooks = data[ type + "queueHooks" ],
                    timers = jQuery.timers,
                    length = queue ? queue.length : 0;

                // enable finishing flag on private data
                data.finish = true;

                // empty the queue first
                jQuery.queue( this, type, [] );

                if ( hooks && hooks.cur && hooks.cur.finish ) {
                    hooks.cur.finish.call( this );
                }

                // look for any active animations, and finish them
                for ( index = timers.length; index--; ) {
                    if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
                        timers[ index ].anim.stop( true );
                        timers.splice( index, 1 );
                    }
                }

                // look for any animations in the old queue and finish them
                for ( index = 0; index < length; index++ ) {
                    if ( queue[ index ] && queue[ index ].finish ) {
                        queue[ index ].finish.call( this );
                    }
                }

                // turn off finishing flag
                delete data.finish;
            });
        }
    });

// Generate parameters to create a standard animation
    function genFx( type, includeWidth ) {
        var which,
            attrs = { height: type },
            i = 0;

        // if we include width, step value is 1 to do all cssExpand values,
        // if we don't include width, step value is 2 to skip over Left and Right
        includeWidth = includeWidth? 1 : 0;
        for( ; i < 4 ; i += 2 - includeWidth ) {
            which = cssExpand[ i ];
            attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
        }

        if ( includeWidth ) {
            attrs.opacity = attrs.width = type;
        }

        return attrs;
    }

// Generate shortcuts for custom animations
    jQuery.each({
        slideDown: genFx("show"),
        slideUp: genFx("hide"),
        slideToggle: genFx("toggle"),
        fadeIn: { opacity: "show" },
        fadeOut: { opacity: "hide" },
        fadeToggle: { opacity: "toggle" }
    }, function( name, props ) {
        jQuery.fn[ name ] = function( speed, easing, callback ) {
            return this.animate( props, speed, easing, callback );
        };
    });

    jQuery.speed = function( speed, easing, fn ) {
        var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
            complete: fn || !fn && easing ||
                jQuery.isFunction( speed ) && speed,
            duration: speed,
            easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
        };

        opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
            opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

        // normalize opt.queue - true/undefined/null -> "fx"
        if ( opt.queue == null || opt.queue === true ) {
            opt.queue = "fx";
        }

        // Queueing
        opt.old = opt.complete;

        opt.complete = function() {
            if ( jQuery.isFunction( opt.old ) ) {
                opt.old.call( this );
            }

            if ( opt.queue ) {
                jQuery.dequeue( this, opt.queue );
            }
        };

        return opt;
    };

    jQuery.easing = {
        linear: function( p ) {
            return p;
        },
        swing: function( p ) {
            return 0.5 - Math.cos( p*Math.PI ) / 2;
        }
    };

    jQuery.timers = [];
    jQuery.fx = Tween.prototype.init;
    jQuery.fx.tick = function() {
        var timer,
            timers = jQuery.timers,
            i = 0;

        fxNow = jQuery.now();

        for ( ; i < timers.length; i++ ) {
            timer = timers[ i ];
            // Checks the timer has not already been removed
            if ( !timer() && timers[ i ] === timer ) {
                timers.splice( i--, 1 );
            }
        }

        if ( !timers.length ) {
            jQuery.fx.stop();
        }
        fxNow = undefined;
    };

    jQuery.fx.timer = function( timer ) {
        if ( timer() && jQuery.timers.push( timer ) ) {
            jQuery.fx.start();
        }
    };

    jQuery.fx.interval = 13;

    jQuery.fx.start = function() {
        if ( !timerId ) {
            timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
        }
    };

    jQuery.fx.stop = function() {
        clearInterval( timerId );
        timerId = null;
    };

    jQuery.fx.speeds = {
        slow: 600,
        fast: 200,
        // Default speed
        _default: 400
    };

// Back Compat <1.8 extension point
    jQuery.fx.step = {};

    if ( jQuery.expr && jQuery.expr.filters ) {
        jQuery.expr.filters.animated = function( elem ) {
            return jQuery.grep(jQuery.timers, function( fn ) {
                return elem === fn.elem;
            }).length;
        };
    }
    jQuery.fn.offset = function( options ) {
        if ( arguments.length ) {
            return options === undefined ?
                this :
                this.each(function( i ) {
                    jQuery.offset.setOffset( this, options, i );
                });
        }

        var docElem, win,
            box = { top: 0, left: 0 },
            elem = this[ 0 ],
            doc = elem && elem.ownerDocument;

        if ( !doc ) {
            return;
        }

        docElem = doc.documentElement;

        // Make sure it's not a disconnected DOM node
        if ( !jQuery.contains( docElem, elem ) ) {
            return box;
        }

        // If we don't have gBCR, just use 0,0 rather than error
        // BlackBerry 5, iOS 3 (original iPhone)
        if ( typeof elem.getBoundingClientRect !== "undefined" ) {
            box = elem.getBoundingClientRect();
        }
        win = getWindow( doc );
        return {
            top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
            left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
        };
    };

    jQuery.offset = {

        setOffset: function( elem, options, i ) {
            var position = jQuery.css( elem, "position" );

            // set position first, in-case top/left are set even on static elem
            if ( position === "static" ) {
                elem.style.position = "relative";
            }

            var curElem = jQuery( elem ),
                curOffset = curElem.offset(),
                curCSSTop = jQuery.css( elem, "top" ),
                curCSSLeft = jQuery.css( elem, "left" ),
                calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
                props = {}, curPosition = {}, curTop, curLeft;

            // need to be able to calculate position if either top or left is auto and position is either absolute or fixed
            if ( calculatePosition ) {
                curPosition = curElem.position();
                curTop = curPosition.top;
                curLeft = curPosition.left;
            } else {
                curTop = parseFloat( curCSSTop ) || 0;
                curLeft = parseFloat( curCSSLeft ) || 0;
            }

            if ( jQuery.isFunction( options ) ) {
                options = options.call( elem, i, curOffset );
            }

            if ( options.top != null ) {
                props.top = ( options.top - curOffset.top ) + curTop;
            }
            if ( options.left != null ) {
                props.left = ( options.left - curOffset.left ) + curLeft;
            }

            if ( "using" in options ) {
                options.using.call( elem, props );
            } else {
                curElem.css( props );
            }
        }
    };


    jQuery.fn.extend({

        position: function() {
            if ( !this[ 0 ] ) {
                return;
            }

            var offsetParent, offset,
                parentOffset = { top: 0, left: 0 },
                elem = this[ 0 ];

            // fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
            if ( jQuery.css( elem, "position" ) === "fixed" ) {
                // we assume that getBoundingClientRect is available when computed position is fixed
                offset = elem.getBoundingClientRect();
            } else {
                // Get *real* offsetParent
                offsetParent = this.offsetParent();

                // Get correct offsets
                offset = this.offset();
                if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
                    parentOffset = offsetParent.offset();
                }

                // Add offsetParent borders
                parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
                parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
            }

            // Subtract parent offsets and element margins
            // note: when an element has margin: auto the offsetLeft and marginLeft
            // are the same in Safari causing offset.left to incorrectly be 0
            return {
                top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
                left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
            };
        },

        offsetParent: function() {
            return this.map(function() {
                var offsetParent = this.offsetParent || document.documentElement;
                while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
                    offsetParent = offsetParent.offsetParent;
                }
                return offsetParent || document.documentElement;
            });
        }
    });


// Create scrollLeft and scrollTop methods
    jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
        var top = /Y/.test( prop );

        jQuery.fn[ method ] = function( val ) {
            return jQuery.access( this, function( elem, method, val ) {
                var win = getWindow( elem );

                if ( val === undefined ) {
                    return win ? (prop in win) ? win[ prop ] :
                        win.document.documentElement[ method ] :
                        elem[ method ];
                }

                if ( win ) {
                    win.scrollTo(
                        !top ? val : jQuery( win ).scrollLeft(),
                        top ? val : jQuery( win ).scrollTop()
                    );

                } else {
                    elem[ method ] = val;
                }
            }, method, val, arguments.length, null );
        };
    });

    function getWindow( elem ) {
        return jQuery.isWindow( elem ) ?
            elem :
            elem.nodeType === 9 ?
                elem.defaultView || elem.parentWindow :
                false;
    }
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
    jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
        jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
            // margin is only for outerHeight, outerWidth
            jQuery.fn[ funcName ] = function( margin, value ) {
                var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
                    extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

                return jQuery.access( this, function( elem, type, value ) {
                    var doc;

                    if ( jQuery.isWindow( elem ) ) {
                        // As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
                        // isn't a whole lot we can do. See pull request at this URL for discussion:
                        // https://github.com/jquery/jquery/pull/764
                        return elem.document.documentElement[ "client" + name ];
                    }

                    // Get document width or height
                    if ( elem.nodeType === 9 ) {
                        doc = elem.documentElement;

                        // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
                        // unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
                        return Math.max(
                            elem.body[ "scroll" + name ], doc[ "scroll" + name ],
                            elem.body[ "offset" + name ], doc[ "offset" + name ],
                            doc[ "client" + name ]
                        );
                    }

                    return value === undefined ?
                        // Get width or height on the element, requesting but not forcing parseFloat
                        jQuery.css( elem, type, extra ) :

                        // Set width or height on the element
                        jQuery.style( elem, type, value, extra );
                }, type, chainable ? margin : undefined, chainable, null );
            };
        });
    });
// Limit scope pollution from any deprecated API
// (function() {

// })();
// Expose jQuery to the global object
    window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
    if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
        define( "jquery", [], function () { return jQuery; } );
    }

})( window );
/**
 * Create a cookie with the given name and value and other optional parameters.
 *
 * Set the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value');
 * Create a cookie with all available options.
 * @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
 * Create a session cookie.
 * @example $.cookie('the_cookie', 'the_value');
 * Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
 * used when the cookie was set.
 * @example $.cookie('the_cookie', null);
 *
 * @param String name The name of the cookie.
 * @param String value The value of the cookie.
 * @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
 * @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
 *                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
 *                             If set to null or omitted, the cookie will be a session cookie and will not be retained
 *                             when the the browser exits.
 * @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
 * @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
 * @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
 *                        require a secure protocol (like HTTPS).
 * @type undefined
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */

/**
 * Cookie plugin
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

/**
 * Get the value of a cookie with the given name.
 *
 * @example $.cookie('the_cookie');
 * @desc Get the value of a cookie.
 *
 * @param String name The name of the cookie.
 * @return The value of the cookie.
 * @type String
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};

/*
 json2.js
 2012-10-08

 Public Domain.

 NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

 See http://www.JSON.org/js.html


 This code should be minified before deployment.
 See http://javascript.crockford.com/jsmin.html

 USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
 NOT CONTROL.


 This file creates a global JSON object containing two methods: stringify
 and parse.

 JSON.stringify(value, replacer, space)
 value       any JavaScript value, usually an object or array.

 replacer    an optional parameter that determines how object
 values are stringified for objects. It can be a
 function or an array of strings.

 space       an optional parameter that specifies the indentation
 of nested structures. If it is omitted, the text will
 be packed without extra whitespace. If it is a number,
 it will specify the number of spaces to indent at each
 level. If it is a string (such as '\t' or '&nbsp;'),
 it contains the characters used to indent at each level.

 This method produces a JSON text from a JavaScript value.

 When an object value is found, if the object contains a toJSON
 method, its toJSON method will be called and the result will be
 stringified. A toJSON method does not serialize: it returns the
 value represented by the name/value pair that should be serialized,
 or undefined if nothing should be serialized. The toJSON method
 will be passed the key associated with the value, and this will be
 bound to the value

 For example, this would serialize Dates as ISO strings.

 Date.prototype.toJSON = function (key) {
 function f(n) {
 // Format integers to have at least two digits.
 return n < 10 ? '0' + n : n;
 }

 return this.getUTCFullYear()   + '-' +
 f(this.getUTCMonth() + 1) + '-' +
 f(this.getUTCDate())      + 'T' +
 f(this.getUTCHours())     + ':' +
 f(this.getUTCMinutes())   + ':' +
 f(this.getUTCSeconds())   + 'Z';
 };

 You can provide an optional replacer method. It will be passed the
 key and value of each member, with this bound to the containing
 object. The value that is returned from your method will be
 serialized. If your method returns undefined, then the member will
 be excluded from the serialization.

 If the replacer parameter is an array of strings, then it will be
 used to select the members to be serialized. It filters the results
 such that only members with keys listed in the replacer array are
 stringified.

 Values that do not have JSON representations, such as undefined or
 functions, will not be serialized. Such values in objects will be
 dropped; in arrays they will be replaced with null. You can use
 a replacer function to replace those with JSON values.
 JSON.stringify(undefined) returns undefined.

 The optional space parameter produces a stringification of the
 value that is filled with line breaks and indentation to make it
 easier to read.

 If the space parameter is a non-empty string, then that string will
 be used for indentation. If the space parameter is a number, then
 the indentation will be that many spaces.

 Example:

 text = JSON.stringify(['e', {pluribus: 'unum'}]);
 // text is '["e",{"pluribus":"unum"}]'


 text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
 // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

 text = JSON.stringify([new Date()], function (key, value) {
 return this[key] instanceof Date ?
 'Date(' + this[key] + ')' : value;
 });
 // text is '["Date(---current time---)"]'


 JSON.parse(text, reviver)
 This method parses a JSON text to produce an object or array.
 It can throw a SyntaxError exception.

 The optional reviver parameter is a function that can filter and
 transform the results. It receives each of the keys and values,
 and its return value is used instead of the original value.
 If it returns what it received, then the structure is not modified.
 If it returns undefined then the member is deleted.

 Example:

 // Parse the text. Values that look like ISO date strings will
 // be converted to Date objects.

 myData = JSON.parse(text, function (key, value) {
 var a;
 if (typeof value === 'string') {
 a =
 /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
 if (a) {
 return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
 +a[5], +a[6]));
 }
 }
 return value;
 });

 myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
 var d;
 if (typeof value === 'string' &&
 value.slice(0, 5) === 'Date(' &&
 value.slice(-1) === ')') {
 d = new Date(value.slice(5, -1));
 if (d) {
 return d;
 }
 }
 return value;
 });


 This is a reference implementation. You are free to copy, modify, or
 redistribute.
 */

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
 call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
 getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
 lastIndex, length, parse, prototype, push, replace, slice, stringify,
 test, toJSON, toString, valueOf
 */


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate())      + 'T' +
                f(this.getUTCHours())     + ':' +
                f(this.getUTCMinutes())   + ':' +
                f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
                Boolean.prototype.toJSON = function (key) {
                    return this.valueOf();
                };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
            typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

                return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

            case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

                if (!value) {
                    return 'null';
                }

// Make an array to hold the partial results of stringifying this object value.

                gap += indent;
                partial = [];

// Is the value an array?

                if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                    v = partial.length === 0
                        ? '[]'
                        : gap
                        ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                        : '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

// If the replacer is an array, use it to select the members to be stringified.

                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === 'string') {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {

// Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

                v = partial.length === 0
                    ? '{}'
                    : gap
                    ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                    : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
//1.4.3
(function(){var n=this,t=n._,r={},e=Array.prototype,u=Object.prototype,i=Function.prototype,a=e.push,o=e.slice,c=e.concat,l=u.toString,f=u.hasOwnProperty,s=e.forEach,p=e.map,v=e.reduce,h=e.reduceRight,g=e.filter,d=e.every,m=e.some,y=e.indexOf,b=e.lastIndexOf,x=Array.isArray,_=Object.keys,j=i.bind,w=function(n){return n instanceof w?n:this instanceof w?(this._wrapped=n,void 0):new w(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=w),exports._=w):n._=w,w.VERSION="1.4.3";var A=w.each=w.forEach=function(n,t,e){if(null!=n)if(s&&n.forEach===s)n.forEach(t,e);else if(n.length===+n.length){for(var u=0,i=n.length;i>u;u++)if(t.call(e,n[u],u,n)===r)return}else for(var a in n)if(w.has(n,a)&&t.call(e,n[a],a,n)===r)return};w.map=w.collect=function(n,t,r){var e=[];return null==n?e:p&&n.map===p?n.map(t,r):(A(n,function(n,u,i){e[e.length]=t.call(r,n,u,i)}),e)};var O="Reduce of empty array with no initial value";w.reduce=w.foldl=w.inject=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),v&&n.reduce===v)return e&&(t=w.bind(t,e)),u?n.reduce(t,r):n.reduce(t);if(A(n,function(n,i,a){u?r=t.call(e,r,n,i,a):(r=n,u=!0)}),!u)throw new TypeError(O);return r},w.reduceRight=w.foldr=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),h&&n.reduceRight===h)return e&&(t=w.bind(t,e)),u?n.reduceRight(t,r):n.reduceRight(t);var i=n.length;if(i!==+i){var a=w.keys(n);i=a.length}if(A(n,function(o,c,l){c=a?a[--i]:--i,u?r=t.call(e,r,n[c],c,l):(r=n[c],u=!0)}),!u)throw new TypeError(O);return r},w.find=w.detect=function(n,t,r){var e;return E(n,function(n,u,i){return t.call(r,n,u,i)?(e=n,!0):void 0}),e},w.filter=w.select=function(n,t,r){var e=[];return null==n?e:g&&n.filter===g?n.filter(t,r):(A(n,function(n,u,i){t.call(r,n,u,i)&&(e[e.length]=n)}),e)},w.reject=function(n,t,r){return w.filter(n,function(n,e,u){return!t.call(r,n,e,u)},r)},w.every=w.all=function(n,t,e){t||(t=w.identity);var u=!0;return null==n?u:d&&n.every===d?n.every(t,e):(A(n,function(n,i,a){return(u=u&&t.call(e,n,i,a))?void 0:r}),!!u)};var E=w.some=w.any=function(n,t,e){t||(t=w.identity);var u=!1;return null==n?u:m&&n.some===m?n.some(t,e):(A(n,function(n,i,a){return u||(u=t.call(e,n,i,a))?r:void 0}),!!u)};w.contains=w.include=function(n,t){return null==n?!1:y&&n.indexOf===y?-1!=n.indexOf(t):E(n,function(n){return n===t})},w.invoke=function(n,t){var r=o.call(arguments,2);return w.map(n,function(n){return(w.isFunction(t)?t:n[t]).apply(n,r)})},w.pluck=function(n,t){return w.map(n,function(n){return n[t]})},w.where=function(n,t){return w.isEmpty(t)?[]:w.filter(n,function(n){for(var r in t)if(t[r]!==n[r])return!1;return!0})},w.max=function(n,t,r){if(!t&&w.isArray(n)&&n[0]===+n[0]&&65535>n.length)return Math.max.apply(Math,n);if(!t&&w.isEmpty(n))return-1/0;var e={computed:-1/0,value:-1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;a>=e.computed&&(e={value:n,computed:a})}),e.value},w.min=function(n,t,r){if(!t&&w.isArray(n)&&n[0]===+n[0]&&65535>n.length)return Math.min.apply(Math,n);if(!t&&w.isEmpty(n))return 1/0;var e={computed:1/0,value:1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;e.computed>a&&(e={value:n,computed:a})}),e.value},w.shuffle=function(n){var t,r=0,e=[];return A(n,function(n){t=w.random(r++),e[r-1]=e[t],e[t]=n}),e};var F=function(n){return w.isFunction(n)?n:function(t){return t[n]}};w.sortBy=function(n,t,r){var e=F(t);return w.pluck(w.map(n,function(n,t,u){return{value:n,index:t,criteria:e.call(r,n,t,u)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||void 0===r)return 1;if(e>r||void 0===e)return-1}return n.index<t.index?-1:1}),"value")};var k=function(n,t,r,e){var u={},i=F(t||w.identity);return A(n,function(t,a){var o=i.call(r,t,a,n);e(u,o,t)}),u};w.groupBy=function(n,t,r){return k(n,t,r,function(n,t,r){(w.has(n,t)?n[t]:n[t]=[]).push(r)})},w.countBy=function(n,t,r){return k(n,t,r,function(n,t){w.has(n,t)||(n[t]=0),n[t]++})},w.sortedIndex=function(n,t,r,e){r=null==r?w.identity:F(r);for(var u=r.call(e,t),i=0,a=n.length;a>i;){var o=i+a>>>1;u>r.call(e,n[o])?i=o+1:a=o}return i},w.toArray=function(n){return n?w.isArray(n)?o.call(n):n.length===+n.length?w.map(n,w.identity):w.values(n):[]},w.size=function(n){return null==n?0:n.length===+n.length?n.length:w.keys(n).length},w.first=w.head=w.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:o.call(n,0,t)},w.initial=function(n,t,r){return o.call(n,0,n.length-(null==t||r?1:t))},w.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:o.call(n,Math.max(n.length-t,0))},w.rest=w.tail=w.drop=function(n,t,r){return o.call(n,null==t||r?1:t)},w.compact=function(n){return w.filter(n,w.identity)};var R=function(n,t,r){return A(n,function(n){w.isArray(n)?t?a.apply(r,n):R(n,t,r):r.push(n)}),r};w.flatten=function(n,t){return R(n,t,[])},w.without=function(n){return w.difference(n,o.call(arguments,1))},w.uniq=w.unique=function(n,t,r,e){w.isFunction(t)&&(e=r,r=t,t=!1);var u=r?w.map(n,r,e):n,i=[],a=[];return A(u,function(r,e){(t?e&&a[a.length-1]===r:w.contains(a,r))||(a.push(r),i.push(n[e]))}),i},w.union=function(){return w.uniq(c.apply(e,arguments))},w.intersection=function(n){var t=o.call(arguments,1);return w.filter(w.uniq(n),function(n){return w.every(t,function(t){return w.indexOf(t,n)>=0})})},w.difference=function(n){var t=c.apply(e,o.call(arguments,1));return w.filter(n,function(n){return!w.contains(t,n)})},w.zip=function(){for(var n=o.call(arguments),t=w.max(w.pluck(n,"length")),r=Array(t),e=0;t>e;e++)r[e]=w.pluck(n,""+e);return r},w.object=function(n,t){if(null==n)return{};for(var r={},e=0,u=n.length;u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},w.indexOf=function(n,t,r){if(null==n)return-1;var e=0,u=n.length;if(r){if("number"!=typeof r)return e=w.sortedIndex(n,t),n[e]===t?e:-1;e=0>r?Math.max(0,u+r):r}if(y&&n.indexOf===y)return n.indexOf(t,r);for(;u>e;e++)if(n[e]===t)return e;return-1},w.lastIndexOf=function(n,t,r){if(null==n)return-1;var e=null!=r;if(b&&n.lastIndexOf===b)return e?n.lastIndexOf(t,r):n.lastIndexOf(t);for(var u=e?r:n.length;u--;)if(n[u]===t)return u;return-1},w.range=function(n,t,r){1>=arguments.length&&(t=n||0,n=0),r=arguments[2]||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=0,i=Array(e);e>u;)i[u++]=n,n+=r;return i};var I=function(){};w.bind=function(n,t){var r,e;if(n.bind===j&&j)return j.apply(n,o.call(arguments,1));if(!w.isFunction(n))throw new TypeError;return r=o.call(arguments,2),e=function(){if(!(this instanceof e))return n.apply(t,r.concat(o.call(arguments)));I.prototype=n.prototype;var u=new I;I.prototype=null;var i=n.apply(u,r.concat(o.call(arguments)));return Object(i)===i?i:u}},w.bindAll=function(n){var t=o.call(arguments,1);return 0==t.length&&(t=w.functions(n)),A(t,function(t){n[t]=w.bind(n[t],n)}),n},w.memoize=function(n,t){var r={};return t||(t=w.identity),function(){var e=t.apply(this,arguments);return w.has(r,e)?r[e]:r[e]=n.apply(this,arguments)}},w.delay=function(n,t){var r=o.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},w.defer=function(n){return w.delay.apply(w,[n,1].concat(o.call(arguments,1)))},w.throttle=function(n,t){var r,e,u,i,a=0,o=function(){a=new Date,u=null,i=n.apply(r,e)};return function(){var c=new Date,l=t-(c-a);return r=this,e=arguments,0>=l?(clearTimeout(u),u=null,a=c,i=n.apply(r,e)):u||(u=setTimeout(o,l)),i}},w.debounce=function(n,t,r){var e,u;return function(){var i=this,a=arguments,o=function(){e=null,r||(u=n.apply(i,a))},c=r&&!e;return clearTimeout(e),e=setTimeout(o,t),c&&(u=n.apply(i,a)),u}},w.once=function(n){var t,r=!1;return function(){return r?t:(r=!0,t=n.apply(this,arguments),n=null,t)}},w.wrap=function(n,t){return function(){var r=[n];return a.apply(r,arguments),t.apply(this,r)}},w.compose=function(){var n=arguments;return function(){for(var t=arguments,r=n.length-1;r>=0;r--)t=[n[r].apply(this,t)];return t[0]}},w.after=function(n,t){return 0>=n?t():function(){return 1>--n?t.apply(this,arguments):void 0}},w.keys=_||function(n){if(n!==Object(n))throw new TypeError("Invalid object");var t=[];for(var r in n)w.has(n,r)&&(t[t.length]=r);return t},w.values=function(n){var t=[];for(var r in n)w.has(n,r)&&t.push(n[r]);return t},w.pairs=function(n){var t=[];for(var r in n)w.has(n,r)&&t.push([r,n[r]]);return t},w.invert=function(n){var t={};for(var r in n)w.has(n,r)&&(t[n[r]]=r);return t},w.functions=w.methods=function(n){var t=[];for(var r in n)w.isFunction(n[r])&&t.push(r);return t.sort()},w.extend=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]=t[r]}),n},w.pick=function(n){var t={},r=c.apply(e,o.call(arguments,1));return A(r,function(r){r in n&&(t[r]=n[r])}),t},w.omit=function(n){var t={},r=c.apply(e,o.call(arguments,1));for(var u in n)w.contains(r,u)||(t[u]=n[u]);return t},w.defaults=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)null==n[r]&&(n[r]=t[r])}),n},w.clone=function(n){return w.isObject(n)?w.isArray(n)?n.slice():w.extend({},n):n},w.tap=function(n,t){return t(n),n};var S=function(n,t,r,e){if(n===t)return 0!==n||1/n==1/t;if(null==n||null==t)return n===t;n instanceof w&&(n=n._wrapped),t instanceof w&&(t=t._wrapped);var u=l.call(n);if(u!=l.call(t))return!1;switch(u){case"[object String]":return n==t+"";case"[object Number]":return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;case"[object Date]":case"[object Boolean]":return+n==+t;case"[object RegExp]":return n.source==t.source&&n.global==t.global&&n.multiline==t.multiline&&n.ignoreCase==t.ignoreCase}if("object"!=typeof n||"object"!=typeof t)return!1;for(var i=r.length;i--;)if(r[i]==n)return e[i]==t;r.push(n),e.push(t);var a=0,o=!0;if("[object Array]"==u){if(a=n.length,o=a==t.length)for(;a--&&(o=S(n[a],t[a],r,e)););}else{var c=n.constructor,f=t.constructor;if(c!==f&&!(w.isFunction(c)&&c instanceof c&&w.isFunction(f)&&f instanceof f))return!1;for(var s in n)if(w.has(n,s)&&(a++,!(o=w.has(t,s)&&S(n[s],t[s],r,e))))break;if(o){for(s in t)if(w.has(t,s)&&!a--)break;o=!a}}return r.pop(),e.pop(),o};w.isEqual=function(n,t){return S(n,t,[],[])},w.isEmpty=function(n){if(null==n)return!0;if(w.isArray(n)||w.isString(n))return 0===n.length;for(var t in n)if(w.has(n,t))return!1;return!0},w.isElement=function(n){return!(!n||1!==n.nodeType)},w.isArray=x||function(n){return"[object Array]"==l.call(n)},w.isObject=function(n){return n===Object(n)},A(["Arguments","Function","String","Number","Date","RegExp"],function(n){w["is"+n]=function(t){return l.call(t)=="[object "+n+"]"}}),w.isArguments(arguments)||(w.isArguments=function(n){return!(!n||!w.has(n,"callee"))}),w.isFunction=function(n){return"function"==typeof n},w.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},w.isNaN=function(n){return w.isNumber(n)&&n!=+n},w.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"==l.call(n)},w.isNull=function(n){return null===n},w.isUndefined=function(n){return void 0===n},w.has=function(n,t){return f.call(n,t)},w.noConflict=function(){return n._=t,this},w.identity=function(n){return n},w.times=function(n,t,r){for(var e=Array(n),u=0;n>u;u++)e[u]=t.call(r,u);return e},w.random=function(n,t){return null==t&&(t=n,n=0),n+(0|Math.random()*(t-n+1))};var T={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","/":"&#x2F;"}};T.unescape=w.invert(T.escape);var M={escape:RegExp("["+w.keys(T.escape).join("")+"]","g"),unescape:RegExp("("+w.keys(T.unescape).join("|")+")","g")};w.each(["escape","unescape"],function(n){w[n]=function(t){return null==t?"":(""+t).replace(M[n],function(t){return T[n][t]})}}),w.result=function(n,t){if(null==n)return null;var r=n[t];return w.isFunction(r)?r.call(n):r},w.mixin=function(n){A(w.functions(n),function(t){var r=w[t]=n[t];w.prototype[t]=function(){var n=[this._wrapped];return a.apply(n,arguments),z.call(this,r.apply(w,n))}})};var N=0;w.uniqueId=function(n){var t=""+ ++N;return n?n+t:t},w.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var q=/(.)^/,B={"'":"'","\\":"\\","\r":"r","\n":"n","	":"t","\u2028":"u2028","\u2029":"u2029"},D=/\\|'|\r|\n|\t|\u2028|\u2029/g;w.template=function(n,t,r){r=w.defaults({},r,w.templateSettings);var e=RegExp([(r.escape||q).source,(r.interpolate||q).source,(r.evaluate||q).source].join("|")+"|$","g"),u=0,i="__p+='";n.replace(e,function(t,r,e,a,o){return i+=n.slice(u,o).replace(D,function(n){return"\\"+B[n]}),r&&(i+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'"),e&&(i+="'+\n((__t=("+e+"))==null?'':__t)+\n'"),a&&(i+="';\n"+a+"\n__p+='"),u=o+t.length,t}),i+="';\n",r.variable||(i="with(obj||{}){\n"+i+"}\n"),i="var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n"+i+"return __p;\n";try{var a=Function(r.variable||"obj","_",i)}catch(o){throw o.source=i,o}if(t)return a(t,w);var c=function(n){return a.call(this,n,w)};return c.source="function("+(r.variable||"obj")+"){\n"+i+"}",c},w.chain=function(n){return w(n).chain()};var z=function(n){return this._chain?w(n).chain():n};w.mixin(w),A(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=e[n];w.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!=n&&"splice"!=n||0!==r.length||delete r[0],z.call(this,r)}}),A(["concat","join","slice"],function(n){var t=e[n];w.prototype[n]=function(){return z.call(this,t.apply(this._wrapped,arguments))}}),w.extend(w.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped}})}).call(this);
// Backbone.js 0.9.10

// (c) 2010-2012 Jeremy Ashkenas, DocumentCloud Inc.
// Backbone may be freely distributed under the MIT license.
// For all details and documentation:
// http://backbonejs.org
(function(){var n=this,B=n.Backbone,h=[],C=h.push,u=h.slice,D=h.splice,g;g="undefined"!==typeof exports?exports:n.Backbone={};g.VERSION="0.9.10";var f=n._;!f&&"undefined"!==typeof require&&(f=require("underscore"));g.$=n.jQuery||n.Zepto||n.ender;g.noConflict=function(){n.Backbone=B;return this};g.emulateHTTP=!1;g.emulateJSON=!1;var v=/\s+/,q=function(a,b,c,d){if(!c)return!0;if("object"===typeof c)for(var e in c)a[b].apply(a,[e,c[e]].concat(d));else if(v.test(c)){c=c.split(v);e=0;for(var f=c.length;e<
    f;e++)a[b].apply(a,[c[e]].concat(d))}else return!0},w=function(a,b){var c,d=-1,e=a.length;switch(b.length){case 0:for(;++d<e;)(c=a[d]).callback.call(c.ctx);break;case 1:for(;++d<e;)(c=a[d]).callback.call(c.ctx,b[0]);break;case 2:for(;++d<e;)(c=a[d]).callback.call(c.ctx,b[0],b[1]);break;case 3:for(;++d<e;)(c=a[d]).callback.call(c.ctx,b[0],b[1],b[2]);break;default:for(;++d<e;)(c=a[d]).callback.apply(c.ctx,b)}},h=g.Events={on:function(a,b,c){if(!q(this,"on",a,[b,c])||!b)return this;this._events||(this._events=
{});(this._events[a]||(this._events[a]=[])).push({callback:b,context:c,ctx:c||this});return this},once:function(a,b,c){if(!q(this,"once",a,[b,c])||!b)return this;var d=this,e=f.once(function(){d.off(a,e);b.apply(this,arguments)});e._callback=b;this.on(a,e,c);return this},off:function(a,b,c){var d,e,t,g,j,l,k,h;if(!this._events||!q(this,"off",a,[b,c]))return this;if(!a&&!b&&!c)return this._events={},this;g=a?[a]:f.keys(this._events);j=0;for(l=g.length;j<l;j++)if(a=g[j],d=this._events[a]){t=[];if(b||
    c){k=0;for(h=d.length;k<h;k++)e=d[k],(b&&b!==e.callback&&b!==e.callback._callback||c&&c!==e.context)&&t.push(e)}this._events[a]=t}return this},trigger:function(a){if(!this._events)return this;var b=u.call(arguments,1);if(!q(this,"trigger",a,b))return this;var c=this._events[a],d=this._events.all;c&&w(c,b);d&&w(d,arguments);return this},listenTo:function(a,b,c){var d=this._listeners||(this._listeners={}),e=a._listenerId||(a._listenerId=f.uniqueId("l"));d[e]=a;a.on(b,"object"===typeof b?this:c,this);
    return this},stopListening:function(a,b,c){var d=this._listeners;if(d){if(a)a.off(b,"object"===typeof b?this:c,this),!b&&!c&&delete d[a._listenerId];else{"object"===typeof b&&(c=this);for(var e in d)d[e].off(b,c,this);this._listeners={}}return this}}};h.bind=h.on;h.unbind=h.off;f.extend(g,h);var r=g.Model=function(a,b){var c,d=a||{};this.cid=f.uniqueId("c");this.attributes={};b&&b.collection&&(this.collection=b.collection);b&&b.parse&&(d=this.parse(d,b)||{});if(c=f.result(this,"defaults"))d=f.defaults({},
    d,c);this.set(d,b);this.changed={};this.initialize.apply(this,arguments)};f.extend(r.prototype,h,{changed:null,idAttribute:"id",initialize:function(){},toJSON:function(){return f.clone(this.attributes)},sync:function(){return g.sync.apply(this,arguments)},get:function(a){return this.attributes[a]},escape:function(a){return f.escape(this.get(a))},has:function(a){return null!=this.get(a)},set:function(a,b,c){var d,e,g,p,j,l,k;if(null==a)return this;"object"===typeof a?(e=a,c=b):(e={})[a]=b;c||(c={});
    if(!this._validate(e,c))return!1;g=c.unset;p=c.silent;a=[];j=this._changing;this._changing=!0;j||(this._previousAttributes=f.clone(this.attributes),this.changed={});k=this.attributes;l=this._previousAttributes;this.idAttribute in e&&(this.id=e[this.idAttribute]);for(d in e)b=e[d],f.isEqual(k[d],b)||a.push(d),f.isEqual(l[d],b)?delete this.changed[d]:this.changed[d]=b,g?delete k[d]:k[d]=b;if(!p){a.length&&(this._pending=!0);b=0;for(d=a.length;b<d;b++)this.trigger("change:"+a[b],this,k[a[b]],c)}if(j)return this;
    if(!p)for(;this._pending;)this._pending=!1,this.trigger("change",this,c);this._changing=this._pending=!1;return this},unset:function(a,b){return this.set(a,void 0,f.extend({},b,{unset:!0}))},clear:function(a){var b={},c;for(c in this.attributes)b[c]=void 0;return this.set(b,f.extend({},a,{unset:!0}))},hasChanged:function(a){return null==a?!f.isEmpty(this.changed):f.has(this.changed,a)},changedAttributes:function(a){if(!a)return this.hasChanged()?f.clone(this.changed):!1;var b,c=!1,d=this._changing?
    this._previousAttributes:this.attributes,e;for(e in a)if(!f.isEqual(d[e],b=a[e]))(c||(c={}))[e]=b;return c},previous:function(a){return null==a||!this._previousAttributes?null:this._previousAttributes[a]},previousAttributes:function(){return f.clone(this._previousAttributes)},fetch:function(a){a=a?f.clone(a):{};void 0===a.parse&&(a.parse=!0);var b=a.success;a.success=function(a,d,e){if(!a.set(a.parse(d,e),e))return!1;b&&b(a,d,e)};return this.sync("read",this,a)},save:function(a,b,c){var d,e,g=this.attributes;
    null==a||"object"===typeof a?(d=a,c=b):(d={})[a]=b;if(d&&(!c||!c.wait)&&!this.set(d,c))return!1;c=f.extend({validate:!0},c);if(!this._validate(d,c))return!1;d&&c.wait&&(this.attributes=f.extend({},g,d));void 0===c.parse&&(c.parse=!0);e=c.success;c.success=function(a,b,c){a.attributes=g;var k=a.parse(b,c);c.wait&&(k=f.extend(d||{},k));if(f.isObject(k)&&!a.set(k,c))return!1;e&&e(a,b,c)};a=this.isNew()?"create":c.patch?"patch":"update";"patch"===a&&(c.attrs=d);a=this.sync(a,this,c);d&&c.wait&&(this.attributes=
        g);return a},destroy:function(a){a=a?f.clone(a):{};var b=this,c=a.success,d=function(){b.trigger("destroy",b,b.collection,a)};a.success=function(a,b,e){(e.wait||a.isNew())&&d();c&&c(a,b,e)};if(this.isNew())return a.success(this,null,a),!1;var e=this.sync("delete",this,a);a.wait||d();return e},url:function(){var a=f.result(this,"urlRoot")||f.result(this.collection,"url")||x();return this.isNew()?a:a+("/"===a.charAt(a.length-1)?"":"/")+encodeURIComponent(this.id)},parse:function(a){return a},clone:function(){return new this.constructor(this.attributes)},
    isNew:function(){return null==this.id},isValid:function(a){return!this.validate||!this.validate(this.attributes,a)},_validate:function(a,b){if(!b.validate||!this.validate)return!0;a=f.extend({},this.attributes,a);var c=this.validationError=this.validate(a,b)||null;if(!c)return!0;this.trigger("invalid",this,c,b||{});return!1}});var s=g.Collection=function(a,b){b||(b={});b.model&&(this.model=b.model);void 0!==b.comparator&&(this.comparator=b.comparator);this.models=[];this._reset();this.initialize.apply(this,
    arguments);a&&this.reset(a,f.extend({silent:!0},b))};f.extend(s.prototype,h,{model:r,initialize:function(){},toJSON:function(a){return this.map(function(b){return b.toJSON(a)})},sync:function(){return g.sync.apply(this,arguments)},add:function(a,b){a=f.isArray(a)?a.slice():[a];b||(b={});var c,d,e,g,p,j,l,k,h,m;l=[];k=b.at;h=this.comparator&&null==k&&!1!=b.sort;m=f.isString(this.comparator)?this.comparator:null;c=0;for(d=a.length;c<d;c++)(e=this._prepareModel(g=a[c],b))?(p=this.get(e))?b.merge&&(p.set(g===
    e?e.attributes:g,b),h&&(!j&&p.hasChanged(m))&&(j=!0)):(l.push(e),e.on("all",this._onModelEvent,this),this._byId[e.cid]=e,null!=e.id&&(this._byId[e.id]=e)):this.trigger("invalid",this,g,b);l.length&&(h&&(j=!0),this.length+=l.length,null!=k?D.apply(this.models,[k,0].concat(l)):C.apply(this.models,l));j&&this.sort({silent:!0});if(b.silent)return this;c=0;for(d=l.length;c<d;c++)(e=l[c]).trigger("add",e,this,b);j&&this.trigger("sort",this,b);return this},remove:function(a,b){a=f.isArray(a)?a.slice():[a];
    b||(b={});var c,d,e,g;c=0;for(d=a.length;c<d;c++)if(g=this.get(a[c]))delete this._byId[g.id],delete this._byId[g.cid],e=this.indexOf(g),this.models.splice(e,1),this.length--,b.silent||(b.index=e,g.trigger("remove",g,this,b)),this._removeReference(g);return this},push:function(a,b){a=this._prepareModel(a,b);this.add(a,f.extend({at:this.length},b));return a},pop:function(a){var b=this.at(this.length-1);this.remove(b,a);return b},unshift:function(a,b){a=this._prepareModel(a,b);this.add(a,f.extend({at:0},
    b));return a},shift:function(a){var b=this.at(0);this.remove(b,a);return b},slice:function(a,b){return this.models.slice(a,b)},get:function(a){if(null!=a)return this._idAttr||(this._idAttr=this.model.prototype.idAttribute),this._byId[a.id||a.cid||a[this._idAttr]||a]},at:function(a){return this.models[a]},where:function(a){return f.isEmpty(a)?[]:this.filter(function(b){for(var c in a)if(a[c]!==b.get(c))return!1;return!0})},sort:function(a){if(!this.comparator)throw Error("Cannot sort a set without a comparator");
    a||(a={});f.isString(this.comparator)||1===this.comparator.length?this.models=this.sortBy(this.comparator,this):this.models.sort(f.bind(this.comparator,this));a.silent||this.trigger("sort",this,a);return this},pluck:function(a){return f.invoke(this.models,"get",a)},update:function(a,b){b=f.extend({add:!0,merge:!0,remove:!0},b);b.parse&&(a=this.parse(a,b));var c,d,e,g,h=[],j=[],l={};f.isArray(a)||(a=a?[a]:[]);if(b.add&&!b.remove)return this.add(a,b);d=0;for(e=a.length;d<e;d++)c=a[d],g=this.get(c),
    b.remove&&g&&(l[g.cid]=!0),(b.add&&!g||b.merge&&g)&&h.push(c);if(b.remove){d=0;for(e=this.models.length;d<e;d++)c=this.models[d],l[c.cid]||j.push(c)}j.length&&this.remove(j,b);h.length&&this.add(h,b);return this},reset:function(a,b){b||(b={});b.parse&&(a=this.parse(a,b));for(var c=0,d=this.models.length;c<d;c++)this._removeReference(this.models[c]);b.previousModels=this.models.slice();this._reset();a&&this.add(a,f.extend({silent:!0},b));b.silent||this.trigger("reset",this,b);return this},fetch:function(a){a=
    a?f.clone(a):{};void 0===a.parse&&(a.parse=!0);var b=a.success;a.success=function(a,d,e){a[e.update?"update":"reset"](d,e);b&&b(a,d,e)};return this.sync("read",this,a)},create:function(a,b){b=b?f.clone(b):{};if(!(a=this._prepareModel(a,b)))return!1;b.wait||this.add(a,b);var c=this,d=b.success;b.success=function(a,b,f){f.wait&&c.add(a,f);d&&d(a,b,f)};a.save(null,b);return a},parse:function(a){return a},clone:function(){return new this.constructor(this.models)},_reset:function(){this.length=0;this.models.length=
    0;this._byId={}},_prepareModel:function(a,b){if(a instanceof r)return a.collection||(a.collection=this),a;b||(b={});b.collection=this;var c=new this.model(a,b);return!c._validate(a,b)?!1:c},_removeReference:function(a){this===a.collection&&delete a.collection;a.off("all",this._onModelEvent,this)},_onModelEvent:function(a,b,c,d){("add"===a||"remove"===a)&&c!==this||("destroy"===a&&this.remove(b,d),b&&a==="change:"+b.idAttribute&&(delete this._byId[b.previous(b.idAttribute)],null!=b.id&&(this._byId[b.id]=
    b)),this.trigger.apply(this,arguments))},sortedIndex:function(a,b,c){b||(b=this.comparator);var d=f.isFunction(b)?b:function(a){return a.get(b)};return f.sortedIndex(this.models,a,d,c)}});f.each("forEach each map collect reduce foldl inject reduceRight foldr find detect filter select reject every all some any include contains invoke max min toArray size first head take initial rest tail drop last without indexOf shuffle lastIndexOf isEmpty chain".split(" "),function(a){s.prototype[a]=function(){var b=
    u.call(arguments);b.unshift(this.models);return f[a].apply(f,b)}});f.each(["groupBy","countBy","sortBy"],function(a){s.prototype[a]=function(b,c){var d=f.isFunction(b)?b:function(a){return a.get(b)};return f[a](this.models,d,c)}});var y=g.Router=function(a){a||(a={});a.routes&&(this.routes=a.routes);this._bindRoutes();this.initialize.apply(this,arguments)},E=/\((.*?)\)/g,F=/(\(\?)?:\w+/g,G=/\*\w+/g,H=/[\-{}\[\]+?.,\\\^$|#\s]/g;f.extend(y.prototype,h,{initialize:function(){},route:function(a,b,c){f.isRegExp(a)||
(a=this._routeToRegExp(a));c||(c=this[b]);g.history.route(a,f.bind(function(d){d=this._extractParameters(a,d);c&&c.apply(this,d);this.trigger.apply(this,["route:"+b].concat(d));this.trigger("route",b,d);g.history.trigger("route",this,b,d)},this));return this},navigate:function(a,b){g.history.navigate(a,b);return this},_bindRoutes:function(){if(this.routes)for(var a,b=f.keys(this.routes);null!=(a=b.pop());)this.route(a,this.routes[a])},_routeToRegExp:function(a){a=a.replace(H,"\\$&").replace(E,"(?:$1)?").replace(F,
    function(a,c){return c?a:"([^/]+)"}).replace(G,"(.*?)");return RegExp("^"+a+"$")},_extractParameters:function(a,b){return a.exec(b).slice(1)}});var m=g.History=function(){this.handlers=[];f.bindAll(this,"checkUrl");"undefined"!==typeof window&&(this.location=window.location,this.history=window.history)},z=/^[#\/]|\s+$/g,I=/^\/+|\/+$/g,J=/msie [\w.]+/,K=/\/$/;m.started=!1;f.extend(m.prototype,h,{interval:50,getHash:function(a){return(a=(a||this).location.href.match(/#(.*)$/))?a[1]:""},getFragment:function(a,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  b){if(null==a)if(this._hasPushState||!this._wantsHashChange||b){a=this.location.pathname;var c=this.root.replace(K,"");a.indexOf(c)||(a=a.substr(c.length))}else a=this.getHash();return a.replace(z,"")},start:function(a){if(m.started)throw Error("Backbone.history has already been started");m.started=!0;this.options=f.extend({},{root:"/"},this.options,a);this.root=this.options.root;this._wantsHashChange=!1!==this.options.hashChange;this._wantsPushState=!!this.options.pushState;this._hasPushState=!(!this.options.pushState||
    !this.history||!this.history.pushState);a=this.getFragment();var b=document.documentMode,b=J.exec(navigator.userAgent.toLowerCase())&&(!b||7>=b);this.root=("/"+this.root+"/").replace(I,"/");b&&this._wantsHashChange&&(this.iframe=g.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow,this.navigate(a));if(this._hasPushState)g.$(window).on("popstate",this.checkUrl);else if(this._wantsHashChange&&"onhashchange"in window&&!b)g.$(window).on("hashchange",this.checkUrl);
else this._wantsHashChange&&(this._checkUrlInterval=setInterval(this.checkUrl,this.interval));this.fragment=a;a=this.location;b=a.pathname.replace(/[^\/]$/,"$&/")===this.root;if(this._wantsHashChange&&this._wantsPushState&&!this._hasPushState&&!b)return this.fragment=this.getFragment(null,!0),this.location.replace(this.root+this.location.search+"#"+this.fragment),!0;this._wantsPushState&&(this._hasPushState&&b&&a.hash)&&(this.fragment=this.getHash().replace(z,""),this.history.replaceState({},document.title,
    this.root+this.fragment+a.search));if(!this.options.silent)return this.loadUrl()},stop:function(){g.$(window).off("popstate",this.checkUrl).off("hashchange",this.checkUrl);clearInterval(this._checkUrlInterval);m.started=!1},route:function(a,b){this.handlers.unshift({route:a,callback:b})},checkUrl:function(){var a=this.getFragment();a===this.fragment&&this.iframe&&(a=this.getFragment(this.getHash(this.iframe)));if(a===this.fragment)return!1;this.iframe&&this.navigate(a);this.loadUrl()||this.loadUrl(this.getHash())},
    loadUrl:function(a){var b=this.fragment=this.getFragment(a);return f.any(this.handlers,function(a){if(a.route.test(b))return a.callback(b),!0})},navigate:function(a,b){if(!m.started)return!1;if(!b||!0===b)b={trigger:b};a=this.getFragment(a||"");if(this.fragment!==a){this.fragment=a;var c=this.root+a;if(this._hasPushState)this.history[b.replace?"replaceState":"pushState"]({},document.title,c);else if(this._wantsHashChange)this._updateHash(this.location,a,b.replace),this.iframe&&a!==this.getFragment(this.getHash(this.iframe))&&
        (b.replace||this.iframe.document.open().close(),this._updateHash(this.iframe.location,a,b.replace));else return this.location.assign(c);b.trigger&&this.loadUrl(a)}},_updateHash:function(a,b,c){c?(c=a.href.replace(/(javascript:|#).*$/,""),a.replace(c+"#"+b)):a.hash="#"+b}});g.history=new m;var A=g.View=function(a){this.cid=f.uniqueId("view");this._configure(a||{});this._ensureElement();this.initialize.apply(this,arguments);this.delegateEvents()},L=/^(\S+)\s*(.*)$/,M="model collection el id attributes className tagName events".split(" ");
    f.extend(A.prototype,h,{tagName:"div",$:function(a){return this.$el.find(a)},initialize:function(){},render:function(){return this},remove:function(){this.$el.remove();this.stopListening();return this},setElement:function(a,b){this.$el&&this.undelegateEvents();this.$el=a instanceof g.$?a:g.$(a);this.el=this.$el[0];!1!==b&&this.delegateEvents();return this},delegateEvents:function(a){if(a||(a=f.result(this,"events"))){this.undelegateEvents();for(var b in a){var c=a[b];f.isFunction(c)||(c=this[a[b]]);
        if(!c)throw Error('Method "'+a[b]+'" does not exist');var d=b.match(L),e=d[1],d=d[2],c=f.bind(c,this),e=e+(".delegateEvents"+this.cid);if(""===d)this.$el.on(e,c);else this.$el.on(e,d,c)}}},undelegateEvents:function(){this.$el.off(".delegateEvents"+this.cid)},_configure:function(a){this.options&&(a=f.extend({},f.result(this,"options"),a));f.extend(this,f.pick(a,M));this.options=a},_ensureElement:function(){if(this.el)this.setElement(f.result(this,"el"),!1);else{var a=f.extend({},f.result(this,"attributes"));
        this.id&&(a.id=f.result(this,"id"));this.className&&(a["class"]=f.result(this,"className"));a=g.$("<"+f.result(this,"tagName")+">").attr(a);this.setElement(a,!1)}}});var N={create:"POST",update:"PUT",patch:"PATCH","delete":"DELETE",read:"GET"};g.sync=function(a,b,c){var d=N[a];f.defaults(c||(c={}),{emulateHTTP:g.emulateHTTP,emulateJSON:g.emulateJSON});var e={type:d,dataType:"json"};c.url||(e.url=f.result(b,"url")||x());if(null==c.data&&b&&("create"===a||"update"===a||"patch"===a))e.contentType="application/json",
        e.data=JSON.stringify(c.attrs||b.toJSON(c));c.emulateJSON&&(e.contentType="application/x-www-form-urlencoded",e.data=e.data?{model:e.data}:{});if(c.emulateHTTP&&("PUT"===d||"DELETE"===d||"PATCH"===d)){e.type="POST";c.emulateJSON&&(e.data._method=d);var h=c.beforeSend;c.beforeSend=function(a){a.setRequestHeader("X-HTTP-Method-Override",d);if(h)return h.apply(this,arguments)}}"GET"!==e.type&&!c.emulateJSON&&(e.processData=!1);var m=c.success;c.success=function(a){m&&m(b,a,c);b.trigger("sync",b,a,c)};
        var j=c.error;c.error=function(a){j&&j(b,a,c);b.trigger("error",b,a,c)};a=c.xhr=g.ajax(f.extend(e,c));b.trigger("request",b,a,c);return a};g.ajax=function(){return g.$.ajax.apply(g.$,arguments)};r.extend=s.extend=y.extend=A.extend=m.extend=function(a,b){var c=this,d;d=a&&f.has(a,"constructor")?a.constructor:function(){return c.apply(this,arguments)};f.extend(d,c,b);var e=function(){this.constructor=d};e.prototype=c.prototype;d.prototype=new e;a&&f.extend(d.prototype,a);d.__super__=c.prototype;return d};
    var x=function(){throw Error('A "url" property or function must be specified');}}).call(this);
var Utils = function(){
    var self = this;
    $('body').append($('<div class="save-message"></div>'));
    this.$message=$('div.save-message');
    $(window).bind('show-message',function(e,cfg){ self.showMessage(e,cfg);});
};

Utils.prototype.showMessage = function(e,cfg){
    var self = this,
        msg = cfg.msg,
        time = cfg.time || 2000,
        hide = function(){
            self.$message.fadeOut(function(){
                self.$message.removeClass('shown').removeAttr('style');
            });
        };
    self.$message.html(msg).addClass('shown');
    if (time>0){
        setTimeout(hide,time);
    }
};


Utils.prototype.textToId = function(s){
    return s.toLowerCase().replace(/ /g,'-');
};

var utils = new Utils();
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
var offline_storage = function(dbName){
    this.db = openDatabase(dbName, "1.0", dbName, 200000);
    this.dataset = {};
};



offline_storage.prototype.onError = function(tx, error) {
    console.log(tx,error.message);
};


offline_storage.prototype.create_table = function(tbName){
    var self = this,
        createStatement = "CREATE TABLE IF NOT EXISTS " + tbName + " (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, commit_sent INT DEFAULT 0, commit_saved INT DEFAULT 0, name TEXT, content TEXT, change_saved DATETIME DEFAULT CURRENT_TIMESTAMP)";
    self.db.transaction(function(tx) {
        tx.executeSql(createStatement, [], function(){self.showRecords(tbName);}, self.onError);
    });

};

offline_storage.prototype.showRecords = function(tbName, callback) {
    var self = this,
        selectAllStatement = "SELECT * FROM " + tbName + " where commit_saved=0";
//    results.innerHTML = '';
    self.db.transaction(function(tx) {
        tx.executeSql(selectAllStatement, [], function(tx, result) {
            self.dataset = result.rows;
            if (callback) callback(self.dataset)
//            for (var i = 0, item = null; i < dataset.length; i++) {
//                item = dataset.item(i);
//                results.innerHTML +=
//                '<li>' + item['lastName'] + ' , ' + item['firstName'] + ' <a href="#" onclick="loadRecord('+i+')">edit</a>  ' +
//                '<a href="#" onclick="deleteRecord('+item['id']+')">delete</a></li>';
//            }
        });
    });
};

offline_storage.prototype.loadRecord = function(i) {
    var item = this.dataset.item(i);
//    firstName.value = item['user'];
//    lastName.value = item['content'];
//    phone.value = item['phone'];
//    id.value = item['id'];
    return item;
};

offline_storage.prototype.update = function(tbName){
    var self = this,
        updateStatement = "UPDATE " + tbName + " SET firstName = ?, lastName = ?, phone = ? WHERE id = ?";
    self.db.transaction(function(tx) {
        tx.executeSql(updateStatement, [firstName.value, lastName.value, phone.value, id.value], function(){self.loadAndReset()}, self.onError);
    });
};


offline_storage.prototype.insert = function(tbName, content){
    var self = this,
        insertStatement = "INSERT INTO " + tbName + " (user, name, content) VALUES (?, ?, ?)";
    self.db.transaction(function(tx) {
        tx.executeSql(insertStatement, ['', '', content], function(){self.loadAndReset()}, self.onError);
    });

};

offline_storage.prototype.delete = function(tbName){
    var self = this,
        deleteStatement = "DELETE FROM " + tbName + " WHERE id=?";
    self.db.transaction(function(tx) {
        tx.executeSql(deleteStatement, [id], function(){self.showRecords(tbName);}, self.onError);
    });
    self.resetForm();
};

offline_storage.prototype.drop = function(tbName){
    var self = this,
        dropStatement = "DROP TABLE " + tbName + "";
    self.db.transaction(function(tx) {
        tx.executeSql(dropStatement, [], function(){self.showRecords(tbName);}, self.onError);
    });
    self.resetForm();
};

offline_storage.prototype.loadAndReset = function(){
    this.resetForm();
    this.showRecords();
};

offline_storage.prototype.resetForm = function(){
//    firstName.value = '';
//    lastName.value = '';
//    phone.val///ue = '';
//    id.value = '';
};

var OS;
if (typeof openDatabase!='undefined') {
    OS = new offline_storage('posts');
} else {
    OS = {
        showRecords: function(){}
    }
}

//var cache = window.applicationCache;
//
//cache.addEventListener("cached", function () {
//    console.log("All resources for this web app have now been downloaded. You can run this application while not connected to the internet");
//}, false);
//cache.addEventListener("checking", function () {
//    console.log("Checking manifest");
//}, false);
//cache.addEventListener("downloading", function () {
//    console.log("Starting download of cached files");
//}, false);
//cache.addEventListener("error", function (e) {
//    console.log("There was an error in the manifest, downloading cached files or you're offline: " + e);
//}, false);
//cache.addEventListener("noupdate", function () {
//    console.log("There was no update needed");
//}, false);
//cache.addEventListener("progress", function () {
//    console.log("Downloading cached files");
//}, false);
//cache.addEventListener("updateready", function () {
//    cache.swapCache();
//    console.log("Updated cache is ready");
//    Even after swapping the cache the currently loaded page won't use it
//    until it is reloaded, so force a reload so it is current.
//    window.location.reload(true);
//    console.log("Window reloaded");
//}, false);
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
    $('a#edit-page',this.$login).on('click',           function(e){ e.preventDefault(); self.enableEdit(); self.enableDrag();      });
    if (!this.adminUser){ return; }
    this.editableTags.on('mouseenter',   function(e){ e.preventDefault(); self.showEditControls($(this));});
    this.editableTags.on('mouseleave',   function(e){ e.preventDefault(); self.controls.hovering = false; self.hideEditControls(); });
    this.controls.on('mouseenter',       function(){ self.controls.hovering = true; });
    this.controls.on('mouseleave',       function(){ self.clearEditVars(); });
    $('span.plus', this.controls).on('click',          function(){ self.addElement(); });
    $('span.minus',this.controls).on('click',          function(){ self.removeElement(); });
    $('a#save-page',this.$login).on('click',           function(e){ e.preventDefault(); self.savePage();         });

    $(window).bind('online', function(){ self.onlineMode(); });
    $(window).bind('offline', function(){ self.offlineMode(); });
    if (!navigator.onLine){ self.offlineMode(); }

    this.loadOfflineContent();
};

new page_editor();