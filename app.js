const Koa = require('koa');
const KoaRouter = require('koa-router');
const bodyParser = require('koa-bodyparser');
const nodemailer = require("nodemailer");

const app = new Koa();
const router = new KoaRouter();

app.use(bodyParser());
router.get('/', ctx=> (ctx.body = "Hello world"));
router.post('/mail', mailer);

async function mailer(ctx, next){
    const body = ctx.request.body;

    // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Logistic App" <info@imperialit.in>', // sender address
    to: body.to, // list of receivers
    subject: body.subject, // Subject line
    text: body.message, // plain text body
    // html: "<b>"+body.message+"</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  ctx.body = {"messageId": info.messageId, "previewUrl": nodemailer.getTestMessageUrl(info)};
}

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);