const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

function listFiles(dir) {
  let results = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });

  files.forEach((file) => {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      results = results.concat(listFiles(filePath));
    } else {
      results.push(filePath);
    }
  });

  return results;
}

function capitalizeWords(str) {
  return str
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

// // 1. List all partitions files and prepare studiedWorks array

// const partitions = listFiles("/Users/matthieu/Code/Web/siteChorale/Partitions");

// const partitionsFiltered = partitions.filter((file) => {
//   return path.extname(file) === ".pdf";
// });

// const studiedWorks = partitionsFiltered.map((file) => {
//   // Ensure files exist before creating read streams
//   if (!fs.existsSync(file)) {
//     console.error(`Thumbnail file does not exist: ${file}`);
//     return;
//   }

//   const parsedFile = path.parse(file);
//   const splitNames = parsedFile.name.split("-");

//   return {
//     title: capitalizeWords(splitNames[1].trim()),
//     code: splitNames[0].trim(),
//     artwork: "",
//     partitionUrl: file,
//     authorMusic: "",
//     isAtWork: false,
//     workRecordings: {
//       baryton: [{ recordingUrl: "", recordingDescription: "" }],
//       bass: [{ recordingUrl: "", recordingDescription: "" }],
//       tenor1: [{ recordingUrl: "", recordingDescription: "" }],
//       tenor2: [{ recordingUrl: "", recordingDescription: "" }],
//       tutti: [{ recordingUrl: "", recordingDescription: "" }],
//     },
//   };
// });

// // console.log(JSON.stringify(studiedWorks, null, 2));

// // // Convert the object to a JSON string
// // const jsonData = JSON.stringify(studiedWorks, null, 2); // The 'null, 2' adds indentation for readability

// // // Write the JSON string to a file
// // fs.writeFile("studiedWorks.json", jsonData, (err) => {
// //   if (err) {
// //     console.error("Error writing to file", err);
// //   } else {
// //     console.log("File has been written");
// //   }
// // });

// // 2. List all work recordings files

// const workRecodings = listFiles(
//   "/Users/matthieu/Code/Web/siteChorale/EnregistrementsTravail"
// );

// const workRecodingsFiltered = workRecodings.filter((file) => {
//   return path.extname(file) === ".mp3";
// });

// workRecodingsFiltered.forEach((file) => {
//   // Ensure files exist before creating read streams
//   if (!fs.existsSync(file)) {
//     console.error(`Thumbnail file does not exist: ${file}`);
//     return;
//   }
// });

// // console.log(JSON.stringify(workRecodingsFiltered, null, 2));

// // // Convert the object to a JSON string
// // const jsonData = JSON.stringify(workRecodingsFiltered, null, 2); // The 'null, 2' adds indentation for readability

// // // Write the JSON string to a file
// // fs.writeFile("workRecordings.json", jsonData, (err) => {
// //   if (err) {
// //     console.error("Error writing to file", err);
// //   } else {
// //     console.log("File has been written");
// //   }
// // });

// 3. Check if all work recordings are in studied Works

const studiedWorks = require("./studiedWorks.json");
const workRecordings = require("./workRecordings.json");

// console.log(JSON.stringify(workRecordings, null, 2));

workRecordings.forEach((recording) => {
  if (
    studiedWorks.findIndex((work) =>
      work.workRecordings.baryton.some(
        (subWork) => subWork.recordingUrl === recording
      )
    ) === -1 &&
    studiedWorks.findIndex((work) =>
      work.workRecordings.bass.some(
        (subWork) => subWork.recordingUrl === recording
      )
    ) === -1 &&
    studiedWorks.findIndex((work) =>
      work.workRecordings.tenor1.some(
        (subWork) => subWork.recordingUrl === recording
      )
    ) === -1 &&
    studiedWorks.findIndex((work) =>
      work.workRecordings.tenor2.some(
        (subWork) => subWork.recordingUrl === recording
      )
    ) === -1 &&
    studiedWorks.findIndex((work) =>
      work.workRecordings.tutti.some(
        (subWork) => subWork.recordingUrl === recording
      )
    ) === -1
  ) {
    console.log(`${recording} not found in studiedWorks.json`);
  }

  // console.log(`${recording} is of type ${typeof recording}`);
});
