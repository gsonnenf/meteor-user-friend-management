/**
 * Created by Greg on 7/10/2016.
 */
import {ListWidgetBase} from '/client/lib/listwidgetbase'
import {SimpleClientJoin} from '/client/lib/simpleclientjoin'

FriendCollection = new Mongo.Collection("FriendCollection");

export class ListWidgetFriends extends ListWidgetBase {
    constructor() {
        super();
        Meteor.subscribe('FriendList');
        super.initialize('friendContainer',FriendCollection);
        $('#removeFriendButton');
    }
    adapter(doc) { return {id: doc.userId, label: doc.name}; }
}

export class ListWidgetOnlineFriends extends ListWidgetBase {
    constructor() {
        super();
        this.clientJoin = new SimpleClientJoin().subscribe( FriendCollection.find(), 'OnlineFriends' );
        super.initialize('onlineFriendsContainer', FriendOnlineCollection);
    }
    adapter(doc){ return {id: doc._id, label: doc.username}; }
}

export class ListWidgetFriendRequest extends ListWidgetBase {
    constructor(listWidgetUser) {
        super();
        this.listWidgetUser = listWidgetUser;
        super.initialize('friendRequestContainer',FriendRequestCollection);

        this.listWidgetUser = listWidgetUser;
        this.messageInput = $('#friendMessageInput');

        Meteor.subscribe('FriendRequestList');

        $('#requestFriendButton').click(()=>{
            var id = this.listWidgetUser.getSelected().id;
            var message = this.messageInput.val();
            console.log("requesting Friend.");
            Meteor.call('friend/requestFriend',id, message,(error,result)=>{
                if (!error) console.log("addButton:" + result);
                if (error) console.log("addButton:" + error);
                this.messageInput.val("");
                console.log("Friend Request Sent.");
            });
        });

        $('#acceptFriendRequestButton').click( ()=>{
            var id = this.getSelected().id;
            Meteor.call('friend/acceptFriend',id, (error,result)=>{
                if (!error) console.log("addButton:" + result);
                if (error) console.log("addButton:" + error);
                console.log("Friend Request Accepted");
            });

        });
        $('#ignoreFriendRequestButton');
    }

    adapter(doc) {
        console.log("User: " + doc.senderName + " Message:" + doc.requestMessage);
        return {id: doc._id, label: doc.senderName};
    }
}