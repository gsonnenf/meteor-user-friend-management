/**
 * Created by Greg on 7/8/2016.
 */

FriendRelationCollection = new Mongo.Collection("FriendRelationCollection");
FriendRequestCollection = new Mongo.Collection("FriendRequestCollection");
FriendOnlineCollection = new Mongo.Collection("FriendOnlineCollection");

UserBlockedCollection = new Mongo.Collection("UserBlockedCollection");
UserIgnoredCollection = new Mongo.Collection("UserIgnoredCollection");
UserOnlineCollection = new Mongo.Collection("UserOnlineCollection");


if (Meteor.isServer ) {
    UserOnlineCollection.remove({});
    FriendOnlineCollection.remove({});
}



    
