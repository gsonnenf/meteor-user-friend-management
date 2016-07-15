/**
 * Created by Greg on 7/9/2016.
 */
import '/server/onlineuserspatch'

UserConnectionCollection = new Mongo.Collection('UserConnectionCollection', {connection: null});

Meteor.onConnection( (args)=>{
    console.log("onConnect Called");
    var connectionId = args.id;
    var userId = Meteor.default_server.sessions[connectionId].userId;
    args.onClose( ()=>{
        console.log("onClose");
        UserConnectionCollection.remove({connectionId: connectionId});
    });
    if (userId) throw new Error("Login made before connection. This shouldn't happen.");
    UserConnectionCollection.insert({connectionId: connectionId, username: "null-" + connectionId, userId:null});
});

Accounts.onLogin( (loginInfo)=>{
    var connectionId = loginInfo.connection.id;
    var userId = loginInfo.user._id;
    if (!userId) return;
    UserConnectionCollection.remove({connectionId: connectionId});
    UserConnectionCollection.insert({userId: userId, connectionId: connectionId, username: loginInfo.user.username });
});

Accounts.onLogout( function(connection, userId) {
    console.log('onlogout');
    UserConnectionCollection.remove({connectionId: connection.id});
    UserConnectionCollection.insert({connectionId: connection.id, username: "null-" + connection.id, userId:null});
});
