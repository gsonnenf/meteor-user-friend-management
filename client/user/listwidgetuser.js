/**
 * Created by Greg on 7/8/2016.
 */

import {ListWidgetBase} from '/client/lib/listwidgetbase'

export class ListWidgetUser extends ListWidgetBase {
    constructor() {
        super();
        Meteor.subscribe('UserDirectory');
        super.initialize('userContainer',Meteor.users);

        Tracker.autorun( ()=>{
            var user = Meteor.user();
            var name = (user) ? user.username : "No user";
            $('#userNameDisplay2').text(name);
        });

        $('#addUserButton').click( ()=>{
            var name = $('#userNameInput').val();
            if (!name) throw new Error("A man has no name.");
            Meteor.call('createNewUser', name, this.errorResultCallback );
        });

        $('#deleteUserButton').click(()=>{
            var id = this.getSelected().id;
            Meteor.call('removeUser',id, this.errorResultCallback );
        });

        $('#loginUserButton').click(()=>{
            var name = this.getSelected().label;
            Meteor.loginWithPassword( name, "1234",this.errorResultCallback);
        });

        $('#logoutUserButton').click(()=>{ Meteor.logout( this.errorResultCallback ); });
    }

    adapter(doc) {
        return {id: doc._id, label:doc.username};
    }

}