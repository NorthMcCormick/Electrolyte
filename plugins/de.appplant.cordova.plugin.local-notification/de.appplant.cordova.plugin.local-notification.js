if(!window.isCordovaApp) {
  try {

    window.cordova.plugins.notification = {};
    window.cordova.plugins.notification.local = {};

    const schedule = require('electron').remote.require('node-schedule');
    const notifier = require('electron').remote.require('node-notifier');
    const uuid = require('electron').remote.require('uuid/v1');
    
    var clipboard = require('electron').clipboard;

    var _notifications = [];

    function _removeNotification(uuid) {
      _notifications.forEach(function(noti, notiIndex) {
        if(noti.data.uuid == uuid) {
          _notifications.splice(notiIndex, 1);
          noti.job.cancel();
        }
      });
    }

    function _triggerNotification(uuid) {
      _notifications.forEach(function(noti, notiIndex) {
        if(noti.data.uuid == uuid) {
          _notifications[notiIndex].data.triggered = true;
          _notifications[notiIndex].data.scheduled = false;
          
          noti.job.cancel();
        }
      });
    }

    const defaultNotification = {
      title: '',
      message: 'No Message',
      wait: true,
      sound: true,
      id: 0,
      scheduled: true,
      triggered: false
    };

    function scheduleNotification(notificationData) {
      console.log('Scheduling notification', notificationData);

      var notification = JSON.parse(JSON.stringify(defaultNotification));

      notification.title = notificationData.title ? notificationData.title : notification.title;
      notification.message = notificationData.text ? notificationData.text : notification.message;
      notification.id = notificationData.id ? notificationData.id : notification.id;
      notification.uuid = uuid();
      
      console.log('Final notificaiton data: ', notification);

      if(!notificationData.at) {
        notifier.notify(notification, function (err, response) {});
      }else{
        var date = new Date(notificationData.at);

        var j = schedule.scheduleJob(date, function(noti) {
          notifier.notify(noti, function (err, response) {
            //_removeNotification(noti.uuid);
            _triggerNotification(noti.uuid);
          });
        }.bind(null, notification));

        _notifications.push({
          job: j,
          data: notification
        });
      }
    }

    window.cordova.plugins.notification.local = {
      schedule: function(notifications, success, fail) {

        // Turns a single object into an array, or an array... into an array...
        var notificationList = [].concat(notifications);

        notificationList.forEach(function(noti) {
          scheduleNotification(noti);
        });
      },
      getAll: function(success, fail) {
        var allNotifications = [];

        _notifications.forEach(function(noti) {
          allNotifications.push(noti.data);
        });

        success(allNotifications);
      },
      isScheduled: function(success, fail) {
        var allNotifications = [];

        _notifications.forEach(function(noti) {
          if(noti.data.scheduled) {
            allNotifications.push(noti.data);
          }
        });

        success(allNotifications);
      },
      isTriggered: function(success, fail) {
        var allNotifications = [];

        _notifications.forEach(function(noti) {
          if(noti.data.triggered) {
            allNotifications.push(noti.data);
          }
        });

        success(allNotifications);
      },
      getAllIds: function(success, fail) {
        var notificationIds = [];

        _notifications.forEach(function(noti) {
            notificationIds.push(noti.data.id);
        });

        success(notificationIds);
      },
      getIds: function(success, fail) {
        var notificationIds = [];

        _notifications.forEach(function(noti) {
            notificationIds.push(noti.data.id);
        });

        success(notificationIds);
      },
      getScheduledIds: function(success, fail) {
        var allNotifications = [];

        _notifications.forEach(function(noti) {
          if(noti.data.scheduled) {
            allNotifications.push(noti.data.id);
          }
        });

        success(allNotifications);
      },
      getTriggeredIds: function(success, fail) {
        var allNotifications = [];

        _notifications.forEach(function(noti) {
          if(noti.data.triggered) {
            allNotifications.push(noti.data.id);
          }
        });

        success(allNotifications);
      },
      get: function(id, success, fail) {
        var notification = null;

        _notifications.forEach(function(noti) {
          if(noti.data.id == id) {
            notification = noti.data;
          }
        });

        success(notification);
      }
      /**
       * Still need to implement:
       * - getScheduled(id)
       * - getTriggered(id)
       * - get([1, 2, 3])
       * 
       */
    }
  } catch(e) {
    console.error('Failed to initialize Local Notification shim, unknown error: ', e);
  }
}


/*exports.schedule = function (notifications, callback, scope, args) {
    this.core.schedule(notifications, callback, scope, args);
};*/