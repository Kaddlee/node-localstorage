import Storage from "../src/storage";

const storage = new Storage("./storage");

// Events
// You can call this events with your custom callback

// ADD item event
storage.on('add', (item: any) => {
  console.log(`You add ${item.name} with value ${item.value}`);
})

// GET item event
storage.on('get', (item: any) => {
  console.log(item);
})

// REMOVE item event
storage.on('remove', (item: any) => {
  console.log(`You remove ${item.name} with value ${item.value}`);
})

// REWRITE item event
storage.on('rewrite', (status: boolean) => {
  if (status) console.log('Realy rewrite storage file!');
})


// Methods

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