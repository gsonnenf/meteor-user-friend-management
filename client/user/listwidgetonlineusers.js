/**
 * Created by Greg on 7/12/2016.
 */

import {ListWidgetBase} from '/client/lib/listwidgetbase'

OnlineUsers = new Mongo.Collection('OnlineUsers');

export class ListWidgetOnlineUsers extends ListWidgetBase {
    constructor(){
        super();
        this.subscription = Meteor.subscribe('AllOnlineUsers');
        super.initialize('onlineUsersContainer',UserOnlineCollection);
    }

    adapter(doc) {
        return {id: doc._id, label: doc.username };
    }
}