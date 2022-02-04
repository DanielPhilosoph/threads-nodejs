const puppeteer = require("puppeteer");
const whatsAppClient = require("@green-api/whatsapp-api-client");

//? Whatsapp Keys - DONT SHARE
const restAPI = whatsAppClient.restAPI({
  idInstance: "28189",
  apiTokenInstance: "021dbbf122b63271d02f3baabf0745f41c3361cf45dec93054",
});

function script() {
  //! ------------ CONFIG - change only here --------------

  //* URL of the page
  const URL = "https://mintalytics.com/collection/supernormalbyzipcy/";
  const NFT_NAME = "Super Normal"; //? Will be represented in the message

  //? SMS info
  const SEND_TO = 972526578802;
  let message_text = ""; // Default value - will change anyways

  //* - HIGHER_THEN - check if higher then this value. NOTE - If you dont want max value, put high number
  //! dynamic
  let HIGHER_THEN = 10000;
  //* - LOWER_THEN - check if lower then this value. NOTE - If you dont want min value, put -1
  //! dynamic
  let LOWER_THEN = 4.2;
  //* How much time to wait between every loop - Default 1000 (1 sec)
  const TIME_TO_WAIT = 1000;
  //* How many rounds of checking before reload page - Default 30 (30 rounds)
  const ROUNDS_TILL_RELOAD = 30;
  //* How many hits (messages sent) till the program will stop? - Default 5
  const NUMBER_OF_HITS = 5;
  //* After a hit, increase or decrease the value by how many percents? - Default 25%
  const PERCENT_JUMPS = 25; //? 0-100

  //! --------------------------------------------------------

  async function x() {
    //* Open browser for watching
    //TODO If you wish to not see the page - do { headless: true } - (run in background)
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(URL);

    let valueToCheck;
    let flag = true;
    let counter = 0;
    let hit = ""; //? HIGHER or LOWER
    let hitCount = 0;

    while (flag) {
      //* Wait the time to wait
      await page.waitForTimeout(TIME_TO_WAIT);

      //* Counting
      counter++;

      //* If true - should reload
      if (counter === ROUNDS_TILL_RELOAD) {
        counter = 0;
        await page.reload(URL);
      }

      //* Get the element text context
      valueToCheck = await page.$eval(
        "body > div.container-fluid.content > div > div.col-md-12.mb-3 > div > div:nth-child(1) > div > span",
        (el) => el.textContent
      );

      //* substring irrelevant chars
      valueToCheck = parseFloat(valueToCheck.substring(2));

      //? Console log for debug
      console.log("valueToCheck " + valueToCheck + " counter " + counter);

      //* Validation
      if (valueToCheck > HIGHER_THEN) {
        //? - Set text to send
        message_text = `Go check ${NFT_NAME}!\nThe value has gone above the high limit ${HIGHER_THEN}. Current value ${valueToCheck}.\nWebsite: ${URL}`;

        //? SEND MESSAGE
        await restAPI.message.sendMessage(null, SEND_TO, message_text);
        console.log("message sent");

        //? Update the hit
        hit = "HIGHER";
      } else if (valueToCheck < LOWER_THEN) {
        //? - Set text to send
        message_text = `Go check ${NFT_NAME}!\nThe value has gone lower then the low limit ${LOWER_THEN}. Current value ${valueToCheck}.\nWebsite: ${URL}`;

        //? SEND MESSAGE
        await restAPI.message.sendMessage(null, SEND_TO, message_text);
        console.log("message sent");

        //? Update the hit
        hit = "LOWER";
      }

      //* Check if the value has gone lower or higher and update accordingly
      if (hit === "LOWER") {
        //* Goes UP by 25%
        LOWER_THEN = LOWER_THEN * (1 - PERCENT_JUMPS / 100);

        //* increase hit count by 1
        hitCount++;
      } else if (hit === "HIGHER") {
        //* Goes DOWN by 25%
        HIGHER_THEN = HIGHER_THEN * (1 + PERCENT_JUMPS / 100);

        //* increase hit count by 1
        hitCount++;
      }

      //* Set hit back to default
      hit = "";

      //? If got to number of hits
      if (NUMBER_OF_HITS === hitCount) {
        //* When done close browser
        await browser.close();

        //* Exit loop
        flag = false;
      }
    }
  }
  x();
}

module.export = { script };
