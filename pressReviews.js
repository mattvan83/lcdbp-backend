const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
// const fetch = require("node-fetch");

const BACKEND_ADDRESS = "http://localhost:3000";

const pressReviews = [
  {
    title: "Une église comble pour le concert (de Noël ?) du comité des fêtes",
    journal: "Le Progrès",
    date: new Date("2023-12-10"),
    city: "Beaufort-Orbagna",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2023/Concert_Beaufort-Orbagna_23-12-10.jpg",
    thumbnailDescription: "Revue de presse du 10 Décembre 2023",
    lastPressReview: true,
  },
  {
    title:
      "Le 'Chœur du Bon Pays' a produit son répertoire de gospel devant une centaine de spectateurs",
    journal: "Le Progrès",
    date: new Date("2023-4-15"),
    city: "Saint-Etienne-Du-Bois",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2023/Concert_St Etienne_du_Bois_23-04-15.jpg",
    thumbnailDescription: "Revue de presse du 15 Avril 2023",
    lastPressReview: true,
  },
  {
    title: "La chorale conserve une trentaine de membres",
    journal: "Le Progrès",
    date: new Date("2023-1-24"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2023/AG_21-01-23.jpg",
    thumbnailDescription: "Revue de presse du 15 Janvier 2023",
    lastPressReview: true,
  },
  {
    title: "Le Chœur du Bon Pays a repris les répétitions",
    journal: "Le Progrès",
    date: new Date("2022-9-11"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2022/Le_Progrès_22-09-11.jpg",
    thumbnailDescription: "Revue de presse du 11 Septembre 2022",
    lastPressReview: true,
  },
  {
    title: "Alain Dargaud, nouveau président du Chœur du Bon Pays",
    journal: "Le Progrès",
    date: new Date("2022-7-22"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2022/Le_Progrès_22-07-22.jpg",
    thumbnailDescription: "Revue de presse du 22 Juillet 2022",
    lastPressReview: true,
  },
  {
    title: "Le Chœur du Bon Pays et la Perrina réunis pour la bonne cause",
    journal: "Le Progrès",
    date: new Date("2022-6-11"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2022/Concert_Perrigny_22-06-11.png",
    thumbnailDescription: "Revue de presse du 11 Juin 2022",
    lastPressReview: true,
  },
  {
    title: "Le Chœur du Bon Pays a repris les répétitions",
    journal: "Le Progrès",
    date: new Date("2021-9-7"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2021/210926_162048.jpg",
    thumbnailDescription: "Revue de presse du 7 Septembre 2021",
    lastPressReview: false,
  },
  {
    title: "Commémoration en mémoire des Résistants du maquis de Lanézia",
    journal: "La Voix du Jura",
    date: new Date("2021-8-3"),
    city: "Cuisia",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2021/210828_193917.jpg",
    thumbnailDescription: "Revue de presse du 3 Août 2021",
    lastPressReview: false,
  },
  {
    title: "Le Chœur du Bon Pays prépare son avenir",
    journal: "Actu Lons et Région",
    date: new Date("2021-7-8"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2021/210727_165940.jpg",
    thumbnailDescription: "Revue de presse du 8 Juillet 2021",
    lastPressReview: false,
  },
  {
    title: "Le Chœur du Bon Pays reprend dans des conditions particulières",
    journal: "Le Progrès",
    date: new Date("2020-9-18"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2020/20-09-18_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 8 Septembre 2020",
    lastPressReview: false,
  },
  {
    title: "Le Chœur du Bon Pays à l'heure du numérique",
    journal: "Le Progrès",
    date: new Date("2020-6-9"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2020/20-06-09_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 9 Juin 2020",
    lastPressReview: false,
  },
  {
    title: "Le 'chœur d'hommes du Bon Pays' se prépare à fêter ses 10 ans",
    journal: "Le Progrès",
    date: new Date("2020-1-30"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2020/20-01-30_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 30 Janvier 2020",
    lastPressReview: false,
  },
  {
    title:
      "Un concert se prépare pour aider l'association humanitaire Apprentis orphelins d'Afrique",
    journal: "Le Progrès",
    date: new Date("2019-10-10"),
    city: "Château-Chalon",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2019/19-10-10_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 10 Octobre 2019",
    lastPressReview: false,
  },
  {
    title: "Concert en hommage à Jean_pierre Boisson",
    journal: "La Voix du Jura",
    date: new Date("2019-10-3"),
    city: "Château-Chalon",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2019/19-10-03_La_Voix_du_Jura.jpg",
    thumbnailDescription: "Revue de presse du 3 Octobre 2019",
    lastPressReview: false,
  },
  {
    title: "Apprentis orphelins d'Afrique : un concert prévu le 13 octobre",
    journal: "Le Progrès",
    date: new Date("2019-9-12"),
    city: "Château-Chalon",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2019/19-09-12_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 12 Septembre 2019",
    lastPressReview: false,
  },
  {
    title:
      "Les membres de la chorale Le Chœur du Bon Pays reprennent leurs activités",
    journal: "Le Progrès",
    date: new Date("2019-9-4"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2019/19-09-04_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 4 Septembre 2019",
    lastPressReview: false,
  },
  {
    title: "Succès des feux de la Saint-Jean",
    journal: "La Voix de l'Ain",
    date: new Date("2019-6-28"),
    city: "Saint-Rémy-du-Mont",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2019/19-06-28_La_Voix_de_l_Ain.jpg",
    thumbnailDescription: "Revue de presse du 28 Juin 2019",
    lastPressReview: false,
  },
  {
    title:
      "Concert hommage à Christian Millet avec Les Chœurs d'hommes du Bon Pays",
    journal: "Le Progrès",
    date: new Date("2019-6-8"),
    city: "Moirans-en-Montagne",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2019/19-06-08_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 8 Juin 2019",
    lastPressReview: false,
  },
  {
    title: "Le Chœur du Bon Pays en concert à l'église samedi soir",
    journal: "Le Progrès",
    date: new Date("2019-5-10"),
    city: "Saint-Laurent-La-Roche",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2019/19-05-10_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 10 Mai 2019",
    lastPressReview: false,
  },
  {
    title: "Gérard Besançon préside le Chœur du Bon Pays",
    journal: "La Voix du Jura",
    date: new Date("2019-1-24"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2019/19-01-24_La_Voix_du_Jura.jpg",
    thumbnailDescription: "Revue de presse du 24 Janvier 2019",
    lastPressReview: false,
  },
  {
    title: "Le chœur se porte bien",
    journal: "Le Progrès",
    date: new Date("2019-1-22"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2019/19-01-22_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 22 Janvier 2019",
    lastPressReview: false,
  },
  {
    title: "L'église a résonné aux sons de chants patriotiques",
    journal: "La Voix du Jura",
    date: new Date("2018-11-15"),
    city: "Montfleur",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2018/18-11-15_La_Voix_du_Jura.jpg",
    thumbnailDescription: "Revue de presse du 15 Novembre 2018",
    lastPressReview: false,
  },
  {
    title: "La Grande Guerre rappelée en chiffres et en musique",
    journal: "Le Progrès",
    date: new Date("2018-11-6"),
    city: "Montfleur",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2018/18-11-06_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 6 Novembre 2018",
    lastPressReview: false,
  },
  {
    title: "Le Chœur du Bon Pays a fait vibrer les Bressans",
    journal: "L'Indépendant",
    date: new Date("2018-10-16"),
    city: "Saillenard",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2018/18-10-16_L_independant.jpg",
    thumbnailDescription: "Revue de presse du 16 Octobre 2018",
    lastPressReview: false,
  },
  {
    title: "170 personnes au concert à l'église",
    journal: "Le Journal de Saône et Loire",
    date: new Date("2018-9-18"),
    city: "Champagnat",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2018/18-09-18_JSL.jpg",
    thumbnailDescription: "Revue de presse du 18 Septembre 2018",
    lastPressReview: false,
  },
  {
    title: "Champagnat : deux chorale vont animer l'église samedi",
    journal: "Le Journal de Saône et Loire",
    date: new Date("2018-9-13"),
    city: "Champagnat",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2018/18-09-13_JSL.jpg",
    thumbnailDescription: "Revue de presse du 13 Septembre 2018",
    lastPressReview: false,
  },
  {
    title: "Le chant des deux chorales résonne entre les murs de l'église",
    journal: "L'Indépendant",
    date: new Date("2018-5-15"),
    city: "Digna",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2018/18-05-15_L_independant.jpg",
    thumbnailDescription: "Revue de presse du 15 Mai 2018",
    lastPressReview: false,
  },
  {
    title: "Le chœur d'hommes chante ce samedi à Digna",
    journal: "Le Journal de Saône et Loire",
    date: new Date("2018-5-9"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2018/18-05-09_JSL.jpg",
    thumbnailDescription: "Revue de presse du 9 Mai 2018",
    lastPressReview: false,
  },
  {
    title:
      "Une belle audience pour le concert organisé au profit de la restauration de l'église de Châtel",
    journal: "La Voix du Jura",
    date: new Date("2018-3-16"),
    city: "Beaufort",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2018/18-03-16_La_Voix_du_Jura.jpg",
    thumbnailDescription: "Revue de presse du 16 Mars 2018",
    lastPressReview: false,
  },
  {
    title: "Un concert au profit de la restauration de l'église de Châtel",
    journal: "Le Progrès",
    date: new Date("2018-3-3"),
    city: "Beaufort",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2018/18-03-03_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 3 Mars 2018",
    lastPressReview: false,
  },
  {
    title: "De belles voix ont retenti à l'église",
    journal: "L'Indépendant",
    date: new Date("2018-2-6"),
    city: "La Chapelle-Thècle",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2018/18-02-06_L_independant.jpg",
    thumbnailDescription: "Revue de presse du 6 Février 2018",
    lastPressReview: false,
  },
  {
    title: "Le Chœur d'hommes du Bon Pays recherche des choristes",
    journal: "La Voix du Jura",
    date: new Date("2018-1-11"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2018/18-01-11_La_Voix_du_Jura.jpg",
    thumbnailDescription: "Revue de presse du 11 Janvier 2018",
    lastPressReview: false,
  },
  {
    title: "Chœur du Bon Pays : appel à choristes",
    journal: "Le Progrès",
    date: new Date("2018-1-8"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2018/18-01-08_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 8 Janvier 2018",
    lastPressReview: false,
  },
];
