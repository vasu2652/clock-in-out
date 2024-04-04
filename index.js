require('dotenv').config()
const { chromium } = require("playwright");
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const personalEmail = process.env.personalEmail;
const personalEmailPassword = process.env.personalEmailPassword;
const notifyTo = process.env.notifyEmail;
const adrenalineUser = process.env.adrenalineUser;
const adrenalinePassword = process.env.adrenalinePassword;
const adrenalineDisplayUerName = process.env.adrenalineDisplayUerName;
const adrenalineURL =  process.env.adrenalineURL;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: personalEmail,
        pass: personalEmailPassword
    }
});

async function clockIn(){
    console.log('ClockIn Started', new Date());
    const browser = await chromium.launch({ headless: true , channel: 'chrome'});
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(adrenalineURL);
    await page.fill('input[type=text]', adrenalineUser);
    await page.fill('input[type=password]', adrenalinePassword);
    await page.getByText('Login').click();
    await page.waitForSelector('text=Clock-in');
    await page.getByText('Clock-in').click();
    await browser.close();
    console.log('clockedIn Success', new Date());
    sendEmail('clockIn');

}

async function clockOut(){
    console.log('Clockout Started', new Date());
    const browser = await chromium.launch({ headless: true , channel: 'chrome'});
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(adrenalineURL);
    await page.fill('input[type=text]', adrenalineUser);
    await page.fill('input[type=password]', adrenalinePassword);
    await page.getByText('Login').click();
    await page.waitForSelector(`text= ${adrenalineDisplayUerName}`, { state: 'attached'});
    await page.locator('img.img-profile').click();
    (await page.waitForSelector('text=Exit application', { state: 'attached'})).click();
    await page.waitForSelector('text= Do you want to clockout ?', { state: 'attached'});
    (await page.waitForSelector('text=Yes', { state: 'attached'})).click();
    await browser.close();
    console.log('clockedOut  Success', new Date());
    sendEmail('clockOut');
}

cron.schedule('0 10 * * 1-5', clockIn, { scheduled: true, timezone: 'Asia/Kolkata'});
cron.schedule('0 19 * * 1-5', clockOut, { scheduled: true, timezone: "Asia/Kolkata"});

function sendEmail(message) {
    const mailOptions = {
        from: personalEmail,
        to: notifyTo,
        subject: message+' '+ new Date(),
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error occurred while sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}
