/**
 * Created by Greg on 7/13/2016.
 */
import '/server/onlineuserconnection'

export class OnlineUsersDistinct {
    constructor (onlineUserCollection,{reportNullUsers} ){
        this.onlineUserCollection = onlineUserCollection;
        this._userCounter = {};
        this._reportNullUsers = reportNullUsers;

        UserConnectionCollection.find().observe({
            added: (doc)=> this.added(doc),
            removed: (doc)=> this.removed(doc),
            changed: (doc)=> this.changed(doc)
        });
    }
    added( doc ){
        if (doc.userId || this._reportNullUsers)
            if ( this._userCounter[doc.username] ) this._userCounter[doc.username]++;
            else {
                this._userCounter[doc.username] = 1;
                this.onlineUserCollection.insert({userId: doc.userId, username: doc.username});
            }
    }
    removed(doc){
        if (doc.userId || this._reportNullUsers) {
            this._userCounter[doc.username]--;
            if (this._userCounter[doc.username] < 1){
                delete this._userCounter[doc.username];
                this.onlineUserCollection.remove({username: doc.username});
            }
        }
    }
    changed(doc) {
        throw new Error("User name changes not yet supported.");
    }
}