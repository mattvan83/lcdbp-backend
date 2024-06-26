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
  {
    title: "904 euros récoltés pour Anouk lors d'un concert de la Cantative",
    journal: "La Voix de L'Ain",
    date: new Date("2017-12-19"),
    city: "Marboz",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2017/17-12-19_La_Voix_de_l_Ain.jpg",
    thumbnailDescription: "Revue de presse du 19 Décembre 2017",
    lastPressReview: false,
  },
  {
    title: "Un récital partagé entre chants sacrés et du terroir",
    journal: "L'Indépendant",
    date: new Date("2017-10-31"),
    city: "Beaurepaire",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2017/17-10-31_L_independant.jpg",
    thumbnailDescription: "Revue de presse du 31 Octobre 2017",
    lastPressReview: false,
  },
  {
    title: "Le Chœur du Bon Pays a comblé les mélomanes",
    journal: "Le Journal de Saône et Loire",
    date: new Date("2017-10-30"),
    city: "Beaurepaire-en-Bresse",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2017/17-10-30_JSL.jpg",
    thumbnailDescription: "Revue de presse du 30 Octobre 2017",
    lastPressReview: false,
  },
  {
    title: "Deux choeurs pour un concert en l'église de Saint-Amour",
    journal: "Le Progrès",
    date: new Date("2017-4-1"),
    city: "Saint-Amour",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2017/17-04_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 1 Avril 2017",
    lastPressReview: false,
  },
  {
    title:
      "Le Chœur du Bon Pays regroupe 30 voix d'hommes et donnera un concert samedi 29 avril",
    journal: "L'Indépendant",
    date: new Date("2017-4-1"),
    city: "Saint-Amour",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2017/17-04_L_independant.jpg",
    thumbnailDescription: "Revue de presse du 1 Avril 2017",
    lastPressReview: false,
  },
  {
    title: "Le Chœur d'Hommes du Bon Pays change de président",
    journal: "Le Progrès",
    date: new Date("2017-1-23"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2017/17-01-23_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 23 Janvier 2017",
    lastPressReview: false,
  },
  {
    title: "Chœur des Hommes du Bon Pays fait chanter l'automne",
    journal: "Le Progrès",
    date: new Date("2016-12-8"),
    city: "Charchilla",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2016/16-12-08_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 8 Décembre 2016",
    lastPressReview: false,
  },
  {
    title: "Deux chorales pour aider à la restauration de l'église de Nanc",
    journal: "Le Progrès",
    date: new Date("2016-10-4"),
    city: "Nanc-Lès-Saint-Amour",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2016/16-10-04_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 4 Octobre 2016",
    lastPressReview: false,
  },
  {
    title: "En mémoire des résistants du petit maquis de Lanézia",
    journal: "Le Progrès",
    date: new Date("2016-8-1"),
    city: "Cuisia",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2016/16-08-01_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 1 Août 2016",
    lastPressReview: false,
  },
  {
    title: "Instantanés",
    journal: "La Voix du Jura",
    date: new Date("2016-5-12"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2016/16-05-12_La_Voix_du_Jura.jpg",
    thumbnailDescription: "Revue de presse du 12 Mai 2016",
    lastPressReview: false,
  },
  {
    title: "Le Chœur du Bon Pays chantera samedi avec la chorale Moligia",
    journal: "Le Progrès",
    date: new Date("2016-5-7"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2016/16-05-07_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 7 Mai 2016",
    lastPressReview: false,
  },
  {
    title: "32 voix masculines à l'église",
    journal: "L'Indépendant",
    date: new Date("2016-4-15"),
    city: "Saint-Germain-du-Bois",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2016/16-04-15_l_Independant.jpg",
    thumbnailDescription: "Revue de presse du 15 Avril 2016",
    lastPressReview: false,
  },
  {
    title: "Les deux chorales ont uni leurs voix pour Retina France",
    journal: "Le Progrès",
    date: new Date("2016-4-2"),
    city: "Saint-Julien",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2016/16-04-02_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 2 Avril 2016",
    lastPressReview: false,
  },
  {
    title: "Petite Montagne, instantané",
    journal: "La Voix du Jura",
    date: new Date("2016-4-2"),
    city: "Saint-Julien",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2016/16-04-02_La_Voix_du_Jura.jpg",
    thumbnailDescription: "Revue de presse du 2 Avril 2016",
    lastPressReview: false,
  },
  {
    title: "Voix d'hommes",
    journal: "Bulletin municipal",
    date: new Date("2016-2-1"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2016/16-02_Bulletin_municipal.jpg",
    thumbnailDescription: "Revue de presse du 1 Février 2016",
    lastPressReview: false,
  },
  {
    title: "Le Chœur du Bon Pays recherche des nouvelles voix",
    journal: "Le Progrès",
    date: new Date("2016-1-14"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2016/16-01-14_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 14 Janvier 2016",
    lastPressReview: false,
  },
  {
    title: "Le Chœur d'hommes du Bon Pays chantera en Pologne",
    journal: "La Voix du Jura",
    date: new Date("2016-1-14"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2016/16-01-14_La_Voix_du_Jura.jpg",
    thumbnailDescription: "Revue de presse du 14 Janvier 2016",
    lastPressReview: false,
  },
  {
    title: "Le Chœur du Bon Pays en appelle aux jeunes",
    journal: "Le Journal de Saône et Loire",
    date: new Date("2016-1-14"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2016/16-01-14_JSL.jpg",
    thumbnailDescription: "Revue de presse du 14 Janvier 2016",
    lastPressReview: false,
  },
  {
    title: "Les deux chorales ont été ovationnées",
    journal: "Le Progrès",
    date: new Date("2015-10-31"),
    city: "Saint-Amour",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2015/15-10-31_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 31 Octobre 2015",
    lastPressReview: false,
  },
  {
    title: "Deux chorales pour un concert",
    journal: "Le Progrès",
    date: new Date("2015-9-21"),
    city: "Cressia",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2015/15-09-21_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 21 Septembre 2015",
    lastPressReview: false,
  },
  {
    title: "Chorales en l'église",
    journal: "Le Progrès",
    date: new Date("2015-9-19"),
    city: "Cressia",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2015/15-09-19_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 19 Septembre 2015",
    lastPressReview: false,
  },
  {
    title: "Un festival en Pologne en 2013",
    journal: "Le Progrès",
    date: new Date("2015-8-15"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2015/15-08-15_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 15 Août 2015",
    lastPressReview: false,
  },
  {
    title: "Instantané",
    journal: "La Voix du Jura",
    date: new Date("2015-5-28"),
    city: "Nozeroy",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2015/15-05-28_La_Voix_du_Jura.jpg",
    thumbnailDescription: "Revue de presse du 28 Mai 2015",
    lastPressReview: false,
  },
  {
    title: "Deux belles soirées musicales",
    journal: "Le Progrès",
    date: new Date("2015-5-25"),
    city: "Nozeroy",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2015/15-05-25_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 25 Mai 2015",
    lastPressReview: false,
  },
  {
    title: "Concert de printemps",
    journal: "La Voix du Jura",
    date: new Date("2015-5-21"),
    city: "Nozeroy",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2015/15-05-21_La_Voix_du_Jura.jpg",
    thumbnailDescription: "Revue de presse du 21 Mai 2015",
    lastPressReview: false,
  },
  {
    title: "Du plaisir à chanter",
    journal: "Bulletin municipal",
    date: new Date("2015-2-1"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2015/15-02_Bulletin_municipal.jpg",
    thumbnailDescription: "Revue de presse du 1 Février 2015",
    lastPressReview: false,
  },
  {
    title: "'Chœur du Pays' : ils chantent avec le coeur",
    journal: "Le Progrès",
    date: new Date("2015-1-8"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2015/15-01-08_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 8 Janvier 2015",
    lastPressReview: false,
  },
  {
    title: "Concert de la chorale Résilia",
    journal: "Le Progrès",
    date: new Date("2014-11-22"),
    city: "Courbouzon",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2014/14-11-22_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 22 Novembre 2014",
    lastPressReview: false,
  },
  {
    title: "La foule au concert",
    journal: "Le Journal de Saône et Loire",
    date: new Date("2014-10-22"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2014/14-10-22_JSL.jpg",
    thumbnailDescription: "Revue de presse du 22 Octobre 2014",
    lastPressReview: false,
  },
  {
    title: "Le concert choral a rempli l'église",
    journal: "Le Progrès",
    date: new Date("2014-10-21"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2014/14-10-21_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 21 Octobre 2014",
    lastPressReview: false,
  },
  {
    title: "Le Chœur du Bon Pays prépare les concerts de la nouvelle saison",
    journal: "Le Progrès",
    date: new Date("2014-9-14"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2014/14-09-14_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 14 Septembre 2014",
    lastPressReview: false,
  },
  {
    title: "Chœur du Bon Pays",
    journal: "Le Journal de Saône et Loire",
    date: new Date("2014-8-30"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2014/14-08-30_JSL.jpg",
    thumbnailDescription: "Revue de presse du 30 Août 2014",
    lastPressReview: false,
  },
  {
    title: "Journée du souvenir du 30 Juillet 1944",
    journal: "Le Progrès",
    date: new Date("2014-7-26"),
    city: "Cuisia",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2014/14-07-26_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 26 Juillet 2014",
    lastPressReview: false,
  },
  {
    title:
      "Le Chœur du Bon Pays redémarre les répétitions avec un nouveau chef",
    journal: "Le Progrès",
    date: new Date("2013-8-30"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2013/13-08-30_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 30 Août 2013",
    lastPressReview: false,
  },
  {
    title: "Le Bon Pays redémarre fait sa rentrée",
    journal: "Le Journal de Saône et Loire",
    date: new Date("2013-8-30"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2013/13-08-30_JSL.jpg",
    thumbnailDescription: "Revue de presse du 30 Août 2013",
    lastPressReview: false,
  },
  {
    title: "Chœur du Bon Pays : changement de direction",
    journal: "La Voix du Jura",
    date: new Date("2013-8-29"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2013/13-08-29_La_Voix_du_Jura.jpg",
    thumbnailDescription: "Revue de presse du 29 Août 2013",
    lastPressReview: false,
  },
  {
    title: "Deux chorales pour un concert",
    journal: "Le Progrès",
    date: new Date("2013-6-3"),
    city: "Mesnay",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2013/13-06-03_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 3 Juin 2013",
    lastPressReview: false,
  },
  {
    title: "Trois choeurs d'or pour l'autisme",
    journal: "La Voix du Jura",
    date: new Date("2013-5-9"),
    city: "Dompierre-Sur-Mont",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2013/13-05-09_La_Voix_du_Jura.jpg",
    thumbnailDescription: "Revue de presse du 9 Mai 2013",
    lastPressReview: false,
  },
  {
    title: "Des choeurs d'or pour lutter contre l'autisme",
    journal: "Le Progrès",
    date: new Date("2013-5-7"),
    city: "Dompierre-Sur-Mont",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2013/13-05-07_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 7 Mai 2013",
    lastPressReview: false,
  },
  {
    title: "Concert de chorales",
    journal: "Le Progrès",
    date: new Date("2013-5-4"),
    city: "Dompierre-Sur-Mont",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2013/13-05-04_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 4 Mai 2013",
    lastPressReview: false,
  },
  {
    title: "Trois chorales pour un foyer d'autistes",
    journal: "Le Progrès",
    date: new Date("2013-5-3"),
    city: "Dompierre-Sur-Mont",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2013/13-05-03_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 3 Mai 2013",
    lastPressReview: false,
  },
  {
    title: "Trois chorales pour une bonne cause",
    journal: "La Voix du Jura",
    date: new Date("2013-5-2"),
    city: "Dompierre-Sur-Mont",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2013/13-05-02_La_Voix_du_Jura.jpg",
    thumbnailDescription: "Revue de presse du 2 Mai 2013",
    lastPressReview: false,
  },
  {
    title: "Un chèque de 1000 euros pour la maison de retraite de Saint-Amour",
    journal: "Le Progrès",
    date: new Date("2013-3-20"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2013/13-03-20_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 20 Mars 2013",
    lastPressReview: false,
  },
  {
    title: "Le secret avait été bien gardé, la surprise a été totale",
    journal: "Le Progrès",
    date: new Date("2013-2-13"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2013/13-02-13_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 13 Février 2013",
    lastPressReview: false,
  },
  {
    title: "A Bian, les animations se suivent",
    journal: "Le Progrès",
    date: new Date("2013-1-26"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2013/13-01-26_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 26 Janvier 2013",
    lastPressReview: false,
  },
  {
    title: "Avec le Chœur d'hommes du Bon Pays",
    journal: "Le Progrès",
    date: new Date("2013-1-13"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2013/13-01-13_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 13 Janvier 2013",
    lastPressReview: false,
  },
  {
    title: "Deux chorales en concert pour une première en église",
    journal: "Le Progrès",
    date: new Date("2012-10-17"),
    city: "Supt",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2012/12-10-17_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 17 Octobre 2012",
    lastPressReview: false,
  },
  {
    title: "Les villageois ont fêté leur saint patron",
    journal: "Le Progrès",
    date: new Date("2012-9-22"),
    city: "Cressia",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2012/12-09-22_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 22 Septembre 2012",
    lastPressReview: false,
  },
  {
    title: "Un week-end de Saint-Maurice dignement fêté",
    journal: "La Voix du Jura",
    date: new Date("2012-9-22"),
    city: "Cressia",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2012/12-09-22_La_Voix_du_Jura.jpg",
    thumbnailDescription: "Revue de presse du 22 Septembre 2012",
    lastPressReview: false,
  },
  {
    title: "C'est la rentrée pour le Chœur du Bon Pays",
    journal: "La Voix du Jura",
    date: new Date("2012-8-16"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2012/12-08-16_La_Voix_du_Jura.jpg",
    thumbnailDescription: "Revue de presse du 16 Août 2012",
    lastPressReview: false,
  },
  {
    title: "Le Chœur du Bon Pays reprend du service",
    journal: "Le Progrès",
    date: new Date("2012-8-12"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2012/12-08-12_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 12 Août 2012",
    lastPressReview: false,
  },
  {
    title: "Les chorales chantent pour récolter des fonds de soutien",
    journal: "La Voix du Jura",
    date: new Date("2012-6-7"),
    city: "Reithouse",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2012/12-06-07_La_Voix_du_Jura.jpg",
    thumbnailDescription: "Revue de presse du 7 Juin 2012",
    lastPressReview: false,
  },
  {
    title: "Un concert de trois chorales a rempli la salle des fêtes",
    journal: "Le Progrès",
    date: new Date("2012-6-5"),
    city: "Reithouse",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2012/12-06-05_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 5 Juin 2012",
    lastPressReview: false,
  },
  {
    title: "Concert de chorales le 1er Juin",
    journal: "Le Progrès",
    date: new Date("2012-5-30"),
    city: "Reithouse",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2012/12-05-30_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 30 Mai 2012",
    lastPressReview: false,
  },
  {
    title: "Les deux choeurs d'hommes ont rempli l'église",
    journal: "Le Progrès",
    date: new Date("2012-5-8"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2012/12-05-08_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 8 Mai 2012",
    lastPressReview: false,
  },
  {
    title: "Concert à l'église",
    journal: "Le Journal de Saône et Loire",
    date: new Date("2012-5-7"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2012/12-05-07_JSL.jpg",
    thumbnailDescription: "Revue de presse du 7 Mai 2012",
    lastPressReview: false,
  },
  {
    title: "Deux choeurs d'hommes réunis pour un premier concert à Cousance",
    journal: "Le Progrès",
    date: new Date("2012-5-4"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2012/12-05-04_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 4 Mai 2012",
    lastPressReview: false,
  },
  {
    title:
      "Le Chœur du Bon Pays reçoit Vénérabilis samedi - C'est son homologue de Macornay",
    journal: "La Voix du Jura",
    date: new Date("2012-5-3"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2012/12-05-03_La_Voix_du_Jura.jpg",
    thumbnailDescription: "Revue de presse du 3 Mai 2012",
    lastPressReview: false,
  },
  {
    title: "Deux choeurs unissent leurs voix",
    journal: "La Voix du Jura",
    date: new Date("2012-5-3"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2012/12-05-03_La_Voix_du_Jura_(2).jpg",
    thumbnailDescription: "Revue de presse du 3 Mai 2012",
    lastPressReview: false,
  },
  {
    title: "Premier concert du Chœur du Bon Pays le 5 mai",
    journal: "Le Journal de Saône et Loire",
    date: new Date("2012-4-25"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2012/12-04-25_JSL.jpg",
    thumbnailDescription: "Revue de presse du 25 Avril 2012",
    lastPressReview: false,
  },
  {
    title: "Le Chœur du Bon Pays invite Vénérabilis",
    journal: "Le Progrès",
    date: new Date("2012-4-20"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2012/12-04-20_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 20 Avril 2012",
    lastPressReview: false,
  },
  {
    title: "Une église bondée pour un concert solidaire",
    journal: "Le Progrès",
    date: new Date("2012-4-2"),
    city: "Montain",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2012/12-04-02_Le_Progres.jpg",
    thumbnailDescription: "Revue de presse du 2 Avril 2012",
    lastPressReview: false,
  },
];
