const express = require('express');
const app = express()
const path = require('path')
const bcrypt = require('bcrypt')
const port = 8000;
const mongoose = require('mongoose');
const cors = require('cors')
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
const router = express.Router()
// app.use(CORS)



// Connection URI
// const uri = 'mongodb+srv://admin04:arul9976@cluster0.fzkpyji.mongodb.net/?retryWrites=true&w=majority';
// const uri = 'mongodb://localhost:27017/';
// Connect to the MongoDB server
// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connect("mongodb://127.0.0.1:27017/users")
    .then(() => {
        console.log('Connected to the database!');

    })
    .catch((error) => {
        console.error('Error connecting to the database:', error);
    });


const userSchema = new mongoose.Schema({
    subject: String,
    message: String,
    checked: Boolean
});

const User = mongoose.model('User', userSchema);



const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions))
app.use(express.static("public"))
app.set('view engine', 'ejs');
// app.set('view engine', 'jade');

app.get('/Login', (req, res) => {
    res.render("login")
})
app.get('/SignUp', (req, res) => {
    res.render("signUp")
})

app.post('/app', async (req, res) => {
    try {
        const ReceivedData = await req.body.data;
        console.log('Received data from the frontend:', ReceivedData);
        try {
            ReceivedData.forEach(Data => {
                const newData = new User(Data)

                newData.save()
                    .then(() => {
                        console.log('data saved');
                    }).catch(() => {
                        console.log('data saved failed');
                    })
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



app.delete('/app/:id', async (req, res) => {
    const id = new ObjectId(req.params);

    if (mongoose.Types.ObjectId.isValid(id)) {
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

app.get('/app', async (req, res) => {
    try {
        const items = await User.find();
        res.json(items);
    } catch (err) {
        console.error('Error retrieving data: ', err);
        res.status(500).send('Internal Server Error');
    }
});

const Login = require('./src/db_Login');


app.post('/app/Login/submit-form', async (req, res) => {
    try {
        const LoginDataEl = await Login.findOne({ Email: req.body.Email })
        console.log('Received', req.body.Email)

        if (LoginDataEl) {
            app.get('/app/submit-form', async (request, response) => {
                const Items = await Login.find({ Email: req.body.Email })
                response.json(Items)
            })
            res.redirect('http://127.0.0.1:5500/Web_Projects/Todo/backend/')
        }
        else {
            res.send('User not exists')
            console.log('ella')
        }
    }

    catch (error) {
        console.log('Error processing data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }


})

app.post('/app/SignUp/submit-form', async (req, res) => {
    try {
        const data = {
            Username: req.body.Username,
            Email: req.body.Email,
            Password: req.body.Password,
        }

        
        const saltRounds = 10;
        const hashpass = await bcrypt.hash(data.Password, saltRounds)
        data.Password = hashpass

        const userdata = await Login.insertMany(data)

        app.get('/app/submit-form', async (request, response) => {
            const Items = await Login.find({ Username: req.body.Username })
            response.json(Items)
        })
        return res.redirect('http://127.0.0.1:5500/Web_Projects/Todo/backend/')
    }

    catch (error) {
        console.log('Error processing data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }


})

app.listen(port, () => {
    console.log(`server connected ${port}`);
})


