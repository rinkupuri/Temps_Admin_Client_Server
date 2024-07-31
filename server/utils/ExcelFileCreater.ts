import ExcelJs from "exceljs";
import { product } from "../types/product";

export const ExcelExport = async ({ product }: { product: product[] }) => {
  const workbook = new ExcelJs.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");
  worksheet.columns = [
    { header: "Image", key: "col1", width: 35 },
    { header: "Model", key: "col2", width: 35 },
    { header: "MRP", key: "col3", width: 35 },
    { header: "Stock", key: "col4", width: 35 },
  ];

  const imageId = workbook.addImage({
    filename: "./download.png",
    extension: "png",
  });

  worksheet.getRows(1, product.length + 1).forEach((row, index) => {
    worksheet.addImage(imageId, {
      tl: { col: 0.5, row: index + 1.5 },
      ext: { height: 220, width: 220 },
      editAs: "oneCell",
    });
    index === 0 ? (row.height = 30) : (row.height = 225);
  });
  const name = Date.now();
  await workbook.xlsx.writeFile(`csv/${name}.xlsx`);
  return `${process.env.HOST_URL}/csv/${name}.xlsx`;
};
