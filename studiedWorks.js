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

const BACKEND_ADDRESS = "http://localhost:3000";

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

// // 3. Check if all work recordings are in studied Works

// const studiedWorks = require("./studiedWorks.json");
// const workRecordings = require("./workRecordings.json");

// // console.log(JSON.stringify(workRecordings, null, 2));

// workRecordings.forEach((recording) => {
//   if (
//     studiedWorks.findIndex((work) =>
//       work.workRecordings.baryton.some(
//         (subWork) => subWork.recordingUrl === recording
//       )
//     ) === -1 &&
//     studiedWorks.findIndex((work) =>
//       work.workRecordings.bass.some(
//         (subWork) => subWork.recordingUrl === recording
//       )
//     ) === -1 &&
//     studiedWorks.findIndex((work) =>
//       work.workRecordings.tenor1.some(
//         (subWork) => subWork.recordingUrl === recording
//       )
//     ) === -1 &&
//     studiedWorks.findIndex((work) =>
//       work.workRecordings.tenor2.some(
//         (subWork) => subWork.recordingUrl === recording
//       )
//     ) === -1 &&
//     studiedWorks.findIndex((work) =>
//       work.workRecordings.tutti.some(
//         (subWork) => subWork.recordingUrl === recording
//       )
//     ) === -1
//   ) {
//     console.log(`${recording} not found in studiedWorks.json`);
//   }

//   // console.log(`${recording} is of type ${typeof recording}`);
// });

// 4. Upload the studiedWorks collection on DB

const studiedWorks = require("./studiedWorks.json");

