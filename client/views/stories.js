Template.Stories.helpers({
    stories: function(){
        return Router.current().data();
    }
});

Template.Stories.rendered = function(){
    enableEndlessScroll("StoriesLimit", Story);
};
