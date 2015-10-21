Hashtags = new Mongo.Collection('hashtags');
Photos = new Mongo.Collection('photos');

var score = function(params){
  var num = (params.createdAt/1000/60/60) + params.likeCount + (params.commentCount * 2);
  return num
}


if(Meteor.isServer) {
  Meteor.publish('hashtags', function () { return Hashtags.find(); });
  Meteor.publish('photos', function () { return Photos.find(); });

  Meteor.methods({

    addTag: function (query) {
      var url = "https://api.instagram.com/v1/tags/"+ query +"?access_token=2166491120.da8ceea.cf76bdd8350e4d9e94e3ad74c6eee5ca";
      Meteor.http.call('GET', url, function(error, results){
        Hashtags.insert({
          createdAt: new Date(),
          count: results.data.data.media_count,
          name: query
        })
      });
    },

    addPhotos: function (query) {
      var url = "https://api.instagram.com/v1/tags/"+ query +"/media/recent?access_token=2166491120.da8ceea.cf76bdd8350e4d9e94e3ad74c6eee5ca";

      // FIRST PAGE
      Meteor.http.call('GET', url, function(error, resultsOne){
        _.each(resultsOne.data.data, function(item){

          var exists = Photos.find({insta_id: item.id}).count();

          if(exists){
            console.log('This photo already exists.')
          }
          else {
            Photos.insert({
              commentCount: item.comments.count,
              createdAt: new Date(),
              image: item.images.low_resolution.url,
              insta_id: item.id,
              likeCount: item.likes.count,
              posted: item.created_time,
              score: score({createdAt: item.created_time, likeCount: item.likes.count, commentCount: item.comments.count}),
              tag: item.tags,
              user: item.user.username
            });
            console.log('Success: photo inserted.');
          }
        })

        // SECOND PAGE
        Meteor.http.call('GET', resultsOne.data.pagination.next_url, function(error, resultsTwo){
          _.each(resultsTwo.data.data, function(item){

            var exists = Photos.find({insta_id: item.id}).count();

            if(exists){
              console.log('This photo already exists.')
            }
            else {
              Photos.insert({
                commentCount: item.comments.count,
                createdAt: new Date(),
                image: item.images.low_resolution.url,
                insta_id: item.id,
                likeCount: item.likes.count,
                posted: item.created_time,
                score: score({createdAt: item.created_time, likeCount: item.likes.count, commentCount: item.comments.count}),
                tag: item.tags,
                user: item.user.username
              });
              console.log('Success: photo inserted.');
            }
          })

          // THIRD PAGE
          Meteor.http.call('GET', resultsTwo.data.pagination.next_url, function(error, resultsThree){
            _.each(resultsThree.data.data, function(item){

              var exists = Photos.find({insta_id: item.id}).count();

              if(exists){
                console.log('This photo already exists.')
              }
              else {
                Photos.insert({
                  commentCount: item.comments.count,
                  createdAt: new Date(),
                  image: item.images.low_resolution.url,
                  insta_id: item.id,
                  likeCount: item.likes.count,
                  posted: item.created_time,
                  score: score({createdAt: item.created_time, likeCount: item.likes.count, commentCount: item.comments.count}),
                  tag: item.tags,
                  user: item.user.username
                });
                console.log('Success: photo inserted.');
              }
            })
          }); // END THIRD PAGE
        }); // END SECOND PAGE

      }); // END FIRST PAGE

    }

  });
}

if (Meteor.isClient) {

  Meteor.subscribe('hashtags');
  Meteor.subscribe('photos');


  Template.body.helpers({
    hashtags: function () {
      return Hashtags.find({}, {sort: {count: -1}});
    },
    photos: function () {
      var selected = Session.get('selectedTag');
      if (selected ==  undefined){
        return Photos.find({}, {sort: {score: -1}});
      }
      else {
        return Photos.find({tag: {$in: [selected]}}, {sort: {score: -1} });
      }
    }
  });

  Template.body.events({
    'submit .new-hashtag': function (event) {
      event.preventDefault();
      var name = event.target.text.value;

      var exists = Hashtags.find({name: name}).count();
      if(exists){
        console.log('This tag already exists');
      }
      else{
        Meteor.call('addTag', name)
        Meteor.call('addPhotos', name);
        Session.set('selectedTag', name);
      }
      event.target.text.value = '';
    },
    'click .hashtag': function (event) {
      var tag = this.name;
      Session.set('selectedTag', tag);
    }
  });

  Template.hashtag.events({
    'click .hashtag-delete': function () {
      Hashtags.remove(this._id);
    }
  });

  Template.photo.events({
    'click .photo-delete': function () {
      Photos.remove(this._id);
    }
  });

}