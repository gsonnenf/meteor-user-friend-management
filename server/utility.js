export function validateTargetId(targetId) {
    var userId = Meteor.userId();
    if (!userId) throw new Error("UserId cannot be null.");
    if (typeof targetId !=="string") throw new Error("TargetId must be string.");
    if (!targetId) throw new Error("TargetId cannot be null.");
    if (targetId == userId ) throw new Error("TargetId cannot be userId.");
    if (!Meteor.users.findOne({_id:targetId})) throw new Error("User does not exist");
}


export function validateUserNotBlocked(userId1, userId2 ) {
    var isBlocked = UserBlockedCollection.findOne({$or: [{OwnerId: userId1, blockedId: userId2},{OwnerId: userId2, blockedId: userId1}] });
    if (isBlocked) throw new Error("Access Denied (blocked).");
}