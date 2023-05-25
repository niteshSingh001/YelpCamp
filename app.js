const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const { campgroundSchema, reviewSchema } = require('./schemas.js')
const methodOVerride = require('method-override');
const Campground = require('./models/campground');
const ExpressError = require("./utils/ExpressError");
const Review = require('./models/review.js');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js')

const userRoutes = require('./routes/users.js')
const campgroundsRoutes = require('./routes/campground.js');
const reviewsRoutes = require('./routes/reviews.js');


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "CONNECTION ERROR:"));
db.once("open", () => {
    console.log("CONNECTED TO MONGO DATABASE");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true }));
app.use(methodOVerride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})

// app.get('/fakeUser', async (req, res) => {
//     const user = new User({ email: 'ns@gmail.com', username: 'niteshSingh' });
//     const newUser = await User.register(user, 'monkey');
//     res.send(newUser);
// })


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}


app.use('/', userRoutes)
app.use('/campgrounds', campgroundsRoutes)
app.use('/campgrounds/:id/reviews', reviewsRoutes)


app.get('/', (req, res) => {
    res.render('home');
});




app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh  No, Something Went Wrong!';
    res.status(statusCode).render('error', { err });
});


























app.listen(3000, () => {
    console.log("SERVING ON PORT 3000");
});
