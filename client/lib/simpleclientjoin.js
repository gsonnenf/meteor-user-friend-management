/**
 * Created by Greg on 7/7/2016.
 */

export class SimpleClientJoin {
    subscribe(referenceCursor, targetPubName) {

        this.subscribeHandle = Meteor.subscribe(targetPubName);
        this.observeHandle = referenceCursor.observe({
            added: (doc)=> {
                if (!this.subscribeHandle.ready()) return;
                console.log("subscribed");
                var oldHandle = this.subscribeHandle;
                this.subscribeHandle = Meteor.subscribe(targetPubName, { onReady: ()=> oldHandle.stop() });
            },
            changed: (doc)=> {
                if (!this.subscribeHandle.ready()) return;
                var oldHandle = this.subscribeHandle;
                this.subscribeHandle = Meteor.subscribe(targetPubName, { onReady: ()=> oldHandle.stop() });
            },
            removed: ()=> {
                if (!this.subscribeHandle.ready()) return;
                var oldHandle = this.subscribeHandle;
                this.subscribeHandle = Meteor.subscribe(targetPubName, { onReady: ()=> oldHandle.stop() });
            }
        });
    };
}


