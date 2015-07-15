Post = new Meteor.Collection('posts');

Meteor.methods({
    addPost: function(postObj, isVideo) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        return Post.insert({
            title: postObj.title,
            desc: postObj.desc,
            imageId: postObj.imageId,
            isVideo: isVideo,
            storyIds: postObj.storyIds,
            user: Meteor.user(),
            createdAt: new Date()
        });
    },
    updatePost: function(post) {
        if (post.user._id != Meteor.userId())
            throw new Meteor.Error("not-authorized");

        Post.update(post._id, {
            $set: {
                title: post.title,
                desc: post.desc
            }
        });
    },
    updatePostViewPosition: function(post, position) {
        if (post.user._id != Meteor.userId())
            throw new Meteor.Error("not-authorized");

        Post.update(post._id, {
            $set: {
                viewPosition: {
                    x: position.x,
                    y: position.y,
                    z: position.z
                }
            }
        });

    },

    addPostToStory: function(post, storyId){
        if (post.user._id != Meteor.userId())
            throw new Meteor.Error("not-authorized");

        var storyIds = post.storyIds || [];
        storyIds.push(storyId);
        
        Post.update(post._id, {
            $set: {
                storyIds: storyIds
            }
        });
    },

    removePostFromStory: function(post, storyId){
        if (post.user._id != Meteor.userId())
            throw new Meteor.Error("not-authorized");

        if(post.storyIds && 
                post.storyIds.count() > 0 &&
                post.storyIds.indexOf(storyId) >= 0){

            var targetIndex = post.storyIds.indexOf(storyId);
            storyIds.splice(targetIndex, 1);
            
            Post.update(post._id, {
                $set: {
                    storyIds: storyIds
                }
            });
        }
    },

    removePost: function(postId) {
        var post = Post.findOne({
            _id: postId
        });
        if (post === null)
            throw new Meteor.Error("not-found");

        if (Meteor.userId() != post.user._id)
            throw new Meteor.Error("not-authorized");

        if (post.isVideo) {
            Video.remove({
                _id: post.imageId
            });
        } else {
            Image.remove({
                _id: post.imageId
            });
        }

        Post.remove({
            _id: post._id
        });
    }
});

if (Meteor.isServer) {
    Meteor.publish("posts", function(postsLimit, query) {
        var isVideoVal;
        console.log(query);

        var validQuery = Object.filterParams(query, [
            "isVideo",
            "user._id",
            "_id"
        ]);


        if (query.hasOwnProperty('isVideo') && !(query.isVideo)) {
            validQuery.isVideo = {
                $ne: true
            };
        }
        console.log(validQuery);
        return Post.find(
            validQuery, {
            limit: postsLimit,
            sort: {
                createdAt: -1
            }
        });
    });
}
