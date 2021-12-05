// Her angives, hvilken path dataen skal følge i forhold til json filen
const express = require("express");
var formidable = require('formidable');
var http = require('http');

const router = express.Router();
const DATA_PATH = __dirname + "/../../data/items.json";
const fs = require("fs");

const saveItemsData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync(DATA_PATH, stringifyData)
}

const getItemsData = () => {
    const jsonData = fs.readFileSync(DATA_PATH)
    return JSON.parse(jsonData)
}

// Læs - brug metoden get til at få varens data til json filen
router.post('/itemcatogery', (req, res) => {
    console.log(req.body.email);
    var existItems = getItemsData();
    var itemData = existItems[req.body.email];
    var category = req.body.category;
    let newItemData=[];
    if(itemData!=undefined)
    for (let i = 0; i < itemData.length; i++) {
        var item = itemData[i];
        console.log(item);
        if(item["category"] === category)
        {
         newItemData.push(item);
        }
        else 
        continue;
       }
    return res.status(200).json(newItemData);
});

// Læs - brug metoden get til at få varens data til json filen (også ved brug af math.random for at oprette et bestemt id til hver enkelt vare)
router.post("/upload", (req, res) => {
    console.log("Hello");
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.filepath;
      const category = fields.category;
      const title = fields.title;
      const price = fields.price;
      const email = fields.emailToSubmit;
      var newpath = 'C:/Users/ninavicic/Desktop/login-system-2/uploads/' + files.filetoupload.originalFilename;
      
      let existItems = getItemsData()
      const newItemId = Math.floor(100000 + Math.random() * 900000)
  
      if (existItems[email] != null)
      existItems[email].push({"category": category,"title": title, "price": price, "newItemId":newItemId,"newpath":oldpath});
      else {
          existItems[email] = [{"category": category,"title": title, "price": price, "newItemId":newItemId,"newpath":oldpath}];
      }
  
      saveItemsData(existItems);
      res.send({success: true, msg: 'item data added successfully'})
 });
});

// Her tilføjes en varer efter de har indtastet dens informationer vha. math.random igen
router.post("/item", (req, res) => {
    const category = req.body.category;
    const title = req.body.title;
    const price = req.body.price;
    const email = req.body.email;
    var newElement;

    let existItems = getItemsData()
    const newItemId = Math.floor(100000 + Math.random() * 900000)

    if (existItems[email] != null)
    existItems[email].push({"category": category,"title": title, "price": price, "newItemId":newItemId});
    else {
        existItems[email] = [{"category": category,"title": title, "price": price, "newItemId":newItemId}];
    }

    saveItemsData(existItems);
    res.send({success: true, msg: 'item data added successfully'})
});

// Update, altså opdater en vare - ved brug af put metoden
router.put('/item/:id', (req, res) => {
    console.log("received");
    fs.readFile(DATA_PATH, 'utf8', (err, data) => {
        let existItems = getItemsData()
        const userId = req.body.userId;
        const itemId = req.params['id'];
        let itemData = existItems[userId];
        let newItemData=[];
        for (let i = 0; i < itemData.length; i++) {
           var item = itemData[i];
           console.log(item);
           if((item["newItemId"].toString()) === itemId)
           {
            let newItemDatawithFilePath = req.body;
            newItemDatawithFilePath["newpath"]= item["newpath"];
            newItemData[i]=newItemDatawithFilePath;
           }
           else 
           newItemData[i]=item;
          }
          existItems[userId]= newItemData;

        saveItemsData(existItems);

        console.log(userId);

        res.send({response: `accounts with item id ${itemId} has been updated`});
    }, true);
});

// Delete, altså slet en vare - ved brug af delete metoden
router.delete('/item/:id', (req, res) => {
console.log("received");
fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    let existItems = getItemsData()
    const userId = req.body.userId;
    const itemId = req.params['id'];
    let itemData = existItems[userId];
    let newItemData=[];
    for (let i = 0; i < itemData.length; i++) {
       var item = itemData[i];
       console.log(item);
       if((item["newItemId"].toString()) === itemId)
       {
        continue;
       }
       else 
       newItemData.push(item);
      }
      existItems[userId]= newItemData;
    saveItemsData(existItems);

    console.log(userId);

    res.send({response: `items with id ${itemId} has been deleted`});
}, true);
})

module.exports = router;
