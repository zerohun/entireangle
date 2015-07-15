function closePostModal(){
    $(".post-check:checked").prop("checked", false);
    $("#post-list-to-add").modal("hide");
}

function thumbUrl(imageId, isVideo) {
    if (isVideo) {
        return Video.findOne({
            _id: imageId
        }).url({
            store: 'video_thumbs'
        });
    } else {
        return Image.findOne({
            _id: imageId
        }).url({
            store: 'thumbs'
        });
    }
}


Template.StoriesNew.events({
    "submit .new-story": function(event){
        var storyObj = {
            title: event.target.title.value,
            desc: event.target.desc.value,
            postIds: Session.get("picked-posts")
        };
        Meteor.call("addStory", storyObj, function(error, storyId) {
            Router.go("stories.show", {
                _id: storyId 
            });
        });
    },

    "click #add-post-to-story": function(){
        $("#post-list-to-add").modal("show");
        return false;
    },

    "click #save-posts-list": function(){
        Session.set("picked-posts",
            Session.get("picked-posts").concat(
                $(".post-check:checked").map(function(i, e){
                    return e.id;
                }).
                toArray()
            )
        );
        closePostModal();
    },

    "click #add-post-cancel": function(){
        closePostModal();
    }

});

Template.StoriesNew.helpers({
    posts: function(){
        if(!(Session.get("picked-posts"))){
            Session.set("picked-posts", []);
        }
        return Post.find({
                    _id: {
                        $in: Session.get("picked-posts")
                    }
                });
    },
    userPosts: function(){
        return Post.find({});
    }
});

Template.postSelect.helpers({
    thumbUrl: thumbUrl 
});
Template.selectedPost.helpers({
    thumbUrl: thumbUrl 
});
