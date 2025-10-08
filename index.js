import 'dotenv/config'
import express from "express";
import logger from "./logger.js";
import morgan from "morgan";

const app = express()
const port = process.env.PORT || 3000
app.use(express.json())

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

let coffeeData = []
let nextId = 1

app.post('/coffee', (req,res) => {
    const {name, price} = req.body
    const newCoffee = {id: nextId++, name, price}
    coffeeData.push(newCoffee)
    res.status(201).send(newCoffee)
})

app.get('/coffee', (req,res) => {
    res.status(200).send(coffeeData)
})

app.get('/coffee/:id', (req, res) => {
    const coffee = coffeeData.find(t => t.id === parseInt(req.params.id))
    if(!coffee){
        res.status(404).send("Coffee not found")
    }
    res.status(200).send(coffee)
})

//update coffee
app.put('/coffee/:id', (req,res) => {
    const coffee = coffeeData.find(t => t.id === parseInt(req.params.id))

    if(!coffee){
        res.status(404).send("Coffee not found")
    }

    const {name, price} = req.body
    coffee.name = name
    coffee.price = price
    res.send(200).send(coffee)
})

//delete coffee
app.delete('/coffee/:id', (req,res) => {
    const index = coffeeData.findIndex(t => t.id === parseInt(req.params.id))
    if (index === -1) {
        return res.status(404).send("Coffee not found")
    }
    coffeeData.splice(index, 1)
    return res.status(204).send("Deleted")
})


app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}...`)
})