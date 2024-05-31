const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
// const fetch = require("node-fetch");

const BACKEND_ADDRESS = "http://localhost:3000";

const listenings = [
  {
    title: "O Cher Jura",
    artwork: "",
    audioFile:
      "/Users/matthieu/Code/Web/siteChorale/Enregistrements/O_cher_Jura_(extrait).mp3",
    authorText: "Henri Cordier",
    authorMusic: "Henri Cordier",
    arrangement: "Jean Sarrazin",
    harmonization: "",
    thumbnail: "/Users/matthieu/Code/Web/siteChorale/Enregistrements/Jura.jpg",
    thumbnailDescription: "Photo du Jura",
    recordingDate: new Date("2020-6-1"),
    lastListening: false,
  },
  {
    title: "Still Ruht Der See",
    artwork: "",
    audioFile:
      "/Users/matthieu/Code/Web/siteChorale/Enregistrements/Still_ruht_der_See_(extrait).mp3",
    authorText: "Heinrich Pfeil",
    authorMusic: "Heinrich Pfeil",
    arrangement: "",
    harmonization: "",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Enregistrements/Heinrich_Pfeil.jpg",
    thumbnailDescription: "Heinrich Pfeil",
    recordingDate: new Date("2020-6-1"),
    lastListening: false,
  },
  {
    title: "Tête En l'Air",
    artwork: "",
    audioFile:
      "/Users/matthieu/Code/Web/siteChorale/Enregistrements/Tete_en_l'air_(extrait).mp3",
    authorText: "Jacques Higelin",
    authorMusic: "Jacques Higelin",
    arrangement: "Roland Ménéguz",
    harmonization: "",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Enregistrements/JacquesHigelin.jpeg",
    thumbnailDescription: "Jacques Higelin",
    recordingDate: new Date("2020-6-1"),
    lastListening: false,
  },
  {
    title: "Le Chœur des Esclaves",
    artwork: "Nabucco",
    audioFile:
      "/Users/matthieu/Code/Web/siteChorale/Enregistrements/20240324_Le_choeur_des_esclaves_Vincelles.mp3",
    authorText: "",
    authorMusic: "Guiseppe Verdi",
    arrangement: "",
    harmonization: "",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Enregistrements/GuiseppeVerdi.jpg",
    thumbnailDescription: "Guiseppe Verdi",
    recordingDate: new Date("2024-3-24"),
    lastListening: true,
  },
  {
    title: "Tebe Poem",
    artwork: "",
    audioFile:
      "/Users/matthieu/Code/Web/siteChorale/Enregistrements/20240324_Tebe_poem_Vincelles.mp3",
    authorText: "Dimitri Bortnianski",
    authorMusic: "Dimitri Bortnianski",
    arrangement: "",
    harmonization: "",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Enregistrements/Dimitri_Bortnianski.jpg",
    thumbnailDescription: "Dimitri Bortnianski",
    recordingDate: new Date("2024-3-24"),
    lastListening: true,
  },
  {
    title: "Maria Iassù",
    artwork: "",
    audioFile:
      "/Users/matthieu/Code/Web/siteChorale/Enregistrements/20240324_Maria_lassù_Vincelles.mp3",
    authorText: "Bepi de Marzi",
    authorMusic: "Bepi de Marzi",
    arrangement: "",
    harmonization: "",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Enregistrements/Bepi_De_Marzi.jpg",
    thumbnailDescription: "Bepi de Marzi",
    recordingDate: new Date("2024-3-24"),
    lastListening: false,
  },
  {
    title: "La Conquête Du Bon Pays",
    artwork: "",
    audioFile:
      "/Users/matthieu/Code/Web/siteChorale/Enregistrements/20240324_La_conquête_du_bon_pays_Vincelles.mp3",
    authorText: "Christian Debourg",
    authorMusic: "Vangelis",
    arrangement: "",
    harmonization: "",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Enregistrements/Vangelis,_26_July_2012.jpg",
    thumbnailDescription: "Vangelis",
    recordingDate: new Date("2024-3-24"),
    lastListening: true,
  },
  {
    title: "Beau Jura",
    artwork: "",
    audioFile:
      "/Users/matthieu/Code/Web/siteChorale/Enregistrements/20240324_Beau_Jura_Vincelles.mp3",
    authorText: "Maurice Perrenoud",
    authorMusic: "Maurice Perrenoud",
    arrangement: "",
    harmonization: "",
    thumbnail: "/Users/matthieu/Code/Web/siteChorale/Enregistrements/Jura.jpg",
    thumbnailDescription: "Photo de la forêt Jurassienne",
    recordingDate: new Date("2024-3-24"),
    lastListening: false,
  },
  {
    title: "La Chanson Du Fromager",
    artwork: "",
    audioFile:
      "/Users/matthieu/Code/Web/siteChorale/Enregistrements/20240324_La_chanson_du_fromager.mp3",
    authorText: "Albert Schmidt",
    authorMusic: "Jean Daetwyler",
    arrangement: "",
    harmonization: "",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Enregistrements/Jean-Daetwyler-au-cafe-cabec45f.jpeg",
    thumbnailDescription: "Jean Daetwyler",
    recordingDate: new Date("2024-3-24"),
    lastListening: true,
  },
  {
    title: "Bella Ciao",
    artwork: "",
    audioFile:
      "/Users/matthieu/Code/Web/siteChorale/Enregistrements/20240324_Bella_ciao_Vincelles.mp3",
    authorText: "",
    authorMusic: "Anonyme du XXème siècle",
    arrangement: "",
    harmonization: "",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Enregistrements/Bella_ciao.jpg",
    thumbnailDescription: "Chant partisan italien",
    recordingDate: new Date("2024-3-24"),
    lastListening: false,
  },
  {
    title: "Les Corons",
    artwork: "",
    audioFile:
      "/Users/matthieu/Code/Web/siteChorale/Enregistrements/20240324_Les_Corons_Vincelles.mp3",
    authorText: "Jean-Pierre Lang",
    authorMusic: "Pierre Bachelet",
    arrangement: "",
    harmonization: "",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Enregistrements/pierre-bachelet.jpeg",
    thumbnailDescription: "Pierre Bachelet",
    recordingDate: new Date("2024-3-24"),
    lastListening: true,
  },
];

