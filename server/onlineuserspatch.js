/**
 * Created by Greg on 7/9/2016.
 */

// Uses a monkey patch to find provide user and connection info to logout handler.
// Using this until I can get the onLogout patch with connection context into Meteor.

(function() {
    var tempFunction = Accounts._server.method_handlers.logout;

    Accounts._server.method_handlers.logout = function () {
        var userId = this.userId;
        var connection = this.connection;
        tempFunction.apply(this, arguments);
        Accounts._successfulLogout(true, connection, userId);
    };

    Accounts._successfulLogout = function (isOverride, connection, userId) {
        if (!isOverride) return;
        this._onLogoutHook.each(function (callback) {
            callback(connection, userId);
            return true;
        });
    };
})();