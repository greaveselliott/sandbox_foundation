(function($){
    $('.off-canvas-wrapper').offCanvas({
        "prefix": '',
        "offCanvasSection": ["right", "left"],

        "triggerEvents": [
               {
                   "selector": ".primary-nav-trigger",
                   "event": ["click", "touch"],
                   "trigger": "open_left",
                   "callback": function () {
                       console.log('primary nav trigger clicked');
                   }
               },
               {
                   "selector": ".secondary-nav-trigger",
                   "event": ["click", "touch"],
                   "trigger": "open_right",
                   "callback": ""
               },
               {
                   "selector": ".search-field-trigger",
                   "event": ["click", "touch"],
                   "trigger": "open_bottom",
                   "callback": function () {
                       console.log('Search toggle clicked');
                       var $body = $('body').toggleClass('search-field-active');
                       if ($body.hasClass('search-field-active')) {
                           $('.mobile-nav-search_field').focus();
                       }
                       
                   }
               }
               ,
               {
                   "selector": ".close-menu",
                   "event": ["click", "touch"],
                   "trigger": "close",
                   "callback": ""
               }
        ],
        "disable": {
            "setCanvasSection": true,
            "isCanvasOpen": true
        }
    });
})(jQuery);


