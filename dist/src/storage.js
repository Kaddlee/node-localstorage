"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
const fs_1 = require("fs");
const crypto_1 = __importDefault(require("crypto"));
class Storage {
    /**
     *
     * Create storage object
     *
     * @param {string} file path to file
     */
    constructor(file) {
        this.chached = {};
        this.events = {};
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
    event(name, data) {
        if (this.events[name] !== null && this.events[name] !== undefined) {
            this.events[name](data);
        }
    }
    updateFromFile() {
        this.chached = JSON.parse((0, fs_1.readFileSync)(this.file).toString());
    }
    updateSum() {
        this.sum = this.fileSum();
    }
    checkSum() {
        if (this.sum === this.fileSum())
            return true;
        else
            return false;
    }
    fileSum(algorithm = 'md5', encoding = 'hex') {
        return crypto_1.default
            .createHash(algorithm)
            .update((0, fs_1.readFileSync)(this.file).toString(), 'utf8')
            .digest(encoding);
    }
    /**
     * Set your callback for event
     *
     * use (add, remove, get, rewrite) events
     *
     * ```js
     *  storage.on("add", (item) => {
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
        this.event("remove", { name, value: this.chached[name] });
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
        if (!this.checkSum())
            this.updateFromFile();
        this.event("get", { name, value: this.chached[name] });
        return this.chached[name];
    }
}
exports.Storage = Storage;
