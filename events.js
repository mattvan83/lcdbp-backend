const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
// const fetch = require("node-fetch");

const BACKEND_ADDRESS = "http://localhost:3000";

const events = [
  {
    title:
      "Concert en hommage à Jean-François Boisson et au profit de l'ONG 'Apprentis-Orphelins d'Afrique'",
    date: new Date("2024-09-29T16:00:00"),
    city: "Château-Chalon",
    place: "Eglise Saint-Pierre",
    chore:
      "Les Chœurs des Trois Pays : Les Mouraches, La Perrina et le Chœur du Bon Pays",
    price: "Entrée libre",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2024-09-29_Concert_Château-Chalon-min.jpg",
    thumbnailDescription:
      "Concert du 29 Septembre 2024 : Concert en hommage à Jean-François Boisson et au profit de l'ONG 'Apprentis-Orphelins d'Afrique'",
  },
  {
    title:
      "Concert pour fêter la restauration de deux tableaux du XIIIème siècle et les découvrir ou redécouvrir",
    date: new Date("2024-03-24T16:00:00"),
    city: "Val-Sonnette",
    place: "Eglise de Vincelles",
    chore: "Le Chœur du Bon Pays",
    price: "Entrée libre",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2024-03-24_Concert_Vincelles-min.png",
    thumbnailDescription:
      "Concert du 24 Mars 2024 : Concert pour fêter la restauration de deux tableaux du XIIIème siècle et les découvrir ou redécouvrir",
  },
  {
    title: "Concert de Noël proposé par le Comité des fêtes de Beaufort",
    date: new Date("2023-12-10T16:00:00"),
    city: "Beaufort",
    place: "Eglise",
    chore:
      "La Chorale Résila dirigée par Bénédicte Cortot et le Chœur du Bon Pays de Cousance",
    price: "Entrée au chapeau",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2023-12-10_Concert_Beaufort-min.jpg",
    thumbnailDescription:
      "Concert du 12 Décembre 2023 : Concert de Noël proposé par le Comité des fêtes de Beaufort",
  },
  {
    title: "Chœur d'hommes : Le Chœur du Bon Pays chante",
    date: new Date("2023-10-07T20:30:00"),
    city: "Digna",
    place: "Eglise",
    chore: "Le Chœur du Bon Pays",
    price: "10€ / Gratuit - 12 ans",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2023-10-07_Concert_Digna-min.jpg",
    thumbnailDescription:
      "Concert du 7 Octobre 2023 : Chœur d'hommes : Le Chœur du Bon Pays chante",
  },
  {
    title:
      "Soirée organisée par le Comité de Fleurissement avec le concours du Chœur du Bon Pays",
    date: new Date("2023-04-15T20:30:00"),
    city: "Saint-Etienne-du-Bois",
    place: "Salle des Fêtes",
    chore: "Le Chœur du Bon Pays",
    price: "10€ / Gratuit - 12 ans",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2023-04-15_Concert_Saint-Etienne-du-Bois-min.jpg",
    thumbnailDescription:
      "Concert du 15 Avril 2023 : Soirée organisée par le Comité de Fleurissement avec le concours du Chœur du Bon Pays",
  },
  {
    title:
      "La Chorale La Perrina et le Chœur du Bon Pays, dans le cadre de ses 10 ans, chantent au profit des réfugiés d'Ukraine et d'ailleurs sous l'égide de l'AJIR",
    date: new Date("2022-06-11T20:30:00"),
    city: "Perrigny",
    place: "Eglise Saint Jean-Baptiste",
    chore: "La Chorale La Perrina et le Chœur du Bon Pays",
    price: "Entrée libre",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2022-06-11_Concert_Perrigny-min.jpg",
    thumbnailDescription:
      "Concert du 11 Juin 2022 : La Chorale La Perrina et le Chœur du Bon Pays, dans le cadre de ses 10 ans, chantent au profit des réfugiés d'Ukraine et d'ailleurs sous l'égide de l'AJIR",
  },
  {
    title: "L'ADMR présente le concert du Chœur du Bon Pays",
    date: new Date("2022-06-04T20:00:00"),
    city: "Dommartin Les Cuiseaux",
    place: "Eglise",
    chore: "Le Chœur du Bon Pays",
    price: "10€",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2022-06-04_Concert_Dommartin_les_Cuiseaux-min.jpg",
    thumbnailDescription:
      "Concert du 4 Juin 2022 : L'ADMR présente le concert du Chœur du Bon Pays",
  },
  {
    title:
      "Le Chœur du Bon Pays chante ses 10 ans et invite la Source d'Adonaï",
    date: new Date("2022-05-15T17:00:00"),
    city: "Cousance",
    place: "Eglise",
    chore: "Le Chœur du Bon Pays",
    price: "10€ / Gratuit - 16 ans",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2022-05-15_Concert_Cousance-min.jpg",
    thumbnailDescription:
      "Concert du 15 Mai 2022 : Le Chœur du Bon Pays chante ses 10 ans et invite la Source d'Adonaï",
  },
  {
    title:
      "Le Chœur du Bon Pays chante ses 10 ans et invite le chœur féminin 'A corps et à cris'",
    date: new Date("2022-04-09T20:30:00"),
    city: "Saint-Amour",
    place: "Salle de la Chevalerie",
    chore: "Le Chœur du Bon Pays et le Chœur féminin 'A corps et à cris'",
    price: "10€ / Gratuit - 16 ans",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2022-04-09_Concert_St_Amour-min.jpg",
    thumbnailDescription:
      "Concert du 9 Avril 2022 : Le Chœur du Bon Pays chante ses 10 ans et invite le chœur féminin 'A corps et à cris'",
  },
  {
    title:
      "Concert en hommage à Jean-François Boisson et au profit de l'ONG 'Apprentis-Orphelins d'Afrique'",
    date: new Date("2019-10-13T16:00:00"),
    city: "Château-Chalon",
    place: "Eglise Saint-Pierre",
    chore:
      "Les Chœurs des Trois Pays : Les Mouraches, La Perrina et le Chœur du Bon Pays",
    price: "Entrée libre",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2019-10-13_Concert_Château-Chalon-min.jpg",
    thumbnailDescription:
      "Concert du 13 Octobre 2019 : Concert en hommage à Jean-François Boisson et au profit de l'ONG 'Apprentis-Orphelins d'Afrique'",
  },
  {
    title: "Au profit de la restauration de l'église",
    date: new Date("2019-05-11T20:30:00"),
    city: "Saint-Laurent-la-Roche",
    place: "Eglise",
    chore: "Le Chœur du Bon Pays",
    price: "10€ / Gratuit - 18 ans",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2019-05-11_Siant-Laurent-la-Roche-min.png",
    thumbnailDescription:
      "Concert du 11 Mai 2019 : Au profit de la restauration de l'église",
  },
  {
    title: "Concert du Chœur du Bon Pays et la Guillerette",
    date: new Date("2019-03-16T20:00:00"),
    city: "Cousance",
    place: "Eglise",
    chore: "Le Chœur du Bon Pays et la Guillerette",
    price: "Participation libre",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2019-03-16_Concert_Cousance-min.PNG",
    thumbnailDescription:
      "Concert du 16 Mars 2019 : Concert du Chœur du Bon Pays et la Guillerette",
  },
  {
    title: "Concert du Chœur d'hommes Cousance Jura",
    date: new Date("2018-10-13T20:30:00"),
    city: "Saillenard",
    place: "Eglise",
    chore: "Le Chœur du Bon Pays",
    price: "6€ / Gratuit pour les scolaires",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2018-10-13_Concert_Saillenard-min.JPG",
    thumbnailDescription:
      "Concert du 13 Octobre 2018 : Concert du Chœur d'hommes Cousance Jura",
  },
  {
    title: "Concert vocal dans le cadre de ma 4ème Biennale des arts",
    date: new Date("2018-09-15T20:30:00"),
    city: "Champagnat",
    place: "Eglise",
    chore: "Le Chœur du Bon Pays et la Chorale La Guillerette",
    price: "Entrée libre",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2018-09-15_Concert_Champagnat-min.JPG",
    thumbnailDescription:
      "Concert du 15 Septembre 2018 : Concert vocal dans le cadre de ma 4ème Biennale des arts",
  },
  {
    title: "Concert du Chœur du Bon Pays et des Chanteurs du Val de Mâtre",
    date: new Date("2018-05-12T20:30:00"),
    city: "Digna",
    place: "Eglise",
    chore: "Le Chœur du Bon Pays et les Chanteurs du Val de Mâtre",
    price: "Participation libre",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2018-05-12_Concert_Digna-min.jpg",
    thumbnailDescription:
      "Concert du 12 Mai 2018 : Concert du Chœur du Bon Pays et des Chanteurs du Val de Mâtre",
  },
  {
    title: "Concert du Chœur du Bon Pays",
    date: new Date("2018-04-22T16:00:00"),
    city: "Allinges",
    place: "Eglise",
    chore: "Le Chœur du Bon Pays",
    price: "Participation libre",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2018-04-22_Concert_Allinges-min.jpg",
    thumbnailDescription:
      "Concert du 22 Avril 2018 : Concert du Chœur du Bon Pays",
  },
  {
    title: "Concert au profit de la restauration de l'église de Châtel",
    date: new Date("2018-03-18T16:00:00"),
    city: "Beaufort",
    place: "Eglise",
    chore: "Le Chœur du Bon Pays et la Suranelle",
    price: "10€ / Demi tarif 12-16 ans / Gratuit pour - 12 ans",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2018-03-16_Concert_Beaufort-min.jpg",
    thumbnailDescription:
      "Concert du 18 Mars 2018 : Concert au profit de la restauration de l'église de Châtel",
  },
  {
    title:
      "Concert des Cigales de Romenay et du Chœur d'hommes du Bon Pays de Cousance",
    date: new Date("2018-02-04T15:00:00"),
    city: "Chapelle-thècle",
    place: "Eglise",
    chore: "Le Chœur du Bon Pays et les Cigales de Romenay",
    price: "Entrée libre",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2018-02-04_Concert_Chapelle-Thècle-min.jpg",
    thumbnailDescription:
      "Concert du 4 Février 2018 : Concert des Cigales de Romenay et du Chœur d'hommes du Bon Pays de Cousance",
  },
  {
    title: "Concert au profit d'Anouk, le sourire à la vie",
    date: new Date("2017-12-17T16:00:00"),
    city: "Bény",
    place: "Eglise",
    chore: "La Cantavive de Marboz et le Chœur du Bon Pays de Cousance",
    price: "Entrée libre",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2017-12-17_Concert_Bény-min.jpg",
    thumbnailDescription:
      "Concert du 17 Décembre 2017 : Concert au profit d'Anouk, le sourire à la vie",
  },
  {
    title: "Concert de Noël",
    date: new Date("2017-12-10T16:00:00"),
    city: "Sagy",
    place: "Eglise",
    chore:
      "Les Chanteurs de la Vallière et les P'tits Chanteurs, et le Bon Pays de Cousance",
    price: "6€ / Gratuit - 12 ans",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2017-12-10_Concert_Sagy-min.jpg",
    thumbnailDescription: "Concert du 10 Décembre 2017 : Concert de Noël",
  },
  {
    title: "Concert du Chœur d'homme de Cousance",
    date: new Date("2017-10-28T20:00:00"),
    city: "Beaurepaire-en-Bresse",
    place: "Eglise",
    chore: "Le Chœur du Bon Pays",
    price: "Participation libre",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2017-10-28_Concert_Beaurepaire-min.jpg",
    thumbnailDescription:
      "Concert du 28 Octobre 2017 : Concert du Chœur d'homme de Cousance",
  },
  {
    title: "Concert dans le cadre du Rosay' Art 2017",
    date: new Date("2017-06-03T18:00:00"),
    city: "Rosay",
    place: "Eglise",
    chore: "Le Chœur du Bon Pays",
    price: "Entrée libre",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2017-06-03_Concert_Rosay-min.jpg",
    thumbnailDescription:
      "Concert du 3 Juin 2017 : Concert dans le cadre du Rosay' Art 2017",
  },
  {
    title: "Concert du Choeur du Bon Pays et de la Guillerette",
    date: new Date("2017-04-29T20:30:00"),
    city: "Saint-Amour",
    place: "Eglise",
    chore: "Le Chœur du Bon Pays et la Guillerette",
    price: "Participation libre",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2017-04-29_Concert_St_Amour-min.jpg",
    thumbnailDescription:
      "Concert du 29 Avril 2017 : Concert du Choeur du Bon Pays et de la Guillerette",
  },
  {
    title: "Concert du Chœur du Bon Pays et des Chanteurs du Val de Mâtre",
    date: new Date("2017-04-01T20:00:00"),
    city: "Guereins",
    place: "Eglise",
    chore: "Le Chœur du Bon Pays et les Chanteurs du Val de Mâtre",
    price: "Participation libre",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2017-04-01_Concert_Guereins-min.jpg",
    thumbnailDescription:
      "Concert du 1 Avril 2017 : Concert du Chœur du Bon Pays et des Chanteurs du Val de Mâtre",
  },
  {
    title: "Automne Musical : Concert de Noël du Chœur d'Hommes de Cousance",
    date: new Date("2016-12-11T16:30:00"),
    city: "Charchilla",
    place: "Eglise Saint-Pierre et Saint-Paul",
    chore: "Le Chœur du Bon Pays",
    price: "10€ / Gratuit - 12 ans",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2016-12-11_Concert_Charchilla-min.jpg",
    thumbnailDescription:
      "Concert du 11 Décembre 2016 : Automne Musical : Concert de Noël du Chœur d'Hommes de Cousance",
  },
  {
    title: "Concert au profit de la restauration de l'église",
    date: new Date("2016-10-22T20:30:00"),
    city: "Maynal",
    place: "Eglise",
    chore: "Le Chœur du Bon Pays et la Chorale Résila",
    price: "Participation libre",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2016-10-22_Concert_Maynal-min.jpg",
    thumbnailDescription:
      "Concert du 22 Octobre 2016 : Concert au profit de la restauration de l'église",
  },
  {
    title: "Concert du Chœur du Bon Pays et la Molegia",
    date: new Date("2016-05-07T20:30:00"),
    city: "Cousance",
    place: "Eglise",
    chore: "Le Chœur du Bon Pays et la Molegia",
    price: "Participation libre",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2016-05-16_Concert_Cousance-min.jpg",
    thumbnailDescription:
      "Concert du 7 Mai 2016 : Concert du Chœur du Bon Pays et la Molegia",
  },
  {
    title: "Concert organisé au profit du Secours Catholique",
    date: new Date("2016-04-10T15:00:00"),
    city: "Saint-Germain du Bois",
    place: "Eglise",
    chore: "Le Chœur du Bon Pays",
    price: "Participation libre",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2016-04-10_Concert_St-Germain_du_Bois-min.jpg",
    thumbnailDescription:
      "Concert du 10 Avril 2016 : Concert organisé au profit du Secours Catholique",
  },
  {
    title: "Le Chœur du Bon Pays et la CantaVive vous invitent à leur concert",
    date: new Date("2015-10-31T20:30:00"),
    city: "Saint-Amour",
    place: "Eglise",
    chore: "Le Chœur du Bon Pays et la CantaVive",
    price: "Participation libre",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2015-10-31_Concert_St_Amour-min.jpg",
    thumbnailDescription:
      "Concert du 31 Octobre 2015 : Le Chœur du Bon Pays et la CantaVive vous invite à leur concert",
  },
  {
    title:
      "Le Chœur du Bon Pays et la Source d'Adonaï vous invitent à leur concert",
    date: new Date("2014-10-18T20:30:00"),
    city: "Saint-Amour",
    place: "Eglise",
    chore: "Le Chœur du Bon Pays et la CantaVive",
    price: "Entrée libre",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2014-10-18_Concert_Cousance-min.jpg",
    thumbnailDescription:
      "Concert du 18 Octobre 2014 : Le Chœur du Bon Pays et la Source d'Adonaï vous invitent à leur concert",
  },
  {
    title:
      "La Chorale Chantevigne de Mesnay invite le Chœur du Bon Pays de Cousance",
    date: new Date("2013-06-01T20:30:00"),
    city: "Mesnay",
    place: "Eglise",
    chore: "La Chorale Chantevigne et le Chœur du Bon Pays",
    price: "Entrée libre",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2013-06-01_Concert_Mesnay-min.jpg",
    thumbnailDescription:
      "Concert du 1 Juin 2013 : La Chorale Chantevigne de Mesnay invite le Chœur du Bon Pays de Cousance",
  },
  {
    title: "3 chorales chanteront pour l'autisme",
    date: new Date("2013-05-04T20:00:00"),
    city: "Dompierre sur Mont",
    place: "Eglise",
    chore:
      "Les Demoiselles de Lorraine, la Voisinale de Joux et le Chœur du Bon Pays",
    price: "Participation libre",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2013-05-04_Concert_Dompierre-min.jpg",
    thumbnailDescription:
      "Concert du 4 Mai 2013 : 3 chorales chanteront pour l'autisme",
  },
  {
    title:
      "Concert au profit de la restauration d'un tableau double face de Saint Rémy en l'église de Reithouse",
    date: new Date("2012-06-01T20:30:00"),
    city: "Reithouse",
    place: "Salle des Fêtes",
    chore: "La Tourgelaine, la Clairpontoise et le Chœur du Bon Pays",
    price: "Participation libre",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2012-06-01_Concert_Reithouse-min.jpg",
    thumbnailDescription:
      "Concert du 1 Juin 2012 : Concert au profit de la restauration d'un tableau double face de Saint Rémy en l'église de Reithouse",
  },
  {
    title: "Cousance concert par le Chœur du Bon Pays avec Vénérabilis",
    date: new Date("2012-05-05T20:30:00"),
    city: "Cousance",
    place: "Eglise",
    chore: "Le Chœur du Bon Pays et Vénérabilis",
    price: "Participation libre",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2012-05-05_Concert_Cousance-min.jpg",
    thumbnailDescription:
      "Concert du 5 Mai 2012 : Cousance concert par le Chœur du Bon Pays avec Vénérabilis",
  },
  {
    title:
      "Soirée concert organisé par Pom Association au profit des puits du Niger",
    date: new Date("2012-03-31T20:00:00"),
    city: "Montain",
    place: "Eglise",
    chore: "Le Chœur du Bon Pays et l'harmonie de Savigny en Revermont",
    price: "Participation libre",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2012-03-31_Concert_Montain-min.jpg",
    thumbnailDescription:
      "Concert du 31 Mars 2012 : Soirée concert organisé par Pom Association au profit des puits du Niger",
  },
  {
    title: "Concert par le Chœur d'hommes du Bon Pays",
    date: new Date("2011-06-03T20:30:00"),
    city: "Gizia",
    place: "Eglise",
    chore: "Le Chœur du Bon Pays",
    price: "Entrée libre",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Affiches/2011-06-03_Concert_Gizia-min.jpg",
    thumbnailDescription:
      "Concert du 3 Juin 2011 : Concert par le Chœur d'hommes du Bon Pays",
  },
];

