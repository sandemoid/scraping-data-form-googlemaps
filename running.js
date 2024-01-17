import * as cheerio from "cheerio";
import puppeteerExtra from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import fs from 'fs';

init();

async function searchGoogleMaps() {
  try {
    const start = Date.now();

    puppeteerExtra.use(stealthPlugin());

    const browser = await puppeteerExtra.launch({
      headless: false,
      executablePath: "", // your path here
    });

    const page = await browser.newPage();

    const query = "Dealer Mobil di Palembang";

    try {
      await page.goto(
        `https://www.google.com/maps/search/${query.split(" ").join("+")}`
      );
    } catch (error) {
      console.log("error going to page");
    }

    async function autoScroll(page) {
      await page.evaluate(async () => {
        const wrapper = document.querySelector('div[role="feed"]');

        await new Promise((resolve, reject) => {
          var totalHeight = 0;
          var distance = 1000;
          var scrollDelay = 3000;

          var timer = setInterval(async () => {
            var scrollHeightBefore = wrapper.scrollHeight;
            wrapper.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeightBefore) {
              totalHeight = 0;
              await new Promise((resolve) => setTimeout(resolve, scrollDelay));

              var scrollHeightAfter = wrapper.scrollHeight;

              if (scrollHeightAfter > scrollHeightBefore) {
                return;
              } else {
                clearInterval(timer);
                resolve();
              }
            }
          }, 700);
        });
      });
    }

    await autoScroll(page);

    const html = await page.content();
    const pages = await browser.pages();
    await Promise.all(pages.map((page) => page.close()));

    await browser.close();
    console.log("browser closed");

    const $ = cheerio.load(html);
    const aTags = $("a");
    const parents = [];
    aTags.each((i, el) => {
      const href = $(el).attr("href");
      if (!href) {
        return;
      }
      if (href.includes("/maps/place/")) {
        parents.push($(el).parent());
      }
    });

    console.log("parents", parents.length);

    const businesses = [];
    let index = 0;

    parents.forEach((parent) => {
      const url = parent.find("a").attr("href");
      const website = parent.find('a[data-value="Website"]').attr("href");
      const storeName = parent.find("div.fontHeadlineSmall").text();
      const ratingText = parent
        .find("span.fontBodyMedium > span")
        .attr("aria-label");

      const bodyDiv = parent.find("div.fontBodyMedium").first();
      const children = bodyDiv.children();
      const lastChild = children.last();
      const firstOfLast = lastChild.children().first();
      const lastOfLast = lastChild.children().last();
      index = index + 1;

      businesses.push({
        index,
        storeName,
        placeId: `ChI${url?.split("?")?.[0]?.split("ChI")?.[1]}`,
        address: firstOfLast?.text()?.split("·")?.[1]?.trim(),
        category: firstOfLast?.text()?.split("·")?.[0]?.trim(),
        phone: lastOfLast?.text()?.split("·")?.[1]?.trim(),
        googleUrl: url,
        bizWebsite: website,
        ratingText,
        stars: ratingText?.split("Bintang")?.[0]?.trim()
          ? Number(ratingText?.split("Bintang")?.[0]?.trim())
          : null,
        numberOfReviews: ratingText
          ?.split("Bintang")?.[1]
          ?.replace("Ulasan", "")
          ?.trim()
          ? Number(
              ratingText?.split("Bintang")?.[1]?.replace("Ulasan", "")?.trim()
            )
          : null,
      });
    });
    const end = Date.now();

    console.log(`time in seconds ${Math.floor((end - start) / 1000)}`);

    return businesses;
  } catch (error) {
    console.log("error at googleMaps", error.message);
  }
}

async function init() {
  try {
    const businesses = await searchGoogleMaps();

    // Convert businesses array to JSON string
    const jsonData = JSON.stringify(businesses, null, 2);

    // Write the JSON data to a file
    fs.writeFileSync('places.json', jsonData, 'utf-8');

    console.log('JSON file created successfully.');
  } catch (error) {
    console.log('Error in init:', error.message);
  }
}
