Post = new Mongo.Collection('posts');
Meteor.methods({
    addPosts: function(imageIds, albumId, albumTitle){
      if (!Meteor.userId()) {
          throw new Meteor.Error("not-authorized");
      }

      let albumObj;
      if(albumId === '0'){
        if(albumTitle === ""){
          albumObj = Album.findOne({
            isDefaultAlbum: true, 
            'user.id': Meteor.user._id
          });
          if(!albumObj){
            albumObj = {
              title: "Deafult ablum",
              isDefaultAlbum: true,
              user: Meteor.user(),
              createdAt: new Date()
            };
            Meteor.call("addAlbum", albumObj);
          }
        }
        else{
          albumObj = {
            title: albumTitle,
            isDefaultAlbum: false,
            user: Meteor.user(),
            createdAt: new Date()
          };
          Meteor.call("addAlbum", albumObj);
        }


      }
      else{
        albumObj = Album.findOne({_id: albumId});
      }
        
      const postIds = [];
      for(let i of imageIds){
        var newPostId = Post.insert({
            title: "",
            desc: "",
            imageId: i,
            isVideo: false,
            isPublished: false,
            isInProgress: true,
            user: Meteor.user(),
            albumIds: [albumObj._id],
            createdAt: new Date()
        });
        postIds.push(newPostId);
      }
      return postIds;
    },
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
            isPublished: postObj.isPublished,
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
                desc: post.desc,
                isPublished: post.isPublished
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

Post.allow({
    insert: function () {
          return true;
            },
    remove: function () {
          return true;
            }
});
if (Meteor.isServer) {
    Meteor.publish("uploadingPosts", function(postIds){
      return Post.find({
        _id: {
          $in: postIds
        },
        'user._id': this.userId
      });
    });
    Meteor.publish("posts", function(postsLimit, query) {
        console.log("post pub");
        console.log(query);
        var isVideoVal;

        var validQuery = Object.filterParams(query, [
            "isVideo",
            "user._id",
            "isFeatured",
            "_id"
        ]);


        if (query.hasOwnProperty('isVideo') && !(query.isVideo)) {
            validQuery.isVideo = {
                $ne: true
            };
        }

        console.log(validQuery);
        console.log(this.userId);
        if(validQuery._id){
        }
        else if(!validQuery['user._id'] || ((this.userId && validQuery['user._id']) && (this.userId != validQuery['user._id']))){
          validQuery.isPublished = {$ne: false};
        }
        else{
          console.log('else');
        }

        return Post.find(
            validQuery, {
            limit: postsLimit,
            sort: {
                createdAt: -1
            }
        });
    });
}
