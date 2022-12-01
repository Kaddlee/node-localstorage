"use strict";
/*

  node-localstorage

  Powered by @Kaddlee with love
  https://github.com/Kaddlee

*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
const fs_1 = require("fs");
class Storage {
    /**
     *
     * Create storage object
     *
     * @param {string} file path to file
     */
    constructor(file) {
        this.chached = {};
        this.sum = 0;
        this.events = {
            rewrite: null,
            add: null,
            remove: null,
            get: null
        };
        this.file = file;
        this.init();
    }
    init() {
        try {
            this.chached = JSON.parse((0, fs_1.readFileSync)(this.file).toString());
            this.updateSum();
        }
        catch {
            (0, fs_1.writeFileSync)(this.file, '{}');
            this.updateSum();
        }
    }
    event(name, data = null) {
        if (this.events[name] !== null && this.events[name] !== undefined) {
            this.events[name](data);
        }
    }
    updateFromFile() {
        this.chached = JSON.parse((0, fs_1.readFileSync)(this.file).toString());
    }
    updateSum() {
        this.sum = (0, fs_1.statSync)(this.file).size;
    }
    checkSum() {
        if (this.sum === (0, fs_1.statSync)(this.file).size)
            return true;
        else
            return false;
    }
    /**
     * Set your callback for event
     *
     * use (add, remove, get, rewrite) events
     *
     * ```js
     *  storage.on("add", (item: any) => {
     *    console.log(`You add ${item.name} with value ${item.value}`);
     *  }
     * ```
     *
     * @param {string} name Name of event
     * @param {object} callback Function for event
     */
    on(name, callback) {
        this.events[name] = callback;
    }
    /**
     * Rewrite storage file
     *
     * @param {any} json Default value after rewrite
     * @return {boolean} Return status
     */
    rewrite(json = null) {
        try {
            if (json)
                this.chached = json;
            else
                this.chached = {};
            (0, fs_1.writeFileSync)(this.file, JSON.stringify(this.chached));
            this.event("rewrite", true);
            return true;
        }
        catch {
            this.event("rewrite", false);
            return false;
        }
    }
    /**
     * Add item to storage
     *
     * @param {string} name Name of key
     * @param {any} value Any type value
     */
    addItem(name, value) {
        this.chached[name] = value;
        (0, fs_1.writeFileSync)(this.file, JSON.stringify(this.chached));
        this.updateSum();
        this.event("add", { name, value });
    }
    /**
     * Remove item from storage
     *
     * @param {string} name Name of key
     */
    removeItem(name) {
        this.event("remove", { name: name, value: this.chached[name] });
        delete this.chached[name];
        (0, fs_1.writeFileSync)(this.file, JSON.stringify(this.chached));
        this.updateSum();
    }
    /**
     * Get item from storage
     *
     * @param {string} name Name of key
     * @return {any} Any type value
     */
    getItem(name) {
        if (this.checkSum()) {
            this.event("get", this.chached[name]);
            return this.chached[name];
        }
        else {
            this.updateFromFile();
            this.event("get", this.chached[name]);
            return this.chached[name];
        }
    }
}
exports.Storage = Storage;
