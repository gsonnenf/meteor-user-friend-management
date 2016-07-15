/**
 * Created by Greg on 7/12/2016.
 */

import {ListWidgetBase} from '/client/lib/listwidgetbase'

export class ListWidgetBlockedUsers extends ListWidgetBase {
    constructor(){
        super();
        this.subscription = Meteor.subscribe('BlockedUsers');
        super.initialize('blockedContainer', UserBlockedCollection);
    }

    adapter(doc) {
        return {id: doc._id, label: doc.username };
    }
}