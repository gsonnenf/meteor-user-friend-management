/**
 * Created by Greg on 7/14/2016.
 */



Meteor.publish("UserDirectory",function(){
    return Meteor.users.find({});
});

Meteor.methods({
    createNewUser: function(name){
        console.log(name);
        return Accounts.createUser({username: name, password:"1234" });
    },
    removeUser: function(id){
        console.log(id);
        return Meteor.users.remove({_id:id});
    },
    connection: function() {
        var sessions = Meteor.default_server.sessions;
        for (let i in sessions) {
            console.log( "Session:" )
            console.log( sessions[i].userId )
            console.log( sessions[i].id );
        }
    }
});