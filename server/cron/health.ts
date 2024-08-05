import axios from "axios";
import cron from "node-cron";

export const serverAliveCron = () => {
  cron.schedule("* * * * *", () => {
    axios.get("https://temps-admin-client-server.onrender.com").then((res) => {
      console.log(res.data);
    });
  });
};
