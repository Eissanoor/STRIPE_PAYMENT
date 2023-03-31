const express = require("express");
const keys = require("./config/keys");
const stripe = require("stripe")(keys.stripeSecretKey);
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");

const app = express();

// Handlebars Middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set Static Folder
app.use(express.static(`${__dirname}/public`));

// Index Route
app.get("/", (req, res) => {
  res.render("index", {
    stripePublishableKey: keys.stripePublishableKey,
  });
});

// Charge Route
app.post("/charge", (req, res) => {
  const amount = 2500;

  stripe.customers
    .create({
      email: req.body.stripeEmail,

      source: req.body.stripeToken,
    })
    .then((customer) =>
      stripe.charges.create({
        amount,
        description: "Web Development Ebook",
        currency: "usd",
        customer: customer.id,
      })
    )

    .then((charge) => console.log(charge));
});

app.post("/createcustomer", async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      description: "from nodejs",
      email: "eissaanoor1@gmail.com",
      name: "khansaab",
    });
    console.log(customer);
  } catch (error) {
    console.log(error);
    console.log("something is wrong");
  }
});

app.get("/retrive", async (req, res) => {
  try {
    const retrive = await stripe.customers.retrieveSource(
      "cus_MbCBmpp4fTgjGM", // customer id
      "card_1LrzooDLFQbyD3ZPm2IpX6RY" // card number
    );
    console.log(retrive);
    // console.log(customer);

    res.send(retrive);
    console.log(retrive);
  } catch (error) {
    console.log(error);
    console.log("something is wrong");
  }
});

app.post("/createtoken", async (req, res) => {
  try {
    const token = await stripe.tokens.create({
      card: {
        number: "5555555555554444", //type of card number
        exp_month: 10,
        exp_year: 2023,
        cvc: "314",
      },
    });
    console.log(token);
  } catch (error) {
    console.log(error);
    console.log("something is wrong");
  }
});

app.post("/addcard", async (req, res) => {
  try {
    const card = await stripe.customers.createSource("cus_MbFLU2wJk1muje", {
      source: "tok_1Ls36TDLFQbyD3ZPFRtkZngq", //token of cutomer
    });
    console.log(card);
  } catch (error) {
    console.log(error);
    console.log("something is wrong");
  }
});

app.post("/updatecard", async (req, res) => {
  try {
    const card = await stripe.customers.updateSource(
      "cus_MbCBmpp4fTgjGM", //customer id
      "card_1LrzooDLFQbyD3ZPm2IpX6RY", // card id
      { name: "EISSANOOR" }
    );
    console.log(card);
  } catch (error) {
    console.log(error);
    console.log("something is wrong");
  }
});

app.delete("/deletecard", async (req, res) => {
  try {
    const deleted = await stripe.customers.deleteSource(
      "cus_MatlSxUn4m4veb",
      "card_1LrzZpDLFQbyD3ZPBx2wKOZC"
    );
    console.log(deleted);
  } catch (error) {
    console.log(error);
    console.log("something is wrong");
  }
});

// app.post("/charge", async (req, res) => {
//   try {
//     const charge = await stripe.charges.create({
//       amount: 20000,
//       currency: "usd",

//       customer: "cus_MbFLU2wJk1muje",
//       description: "this is nodejs for payment",
//     });
//     console.log(charge);
//   } catch (error) {
//     console.log(error);
//     console.log("something is wrong");
//   }
// });

app.post("/othercard", async (req, res) => {
  try {
    const charge = await stripe.charges.create({
      amount: 1000,
      currency: "usd",
      source: "tok_1LsPzgDLFQbyD3ZPtC2xSRa2",
      // customer: "cus_MbFLU2wJk1muje",
      description:
        "My First Test Charge (created for API docs at https://www.stripe.com/docs/api)",
    });
    console.log(charge);
  } catch (error) {
    console.log(error);
    console.log("something is wrong");
  }
});

app.get("/allchargelist", async (req, res) => {
  try {
    const cashBalanceTransactions = await stripe.balance.retrieve();
    console.log(cashBalanceTransactions);
  } catch (error) {
    console.log(error);
    console.log("something is wrong");
  }
});

app.post("/listcashbalance", async (req, res) => {
  try {
    const invoice = await stripe.invoices.create({
      customer: "cus_MbFLU2wJk1muje",
    });
    console.log(invoice);
  } catch (error) {
    console.log(error);
    console.log("something is wrong");
  }
});
app.post("/charge/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const car = await stripe.customers.createSource("cus_MatlSxUn4m4veb", {
      source: "card_1LrhxgDLFQbyD3ZP7A5cVMqS",
    });
    console.log(car);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
  // ch_3LrhxsDLFQbyD3ZP1YLbGAim;
});
const port = 8000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
