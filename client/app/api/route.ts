import cron from "node-cron";
import axios from "axios";
import csvtojson from "csvtojson";
import fs from "node:fs";

export const dynamic = 'force-dynamic' // defaults to auto

export async function GET() {
  cron.schedule("* * * * *", async () => {
    console.log("started");
    try {
      const res = await axios.get(
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vRheXxtxUyyhKUqnxERRT5M0VfzMkwUo5piQwZKUYYePoeGFfxZQJmKK3FG-kJ4wlnCCYNT3xKp9SbS/pub?gid=0&single=true&output=csv"
      );
      const data = await res.data;
      const jsonData = await csvtojson().fromString(data);
      console.log(jsonData);
      await fs.writeFile(
        "productData.json",
        JSON.stringify(jsonData),
        (err) => {
          if (err) {
            // console.error(err);
          }
        }
      );
    } catch (e) {
      //   console.log(e);
    }
  });

  return new Response("Hello Papa", {
    status: 200,
  });
}
