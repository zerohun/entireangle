window.enableEndlessScroll =  function(limitSessionKey, pCollection){
    $("#list-fetching-bar").show();

    Tracker.autorun(function(computation) {
        var limit = Session.get(limitSessionKey); 
        if (pCollection.find(Session.get("postsQuery")).count() < limit)
            $("#list-fetching-bar").fadeOut(2000);
        else
            $("#list-fetching-bar").show();

        var popStateSub = Rx.Observable.fromEvent(window, "popstate").
        subscribe(function(e) {
            computation.stop();
            popStateSub.dispose();
        });
    });

    var scrollEventSrc = Rx.Observable.fromEvent(window, "scroll").
    filter(function() {
        return ($(window).scrollTop() >= $(document).height() - $(window).height() - 10);
    }).
    takeUntil(Rx.Observable.fromEvent(window, 'popstate'));

    var scrollEventSub = scrollEventSrc.subscribe(function(e) {
        var limit = Session.get(limitSessionKey); 
        if (pCollection.find().count() >= limit)
          FView.byId("loading-box").node.show();
          Session.set(limitSessionKey, limit + 40);
    });

    var pushstateSub = Rx.Observable.fromEvent(window, 'popstate').
                        subscribe(function(){
                            scrollEventSub.dispose();
                            pushstateSub.dispose();
                            $("#list-fetching-bar").hide();
                        });

    $(window).trigger("scroll");
};

