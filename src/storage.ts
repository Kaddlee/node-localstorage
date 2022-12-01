/*

  node-localstorage  

  Powered by @Kaddlee with love
  https://github.com/Kaddlee

*/

import { readFileSync, writeFileSync, statSync } from "fs";

export class Storage {

  public file: string;

  private chached: any = {};
  private sum: number = 0;
  private events: any = {
    rewrite: null,
    add: null,
    remove: null,
    get: null
  };

  /**
   * 
   * Create storage object
   * 
   * @param {string} file path to file
   */
  constructor(file: string) {
    this.file = file;
    this.init();
  }

  private init(): void {
    try {
      this.chached = JSON.parse(readFileSync(this.file).toString());
      this.updateSum();
    } catch {
      writeFileSync(this.file, '{}');
      this.updateSum();
    }
  }

  private event(name: string, data: any = null): void {
    if (this.events[name] !== null && this.events[name] !== undefined) {
      this.events[name](data);
    }
  }

  private updateFromFile(): void {
    this.chached = JSON.parse(readFileSync(this.file).toString());
  }

  private updateSum(): void {
    this.sum = statSync(this.file).size;
  }

  private checkSum(): boolean {
    if (this.sum === statSync(this.file).size) return true;
    else return false;
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
  on(name: string, callback: object): void {
    this.events[name] = callback;
  }

  /** 
   * Rewrite storage file
   * 
   * @param {any} json Default value after rewrite
   * @return {boolean} Return status
   */
  rewrite(json: any = null): boolean {
    try {

      if (json) this.chached = json; 
      else this.chached = {}

      writeFileSync(this.file, JSON.stringify(this.chached));
      this.event("rewrite", true);
      return true;
    } catch {
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
  addItem(name: string, value: any): void {
    this.chached[name] = value;
    writeFileSync(this.file, JSON.stringify(this.chached));
    this.updateSum();
    this.event("add", {name, value});
  }

  /** 
   * Remove item from storage
   * 
   * @param {string} name Name of key
   */
  removeItem(name: string): void {
    this.event("remove", {name: name, value: this.chached[name]});
    delete this.chached[name];
    writeFileSync(this.file, JSON.stringify(this.chached));
    this.updateSum();
  }

  /** 
   * Get item from storage
   * 
   * @param {string} name Name of key
   * @return {any} Any type value
   */
  getItem(name: string): any {
    if (this.checkSum()) {
      this.event("get", this.chached[name]);
      return this.chached[name];
    } else {
      this.updateFromFile();
      this.event("get", this.chached[name]);
      return this.chached[name];
    }
  }
}