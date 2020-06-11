var express = require('express');
var exphbs = require('express-handlebars');
var morgan = require('morgan')
var mercadopago = require('mercadopago');

mercadopago.configure({
    integrator_id: 'dev_24c65fb163bf11ea96500242ac130004',
    access_token: 'APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398'
});


var app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use('/assets', express.static(__dirname + '/assets'));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))



app.get('/', function (req, res) {
    res.render('home');
});

app.get('/tienda', function (req, res) {
    res.render('tienda');
});

app.get('/detail', function (req, res) {
    mercadopago.preferences.create(myPreference(req.query))
        .then(result => { 
            console.log(result);
            res.render('detail', { ...req.query, init_point: result.body.init_point 
            }) })
        .catch(error => {
            console.log(error);
            res.render('detail', { ...req.query, init_point: response.body.init_point })
        });
});




app.get('/success', function (req, res) {
            console.log(req.query);
            res.render('success', req.query);
})

app.get('/failure', function (req, res) {
    res.render('failure', req);
})

app.get('/pending', function (req, res) {
    res.render('pending', req);
})


app.use(express.static('assets'));



app.listen(process.env.PORT || 3000)



const myPreference = ({ img, title, price, unit }) => {
    const production = 'https://nikoledesma-mp-ecommerce-nodej.herokuapp.com';
    const development = 'http://localhost:3000';
    const url = (process.env.NODE_ENV ? production : development);
    return ({

        payer: {
            name: "Lalo",
            surname: "Landa",
            email: "test_user_63274575@testuser.com",
            phone: {
                area_code: "11",
                number: 22223333
            },
            address: {
                street_name: 'False',
                street_number: 123,
                zip_code: '1111'
            }
        },
        items: [
            {
                id: 1234,
                title,
                description: 'Dispositivo móvil de Tienda e-commerce',
                picture_url: url + img.substr(1),
                quantity: Number(unit),
                unit_price: Number(price)
            }
        ],
        auto_return: "approved",
        payment_methods: {
            installments: 6
        },
        external_reference: "nicolase.ledesma@gmail.com",
        back_urls: {
            success: url + "/success",
            failure: url + "/failure",
            pending: url + "/pending"
        },
        notification_url: "https://whispering-lowlands-19099.herokuapp.com/notifications"
    })
}

