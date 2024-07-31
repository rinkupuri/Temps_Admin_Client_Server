import ExcelJs from "exceljs";
export const exportExcelSheet = async () => {
  const workbook = new ExcelJs.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");
  worksheet.columns = [
    { header: "Id", key: "id", width: 10 },
    { header: "Name", key: "name", width: 20 },
    { header: "Email", key: "email", width: 30 },
  ];

  const imageId = workbook.addImage({
    filename: "path/to/your/image.png",
    extension: "png",
  });

  worksheet.addImage(imageId, {
    // @ts-ignore
    tl: { col: 1.5, row: 1.5 },
    // @ts-ignore
    ext: { height: 220, width: 220 },
  });
  await workbook.xlsx.writeFile("lockedImageWorkbook.xlsx");
};
