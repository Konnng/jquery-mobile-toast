/* jshint devel: true */
"use strict";

$( document ).on( "pageinit", "#demoPage", function( event ) {

    $("#default").on("tap", function() {
        $.mobile.toast({
            message: "Live long and prosper!"
        });
    });

    $("#longer").on("tap", function() {
        $.mobile.toast({
            message: "Live long and prosper!",
            duration: "long"
        });
    });

    $("#custom").on("tap", function() {
        $.mobile.toast({
            message: "Live long and prosper!",
            classOnOpen: "pomegranate"
        });
    });

    $("#custom-kitkat").on("tap", function() {
        $.mobile.toast({
            message: "Live long and prosper!",
            classOnOpen: "kitkat"
        });
    });

    $("#close-event").on("tap", function() {
        $.mobile.toast({
            message: "Live long and prosper!",
            afterclose: function(event, ui) {
                alert("Toast closed!");
            }
        });
    });

    $("#animate-css").on("tap", function() {
        $.mobile.toast({
            message: "Live long and prosper!",
            classOnOpen: "animated bounceInUp"
        });
    });

    $("#animate-css2").on("tap", function() {
        $.mobile.toast({
            message: "Live long and prosper!",
            classOnOpen: "animated slideInLeft",
            classOnClose: "slideOutRight"
        });
    });

});
