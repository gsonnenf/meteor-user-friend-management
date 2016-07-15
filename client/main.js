/**
 * Created by Greg on 7/8/2016.
 */
import {ListWidgetUser} from '/client/user/listwidgetuser'
import {ListWidgetOnlineUsers} from '/client/user/listwidgetonlineusers'
import {ListWidgetFriends, ListWidgetFriendRequest,ListWidgetOnlineFriends} from '/client/friend/friendwidgets'
main = function() {
    var listWidgetUser = new ListWidgetUser();
    var listWidgetFriendRequest = new ListWidgetFriendRequest(listWidgetUser);
    var listWidgetFriends = new ListWidgetFriends();
    var listWidgetOnlineUsers = new ListWidgetOnlineUsers();
    var listWidgetOnlineFriends = new ListWidgetOnlineFriends();
};
