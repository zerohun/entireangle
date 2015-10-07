Post = new Mongo.Collection('posts');
Post.attachSchema(new SimpleSchema({
  title:{
    type:String,
    optional: true
  },
  desc:{
    type:String,
    optional: true
  },
  isPublished:{
    type:Boolean
  },
  imageId:{
    type:String
  },
  albumIds:{
    type:Array,
    index: 1,
    optional: true
  },
  'albumIds.$': {
    type: String,
    optional: true
  },
  isVideo:{
    type:Boolean
  },
  user:{
    type:Object,
    blackbox: true
  },
  createdAt:{
    type: Date,
    index: 1
  }
}));

Meteor.methods({
    addPosts: function(imageIds, albums){
      if (!Meteor.userId()) {
          throw new Meteor.Error("not-authorized");
      }

      albums.forEach((album, index)=>{
        if(album._id.startsWith("new-")){
          delete album._id;
          albums[index]._id = Album.insert({
            title: album.title,
            desc: album.desc,
            createdAt: new Date()
          }); 
        }
      });
        
      const postIds = [];
      for(let i of imageIds){
        var newPostId = Post.insert({
            title: "",
            desc: "",
            imageId: i,
            isVideo: false,
            isPublished: false,
            user: Meteor.user(),
            albumIds: albums.map((album)=>album._id),
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
    update: function (postId, post) {
      return (post.user._id === Meteor.userId());
    },
    remove: function (postId, post) {
      return (post.user._id === Meteor.userId());
    }
});
if (Meteor.isServer) {
    Meteor.publish("uploadingPosts", function(postIds){
      console.log('pub uploading posts');
      console.log(postIds);
      console.log(this.userId);
      var posts = Post.find({
        _id: {
          $in: postIds
        },
        'user._id': this.userId
      });
      console.log(posts.count());
      return posts;
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
