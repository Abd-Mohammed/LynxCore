class TaskScheduler {
    /**
     * Create and run a new recurring task scheduler.
     * 
     * @param {number} refreshInterval
     */
    constructor(refreshInterval) {
        this.refreshInterval = refreshInterval;
        this.runnable = null;
        this.subscribers = {};
        // start the runnable directly.
        this.start();
    }

    /**
     * Register a callback for the runnable.
     * 
     * @param {string} key
     * @param {any} callback
     * @param {boolean} directCall : Specify whether the callback should be called immediatly after it's registered.
     */
    register(key, callback, directCall = true) {
        if (this.subscribers[key] != null) {
            console.error(`Scheduler already has the given subscriber (${key})`);
            return;
        }

        if (directCall) {
            callback();
        }

        this.subscribers[key] = callback;
    }

    /**
     * Remove the callback from scheduler.
     * 
     * @param {string} key
     */
    unRegister(key) {
        if (this.isRegistered(key)) {
            delete this.subscribers[key];
        }
    }

    /**
     * Check if a callback is registred for the given key.
     * 
     * @param {string} key
     */
    isRegistered(key) {
        return this.subscribers[key] != null;
    }

    /**
     * Execute callbacks.
     *
     */
    execute(key = null) {
        // If a specific key is sent, then just call it explicitly.
        if (key != null) {
            if (this.subscribers[key] != null) {
                this.subscribers[key]();
            }

            return;
        }

        // Run all the callbacks.
        for (var key in this.subscribers) {
            this.subscribers[key]();
        }
    }

    /**
     * Start the scheduler.
     *
     */
    start(directExecute = false) {

        if (directExecute) {
            this.execute();
        }

        this.runnable = setTimeout(() => {
            this.execute();
            this.start();
        }, this.refreshInterval);
    }

    /**
     * Stop the scheduler completly.
     * 
     */
    stop() {
        if (this.runnable != null) {
            clearTimeout(this.runnable);
        }

        this.runnable = null;
    }

    /**
     * change the time interval between execute 
     * 
     * @param {any} interval
     * @param {boolean} directExecute
     */
    changeInterval(interval, directExecute = true) {
        this.refreshInterval = interval;

        // clear the queued call.
        this.stop();

        // directly execute the callbacks if required.
        if (directExecute) {
            this.execute();
        }

        // register the new refresh interval for the required time value.
        this.start();
    }
}