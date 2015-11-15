/**
 * off[canvas].js
 * This jQuery plugin adds flexible off-canvas functionality to your web page
 * Dependencies: jQuery, jQuery.widget
 * Version: 1.0
 * Licensed under the MIT license: MIT (http://opensource.org/licenses/MIT)
 * Plugin Author: Elliott Matthew Greaves
 * Author URI: http://www.elliottgreaves.com
 * Further changes: @greaveselliott
 */

;(function ( $, window, document, undefined ) {
    $.widget("eemjii.offCanvas", {
        options: {
            "prefix"            :   "eemjii_off_canvas_",
            "root"              :   "body",
            "DOM": {
                "wrapper"       : "wrapper",
                "innerWrapper"  : "wrapper-inner",
                "section"       : "section"
            },

            "triggerEvents"     :   [
                {
                    "selector"  :".trigger1",
                    "event"     :["click","touch","wiggle"],
                    "trigger"   :"eemjii_off_canvas_open_top",
                    "callback"  :""
                }
            ],
            "offCanvasSection"     : [
                "top",
                "right",
                "bottom",
                "left",
                "top-layered",
                "right-layered",
                "bottom-layered",
                "left-layered"
            ],
            "disable": {
                "setCanvasSection": false,
                "isCanvasOpen": false
            }
        },

        _create : function() {
            var self                = this;

            self.$element              = $(self.element);

            self.prefix             = self.options.prefix;
            // PROPERTY: root
            // DEFAULT: "body" - defined in plugin options (found at the top of this script)
            // The root is used as an EventHub which acts as a global space for brokering the binding and triggering of events.
            self.root               = self.options.root;
            self.$root              = $(self.root);

            // PROPERTY: wrapper
            // DEFAULT: "eemjii_off_canvas_wrapper" - defined in plugin options (found at the top of this script)
            // This is the classed added to the external wrapper <div> tag
            self.wrapper            = self.options.DOM.wrapper;

            // PROPERTY: innerWrapper
            // DEFAULT: "eemjii_off_canvas_wrapper-inner" - defined in plugin options (found at the top of this script)
            // This is the classed added to the internal wrapper <div> tag
            self.innerWrapper       = self.options.DOM.innerWrapper;

            // PROPERTY: wrapper
            // DEFAULT: null
            // This property is later used to store the class for the current active offset state (left, right, top, bottom or any custom states you may have added)
            self.activeOffsetClass  = null;

            // METHOD CALL: setDOM();
            // Wraps the necessary DOM elements around the plugins target
            self.setDOM();

            // METHOD CALL: setCanvasSection();
            // Inserts all the sections defined in the plugin options
            self.setCanvasSection();
            // Bind an event that calls the setCanvasSection function
            // allowing this function to be called again after the plugin has loaded
            self.setMethodEventListener('setCanvasSection', self.setCanvasSection());
            // METHOD CALL: setTriggerTweenEvents();
            // Binds the custom events which add / remove the offset animation classes
            self.setTriggerTweenEvents();

            // METHOD CALL: setTriggerEvents();
            // Binds the custom events handlers which trigger the offset animations events
            self.setTriggerEvents();

            console.log(self);
        },

        // METHOD: setDOM ()
        // Using the configuration defined in the plugin options,
        // This method sets all the required DOM (html tags, plugin classes, ID's ect) to your page
        setDOM: function () {
            var self = this;
            // Checks if DOM hasn't already been set for this plugin instance
            if (self.isDOMset) { return }
            // Wrapping the external wrapper
            self.$element.wrap(function () {
                return '<div class="' + self.prefix + self.wrapper + '"></div>';
            })
                // Wrapping the internal wrapper
                .wrap(function () {
                    return '<div class="' + self.prefix + self.innerWrapper + '"></div>';
                });
            // Sets a property on this plugin instance letting the plugin know that the DOM has now been set
            self.isDOMset = true;
        },
        // METHOD: setCanvasSection ()
        // Using the configuration defined in the plugin options,
        // This method sets the DOM (html tags, plugin classes, ID's ect) for each section that sits of the canvas
        // note: Feel free to add/remove sections configuring the plugin options, but remember to add the CSS styles for your custom section
        setCanvasSection: function () {
            var self = this;
            // Check if the user needs the plugin to generate
            // the mark-up for the off-canvas section(s)
            if (self.options.disable.setCanvasSection) { return }
            // Store offCanvasSection's locally, reducing repeat object queries
            var sections = self.options.offCanvasSection,
                // Store jQuery $wrapper object locally, reducing repeat object queries
                $wrapper = $('.' + self.prefix  + self.wrapper),
                // Store general sections class locally outside of the loop, reducing repeat object queries
                generalSectionsClass = self.prefix + self.options.DOM.section,
                // Store specific section class locally outside of the loop, reducing repeat object queries
                specificSectionsClass = self.prefix + self.options.DOM.section;
                // Removing any existing canvasSections, preventing duplicated content
                $('.' + generalSectionsClass).remove();
                // Loop through offCanvasSection's
                $.each(sections, function (index, element) {
                    $wrapper.append('<div class="' + generalSectionsClass +' '+ specificSectionsClass + '_' + sections[index] + '"></div>')
                });
        },
        // METHOD: setMethodEventListener
        // This function sets a custom event listener which fires the passed in method
        // Takes 2 arguments
        // Argument 1: event - the name of the event to be called (remember the prefix specified in the plugin options as prepended to the event name)
        // Argument 2: method - the name of the method to be called
        setMethodEventListener: function (event, method) {
            var self = this;
            // checks if the isListeningFor property has not been defined
            // I've chosen to group all event checks into the isListeningFor object property
            if (!self.isListeningFor) {
                // defines the is listening for property
                self.isListeningFor = {};
            }
            // Set this "event" to the previously defined isListeningFor property
            // I've set its current value to false as the
            //self.islisteningFor[event] = false;
            // Checks if this event is already being listened for
            if (self.isListeningFor[event]) { return }
            // Bind event to $root - all events are bound to the local EventHub (by default, the local eventHub is the <body> tag)
            self.$root.bind(self.prefix + event, function (e) {
                // Calls the injected method
                method();
            });
            // Sets isListeningFor[{event name}] to true - preventing duplicate event listeners
            self.isListeningFor[event] = true;
        },
        // METHOD: setTriggerEvents ()
        // Using the configuration defined in the plugin options,
        // This function Sets all events that trigger the opening and closing of the off-canvas interface
        // Trigger events Options object model:
        // {
        // "selector":".trigger1",
        // "event":["click","touch"],
        // "trigger":"eemjii_off_canvas_open_top",
        // "callback":""
        // },
        setTriggerEvents: function () {
            var self = this;
            console.log('events set');
            // Loop over each trigger event option
            $.each(self.options.triggerEvents, function (index, element){
                // Joins the event handlers options into a space-delimited string
                // The list of event handles (string) are then data is stored in as a property in the plugin object to be available to other functions
                // The list of event handles (string) are also stored in a local variable to reduce the number of local queries to the plugin object
                var eventHandles = self.eventHandles = $.map($(element.event) || [], function (x) {
                    return self.prefix + x.replace(/\s/g, '-');
                }).join(' ');
                // Error handling
                // Checks if the trigger data type is a string, provides the user with some help in the console if they accidentally forget the to add a event to call or use the wrong data type such as am 'array, object, function or number'.
                try {
                    var triggerDataType = typeof element.trigger;
                    // checks if the data type is a string
                    if (triggerDataType === 'string') {
                        // Bind the event handle to the body (eventHub) and the current indexed element
                        $((element.selector)).bind(eventHandles, function (e) {
                            // Triggers the current indexed elements defined "canvas Tween Event" - the tween event can be redefined in the plugins options (defaults are found at the top of this document)
                            self.$root.trigger(element.trigger);
                            // Trigger the callback function if their is one
                            if (typeof element.callback === 'function') {
                                element.callback();
                            }
                        });
                    // if the data type IS NOT a string, throw an error
                    } else {
                        throw   "Error - eemjii_off_canvas: \n" +
                        "Error found in plugin configuration \n" +
                        "Configuration error is in the 'triggerEvents' \n" +
                        "The " +
                        self.getOrdinal((index+1)) +
                        " triggers is calling an event with a datatype of '" +
                        triggerDataType +
                        "'\nThe 'trigger' setting MUST have a value AND it must be a 'string'";
                    }
                } catch(error) {
                    // Print the message in the browser console
                    console.error(error);
                }
            });
        },

        // METHOD: isOpen()
        // Checks to see if the canvas is open
        // True: Returns the side which is open - string
        // False: Returns false - boolean
        isCanvasOpen: function () {
            var self = this,
                isCanvasOpen = false;
            if (self.activeOffsetClass) {isCanvasOpen = true;}
            return isCanvasOpen;
        },
        // METHOD: getOrdinal ()
        // Returns a ordinal number (string) of the injected number (integer)
        getOrdinal: function (number) {
            var ordinalString   =   ["th","st","nd","rd"],
                v   =   number%100;
            return number+(ordinalString[(v-20)%10]||ordinalString[v]||ordinalString[0]);
        },

        // METHOD: setTriggerTweenEvents ()
        // Animates the canvas in a specified direction  (The specified direction is injected by the event that calls this method)
        setTriggerTweenEvents: function () {
            var self = this;

            var offCanvasSection = self.options.offCanvasSection;

            self.$wrapper = $("." + self.prefix + self.wrapper);
            self.$innerWrapper = $("." + self.prefix + self.innerWrapper);

            // Loop over each tweenEvent specified in the options
            $.each(offCanvasSection, function (index, element) {
                //  Creates the event for this tweenEvent
                self.$root.bind(self.prefix + "open_" + offCanvasSection[index], function (e) {
                    // Checks if the Canvas is already open
                    // This prevents multiple canvas openings, for example on the left and right sides have been revealed at the same time.
                    // Possible feature for a future release, but for now limiting the opening to 1 at a time for simplicity.
                    if (self.options.disable.isCanvasOpen && !self.isCanvasOpen()) {
                        // sets activeOffsetClass property for later use
                        self.activeOffsetClass = self.prefix + "open_" + offCanvasSection[index];
                        // Add the current 'offCanvasSection open' class to the $wrapper DOM element
                        // The classes specified in the CSS file should control the animation
                        self.$wrapper.addClass(self.activeOffsetClass);
                        return "open_" + offCanvasSection[index];
                    }
                });
            });

            // Create the event for closing the offCanvas - returning the canvas to its original state
            self.$root.bind(self.prefix + "close", function (e) {
                // Removes the current activeOffsetClass from the wrapper
                self.$wrapper.removeClass(self.activeOffsetClass);
                // Resets the activeOffsetClass value to 'null'
                self.activeOffsetClass = null;
            });
        },

        // METHOD: destroy ()
        // Destroys this instance of this plugin
        destroy: function(){
            $.Widget.prototype.destroy.apply( this, arguments );
            //unsubscribe to 'myEventStart'
            //self.element.unbind( "myEventStart", function(e){
            ///console.log("unsubscribed to this event");
            //});
        }
    });
})( jQuery, window , document );

//Publishing event notifications
//usage:
// $(".my-widget").trigger("myEventStart");
// $(".my-widget").trigger("myEventEnd");