/**
 * Created by Greg on 7/12/2016.
 */
import {ListWidgetBase} from '/client/lib/listwidgetbase'

export class ListWidgetIgnoredUsers extends ListWidgetBase {
    constructor(){
        super();
        this.subscription = Meteor.subscribe('IgnoredUsers');
        super.initialize('ignoredContainer',UserIgnoredCollection);
    }
    adapter(doc) {
        return {id: doc._id, label: doc.username };
    }
}