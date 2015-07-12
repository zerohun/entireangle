var postsSubscription = null;

if (Meteor.isClient) {
    Session.set("PostsLimit", 10);
    Session.set("UserPostsLimit", 10);
    Session.set("isVideo", false);
}

Router.configure({
    layoutTemplate: 'layout'
});
Router.onBeforeAction(function() {
    var $ele = $("#orb-player");
    if ($ele.count > 0)
        $ele.remove();

    $('body').css({overflow: "scroll"});
    this.next();

});
Router.route('/', {
    name: "home",
    action: function() {
        this.redirect('/posts');
    }
});
Router.route('/about', {
    name: "about"
});
Router.route('/posts', {
    name: "Posts",
    template: "Posts",
    subscriptions: function() {
        $("#list-fetching-bar").fadeOut(1000);
        var limit = Session.get("PostsLimit");
        postsSubscription = Meteor.subscribe("posts", limit, {isVideo: Session.get("isVideo")});
    },
    data: function() {
        var limit = Session.get("PostsLimit");
        return {
            posts: Post.find({}, {
                limit: limit
            }),
            limit: limit
        };
    }
});
Router.route('/posts/new', {
    name: "posts.new",
    action: function() {
        if (Meteor.user()) {
            this.render("PostsNew");
        } else {
            toastr.warning("You need to login to post a image");
            $("#login-dropdown-list").addClass("open");
            Router.go("Posts");
        }
    }
});

Router.route('/posts/:_id', {
    name: "posts.show",
    subscriptions: function() {
        // return one handle, a function, or an array
        if(postsSubscription){
            var limit = Session.get("PostsLimit");
            return Meteor.subscribe("posts", limit, {isVideo: Session.get('isVideo')});
        }
        else
            return Meteor.subscribe("posts", 1, {_id: this.params._id});

    },
    data: function() {
        var post = Post.findOne({
            _id: this.params._id
        });
        if (post) {
            post.description = "EntireAngle - Pictures for virtual reality";
            post.summary = "EntireAngle - Pictures for virtual reality";
            var imageUrl;
            if (post.isVideo) {
                imageUrl = Video.findOne({
                    _id: post.imageId
                }).url({
                    store: 'video_thumbs'
                });
                post.summary += "(but this is video)";
            } else {
                imageUrl = Image.findOne({
                    _id: post.imageId
                }).url({
                    store: 'snsThumbs'
                });
            }
            post.thumbnail = function() {
                return imageUrl;
            };
        } else {
            console.log('post is null id:' + this.params._id);
            console.log(Post.findOne({
                _id: this.params._id
            }));
        }

        return post;
    },
    action: function() {

        if (this.ready()) {
            if (this.data()) {
                if (this.data().isVideo)
                    this.render("VideoPostsShow");
                else
                    this.render("PostsShow");
            }
        } else {
            this.render('Loading');
        }
    }
});
Router.route('/ep/:_id', {
    action: function() {
        Router.go("posts.show", {
            _id: this.params._id
        }, {
            query: 'embedded=yes'
        });
    },
    waitOn: function() {
        // return one handle, a function, or an array
        return Meteor.subscribe("posts", 1, {_id: this.params._id});
    }
});

Router.route('/users/:_id', {
    name: "users.show",
    data: function(){
        return Meteor.users.findOne({_id: this.params._id});
    },
    subscriptions: function() {
        return[
            Meteor.subscribe("users", this.params._id),
            Meteor.subscribe("posts", Session.get('UserPostsLimit'), {"user._id": this.params._id})
        ];
    }
});

Router.route('/private_policy', {
    name: "private.policy",
});
