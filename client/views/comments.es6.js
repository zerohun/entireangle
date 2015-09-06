function findUpAndDown(target, cssSelector){
  var $selected = $(target).find(cssSelector);
  if($selected.length > 0){
    return $selected;
  }
  else{
    return findUpAndDown(target.parentNode, cssSelector);
  }
}

function getCommentId(target){
  if(target.dataset.id)
    return target.dataset.id;
  else
    return getCommentId(target.parentNode);
}

function startCommentEditing(target){
  findUpAndDown(target, '.comment-content').hide();
  findUpAndDown(target, '.comment-edit-form-wrapper').show();
  
}
function stopCommentEditing(target){
  findUpAndDown(target, '.comment-content').show();
  findUpAndDown(target, '.comment-edit-form-wrapper').hide();
}

function resetCommentFields(){
  $(".comment-content").show();
  $(".comment-edit-form-wrapper").hide();
}



Template.comments.helpers({
  "comments": function(){
    return Comment.find({}, {
      limit: Session.get("commentsLimit"),
      sort:{
        createdAt: -1
      }
    });
  },
  "showMoreCommentButton": function(){
    var commentsCount = Comment.find({}).count();
    return commentsCount > 0 && commentsCount > Session.get("commentsLimit");
  },
  "isMyComment": function(comment){
    return Meteor.user()._id === comment.user._id;
  }
});

Template.comments.events({
  "click #comment-more-button": function(){
    var commentsLimit = Session.get("commentsLimit");
    commentsLimit = commentsLimit + 10;
    Session.set("commentsLimit", commentsLimit);
    if(commentsLimit >= Comment.find({}).count()){
      $("#comment-more-button").hide();
    }
  },
  "submit #comment-form": function(event){
    var commentText = event.target.commentText.value;
    if(commentText.replace(/ /g, '').length > 0){
      var commentObj = {
        commentText: event.target.commentText.value,
        postId: Router.current().data()._id,
        user: Meteor.user()
      };
      Meteor.call("addComment", commentObj, function(error){
        if(error){
          console.warn(error);
        }
        else{
          event.target.commentText.value = "";
        }
      });
    }
    event.target.commentText.value = "";
    return false;
  },
  "click .remove-comment-button": function(event){
    window.t = event;
    resetCommentFields();
    var commentId = getCommentId(event.target);
    Meteor.call("removeComment", commentId);
  },
  "click .edit-comment-button": function(event){
    resetCommentFields();
    startCommentEditing(event.target);
  },
  "click .cancel-comment-button": function(event){
    stopCommentEditing(event.target);
  },
  "submit .comment-edit-form": function(event){
    var commentId = getCommentId(event.target);
    console.log(commentId);
    var commentObj = {
      _id: commentId,
      commentText: event.target.commentText.value
    };
    stopCommentEditing(event.target);
    Meteor.call("updateComment", commentObj);
    
    return false;
  }
});

Template.comments.rendered = () =>{
  Session.set("commentsLimit", 10);
};