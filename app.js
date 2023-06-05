// Events
// const events = require('events');
//
// const eventEmitter = new events();
//
// eventEmitter.on('click', (data)=>{
//     console.log(data)
//     console.log('Click, click, click')
// })
//
// eventEmitter.emit('click', {data: 'Hello'})
// eventEmitter.emit('click')
// eventEmitter.emit('click')
// eventEmitter.emit('click')
// eventEmitter.emit('click')
//
// console.log(eventEmitter.eventNames())
//
// eventEmitter.once('clickAndDie', ()=>{
//     console.log('Clicked and died')
// })
//
// console.log(eventEmitter.eventNames())
//
// eventEmitter.emit('clickAndDie')
// eventEmitter.emit('clickAndDie')
// eventEmitter.emit('clickAndDie')
// eventEmitter.emit('clickAndDie')

//  Stream
// const fs = require('fs');
//
// const readStream = fs.createReadStream('text3.txt')
// const writeStream = fs.createWriteStream('text2.txt')
//
// readStream.on('data', (chunk) => {
//     writeStream.write(chunk)
// })
//
// readStream
//     .on('error', () => {
//         readStream.destroy()
//         writeStream.end('ERROR ON READING FILE')
//     })
//     .pipe(writeStream)

const express = require('express')

const fileService = require('./file.service');

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.get('/users', async (req, res) => {
    const users = await fileService.readDB();
    res.status(200).json(users)
})
app.get('/users/:id', async (req, res) => {
    const {id} = req.params

    const users = await fileService.readDB()

    const user = users.find((user) => user.id === +id);
    if (!user) {
        return res.status(422).json('user not found')
    }

    res.json(user)
})

app.post('/users', async (req, res) => {
    const {name, age} = req.body

    if (!name || name.length < 2) {
        return res.status(400).json({
                message: "Name must contain at least 3 letters"
            }
        )
    }
    if (!age || age < 10 || age > 150) {
        return res.status(400).json({
                message: "Age is wrong"
            }
        )
    }

    const users = await fileService.readDB()

    const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        name,
        age,
    }
    users.push(newUser)

    await fileService.writeDB(users)

    res.status(201).json(newUser)
})

app.put('/users/:id', async (req, res) => {
    const {id} = req.params
    const {name, age} = req.body;

    const users = await fileService.readDB()
    const user = users.find((user) => user.id === +id);

    if (!user) {
        return res.status(422).json('user not found')
    }

    if (name) user.name = name
    if (age) user.age = age

    await fileService.writeDB(users)

    res.status(201).json(user)
})

app.patch('/users/:id', async (req, res)=>{
    const {id} = req.params
    const {name, age} = req.body

    if (name && name.length < 2) {
        return res.status(400).json({
                message: "Name must contain at least 3 letters"
            }
        )
    }
    if (age && (age < 10 || age > 100)) {
        return res.status(400).json({
                message: "Age is wrong"
            }
        )
    }

    const users = await fileService.readDB()
    const user = users.find((user) => user.id === +id);

    if (!user) {
        return res.status(422).json('user not found')
    }
    if (name) user.name = name
    if (age) user.age = age

    await fileService.writeDB(users)
    res.status(201).json(user)
})

app.delete('/users/:id', async (req, res) => {
    const {id} = req.params

    const users = await fileService.readDB()
    const index = users.findIndex((user) => user.id === +id);

    if (index === -1) {
        return res.status(422).json('user not found')
    }

    users.splice(index, 1)
    await fileService.writeDB(users)

    res.status(204)
})

const PORT = 5001

app.listen(PORT, () => {
    console.log(`Server has started on PORT ${PORT} `)
})