const Storage = require('../index');

const storage1 = new Storage('./storage'); // first handler
const storage2 = new Storage('./storage'); // second handler

// create and rewrite
storage1.addItem("name", "tony");
storage2.addItem("name", "hayzen");


// read key
console.log(storage1.getItem("name"));
console.log(storage2.getItem("name"));

// remove key from storage1
storage1.removeItem("name");

// get this removed key from storage2. return undefined
console.log(storage2.getItem("name"));