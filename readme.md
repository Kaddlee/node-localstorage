# node-localstorage

A lightweight library that allows you to add simple file storage to your nodeJS project

```js
import {Storage} from "node-localstorage";

const storage = new Storage("./storage");

storage.addItem("name", "any type value");
```

## Methods

```js
// ADD new item
// If such a key is found, it will be overwritten
storage.addItem("name", "any type value");

// GET item
storage.getItem("name");

// REMOVE item
storage.removeItem("name");

// REWRITE storage file
storage.rewrite({name: "Kaddlee"}); // default {name: "Kaddlee"}
storage.rewrite(); // default {}
```

## Events
You can call this events with your custom callback

```js
// ADD item event
storage.on('add', (item) => {
  console.log(`You add ${item.name} with value ${item.value}`);
})

// GET item event
storage.on('get', (item) => {
  console.log(item);
})

// REMOVE item event
storage.on('remove', (item) => {
  console.log(`You remove ${item.name} with value ${item.value}`);
})

// REWRITE item event
storage.on('rewrite', (status) => {
  if (status) console.log('Realy rewrite storage file!');
})
```