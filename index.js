const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const { MongoClient, ObjectId } = require('mongodb');

require('dotenv').config()
const port =process.env.PORT || 5000
console.log(process.env.DB_USER)

app.use(cors())
app.use(bodyParser.json())


app.get('/', (req, res) => {
  res.send('Hello World!')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.33vow.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('database err ',err)
  const eventCollection = client.db("marcedisCar").collection("cars");
  
app.post('/addEvent',(req,res)=>{

  const newEvent =req.body;
  console.log('adding new event',newEvent)

  eventCollection.insertOne(newEvent)
  .then(result => {
    console.log('insertCount' ,result.insertCount)
    res.send(result.insertCount >0)
  })
})


app.get('/events',(req,res)=> {
  eventCollection.find()
  .toArray( (err,items) =>{
    res.send(items)

  })
})

app.get("/event/:id", (req, res) => {
  eventCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, items) => {
          res.send(items[0]);
      });
});

app.delete('deleteEvent/:id',(req,res) => {
const id = ObjectID(req.params.id)
console.log('delete this ',id);
eventCollection.findOneAndDelete({_id: id})
.then(documents => res.send (!!documents.value))

})

});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})