async function uploadStudiedWork(studiedWork) {
  // Dynamically import node-fetch
  const fetch = (await import("node-fetch")).default;

  const formData = new FormData();

  // Use path module to resolve file paths
  const partitionFilePath = path.resolve(studiedWork.partitionUrl);
  if (!fs.existsSync(partitionFilePath)) {
    console.error(`Partition file does not exist: ${partitionFilePath}`);
    return;
  }

  const barytonRecordingPaths = [];
  const barytonDescriptions = [];
  const bassRecordingPaths = [];
  const bassDescriptions = [];
  const tenor1RecordingPaths = [];
  const tenor1Descriptions = [];
  const tenor2RecordingPaths = [];
  const tenor2Descriptions = [];
  const tuttiRecordingPaths = [];
  const tuttiDescriptions = [];

  if (studiedWork.isAtWork) {
    studiedWork.workRecordings.baryton.forEach((recording) => {
      if (recording.recordingUrl && recording.recordingDescription) {
        const barytonRecordingPath = path.resolve(recording.recordingUrl);
        if (!fs.existsSync(barytonRecordingPath)) {
          console.error(
            `Baryton recording file does not exist: ${barytonRecordingPath}`
          );
          return;
        }
        barytonRecordingPaths.push(barytonRecordingPath);
        barytonDescriptions.push(recording.recordingDescription);
      } else if (
        (recording.recordingUrl && !recording.recordingDescription) ||
        (!recording.recordingUrl && recording.recordingDescription)
      ) {
        console.error(
          `Unmatched baryton recording and description for code ${code}`
        );
        return;
      }
    });

    studiedWork.workRecordings.bass.forEach((recording) => {
      if (recording.recordingUrl && recording.recordingDescription) {
        const bassRecordingPath = path.resolve(recording.recordingUrl);
        if (!fs.existsSync(bassRecordingPath)) {
          console.error(
            `Bass recording file does not exist: ${bassRecordingPath}`
          );
          return;
        }

        bassRecordingPaths.push(bassRecordingPath);
        bassDescriptions.push(recording.recordingDescription);
      } else if (
        (recording.recordingUrl && !recording.recordingDescription) ||
        (!recording.recordingUrl && recording.recordingDescription)
      ) {
        console.error(
          `Unmatched bass recording and description for code ${code}`
        );
        return;
      }
    });

    studiedWork.workRecordings.tenor1.forEach((recording) => {
      if (recording.recordingUrl && recording.recordingDescription) {
        const tenor1RecordingPath = path.resolve(recording.recordingUrl);
        if (!fs.existsSync(tenor1RecordingPath)) {
          console.error(
            `Tenor1 recording file does not exist: ${tenor1RecordingPath}`
          );
          return;
        }

        tenor1RecordingPaths.push(tenor1RecordingPath);
        tenor1Descriptions.push(recording.recordingDescription);
      } else if (
        (recording.recordingUrl && !recording.recordingDescription) ||
        (!recording.recordingUrl && recording.recordingDescription)
      ) {
        console.error(
          `Unmatched tenor1 recording and description for code ${code}`
        );
        return;
      }
    });

    studiedWork.workRecordings.tenor2.forEach((recording) => {
      if (recording.recordingUrl && recording.recordingDescription) {
        const tenor2RecordingPath = path.resolve(recording.recordingUrl);
        if (!fs.existsSync(tenor2RecordingPath)) {
          console.error(
            `Tenor2 recording file does not exist: ${tenor2RecordingPath}`
          );
          return;
        }

        tenor2RecordingPaths.push(path.resolve(recording.recordingUrl));
        tenor2Descriptions.push(recording.recordingDescription);
      } else if (
        (recording.recordingUrl && !recording.recordingDescription) ||
        (!recording.recordingUrl && recording.recordingDescription)
      ) {
        console.error(
          `Unmatched tenor2 recording and description for code ${code}`
        );
        return;
      }
    });

    studiedWork.workRecordings.tutti.forEach((recording) => {
      if (recording.recordingUrl && recording.recordingDescription) {
        const tuttiRecordingPath = path.resolve(recording.recordingUrl);
        if (!fs.existsSync(tuttiRecordingPath)) {
          console.error(
            `Tutti recording file does not exist: ${tuttiRecordingPath}`
          );
          return;
        }

        tuttiRecordingPaths.push(path.resolve(recording.recordingUrl));
        tuttiDescriptions.push(recording.recordingDescription);
      } else if (
        (recording.recordingUrl && !recording.recordingDescription) ||
        (!recording.recordingUrl && recording.recordingDescription)
      ) {
        console.error(
          `Unmatched tutti recording and description for code ${code}`
        );
        return;
      }
    });
  }

  formData.append("token", "iG3PywQUOeAX-fslH9LqhZwg83No3yl_");
  formData.append("title", studiedWork.title);
  formData.append("code", studiedWork.code);
  formData.append("partitionFromFront", fs.createReadStream(partitionFilePath));
  formData.append("isAtWork", studiedWork.isAtWork);

  if (studiedWork.isAtWork) {
    barytonDescriptions.forEach((description) => {
      formData.append("barytonRecordingDescriptions", description);
    });
    barytonRecordingPaths.forEach((path) => {
      formData.append("barytonRecordingsFromFront", fs.createReadStream(path));
    });

    bassDescriptions.forEach((description) => {
      formData.append("bassRecordingDescriptions", description);
    });
    bassRecordingPaths.forEach((path) => {
      formData.append("bassRecordingsFromFront", fs.createReadStream(path));
    });

    tenor1Descriptions.forEach((description) => {
      formData.append("tenor1RecordingDescriptions", description);
    });
    tenor1RecordingPaths.forEach((path) => {
      formData.append("tenor1RecordingsFromFront", fs.createReadStream(path));
    });

    tenor2Descriptions.forEach((description) => {
      formData.append("tenor2RecordingDescriptions", description);
    });
    tenor2RecordingPaths.forEach((path) => {
      formData.append("tenor2RecordingsFromFront", fs.createReadStream(path));
    });

    tuttiDescriptions.forEach((description) => {
      formData.append("tuttiRecordingDescriptions", description);
    });
    tuttiRecordingPaths.forEach((path) => {
      formData.append("tuttiRecordingsFromFront", fs.createReadStream(path));
    });
  }

  if (studiedWork.artwork) {
    formData.append("artwork", studiedWork.artwork);
  }

  if (studiedWork.authorMusic) {
    formData.append("authorMusic", studiedWork.authorMusic);
  }

  try {
    const response = await fetch(`${BACKEND_ADDRESS}/studiedWorks/upload`, {
      method: "POST",
      body: formData,
      headers: formData.getHeaders(), // necessary to set the correct headers
      timeout: 0, // Disable timeout for debugging
    });

    const text = await response.text(); // Get the response as text first
    console.log("Response Text:", text);

    let data;
    try {
      data = JSON.parse(text); // Try to parse the response as JSON
    } catch (error) {
      console.error("Failed to parse JSON response:", error);
      return;
    }

    if (!data.result) {
      console.error("Error from server:", data.error);
    } else {
      console.log("Success:", data);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

async function uploadAllStudiedWorks() {
  for (const studiedWork of studiedWorks) {
    await uploadStudiedWork(studiedWork);
  }
}

uploadAllStudiedWorks();
