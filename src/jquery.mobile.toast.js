;(function( $, window, document, undefined ) {

    "use strict";

    /**
     * A jQuery Mobile Android-like Toast Plugin.
     *
     * @class toast
     * @constructor
     * @namespace $.mobile
     * @extends widget
     * @chainable
     * @example
     *     $.mobile.toast({ message: 'Live long and prosper!' });
     */
    $.widget( "mobile.toast", {

        /**
         * Version of the widget
         *
         * @property {String} version
         */
        version: "0.0.7",

        /**
         * Options of this widget
         *
         * @property {Object} options
         */
        options: {
            /**
             * The message of the toast.
             *
             * @attribute {String} message
             * @default ""
             * @example
             *     $.mobile.toast({ message: 'Live long and prosper' });
             * @example
             *     // Change default value
             *     $.mobile.toast.prototype.options.message = 'Live long and prosper';
             */
            message: "",

            /**
             * Duration of message show to the user.
             *
             * @attribute {Number or String} duration
             * @default 2000
             * @example
             *     $.mobile.toast({
             *         message: 'Live long and prosper',
             *         duration: 2000
             *     });
             * @example
             *     // Change default value
             *     $.mobile.toast.prototype.options.duration = 2000;
             */
            duration: 2000,

            /**
             * Optional class to overwrite styling of toast on open.
             *
             * @attribute {String} classOnOpen
             * @default ""
             * @example
             *     $.mobile.toast({
             *         message: 'Live long and prosper',
             *         classOnOpen: 'pomegranate'
             *     });
             * @example
             *     // Change default value
             *     $.mobile.toast.prototype.options.classOnOpen = 'pomegranate';
             */
            classOnOpen: "",

            /**
             * Optional class to overwrite styling of toast on close.
             *
             * @attribute {String} classOnClose
             * @default ""
             * @example
             *     $.mobile.toast({
             *         message: 'Live long and prosper',
             *         classOnClose: 'pomegranate'
             *     });
             * @example
             *     // Change default value
             *     $.mobile.toast.prototype.options.classOnClose = 'pomegranate';
             */
            classOnClose: "",

            /**
             * Before position callback
             *
             * @attribute {function} beforeposition
             * @event beforeposition
             * @default null
             * @example
             *     $.mobile.toast({
             *         message: 'Live long and prosper!',
             *         beforeposition: function( event, ui ){
             *             console.log('beforeposition');
             *         }
             *     });
             * @example
             *     $.mobile.toast.on('toastbeforeposition', function( event, ui ){});
             */
            beforeposition: null,

            /**
             * After close callback
             *
             * @attribute {function} afterclose
             * @event afterclose
             * @default null
             * @example
             *     $.mobile.toast({
             *         message: 'Live long and prosper!',
             *         afterclose: function( event, ui ){
             *             console.log('afterclose');
             *         }
             *     });
             * @example
             *     $.mobile.toast.on('toastafterclose', function( event, ui ){});
             */
            afterclose: null,

            /**
             * After open callback
             *
             * @attribute {function} afteropen
             * @event afteropen
             * @default null
             * @example
             *     $.mobile.toast({
             *         message: 'Live long and prosper!',
             *         afteropen: function( event, ui ){
             *             console.log('afteropen');
             *         }
             *     });
             * @example
             *     $.mobile.toast.on('toastafteropen', function( event, ui ){});
             */
            afteropen: null
        },

        /**
         * Constructor method, called automaticly
         * @constructor
         * @method _create
         * @private
         */

        /**
         * Create callback
         *
         * @event create
         * @example
         *     $.mobile.toast({
         *         message: 'Live long and prosper!',
         *         create: function( event, ui ){
         *             console.log('create');
         *         }
         *     });
         * @example
         *     $.mobile.toast.on('toastcreate', function( event, ui ){});
         */
        _create: function() {
            // Parse initial options
            this._parseOptions();

            // Cache page and content area
            this.$p = $.mobile.activePage;
            this.$c = $(".ui-content", this.$p);

            // Render toast
            this.$toast = this._renderToast();

            // Append to content
            this._addToPage();

            // Position toast
            this.reposition();

            // Show toast to user
            this.open();
        },

        /**
         * Call parse functions for options
         *
         * @method _parseOptions
         * @private
         */
        _parseOptions: function() {
            this.options.duration = this._parseDurationOption(this.options.duration);
        },

        /**
         * Parse function for "duration" option
         *
         * @method _parseDurationOption
         * @private
         * @return {number} Duration in ms
         */
        _parseDurationOption: function(value) {
            if (typeof value === "string") {
                switch (value) {
                    case "short":
                        value = 2500;
                        break;
                    case "long":
                        value = 3500;
                        break;
                    default:
                        value = 2000;
                        break;
                }
            }
            return value;
        },

        /**
         * Render text method, render and style message in paragraph
         *
         * @method _renderText
         * @private
         * @return {object} jQuery fragment
         */
        _renderText: function() {
            return $("<p>" + this.options.message + "</p>").css({
                "max-width":  "160px",

                "margin":     "0",
                "padding":    "6px 12px",

                "font-size":  "16px",
                "color":      "#FFFFFF",
                "text-shadow":"none",

                "border":     "none"
            });
        },

        /**
         * Render toast method, render and style paragraph in container
         *
         * @method _renderToast
         * @private
         * @return {object} jQuery fragment
         */
        _renderToast: function() {
            return $("<div data-role='toast'></div>")
                .html(this._renderText())
                .css({
                    "display":               "none",
                    "position":              "fixed",
                    "z-index":               "1100",

                    "background-color":      "#34495e",

                    "-webkit-border-radius": "6px",
                    "border-radius":         "6px",

                    "background-clip":       "padding-box"
                })
                .addClass(this.options.classOnOpen);
        },

        /**
         * Add toast to page
         *
         * @method _addToPage
         * @private
         */
        _addToPage: function() {
            this.$c.append( this.$toast );
        },

        /**
         * Calculates top, left coordinates to postion toast
         *
         * @method _getToastCoordinates
         * @private
         * @return {object} Position object
         */
        _getToastCoordinates: function() {
            var toastDimensions = {
                width:  this.$toast.width(),
                height: this.$toast.height()
            },
            windowCoordinates = this._getWindowCoordinates(),
            factor = (windowCoordinates.height >= windowCoordinates.width) ? 80 : 80;

            return {
                top: (windowCoordinates.height * factor) / 100,
                left: (windowCoordinates.width / 2) - (toastDimensions.width / 2)
            };
        },

        /**
         * Get position an size of page
         *
         * @method _getWindowCoordinates
         * @private
         * @return {object} Position/size object
         */
        _getWindowCoordinates: function() {
            var theWindow = $.mobile.window;

            return {
                x: theWindow.scrollLeft(),
                y: theWindow.scrollTop(),
                width: ( window.innerWidth || theWindow.width() ),
                height: ( window.innerHeight || theWindow.height() )
            };
        },

        /**
         * Remove toast from page
         *
         * @method _destroy
         * @private
         */
        _destroy: function() {
            this.$toast.remove();
        },

        /**
         * Called whenever the option() method is called, regardless of the form in which the
         * option() method was called.
         * Overriding this is useful if you can defer processor-intensive changes for multiple
         * option changes.
         *
         * @method _setOptions
         * @private
         */
        _setOptions: function() {
            this._superApply( arguments );
        },

        /**
         * Called from the _setOptions() method for each individual option. Widget state should be
         * updated based on changes.
         *
         * @method _setOption
         * @private
         * @param {String} key The name of the option to set.
         * @param {Object} value A value to set for the option.
         */
        _setOption: function( key, value ) {
            if ( key === "message" ) {
                // Trim message
                value = $.trim(value);
                // Prevent empty message
                if ( value === "" ) {
                    return;
                }
            }
            if ( key === "duration" ) {
                value = this._parseDurationOption(value);
            }
            this._super( key, value );
        },

        /**
         * Called before end and handle close animation. Trigger "beforeClose" event.
         *
         * @method _beforeEnd
         * @private
         */
        _beforeEnd: function() {
            this._trigger("beforeClose");

            if (this.options.classOnClose !== "") {
                this.$toast
                    .addClass(this.options.classOnClose)
                    .on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd",
                        $.proxy(function() {
                            this._end();
                        }, this));
            } else {
                // Default
                this.$toast.fadeOut(500, $.proxy(this._end, this));
            }
        },

        /**
         * Destroy toast and trigger "afterclose" event.
         *
         * @method _end
         * @private
         */
        _end: function() {
            this.destroy();
            this._trigger("afterclose");
        },

        /*
        | Public methods ------------------------------------------------------
        */

        /**
         * Reposition method, position toast during initialisation and later.
         *
         * @method reposition
         * @protected
         */
        reposition: function() {
            this._trigger("beforeposition");

            var coordinates = this._getToastCoordinates();
            this.$toast.css({
                "top":     coordinates.top,
                "left":    coordinates.left
            });
        },

        /**
         * Open method, open toast and auto-close it after duration
         *
         * @method open
         * @protected
         */
        open: function() {
            this.$toast.css({ "display": "inline-block" });
            this._trigger("afteropen");
            window.setTimeout($.proxy(this._beforeEnd, this), this.options.duration);
        }
    });

})( jQuery, window, document );
