const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// all config
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();
const port = process.env.PORT || 5000;

// all middleware
const corsConfig = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
};
app.use(cors(corsConfig));
app.use(express.json());
app.use(cookieParser());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2brfitt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const userCollection = client.db('urbanUtopiaDB').collection('users');

    const announcementCollection = client
      .db('urbanUtopiaDB')
      .collection('announcements');

    const apartmentCollection = client
      .db('urbanUtopiaDB')
      .collection('apartments');

    const agreementCollection = client
      .db('urbanUtopiaDB')
      .collection('agreements');

    const paymentCollection = client.db('urbanUtopiaDB').collection('payments');
    const couponCollection = client.db('urbanUtopiaDB').collection('coupons');

    // auth related API
    // node
    // require('crypto').randomBytes(64).toString('hex')
    // gives token when user login
    app.post('/getJwtToken', async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '4h',
      });
      res.send({ token });
    });

    // my made middlewares
    const verifyToken = async (req, res, next) => {
      const tokenCard = req?.headers.authorization;

      if (!tokenCard) {
        return res.status(401).send({ message: 'unauthorized access' });
      }

      const token = req?.headers.authorization.split(' ')[1];
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: 'unauthorized access' });
        }
        if (req?.query?.email !== decoded?.email) {
          return res.status(403).send({ message: 'forbidden access' });
        }
        req.user = decoded;
        next();
      });
    };

    const verifyAdmin = async (req, res, next) => {
      const email = req.user?.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      if (user.role !== 'admin') {
        return res.status(403).send({ message: 'forbidden access' });
      }
      next();
    };

    const verifyMember = async (req, res, next) => {
      const email = req.user?.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      if (user.role !== 'member') {
        return res.status(403).send({ message: 'forbidden access' });
      }
      next();
    };

    // users related API
    // Post a user while registering or logging in
    app.post('/user', async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // Check user role
    app.get('/user/role/:email', verifyToken, async (req, res) => {
      const email = req.params.email;
      const result = await userCollection.findOne({ email });
      res.send(result?.role);
    });

    // get user profile data
    app.get('/user/profile/:email', verifyToken, async (req, res) => {
      const email = req.params.email;
      const result = await userCollection.findOne({ email });
      res.send(result);
    });

    // get users of role member
    app.get('/users/members', verifyToken, verifyAdmin, async (req, res) => {
      const result = await userCollection.find({ role: 'member' }).toArray();
      res.send(result);
    });

    // patch a member role as user
    app.patch(
      '/users/member/:email',
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        const email = req.params.email;
        const filter = { email };
        const document = { $set: { role: 'user' } };

        // delete the agreement also
        await agreementCollection.deleteOne({ lesseeEmail: email });
        await apartmentCollection.updateOne(
          { lesseeEmail: email },
          {
            $set: {
              status: 'available',
              lesseeName: 'to-let',
              lesseeEmail: 'to-let',
              rentedDate: 'to-let',
            },
          }
        );

        const result = await userCollection.updateOne(filter, document);

        res.send(result);
      }
    );

    // Announcents related API
    // post a new announcement
    app.post('/announcements', verifyToken, verifyAdmin, async (req, res) => {
      const announcement = { ...req.body, date: Date.now() };

      const result = await announcementCollection.insertOne(announcement);
      res.send(result);
    });

    // get all announcements
    app.get('/announcements', verifyToken, async (req, res) => {
      const result = await announcementCollection.find().sort({ $natural: -1 }).toArray();
      res.send(result);
    });

    // get an announcement
    app.get('/announcements/:id', async (req, res) => {
      const id = req.params.id;
      const result = await announcementCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // update an announcement
    app.patch('/announcements/:id',  verifyToken, verifyAdmin, async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = { $set: req.body };
        const result = await announcementCollection.updateOne( filter, updateDoc );
        res.send(result);
      }
    );

    // delete an announcement
    app.delete('/announcements/:id', verifyToken, verifyAdmin, async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const result = await announcementCollection.deleteOne(filter);
        res.send(result);
      }
    );

    // apartment related API
    // post an apartments
    app.post('/apartments', verifyToken, verifyAdmin, async (req, res) => {
      const apartment = req.body;
      const result = await apartmentCollection.insertOne(apartment);
      res.send(result);
    });

    // // get all apartments
    // app.get('/apartments', async (req, res) => {
    //   const result = await apartmentCollection.find().toArray();
    //   res.send(result);
    // });

    // Get apartments by pagination
    app.get('/apartments', async (req, res) => {
      const size = parseInt(req.query.size);
      const page = parseInt(req.query.page) - 1;
      const result = await apartmentCollection
        .find()
        .skip(page * size)
        .limit(size)
        .toArray();

      res.send(result);
    });

    // Get apartments count
    app.get('/apartments-count', async (req, res) => {
      const count = await apartmentCollection.estimatedDocumentCount();
      res.send({ count });
    });

    // get an apartment by id
    app.get('/apartments/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await apartmentCollection.findOne(filter);
      res.send(result);
    });

    // update an apartment
    app.patch('/apartments/:id', verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: req.body };
      const result = await apartmentCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // delete an apartment
    app.delete(
      '/apartments/:id',
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const result = await apartmentCollection.deleteOne(filter);
        res.send(result);
      }
    );

    // agreement related API
    // post a new agreement
    app.post('/agreements', verifyToken, async (req, res) => {
      const booking = req.body;
      const result = await agreementCollection.insertOne(booking);
      res.send(result);
    });

    // get an agreement status by email
    app.get('/agreements/:email', verifyToken, async (req, res) => {
      const email = req.params.email;
      const result = await agreementCollection.findOne({ lesseeEmail: email });
      res.send(result?.status);
    });

    //get an agreement by email
    app.get('/agreement/:email', verifyToken, async (req, res) => {
      const email = req.params.email;
      const result = await agreementCollection.findOne({ lesseeEmail: email });
      res.send(result);
    });

    // get all agreements
    app.get('/agreements', verifyToken, verifyAdmin, async (req, res) => {
      const result = await agreementCollection.find().toArray();
      res.send(result);
    });

    // put agreement status as checked and set user as member
    app.patch(
      '/agreements/accept/:id',
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        const doc = req.body;
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const update = {
          $set: { status: 'checked', acceptDate: doc?.acceptDate },
        };
        const agree = await agreementCollection.updateOne(filter, update);
        const document = await agreementCollection.findOne(filter);

        const apart = await apartmentCollection.updateOne(
          { apartment: doc.apartment },
          {
            $set: {
              status: 'unavailable',
              rentedDate: doc?.acceptDate,
              lesseeName: document?.lesseeName,
              lesseeEmail: document?.lesseeEmail,
            },
          }
        );

        const data = await userCollection.updateOne(
          { email: document?.lesseeEmail },
          { $set: { role: 'member', acceptDate: doc.acceptDate } }
        );

        res.send(data);
      }
    );

    // put agreement status as checked only
    app.patch(
      '/agreements/reject/:id',
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const update = { $set: { status: 'checked' } };
        const data = await agreementCollection.updateOne(filter, update);

        res.send(data);
      }
    );

    // Payments collection
    // create-payment-intent
    app.post('/create-payment-intent', verifyToken, async (req, res) => {
      const { rent } = req.body;
      const amount = parseInt(rent * 100);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'usd',
        payment_method_types: ['card'],
      });
      res.send({ clientSecret: paymentIntent.client_secret });
    });

    // post a payment and update status
    app.post('/payments', verifyToken, async (req, res) => {
      const payment = req.body;
      const result = await paymentCollection.insertOne(payment);
      res.send(result);
    });

    // get payments by email
    app.get('/payments/:email', verifyToken, verifyMember, async (req, res) => {
      const email = req.params.email;
      const result = await paymentCollection.find({ email }).toArray();
      res.send(result);
    });

    // get payments by month search
    app.get('/search-payments', verifyToken, async (req, res) => {
      const { search, email } = req.query;
      const filter = { month: { $regex: search, $options: 'i' }, email };
      const payments = await paymentCollection.find(filter).toArray();
      res.send(payments);
    });

    // coupons collection
    // post a new coupon
    app.post('/coupons', verifyToken, verifyAdmin, async (req, res) => {
      const coupon = req.body;
      const result = await couponCollection.insertOne(coupon);
      res.send(result);
    });

    // get all coupons
    app.get('/coupons', async (req, res) => {
      const result = await couponCollection.find().toArray();
      res.send(result);
    });

    // patch a coupon status
    app.patch('/coupons/:id', verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const bodyData = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: { status: bodyData.newStatus } };
      const result = await couponCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // delete a coupon
    app.delete('/coupons/:id', verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await couponCollection.deleteOne(filter);
      res.send(result);
    });

    // stats or analytics
    // total amount from payments
    const getWeekRanges = () => {
      const today = new Date();
      const startOfThisWeek = new Date(
        today.setDate(today.getDate() - today.getDay())
      );

      const startOfLastWeek = new Date(startOfThisWeek);
      startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

      const endOfLastWeek = new Date(startOfThisWeek);
      endOfLastWeek.setDate(endOfLastWeek.getDate() - 1);

      return {
        thisWeek: {
          start: startOfThisWeek,
          end: new Date(),
        },
        lastWeek: {
          start: startOfLastWeek,
          end: endOfLastWeek,
        },
      };
    };

    // admin-stats
    app.get('/admin-stats', verifyToken, verifyAdmin, async (req, res) => {
      // const users = await userCollection.countDocuments()
      const totalApartments =
        await apartmentCollection.estimatedDocumentCount();
      const totalAgreements =
        await agreementCollection.estimatedDocumentCount();
      const totalPayments = await paymentCollection.estimatedDocumentCount();

      const result = await paymentCollection
        .aggregate([{ $group: { _id: null, totalAmmount: { $sum: '$rent' } } }])
        .toArray();
      const revenue = result.length > 0 ? result[0].totalAmmount : 0;

      const { thisWeek, lastWeek } = getWeekRanges();

      // isRevenueGrowing
      const thisWeekPayments = await paymentCollection.countDocuments({
        date: {
          $gte: thisWeek.start.toISOString(),
          $lte: thisWeek.end.toISOString(),
        },
      });
      const lastWeekPayments = await paymentCollection.countDocuments({
        date: {
          $gte: lastWeek.start.toISOString(),
          $lte: lastWeek.end.toISOString(),
        },
      });
      const isPaymentGrowing = thisWeekPayments > lastWeekPayments;

      const allMembers = await userCollection
        .find({ role: 'member' })
        .toArray();
      const allUsers = await userCollection.find({ role: 'user' }).toArray();
      const memberCount = allMembers.length;
      const userCount = allUsers.length;

      const availableApartments = await apartmentCollection
        .find({ status: 'available' })
        .toArray();

      const availableApartmentsCount = availableApartments.length;

      const availableApartmentsParcent =
        (availableApartmentsCount / totalApartments) * 100;

      const unAvailableApartmentsParcent = 100 - availableApartmentsParcent;

      res.send({
        totalApartments,
        availableApartmentsParcent,
        unAvailableApartmentsParcent,
        revenue,
        userCount,
        memberCount,
        totalPayments,
        isPaymentGrowing,
      });
    });

    // Send a ping to confirm a successful connection to DB
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hellow! From UrbanUtopia server owner Khaled');
});

app.listen(port, () => {
  console.log(`UrbanUtopia server is running on port: ${port}`);
});
