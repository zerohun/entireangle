Story = new Meteor.Collection('stories');
Meteor.methods({
    addStory: function(storyObj){
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        return Story.insert({
            title: storyObj.title,
            desc: storyObj.desc,
            postIds: storyObj.postIds
        });
    },

    updateStory: function(story) {
        if (storyObj.user._id != Meteor.userId())
            throw new Meteor.Error("not-authorized");

        Stroy.update(story._id, {
            $set: {
                title: story.title,
                desc: story.desc
            }
        });
    },

    removeStory: function(storyId) {
        var story = Story.findOne({
            _id: storyId
        });

        if (story === null)
            throw new Meteor.Error("not-found");

        if (Meteor.userId() != story.user._id)
            throw new Meteor.Error("not-authorized");

        Story.remove({
            _id: story._id
        });
    }
});

if (Meteor.isServer) {
    Meteor.publish("stories", function(limit, query){
        return Story.find(Object.filterParams(query, [
                "_id",
                "user.id"
        ])); 
    });
}
