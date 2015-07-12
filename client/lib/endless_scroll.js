window.enablePostEndlessScroll =  function(limitSessionKey){

    Tracker.autorun(function(computation) {
        var limit = Session.get(limitSessionKey); 
        if (Post.find().count() < limit)
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
        if (Post.find().count() >= limit)
            Session.set(limitSessionKey, limit + 10);
    });
};
