const fs = require("fs");
const exifParser = require("exif-parser");

async function getCaptureTime(filePath) {
  // Try with exif-parser
  try {
    const buffer = fs.readFileSync(filePath);
    const parser = exifParser.create(buffer);
    const result = parser.parse();

    const possibleDates = [
      result.tags.DateTimeOriginal,
      result.tags.CreateDate,
      result.tags.ModifyDate,
      result.tags.DateTime,
    ];

    // console.log("Possible dates found with exif-parser:", possibleDates);

    // Filter out undefined values and convert timestamps to dates
    const validDates = possibleDates
      .filter((timestamp) => timestamp !== undefined)
      .map((timestamp) => new Date(timestamp * 1000));

    // Return the earliest date if any valid dates exist
    if (validDates.length > 0) {
      return new Date(Math.min(...validDates.map((d) => d.getTime())));
    }
  } catch (exifError) {
    console.error("Exif-parser extraction failed:", exifError.message);
  }

  // Fallback to file stats if no EXIF data found
  try {
    const stats = fs.statSync(filePath);
    const dates = [
      stats.birthtime, // Creation time (not available on all systems)
      stats.mtime, // Modification time
      stats.ctime, // Change time
    ];

    // console.log("Possible dates found with file stats:", dates);

    // Return the earliest available date
    const validDates = dates.filter((date) => date instanceof Date);
    if (validDates.length > 0) {
      return new Date(Math.min(...validDates.map((d) => d.getTime())));
    }
  } catch (statsError) {
    console.error("File stats extraction failed:", statsError.message);
  }

  return null;
}

// Since the function is now async, we need to use await
// async function test() {
//   const date = await getCaptureTime(
//     // "/Users/matthieu/Code/Web/siteChorale/Photos/CONCERTS/2019-06-22 Concert Salavre/PICT0136.JPG"
//     // "/Users/matthieu/Code/Web/siteChorale/Photos/CONCERTS/2011-06-03 Concert Gizia/2011-06-03 Gizia 3.JPG"
//     "/Users/matthieu/Code/Web/siteChorale/Photos/MOMENTS DE DETENTE/22-03-12 Détente en journée de travail/20220312_130640.jpg"
//   );
//   console.log("Capture date:", date);
// }

// test();

module.exports = { getCaptureTime };
