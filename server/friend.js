/**
 * Created by Greg on 7/10/2016.
 */
import {OnlineUsersDistinct} from '/server/onlineusersdistinct'
import {validateTargetId, validateUserNotBlocked} from '/server/utility'

Meteor.publish('FriendList',function() {
    var friendCursor =  FriendRelationCollection.find(
        { 'friendship.userId': this.userId },
        { fields:{friendship:{ $elemMatch:{ userId:{ $ne: this.userId }}}}});

    var handle = friendCursor.observe({
        added: (doc)=>{this.added('FriendCollection', doc.friendship[0].userId, doc.friendship[0] ); },
        removed: (doc)=>{ this.removed('FriendCollection', doc.friendship[0].userId) }
    });
    this.ready();
    this.onStop(function () { handle.stop(); });
});

var onlineUsersDistinct = new OnlineUsersDistinct(FriendOnlineCollection, {reportNullUsers: false});
Meteor.publish('OnlineFriends', function(){
    var friendCursor =  FriendRelationCollection.find(
        { friendship: {$elemMatch: {userId: this.userId} }},
        { fields:{friendship:{ $elemMatch:{ userId:{ $ne: this.userId }}}}});

    var friendIdList = friendCursor.map( element => element.friendship[0].userId );
    return FriendOnlineCollection.find({userId: {$in: friendIdList} });
});

Meteor.publish('FriendRequestList', function() {
   return FriendRequestCollection.find({targetId: this.userId});
});

Meteor.methods({
        'friend/requestFriend': function (targetId, message) {
        var senderId = Meteor.userId();
        validateTargetId(targetId);
        validateUserNotBlocked( targetId, senderId );
        if (message != null || typeof message != 'string') throw new Error("Message must be string or null.");
        
        if (!Meteor.users.findOne({_id:targetId})) throw new Error("User does not exist");
        if (FriendRelationCollection.findOne({friendship: {$all: [senderId, targetId]}})) throw new Error("Friendship already exists.");
        var request = FriendRequestCollection.findOne({senderId: senderId, targetId: targetId});
        if (request) FriendRequestCollection.remove(request);
        var friendRequest = {
            senderId: senderId,
            targetId: targetId,
            senderName: Meteor.users.findOne(senderId).username,
            targetName: Meteor.users.findOne(targetId).username,
            requestMessage: message,
            createdAt: Date.now()
        };
        return FriendRequestCollection.insert(friendRequest);
    },

    'friend/acceptFriend': function (friendRequestId) {
        var senderId = Meteor.userId();
        validateTargetId(friendRequestId);
        var friendRequest = FriendRequestCollection.findOne(friendRequestId);
        if (!friendRequest) throw new Error("Friend Request not found.");
        if (friendRequest.targetId != senderId) throw new Error("No permissions.");
        FriendRequestCollection.remove(friendRequestId);
        //Removes all friend requests associated with friendship.
        FriendRequestCollection.remove({
            $or: [
                {senderId: friendRequest.senderId, targetId: friendRequest.targetId},
                {targetId: friendRequest.senderId, senderId: friendRequest.targetId}
            ]
        });
        validateUserNotBlocked( friendRequest.senderId, friendRequest.targetId );

        //Does not create new friendship if one already exists. Probably not needed.
        if (FriendRelationCollection.findOne({friendship: {$all: [friendRequest.senderId, friendRequest.targetId]}})) throw new Error("Friendship already exists");
        //Creates friendship
        var sender = {userId: friendRequest.senderId, name: friendRequest.senderName};
        var target = {userId: friendRequest.targetId, name: friendRequest.targetName};
        return FriendRelationCollection.insert({friendship: [sender, target], createdAt: Date.now()});
    },

    'friend/removeFriend': function(targetId) {
        validateTargetId(targetId);
        return FriendRelationCollection.remove({friendship: {$all: [ Meteor.userId(), targetId ]}});
    }
});

