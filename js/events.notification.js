var events = events || {};

/**
 * Let you create an Event Notification system
 *
 * @example
 *    new Notification.Listener("something.clicked", function(event) { ... })
 *    new Notification("something.clicked")
 */
events.Notification = (function() {
	var Event = function(data) {
		var stopped = false;

		return {
			isStopped: function() {
				return stopped;
			},

			stop: function() {
				stopped = true;
			},
			data: data
		}
	};
	var Storage = {
		eventListeners: {},

		addListener: function(eventId, listener) {
			if(!this.eventListeners[eventId]) {this.eventListeners[eventId] = [];}
			this.eventListeners[eventId].push(listener);
			return this.eventListeners[eventId].length-1;
		},
		
		removeListener: function(eventId, listenerId) {
			this.eventListeners[eventId].splice(listenerId, 1);
		},

		fireEvent: function(eventId, data) {
			var event = new Event(data);
			if(this.eventListeners[eventId]) {
				for(var i=0,l=this.eventListeners[eventId].length; i<l; ++i) {
					this.eventListeners[eventId][i] && this.eventListeners[eventId][i].processEvent(event);
					if(event.isStopped()) { break; }
				}
			}
		}
	};

	/**
	 * Create an Instance of this, and you will fire a notifaction instantly
	 */
	Notification = function(eventId, data) {
		return Storage.fireEvent(eventId, data);
	};

	/**
	 * Create this to create a Listener for upcoming notifacations
	 */
	Notification.Listener = function(eventId, callback) {
		var listenerId = null,
			object = {
				stopListening: function() {
					listenerId && Storage.removeListener(eventId, listenerId);
					listenerId = null;
				},
				startListening: function() {
					listenerId = Storage.addListener(eventId, this);
				},
				/** Parameter: Event */
				processEvent: callback
			};
		object.startListening();

		return object;
	};

	return Notification;
})();