async function uploadListening(listening) {
  // Dynamically import node-fetch
  const fetch = (await import("node-fetch")).default;

  const formData = new FormData();

  // Use path module to resolve file paths
  const audioFilePath = path.resolve(listening.audioFile);
  const thumbnailFilePath = path.resolve(listening.thumbnail);

  // Ensure files exist before creating read streams
  if (!fs.existsSync(audioFilePath)) {
    console.error(`Audio file does not exist: ${audioFilePath}`);
    return;
  }

  if (!fs.existsSync(thumbnailFilePath)) {
    console.error(`Thumbnail file does not exist: ${thumbnailFilePath}`);
    return;
  }

  formData.append("listeningFromFront", fs.createReadStream(audioFilePath));
  formData.append("thumbnailFromFront", fs.createReadStream(thumbnailFilePath));
  formData.append("title", listening.title);
  formData.append("authorMusic", listening.authorMusic);
  formData.append("thumbnailDescription", listening.thumbnailDescription);
  formData.append("recordingDate", listening.recordingDate.toISOString());
  formData.append("token", "iG3PywQUOeAX-fslH9LqhZwg83No3yl_");
  formData.append("lastListening", listening.lastListening.toString());

  if (listening.artwork) {
    formData.append("artwork", listening.artwork);
  }

  if (listening.authorText) {
    formData.append("authorText", listening.authorText);
  }

  if (listening.arrangement) {
    formData.append("arrangement", listening.arrangement);
  }

  if (listening.harmonization) {
    formData.append("harmonization", listening.harmonization);
  }

  // console.log("formData: ", formData);

  try {
    const response = await fetch(`${BACKEND_ADDRESS}/listenings/upload`, {
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

async function uploadAllListenings() {
  for (const listening of listenings) {
    await uploadListening(listening);
  }
}

uploadAllListenings();
