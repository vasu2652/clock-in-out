require('dotenv').config()
const { chromium } = require("playwright");
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const personalEmail = process.env.personalEmail;
const personalEmailPassword = process.env.personalEmailPassword;
const notifyTo = process.env.notifyEmail;
const adrenalineUser = process.env.adrenalineUser;
const adrenalinePassword = process.env.adrenalinePassword;
const adrenalineDisplayUserName = process.env.adrenalineDisplayUserName;
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
    try {
        console.info('ClockIn Started', new Date());
        const browser = await chromium.launch({ headless: true , channel: 'chrome'});
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(adrenalineURL);
        await page.fill('input[type=text]', adrenalineUser);
        await page.fill('input[type=password]', adrenalinePassword);
        await page.waitForTimeout(2000);
        await page.getByText('Login').click();
        await page.waitForTimeout(2000);
        await page.waitForSelector('text=Clock-in');
        await page.waitForTimeout(2000);
        await page.getByText('Clock-in').click();
        await page.waitForTimeout(2000);
        await browser.close();
        console.info('clockedIn Success', new Date());
        sendEmail('clockIn');
    } catch (error) {
        console.error(error)
    }


}

async function clockOut(){
    try {
        console.info('Clockout Started', new Date());
        const browser = await chromium.launch({ headless: false , channel: 'chrome'});
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(adrenalineURL);
        await page.fill('input[type=text]', adrenalineUser);
        await page.fill('input[type=password]', adrenalinePassword);
        await page.waitForTimeout(2000);
        await page.getByText('Login').click();
        await page.waitForTimeout(2000);
        await page.waitForSelector(`text= ${adrenalineDisplayUserName}`, { state: 'attached'});
        await page.waitForTimeout(2000);
        await page.locator('img.img-profile').click();
        await page.waitForTimeout(2000);
        (await page.waitForSelector('text=Exit application', { state: 'attached'})).click();
        await page.waitForTimeout(2000);
        await page.waitForSelector('text= Do you want to clockout ?', { state: 'attached'});
        await page.waitForTimeout(2000);
        (await page.waitForSelector('text=Yes', { state: 'attached'})).click();
        await page.waitForTimeout(2000);
        await browser.close();
        console.info('clockedOut  Success', new Date());
        sendEmail('clockOut');
    } catch (error) {
        console.error(error)
    }
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
            console.info('Email sent:', info.response);
        }
    });
}
console.info('Service Worker started', new Date());

