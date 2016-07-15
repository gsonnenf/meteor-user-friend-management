/**
 * Created by Greg on 7/8/2016.
 */
import {OnlineUsersDistinct} from '/server/onlineusersdistinct'
import {validateTargetId} from '/server/utility'

var onlineUsersDistinct = new OnlineUsersDistinct(UserOnlineCollection, {reportNullUsers: true});
Meteor.publish('AllOnlineUsers', function() {
    return UserOnlineCollection.find();
});

Meteor.publish('IgnoredUsers', function() {
    UserIgnoredCollection.find({ownerId: Meteor.userId });
});

Meteor.publish('BlockedUsers', function() {
    UserIgnoredCollection.find({ownerId: Meteor.userId });
});

Meteor.methods({
    'user/ignoreUser': function( targetId ) {
        validateTargetId(targetId);
        var doc = {ownerId: Meteor.userId(), targetId: targetId };
        if ( UserIgnoredCollection.findOne(doc) ) throw new Error("User already ignored.");
        return UserIgnoredCollection.insert(doc);

    },
    'user/unignoreUser': function( targetId ){
        validateTargetId(targetId);
        var doc = {ownerId: Meteor.userId(), targetId: targetId };
        return UserIgnoredCollection.remove(doc);
    },
    'user/blockUser': function( targetId ) {
        validateTargetId(targetId);
        var ownerId = Meteor.userId();
        var doc = {ownerId: ownerId, targetId: targetId };
        if ( UserBlockedCollection.findOne(doc) ) throw new Error("User already blocked.");
        FriendRelationCollection.remove({ 'friendship.userId': {$all: [ targetId, Meteor.userId()]}});
        FriendRequestCollection.remove({ $or: [
                {senderId: ownerId, targetId: targetId},
                {targetId: targetId, senderId: ownerId},
            ]
        });
        return UserBlockedCollection.insert(doc);

    },
    'user/unblockUser': function( targetId) {
        validateTargetId(targetId);
        var doc = {ownerId: Meteor.userId(), targetId: targetId };
        return UserBlockedCollection.remove(doc);
    }
});

