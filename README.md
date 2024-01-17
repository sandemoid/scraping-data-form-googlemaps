# Google Maps Scraper

## Prerequisites

Ensure you have the following dependencies installed before running the script:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (Node Package Manager)

## Disclaimer: Google Maps Scraper

This script is developed for legitimate and positive marketing purposes. The use of this script is expected to comply with the law and ethical standards. It is strictly prohibited to use this script for activities that violate privacy, laws, or cause harm. The script creator is not responsible for misuse or any negative consequences resulting from its use. Use of this script implies your agreement to comply with the rules and take responsibility for its use. The script does not guarantee specific results or performance. Use it wisely and in accordance with Google Maps policies and applicable regulations.

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/sandemoid/scraping-data-form-googlemaps
   cd your-repo
   ```

2. Install the required npm packages:

   ```bash
   npm install
   ```

## Usage

1. Open the `running.js` file and update the `query` variable with your desired search query:

   ```javascript
   const query = "Dealer Mobil di Palembang";
   ```

2. Run the script:

   ```bash
   node running.js
   ```

   The script will launch a headless browser, perform the Google Maps search, and scrape relevant business information.

3. The scraped data will be saved in a JSON file named `places.json` in the project directory.

## Acknowledgments

This script is based on [@adrianhorning08](https://gist.github.com/adrianhorning08/dd72c19670b488ac5b42ec292a6d158a). Special thanks for providing the initial code.