async function uploadEvent(event) {
  // Dynamically import node-fetch
  const fetch = (await import("node-fetch")).default;

  const formData = new FormData();

  // Use path module to resolve file paths
  const thumbnailFilePath = path.resolve(event.thumbnail);
  const thumbnailFileExtension = path.extname(event.thumbnail);

  // Ensure files exist before creating read streams
  if (!fs.existsSync(thumbnailFilePath)) {
    console.error(`Thumbnail file does not exist: ${thumbnailFilePath}`);
    return;
  }
  //   else {
  //     console.error(`Thumbnail file exists: ${thumbnailFilePath}`);
  //   }

  formData.append("thumbnailFromFront", fs.createReadStream(thumbnailFilePath));
  formData.append("title", event.title);
  formData.append("journal", event.journal);
  formData.append("city", event.city);
  formData.append("thumbnailDescription", event.thumbnailDescription);
  formData.append("eventDate", event.date.toISOString());
  formData.append("token", "iG3PywQUOeAX-fslH9LqhZwg83No3yl_");
  formData.append("lastevent", event.lastevent.toString());
  formData.append("thumbnailExtension", thumbnailFileExtension);

  // console.log("formData: ", formData);

  try {
    const response = await fetch(`${BACKEND_ADDRESS}/events/upload`, {
      method: "POST",
      body: formData,
      headers: formData.getHeaders(), // necessary to set the correct headers
      timeout: 0, // Disable timeout for debugging
    });

    const text = await response.text(); // Get the response as text first
    // console.log("Response Text:", text);

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

async function uploadAllEvents() {
  for (const event of events) {
    await uploadEvent(event);
  }
}

uploadAllEvents();
