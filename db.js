const express = require('express');
const app = express()
const path = require('path')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const cors = require('cors')
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
const router = express.Router()


const dotenv = require('dotenv')
dotenv.config()

// connectDb()
console.log('url', process.env.MONGODB_URI)

const mongoURI = process.env.MONGODB_URI
console.log('url', mongoURI)
// Connection URI

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const userSchema = new mongoose.Schema({
    username: String,
    subject: String,
    message: String,
    checked: Boolean,
    TimeDate: {
        date: String,
        month: String,
        hours: String,
        minutes: String,
        ampm: String,
    }
});





const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}


app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions))
app.use(express.static("public"))

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render("main")
})
app.get('/Login', (req, res) => {
    res.render("login")
})
app.get('/SignUp', (req, res) => {
    res.render("signUp")
})
app.get('/Dashboard', (req, res) => {
    res.render("Dashboard")
})

const Login = require('./src/db_Login');






app.post('/app/SignUp/', async (req, res) => {
    try {

        const data = {
            Username: req.body.Formobject.Username,
            Email: req.body.Formobject.Email,
            Password: req.body.Formobject.Password,
        }

        const saltRounds = 10;
        const hashpass = await bcrypt.hash(data.Password, saltRounds)
        data.Password = hashpass
        console.log(data)
        const userdata = await Login.insertMany(data)

        console.log('data', userdata);
        return res.json(userdata)


    }

    catch (error) {
        console.log('Error processing data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }


})

app.get("/app/check/:username/:id", async (req, res) => {
    const data = req.params;
    let mail = data.username;
    let id = data.id;
    console.log(mail, id);
    const Data = await DataPost(mail).findById(id);
    console.log(Data);
    if (Data.checked) {
        await DataPost(mail).findByIdAndUpdate({ _id: id }, { checked: false })
    } else {
        await DataPost(mail).findByIdAndUpdate({ _id: id }, { checked: true })

    }
    res.send(Data)
})

app.post('/app/Login/', async (req, res) => {

    const DataEL = await req.body


    const Data = await Login.find({ Email: DataEL.Formobject.Email }).lean()
    console.log('hi', Data)
    try {
        if (Data.length !== 0) {
            const pass = Data[0].Password
            if (await bcrypt.compare(req.body.Formobject.Password, pass)) {
                res.json(Data)
            }
            else {
                res.json({ error: 'Un/Ps wrong' })
            }

        }
        else {
            res.json({ error: 'User not exists' })
        }

    }

    catch (error) {
        console.log('Error processing data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }


})

const GetUser = (DataEL) => {
    app.get('/app/Dashboard/Login/', async (request, response) => {
        const Data = await Login.findOne({ Email: DataEL })

        console.log('datassss', Data);
        response.json([Data])

    })
}
const DataPost = (username) => {

    const User = mongoose.model(username, userSchema);
    return User
}


app.post('/app/', async (req, res) => {

    try {

        const ReceivedData = await req.body.data;
        console.log('Received data from the frontend:', ReceivedData);
        try {
            ReceivedData.forEach(Data => {
                let User = DataPost(Data.username)
                const newData = new User(Data)
                console.log('frfd', newData)
                newData.save()
                    .then(() => {
                        console.log('data saved');
                    }).catch(() => {
                        console.log('data saved failed');
                    })
                // const data = User.find({ subject: Data.subject })
                res.json(newData);
            })

        }
        catch (err) {
            console.log('failed');
        }

    }

    catch (error) {
        console.log('Error processing data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }


})
app.delete('/app/:id/', async (req, res) => {
    const data = req.params;
    const dataSplit = data.id.split(':')
    const uname = dataSplit[0]
    const id = new ObjectId(dataSplit[1])
    const User = DataPost(uname)
    if (data) {
        try {
            const deletedItem = await User.findByIdAndDelete(id)
            if (deletedItem) {
                console.log('Document deleted successfully:', deletedItem);
            } else {
                console.log('No document found with the provided ID:', id);
            }
        } catch (err) {
            console.error('Error deleting document:', err);
        }
    } else {
        reject({ success: "false", data: "Please provide correct id" });
    }


});



app.get('/app/:username/', async (req, res) => {

    const data = req.params;
    console.log('name', data)
    const User = DataPost(data.username)
    try {
        const items = await User.find({ username: data.username });
        console.log('Items', items);
        res.json(items);
    } catch (err) {
        console.error('Error retrieving data: ', err);
        res.status(500).send('Internal Server Error');
    }
});




const PORT = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 4000

app.listen(PORT, () => {
    console.log(`server connected ${PORT}`);
})




