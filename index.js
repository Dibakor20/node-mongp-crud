// npm install express mongodb 
// npm install -g nodemon  for auto connect if anything i change
// npm install cors for handiling cors error
// npm install body-parser for  geeting post

// userName='dbUser'
// password='1bJIk7TqpqWwmUYn'

const express = require('express')
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId

const uri = "mongodb+srv://dbUser:1bJIk7TqpqWwmUYn@cluster0.24jci.mongodb.net/natural?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html')
})



client.connect(err => {
  const productCollection = client.db("natural").collection("products");

  app.get('/products',(req,res)=>{
    productCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })

  // add Product
  app.post('/addProduct',(req,res)=>{
      const product = req.body
      console.log(product)
      productCollection.insertOne(product)
      .then(result=>{
          console.log("product added")
          res.redirect('/')
      })
  })

  console.log("database connected")
  // perform actions on the collection object
  // Get Product
  app.get('/product/:id',(req,res)=>{
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err,documents)=>{
      res.send(documents[0])
    })
     
  })
  // Update Product
  app.patch('/update/:id',(req,res)=>{
    productCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {price: req.body.price, quantity: req.body.quantity} 
    })
    .then(result=>{
      res.send(result.modifiedCount > 0)
    })

  })
  // delete Product
  app.delete('/delete/:id',(req,res)=>{
    productCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result=>{
      res.send(result.deletedCount > 0)
    })
  })
 
});





app.listen(3000)


