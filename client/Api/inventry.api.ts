import axios from "axios";

export const bulkModelWiseInventry = async (modelString: string) => {
  await axios
    .post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/inventry/exportmodelwise`,
      {
        modelString,
      },
      {
        withCredentials: true,
      }
    )
    .then((res) => {
      const link = res.data.link;
      if (link) {
        const a = document.createElement("a");
        a.href = res.data.link;
        a.click();
        a.remove();
      } else {
        alert("Something Went Wrong Please Try Again");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
