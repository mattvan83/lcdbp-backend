const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
// const fetch = require("node-fetch");

const BACKEND_ADDRESS = "http://localhost:3000";

const pressReviews = [
  {
    title:
      "Inauguration et bénédiction de la chapelle restaurée Notre-Dame du Chêne",
    journal: "L'Echo du Revermont",
    date: new Date("2024-06-1"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2024/2024-06_L_Echo_du_Revermont-min.jpg",
    thumbnailDescription:
      "Revue de presse du 1 Juin 2024 : Inauguration et bénédiction de la chapelle restaurée Notre-Dame du Chêne",
    lastPressReview: true,
  },
  {
    title: "Le Chœur du Bon Pays a un nouveau bureau",
    journal: "Le Progrès",
    date: new Date("2024-02-23"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2024/2024-02-23_Le_Progres-min.png",
    thumbnailDescription:
      "Revue de presse du 23 Février 2024 : Le Chœur du Bon Pays a un nouveau bureau",
    lastPressReview: true,
  },
  {
    title: "Six concerts au programme du Chœur du Bon Pays",
    journal: "L'Indépendant",
    date: new Date("2024-01-30"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2024/2024-01-24_L_independant-min.png",
    thumbnailDescription:
      "Revue de presse du 30 Janvier 2024 : Six concerts au programme du Chœur du Bon Pays",
    lastPressReview: true,
  },
  {
    title: "Une église comble pour le concert (de Noël ?) du comité des fêtes",
    journal: "Le Progrès",
    date: new Date("2023-12-10"),
    city: "Beaufort-Orbagna",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2023/Concert_Beaufort-Orbagna_23-12-10-min.jpg",
    thumbnailDescription:
      "Revue de presse du 10 Décembre 2023 : Une église comble pour le concert (de Noël ?) du comité des fêtes",
    lastPressReview: true,
  },
  {
    title: "Le Chœur du Bon Pays en concert ce dimanche",
    journal: "Le Progrès",
    date: new Date("2023-12-6"),
    city: "Saint-Etienne-Du-Bois",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2023/2023-12-06_Le_Progres-min.png",
    thumbnailDescription:
      "Revue de presse du 6 Décembre 2023 : Le Chœur du Bon Pays en concert ce dimanche",
    lastPressReview: true,
  },
  {
    title:
      "Le 'Chœur du Bon Pays' a produit son répertoire de gospel devant une centaine de spectateurs",
    journal: "Le Progrès",
    date: new Date("2023-4-15"),
    city: "Saint-Etienne-Du-Bois",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2023/Concert_St Etienne_du_Bois_23-04-15-min.jpg",
    thumbnailDescription:
      "Revue de presse du 15 Avril 2023 : Le 'Chœur du Bon Pays' a produit son répertoire de gospel devant une centaine de spectateurs",
    lastPressReview: true,
  },
  {
    title: "La chorale conserve une trentaine de membres",
    journal: "Le Progrès",
    date: new Date("2023-1-24"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2023/AG_21-01-23-min.jpg",
    thumbnailDescription:
      "Revue de presse du 24 Janvier 2023 : La chorale conserve une trentaine de membres",
    lastPressReview: true,
  },
  {
    title: "Le Chœur du Bon Pays a repris les répétitions",
    journal: "Le Progrès",
    date: new Date("2022-9-11"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2022/2022-09-11_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 11 Septembre 2022 : Le Chœur du Bon Pays a repris les répétitions",
    lastPressReview: false,
  },
  {
    title: "Alain Dargaud, nouveau président du Chœur du Bon Pays",
    journal: "Le Progrès",
    date: new Date("2022-7-26"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2022/2022-07-26_Le_Progres-min.png",
    thumbnailDescription:
      "Revue de presse du 26 Juillet 2022 : Alain Dargaud, nouveau président du Chœur du Bon Pays",
    lastPressReview: false,
  },
  {
    title: "Le Chœur du Bon Pays a rendu hommage à  son chef sur le départ",
    journal: "Le Progrès",
    date: new Date("2022-6-27"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2022/2022-06-27_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 27 Juin 2022 : Le Chœur du Bon Pays a rendu hommage à  son chef sur le départ",
    lastPressReview: false,
  },
  {
    title: "Le Chœur du Bon Pays et la Perrina réunis pour la bonne cause",
    journal: "Le Progrès",
    date: new Date("2022-6-14"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2022/2022-06-14_Le_Progres-min.png",
    thumbnailDescription:
      "Revue de presse du 14 Juin 2022 : Le Chœur du Bon Pays et la Perrina réunis pour la bonne cause",
    lastPressReview: false,
  },
  {
    title: "Le Chœur du Bon Pays va (enfin) fêter ses 10 ans",
    journal: "Le Progrès",
    date: new Date("2022-3-4"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2022/2022-03-04_Le_Progres-min.png",
    thumbnailDescription:
      "Revue de presse du 4 Mars 2022 : Le Chœur du Bon Pays va (enfin) fêter ses 10 ans",
    lastPressReview: false,
  },
  {
    title: "Le Chœur du Bon Pays a repris les répétitions",
    journal: "Le Progrès",
    date: new Date("2021-9-7"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2021/210926_162048-min.jpg",
    thumbnailDescription:
      "Revue de presse du 7 Septembre 2021 : Le Chœur du Bon Pays a repris les répétitions",
    lastPressReview: false,
  },
  {
    title: "Commémoration en mémoire des Résistants du maquis de Lanézia",
    journal: "La Voix du Jura",
    date: new Date("2021-8-3"),
    city: "Cuisia",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2021/210828_193917-min.jpg",
    thumbnailDescription: "Revue de presse du 3 Août 2021",
    lastPressReview: false,
  },
  {
    title: "Le Chœur du Bon Pays prépare son avenir",
    journal: "Le Progrès",
    date: new Date("2021-7-8"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2021/210727_165940-min.jpg",
    thumbnailDescription:
      "Revue de presse du 8 Juillet 2021 : Le Chœur du Bon Pays prépare son avenir",
    lastPressReview: false,
  },
  {
    title: "Le Chœur du Bon Pays reprend dans des conditions particulières",
    journal: "Le Progrès",
    date: new Date("2020-9-18"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2020/20-09-18_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 8 Septembre 2020 : Le Chœur du Bon Pays reprend dans des conditions particulières",
    lastPressReview: false,
  },
  {
    title: "Le Chœur du Bon Pays à l'heure du numérique",
    journal: "Le Progrès",
    date: new Date("2020-6-9"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2020/20-06-09_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 9 Juin 2020 : Le Chœur du Bon Pays à l'heure du numérique",
    lastPressReview: false,
  },
  {
    title: "Le 'chœur d'hommes du Bon Pays' se prépare à fêter ses 10 ans",
    journal: "Le Progrès",
    date: new Date("2020-1-30"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2020/20-01-30_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 30 Janvier 2020 : Le 'chœur d'hommes du Bon Pays' se prépare à fêter ses 10 ans",
    lastPressReview: false,
  },
  {
    title:
      "Un concert se prépare pour aider l'association humanitaire Apprentis orphelins d'Afrique",
    journal: "Le Progrès",
    date: new Date("2019-10-10"),
    city: "Château-Chalon",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2019/19-10-10_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 10 Octobre 2019 : Un concert se prépare pour aider l'association humanitaire Apprentis orphelins d'Afrique",
    lastPressReview: false,
  },
  {
    title: "Concert en hommage à Jean_pierre Boisson",
    journal: "La Voix du Jura",
    date: new Date("2019-10-3"),
    city: "Château-Chalon",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2019/19-10-03_La_Voix_du_Jura-min.jpg",
    thumbnailDescription:
      "Revue de presse du 3 Octobre 2019 : Concert en hommage à Jean_pierre Boisson",
    lastPressReview: false,
  },
  {
    title: "Apprentis orphelins d'Afrique : un concert prévu le 13 octobre",
    journal: "Le Progrès",
    date: new Date("2019-9-12"),
    city: "Château-Chalon",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2019/19-09-12_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 12 Septembre 2019 : Apprentis orphelins d'Afrique : un concert prévu le 13 octobre",
    lastPressReview: false,
  },
  {
    title:
      "Les membres de la chorale Le Chœur du Bon Pays reprennent leurs activités",
    journal: "Le Progrès",
    date: new Date("2019-9-4"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2019/19-09-04_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 4 Septembre 2019 : Les membres de la chorale Le Chœur du Bon Pays reprennent leurs activités",
    lastPressReview: false,
  },
  {
    title: "Succès des feux de la Saint-Jean",
    journal: "La Voix de l'Ain",
    date: new Date("2019-6-28"),
    city: "Saint-Rémy-du-Mont",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2019/19-06-28_La_Voix_de_l_Ain-min.jpg",
    thumbnailDescription:
      "Revue de presse du 28 Juin 2019 : Succès des feux de la Saint-Jean",
    lastPressReview: false,
  },
  {
    title:
      "Concert hommage à Christian Millet avec Les Chœurs d'hommes du Bon Pays",
    journal: "Le Progrès",
    date: new Date("2019-6-8"),
    city: "Moirans-en-Montagne",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2019/19-06-08_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 8 Juin 2019 : Concert hommage à Christian Millet avec Les Chœurs d'hommes du Bon Pays",
    lastPressReview: false,
  },
  {
    title: "Le Chœur du Bon Pays en concert à l'église samedi soir",
    journal: "Le Progrès",
    date: new Date("2019-5-10"),
    city: "Saint-Laurent-La-Roche",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2019/19-05-10_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 10 Mai 2019 : Le Chœur du Bon Pays en concert à l'église samedi soir",
    lastPressReview: false,
  },
  {
    title: "Gérard Besançon préside le Chœur du Bon Pays",
    journal: "La Voix du Jura",
    date: new Date("2019-1-24"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2019/19-01-24_La_Voix_du_Jura-min.jpg",
    thumbnailDescription:
      "Revue de presse du 24 Janvier 2019 : Gérard Besançon préside le Chœur du Bon Pays",
    lastPressReview: false,
  },
  {
    title: "Le chœur se porte bien",
    journal: "Le Progrès",
    date: new Date("2019-1-22"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2019/19-01-22_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 22 Janvier 2019 : Le chœur se porte bien",
    lastPressReview: false,
  },
  {
    title: "L'église a résonné aux sons de chants patriotiques",
    journal: "La Voix du Jura",
    date: new Date("2018-11-15"),
    city: "Montfleur",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2018/18-11-15_La_Voix_du_Jura-min.jpg",
    thumbnailDescription:
      "Revue de presse du 15 Novembre 2018 : L'église a résonné aux sons de chants patriotiques",
    lastPressReview: false,
  },
  {
    title: "La Grande Guerre rappelée en chiffres et en musique",
    journal: "Le Progrès",
    date: new Date("2018-11-6"),
    city: "Montfleur",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2018/18-11-06_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 6 Novembre 2018 : La Grande Guerre rappelée en chiffres et en musique",
    lastPressReview: false,
  },
  {
    title: "Le Chœur du Bon Pays a fait vibrer les Bressans",
    journal: "L'Indépendant",
    date: new Date("2018-10-16"),
    city: "Saillenard",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2018/18-10-16_L_independant-min.jpg",
    thumbnailDescription:
      "Revue de presse du 16 Octobre 2018 : Le Chœur du Bon Pays a fait vibrer les Bressans",
    lastPressReview: false,
  },
  {
    title: "170 personnes au concert à l'église",
    journal: "Le Journal de Saône et Loire",
    date: new Date("2018-9-18"),
    city: "Champagnat",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2018/18-09-18_JSL-min.jpg",
    thumbnailDescription:
      "Revue de presse du 18 Septembre 2018 : 170 personnes au concert à l'église",
    lastPressReview: false,
  },
  {
    title: "Champagnat : deux chorale vont animer l'église samedi",
    journal: "Le Journal de Saône et Loire",
    date: new Date("2018-9-13"),
    city: "Champagnat",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2018/18-09-13_JSL-min.jpg",
    thumbnailDescription:
      "Revue de presse du 13 Septembre 2018 : Champagnat : deux chorale vont animer l'église samedi",
    lastPressReview: false,
  },
  {
    title: "Le chant des deux chorales résonne entre les murs de l'église",
    journal: "L'Indépendant",
    date: new Date("2018-5-15"),
    city: "Digna",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2018/18-05-15_L_independant-min.jpg",
    thumbnailDescription:
      "Revue de presse du 15 Mai 2018 : Le chant des deux chorales résonne entre les murs de l'église",
    lastPressReview: false,
  },
  {
    title: "Le chœur d'hommes chante ce samedi à Digna",
    journal: "Le Journal de Saône et Loire",
    date: new Date("2018-5-9"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2018/18-05-09_JSL-min.jpg",
    thumbnailDescription:
      "Revue de presse du 9 Mai 2018 : Le chœur d'hommes chante ce samedi à Digna",
    lastPressReview: false,
  },
  {
    title:
      "Une belle audience pour le concert organisé au profit de la restauration de l'église de Châtel",
    journal: "La Voix du Jura",
    date: new Date("2018-3-16"),
    city: "Beaufort",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2018/18-03-16_La_Voix_du_Jura-min.jpg",
    thumbnailDescription:
      "Revue de presse du 16 Mars 2018 : Une belle audience pour le concert organisé au profit de la restauration de l'église de Châtel",
    lastPressReview: false,
  },
  {
    title: "Un concert au profit de la restauration de l'église de Châtel",
    journal: "Le Progrès",
    date: new Date("2018-3-3"),
    city: "Beaufort",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2018/18-03-03_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 3 Mars 2018 : Un concert au profit de la restauration de l'église de Châtel",
    lastPressReview: false,
  },
  {
    title: "De belles voix ont retenti à l'église",
    journal: "L'Indépendant",
    date: new Date("2018-2-6"),
    city: "La Chapelle-Thècle",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2018/18-02-06_L_independant-min.jpg",
    thumbnailDescription:
      "Revue de presse du 6 Février 2018 : De belles voix ont retenti à l'église",
    lastPressReview: false,
  },
  {
    title: "Le Chœur d'hommes du Bon Pays recherche des choristes",
    journal: "La Voix du Jura",
    date: new Date("2018-1-11"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2018/18-01-11_La_Voix_du_Jura-min.jpg",
    thumbnailDescription:
      "Revue de presse du 11 Janvier 2018 : Le Chœur d'hommes du Bon Pays recherche des choristes",
    lastPressReview: false,
  },
  {
    title: "Chœur du Bon Pays : appel à choristes",
    journal: "Le Progrès",
    date: new Date("2018-1-8"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2018/18-01-08_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 8 Janvier 2018 : Chœur du Bon Pays : appel à choristes",
    lastPressReview: false,
  },
  {
    title: "904 euros récoltés pour Anouk lors d'un concert de la Cantative",
    journal: "La Voix de L'Ain",
    date: new Date("2017-12-19"),
    city: "Marboz",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2017/17-12-19_La_Voix_de_l_Ain-min.jpg",
    thumbnailDescription:
      "Revue de presse du 19 Décembre 2017 : 904 euros récoltés pour Anouk lors d'un concert de la Cantative",
    lastPressReview: false,
  },
  {
    title: "Un récital partagé entre chants sacrés et du terroir",
    journal: "L'Indépendant",
    date: new Date("2017-10-31"),
    city: "Beaurepaire",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2017/17-10-31_L_independant-min.jpg",
    thumbnailDescription:
      "Revue de presse du 31 Octobre 2017 : Un récital partagé entre chants sacrés et du terroir",
    lastPressReview: false,
  },
  {
    title: "Le Chœur du Bon Pays a comblé les mélomanes",
    journal: "Le Journal de Saône et Loire",
    date: new Date("2017-10-30"),
    city: "Beaurepaire-en-Bresse",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2017/17-10-30_JSL-min.jpg",
    thumbnailDescription:
      "Revue de presse du 30 Octobre 2017 : Le Chœur du Bon Pays a comblé les mélomanes",
    lastPressReview: false,
  },
  {
    title: "Deux choeurs pour un concert en l'église de Saint-Amour",
    journal: "Le Progrès",
    date: new Date("2017-4-1"),
    city: "Saint-Amour",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2017/17-04_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 1 Avril 2017 : Deux choeurs pour un concert en l'église de Saint-Amour",
    lastPressReview: false,
  },
  {
    title:
      "Le Chœur du Bon Pays regroupe 30 voix d'hommes et donnera un concert samedi 29 avril",
    journal: "L'Indépendant",
    date: new Date("2017-4-1"),
    city: "Saint-Amour",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2017/17-04_L_independant-min.jpg",
    thumbnailDescription:
      "Revue de presse du 1 Avril 2017 : Le Chœur du Bon Pays regroupe 30 voix d'hommes et donnera un concert samedi 29 avril",
    lastPressReview: false,
  },
  {
    title: "Le Chœur d'Hommes du Bon Pays change de président",
    journal: "Le Progrès",
    date: new Date("2017-1-23"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2017/17-01-23_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 23 Janvier 2017 : Le Chœur d'Hommes du Bon Pays change de président",
    lastPressReview: false,
  },
  {
    title: "Chœur des Hommes du Bon Pays fait chanter l'automne",
    journal: "Le Progrès",
    date: new Date("2016-12-8"),
    city: "Charchilla",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2016/16-12-08_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 8 Décembre 2016 : Chœur des Hommes du Bon Pays fait chanter l'automne",
    lastPressReview: false,
  },
  {
    title: "Deux chorales pour aider à la restauration de l'église de Nanc",
    journal: "Le Progrès",
    date: new Date("2016-10-4"),
    city: "Nanc-Lès-Saint-Amour",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2016/16-10-04_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 4 Octobre 2016 : Deux chorales pour aider à la restauration de l'église de Nanc",
    lastPressReview: false,
  },
  {
    title: "En mémoire des résistants du petit maquis de Lanézia",
    journal: "Le Progrès",
    date: new Date("2016-8-1"),
    city: "Cuisia",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2016/16-08-01_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 1 Août 2016 : En mémoire des résistants du petit maquis de Lanézia",
    lastPressReview: false,
  },
  {
    title: "Instantanés",
    journal: "La Voix du Jura",
    date: new Date("2016-5-12"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2016/16-05-12_La_Voix_du_Jura-min.jpg",
    thumbnailDescription: "Revue de presse du 12 Mai 2016 : Instantanés",
    lastPressReview: false,
  },
  {
    title: "Le Chœur du Bon Pays chantera samedi avec la chorale Moligia",
    journal: "Le Progrès",
    date: new Date("2016-5-7"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2016/16-05-07_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 7 Mai 2016 : Le Chœur du Bon Pays chantera samedi avec la chorale Moligia",
    lastPressReview: false,
  },
  {
    title: "32 voix masculines à l'église",
    journal: "L'Indépendant",
    date: new Date("2016-4-15"),
    city: "Saint-Germain-du-Bois",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2016/16-04-15_l_Independant-min.jpg",
    thumbnailDescription:
      "Revue de presse du 15 Avril 2016 : 32 voix masculines à l'église",
    lastPressReview: false,
  },
  {
    title: "Les deux chorales ont uni leurs voix pour Retina France",
    journal: "Le Progrès",
    date: new Date("2016-4-2"),
    city: "Saint-Julien",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2016/16-04-02_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 2 Avril 2016 : Les deux chorales ont uni leurs voix pour Retina France",
    lastPressReview: false,
  },
  {
    title: "Petite Montagne, instantané",
    journal: "La Voix du Jura",
    date: new Date("2016-4-2"),
    city: "Saint-Julien",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2016/16-04-02_La_Voix_du_Jura-min.jpg",
    thumbnailDescription:
      "Revue de presse du 2 Avril 2016 : Petite Montagne, instantané",
    lastPressReview: false,
  },
  {
    title: "Voix d'hommes",
    journal: "Bulletin municipal",
    date: new Date("2016-2-1"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2016/16-02_Bulletin_municipal-min.jpg",
    thumbnailDescription: "Revue de presse du 1 Février 2016 : Voix d'hommes",
    lastPressReview: false,
  },
  {
    title: "Le Chœur du Bon Pays recherche des nouvelles voix",
    journal: "Le Progrès",
    date: new Date("2016-1-14"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2016/16-01-14_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 14 Janvier 2016 : Le Chœur du Bon Pays recherche des nouvelles voix",
    lastPressReview: false,
  },
  {
    title: "Le Chœur d'hommes du Bon Pays chantera en Pologne",
    journal: "La Voix du Jura",
    date: new Date("2016-1-14"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2016/16-01-14_La_Voix_du_Jura-min.jpg",
    thumbnailDescription:
      "Revue de presse du 14 Janvier 2016 : Le Chœur d'hommes du Bon Pays chantera en Pologne",
    lastPressReview: false,
  },
  {
    title: "Le Chœur du Bon Pays en appelle aux jeunes",
    journal: "Le Journal de Saône et Loire",
    date: new Date("2016-1-14"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2016/16-01-14_JSL-min.jpg",
    thumbnailDescription:
      "Revue de presse du 14 Janvier 2016 : Le Chœur du Bon Pays en appelle aux jeunes",
    lastPressReview: false,
  },
  {
    title: "Les deux chorales ont été ovationnées",
    journal: "Le Progrès",
    date: new Date("2015-10-31"),
    city: "Saint-Amour",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2015/15-10-31_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 31 Octobre 2015 : Les deux chorales ont été ovationnées",
    lastPressReview: false,
  },
  {
    title: "Deux chorales pour un concert",
    journal: "Le Progrès",
    date: new Date("2015-9-21"),
    city: "Cressia",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2015/15-09-21_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 21 Septembre 2015 : Deux chorales pour un concert",
    lastPressReview: false,
  },
  {
    title: "Chorales en l'église",
    journal: "Le Progrès",
    date: new Date("2015-9-19"),
    city: "Cressia",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2015/15-09-19_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 19 Septembre 2015 : Chorales en l'église",
    lastPressReview: false,
  },
  {
    title: "Un festival en Pologne en 2016",
    journal: "Le Progrès",
    date: new Date("2015-8-15"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2015/15-08-15_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 15 Août 2015 : Un festival en Pologne en 2016",
    lastPressReview: false,
  },
  {
    title: "Instantané",
    journal: "La Voix du Jura",
    date: new Date("2015-5-28"),
    city: "Nozeroy",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2015/15-05-28_La_Voix_du_Jura-min.jpg",
    thumbnailDescription: "Revue de presse du 28 Mai 2015 : Instantané",
    lastPressReview: false,
  },
  {
    title: "Deux belles soirées musicales",
    journal: "Le Progrès",
    date: new Date("2015-5-25"),
    city: "Nozeroy",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2015/15-05-25_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 25 Mai 2015 : Deux belles soirées musicales",
    lastPressReview: false,
  },
  {
    title: "Concert de printemps",
    journal: "La Voix du Jura",
    date: new Date("2015-5-21"),
    city: "Nozeroy",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2015/15-05-21_La_Voix_du_Jura-min.jpg",
    thumbnailDescription:
      "Revue de presse du 21 Mai 2015 : Concert de printemps",
    lastPressReview: false,
  },
  {
    title: "Du plaisir à chanter",
    journal: "Bulletin municipal",
    date: new Date("2015-2-1"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2015/15-02_Bulletin_municipal-min.jpg",
    thumbnailDescription:
      "Revue de presse du 1 Février 2015 : Du plaisir à chanter",
    lastPressReview: false,
  },
  {
    title: "'Chœur du Pays' : ils chantent avec le coeur",
    journal: "Le Progrès",
    date: new Date("2015-1-8"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2015/15-01-08_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 8 Janvier 2015 : 'Chœur du Pays' : ils chantent avec le coeur",
    lastPressReview: false,
  },
  {
    title: "Concert de la chorale Résilia",
    journal: "Le Progrès",
    date: new Date("2014-11-22"),
    city: "Courbouzon",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2014/14-11-22_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 22 Novembre 2014 : Concert de la chorale Résilia",
    lastPressReview: false,
  },
  {
    title: "La foule au concert",
    journal: "Le Journal de Saône et Loire",
    date: new Date("2014-10-22"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2014/14-10-22_JSL-min.jpg",
    thumbnailDescription:
      "Revue de presse du 22 Octobre 2014 : La foule au concert",
    lastPressReview: false,
  },
  {
    title: "Le concert choral a rempli l'église",
    journal: "Le Progrès",
    date: new Date("2014-10-21"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2014/14-10-21_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 21 Octobre 2014 : Le concert choral a rempli l'église",
    lastPressReview: false,
  },
  {
    title: "Le Chœur du Bon Pays prépare les concerts de la nouvelle saison",
    journal: "Le Progrès",
    date: new Date("2014-9-14"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2014/14-09-14_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 14 Septembre 2014 : Le Chœur du Bon Pays prépare les concerts de la nouvelle saison",
    lastPressReview: false,
  },
  {
    title: "Chœur du Bon Pays",
    journal: "Le Journal de Saône et Loire",
    date: new Date("2014-8-30"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2014/14-08-30_JSL-min.jpg",
    thumbnailDescription: "Revue de presse du 30 Août 2014 : Chœur du Bon Pays",
    lastPressReview: false,
  },
  {
    title: "Journée du souvenir du 30 Juillet 1944",
    journal: "Le Progrès",
    date: new Date("2014-7-26"),
    city: "Cuisia",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2014/14-07-26_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 26 Juillet 2014 : Journée du souvenir du 30 Juillet 1944",
    lastPressReview: false,
  },
  {
    title:
      "Le Chœur du Bon Pays redémarre les répétitions avec un nouveau chef",
    journal: "Le Progrès",
    date: new Date("2013-8-30"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2013/13-08-30_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 30 Août 2013 : Le Chœur du Bon Pays redémarre les répétitions avec un nouveau chef",
    lastPressReview: false,
  },
  {
    title: "Le Bon Pays redémarre fait sa rentrée",
    journal: "Le Journal de Saône et Loire",
    date: new Date("2013-8-30"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2013/13-08-30_JSL-min.jpg",
    thumbnailDescription:
      "Revue de presse du 30 Août 2013 : Le Bon Pays redémarre fait sa rentrée",
    lastPressReview: false,
  },
  {
    title: "Chœur du Bon Pays : changement de direction",
    journal: "La Voix du Jura",
    date: new Date("2013-8-29"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2013/13-08-29_La_Voix_du_Jura-min.jpg",
    thumbnailDescription:
      "Revue de presse du 29 Août 2013 : Chœur du Bon Pays : changement de direction",
    lastPressReview: false,
  },
  {
    title: "Deux chorales pour un concert",
    journal: "Le Progrès",
    date: new Date("2013-6-3"),
    city: "Mesnay",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2013/13-06-03_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 3 Juin 2013 : Deux chorales pour un concert",
    lastPressReview: false,
  },
  {
    title: "Trois choeurs d'or pour l'autisme",
    journal: "La Voix du Jura",
    date: new Date("2013-5-9"),
    city: "Dompierre-Sur-Mont",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2013/13-05-09_La_Voix_du_Jura-min.jpg",
    thumbnailDescription:
      "Revue de presse du 9 Mai 2013 : Trois choeurs d'or pour l'autisme",
    lastPressReview: false,
  },
  {
    title: "Des choeurs d'or pour lutter contre l'autisme",
    journal: "Le Progrès",
    date: new Date("2013-5-7"),
    city: "Dompierre-Sur-Mont",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2013/13-05-07_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 7 Mai 2013 : Des choeurs d'or pour lutter contre l'autisme",
    lastPressReview: false,
  },
  {
    title: "Concert de chorales",
    journal: "Le Progrès",
    date: new Date("2013-5-4"),
    city: "Dompierre-Sur-Mont",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2013/13-05-04_Le_Progres-min.jpg",
    thumbnailDescription: "Revue de presse du 4 Mai 2013 : Concert de chorales",
    lastPressReview: false,
  },
  {
    title: "Trois chorales pour un foyer d'autistes",
    journal: "Le Progrès",
    date: new Date("2013-5-3"),
    city: "Dompierre-Sur-Mont",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2013/13-05-03_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 3 Mai 2013 : Trois chorales pour un foyer d'autistes",
    lastPressReview: false,
  },
  {
    title: "Trois chorales pour une bonne cause",
    journal: "La Voix du Jura",
    date: new Date("2013-5-2"),
    city: "Dompierre-Sur-Mont",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2013/13-05-02_La_Voix_du_Jura-min.jpg",
    thumbnailDescription:
      "Revue de presse du 2 Mai 2013 : Trois chorales pour une bonne cause",
    lastPressReview: false,
  },
  {
    title: "Un chèque de 1000 euros pour la maison de retraite de Saint-Amour",
    journal: "Le Progrès",
    date: new Date("2013-3-20"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2013/13-03-20_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 20 Mars 2013 : Un chèque de 1000 euros pour la maison de retraite de Saint-Amour",
    lastPressReview: false,
  },
  {
    title: "Le secret avait été bien gardé, la surprise a été totale",
    journal: "Le Progrès",
    date: new Date("2013-2-13"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2013/13-02-13_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 13 Février 2013 : Le secret avait été bien gardé, la surprise a été totale",
    lastPressReview: false,
  },
  {
    title: "A Bian, les animations se suivent",
    journal: "Le Progrès",
    date: new Date("2013-1-26"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2013/13-01-26_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 26 Janvier 2013 : A Bian, les animations se suivent",
    lastPressReview: false,
  },
  {
    title: "Avec le Chœur d'hommes du Bon Pays",
    journal: "Le Progrès",
    date: new Date("2013-1-13"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2013/13-01-13_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 13 Janvier 2013 : Avec le Chœur d'hommes du Bon Pays",
    lastPressReview: false,
  },
  {
    title: "Deux chorales en concert pour une première en église",
    journal: "Le Progrès",
    date: new Date("2012-10-17"),
    city: "Supt",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2012/12-10-17_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 17 Octobre 2012 : Deux chorales en concert pour une première en église",
    lastPressReview: false,
  },
  {
    title: "Les villageois ont fêté leur saint patron",
    journal: "Le Progrès",
    date: new Date("2012-9-22"),
    city: "Cressia",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2012/12-09-22_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 22 Septembre 2012 : Les villageois ont fêté leur saint patron",
    lastPressReview: false,
  },
  {
    title: "Un week-end de Saint-Maurice dignement fêté",
    journal: "La Voix du Jura",
    date: new Date("2012-9-22"),
    city: "Cressia",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2012/12-09-22_La_Voix_du_Jura-min.jpg",
    thumbnailDescription:
      "Revue de presse du 22 Septembre 2012 : Un week-end de Saint-Maurice dignement fêté",
    lastPressReview: false,
  },
  {
    title: "C'est la rentrée pour le Chœur du Bon Pays",
    journal: "La Voix du Jura",
    date: new Date("2012-8-16"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2012/12-08-16_La_Voix_du_Jura-min.jpg",
    thumbnailDescription:
      "Revue de presse du 16 Août 2012 : C'est la rentrée pour le Chœur du Bon Pays",
    lastPressReview: false,
  },
  {
    title: "Le Chœur du Bon Pays reprend du service",
    journal: "Le Progrès",
    date: new Date("2012-8-12"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2012/12-08-12_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 12 Août 2012 : Le Chœur du Bon Pays reprend du service",
    lastPressReview: false,
  },
  {
    title: "Les chorales chantent pour récolter des fonds de soutien",
    journal: "La Voix du Jura",
    date: new Date("2012-6-7"),
    city: "Reithouse",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2012/12-06-07_La_Voix_du_Jura-min.jpg",
    thumbnailDescription:
      "Revue de presse du 7 Juin 2012 : Les chorales chantent pour récolter des fonds de soutien",
    lastPressReview: false,
  },
  {
    title: "Un concert de trois chorales a rempli la salle des fêtes",
    journal: "Le Progrès",
    date: new Date("2012-6-5"),
    city: "Reithouse",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2012/12-06-05_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 5 Juin 2012 : Un concert de trois chorales a rempli la salle des fêtes",
    lastPressReview: false,
  },
  {
    title: "Concert de chorales le 1er Juin",
    journal: "Le Progrès",
    date: new Date("2012-5-30"),
    city: "Reithouse",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2012/12-05-30_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 30 Mai 2012 : Concert de chorales le 1er Juin",
    lastPressReview: false,
  },
  {
    title: "Les deux choeurs d'hommes ont rempli l'église",
    journal: "Le Progrès",
    date: new Date("2012-5-8"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2012/12-05-08_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 8 Mai 2012 : Les deux choeurs d'hommes ont rempli l'église",
    lastPressReview: false,
  },
  {
    title: "Concert à l'église",
    journal: "Le Journal de Saône et Loire",
    date: new Date("2012-5-7"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2012/12-05-07_JSL-min.jpg",
    thumbnailDescription: "Revue de presse du 7 Mai 2012 : Concert à l'église",
    lastPressReview: false,
  },
  {
    title: "Deux choeurs d'hommes réunis pour un premier concert à Cousance",
    journal: "Le Progrès",
    date: new Date("2012-5-4"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2012/12-05-04_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 4 Mai 2012 : Deux choeurs d'hommes réunis pour un premier concert à Cousance",
    lastPressReview: false,
  },
  {
    title:
      "Le Chœur du Bon Pays reçoit Vénérabilis samedi - C'est son homologue de Macornay",
    journal: "La Voix du Jura",
    date: new Date("2012-5-3"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2012/12-05-03_La_Voix_du_Jura-min.jpg",
    thumbnailDescription:
      "Revue de presse du 3 Mai 2012 : Le Chœur du Bon Pays reçoit Vénérabilis samedi - C'est son homologue de Macornay",
    lastPressReview: false,
  },
  {
    title: "Deux choeurs unissent leurs voix",
    journal: "La Voix du Jura",
    date: new Date("2012-5-3"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2012/12-05-03_La_Voix_du_Jura_(2)-min.jpg",
    thumbnailDescription:
      "Revue de presse du 3 Mai 2012 : Deux choeurs unissent leurs voix",
    lastPressReview: false,
  },
  {
    title: "Premier concert du Chœur du Bon Pays le 5 mai",
    journal: "Le Journal de Saône et Loire",
    date: new Date("2012-4-25"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2012/12-04-25_JSL-min.jpg",
    thumbnailDescription:
      "Revue de presse du 25 Avril 2012 : Premier concert du Chœur du Bon Pays le 5 mai",
    lastPressReview: false,
  },
  {
    title: "Le Chœur du Bon Pays invite Vénérabilis",
    journal: "Le Progrès",
    date: new Date("2012-4-20"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2012/12-04-20_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 20 Avril 2012 : Le Chœur du Bon Pays invite Vénérabilis",
    lastPressReview: false,
  },
  {
    title: "Une église bondée pour un concert solidaire",
    journal: "Le Progrès",
    date: new Date("2012-4-2"),
    city: "Montain",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2012/12-04-02_Le_Progres-min.jpg",
    thumbnailDescription:
      "Revue de presse du 2 Avril 2012 : Une église bondée pour un concert solidaire",
    lastPressReview: false,
  },
  {
    title: "Un choeur et du coeur au Carcom",
    journal: "Le Progrès",
    date: new Date("2011-11-28"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2011/11-11-28_Le_Progres.jpg",
    thumbnailDescription:
      "Revue de presse du 28 Novembre 2011 : Un choeur et du coeur au Carcom",
    lastPressReview: false,
  },
  {
    title: "Le Jura compte un troisième choeur d'hommes",
    journal: "Le Progrès",
    date: new Date("2011-9-27"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2011/11-09-27_Le_Progres.jpg",
    thumbnailDescription:
      "Revue de presse du 27 Septembre 2011 : Le Jura compte un troisième choeur d'hommes",
    lastPressReview: false,
  },
  {
    title: "Le Bon Pays cherche des voix",
    journal: "La Voix du Jura",
    date: new Date("2011-9-22"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2011/11-09-22_La_Voix_du_Jura.jpg",
    thumbnailDescription:
      "Revue de presse du 22 Septembre 2011 : Le Bon Pays cherche des voix",
    lastPressReview: false,
  },
  {
    title: "Ils reprennent de la voix de bon 'choeur'",
    journal: "Le Progrès",
    date: new Date("2011-9-4"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2011/11-09-04_Le_Progres.jpg",
    thumbnailDescription:
      "Revue de presse du 4 Septembre 2011 : Ils reprennent de la voix de bon 'choeur'",
    lastPressReview: false,
  },
  {
    title: "Du nouveau pour le Souvenir français",
    journal: "Le Progrès",
    date: new Date("2011-7-26"),
    city: "Augea",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2011/11-07-26_Le_Progres.jpg",
    thumbnailDescription:
      "Revue de presse du 26 Juillet 2011 : Du nouveau pour le Souvenir français",
    lastPressReview: false,
  },
  {
    title: "Crescendo a ravi le public",
    journal: "Le Progrès",
    date: new Date("2011-6-21"),
    city: "Sirod",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2011/11-06-21_Le_Progres.jpg",
    thumbnailDescription:
      "Revue de presse du 21 Juin 2011 : Crescendo a ravi le public",
    lastPressReview: false,
  },
  {
    title: "Le Chœur des hommes du Bon Pays attire 250 personnes",
    journal: "La Voix du Jura",
    date: new Date("2011-6-16"),
    city: "Gizia",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2011/11-06-16_La_Voix_du_Jura.jpg",
    thumbnailDescription:
      "Revue de presse du 16 Juin 2011 : Le Chœur des hommes du Bon Pays attire 250 personnes",
    lastPressReview: false,
  },
  {
    title: "Baptême réussi pour le Chœur des hommes du Bon Pays",
    journal: "Le Progrès",
    date: new Date("2011-6-7"),
    city: "Gizia",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2011/11-06-07_Le_Progres.jpg",
    thumbnailDescription:
      "Revue de presse du 7 Juin 2011 : Baptême réussi pour le Chœur des hommes du Bon Pays",
    lastPressReview: false,
  },
  {
    title: "Premier concert pour le Chœur du Bon Pays vendredi à l'église",
    journal: "Le Progrès",
    date: new Date("2011-6-1"),
    city: "Gizia",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2011/11-06-01_Le_Progres.jpg",
    thumbnailDescription:
      "Revue de presse du 1 Juin 2011 : Premier concert pour le Chœur du Bon Pays vendredi à l'église",
    lastPressReview: false,
  },
  {
    title: "Le Chœur d'hommes du Bon Pays pour une 1ère",
    journal: "L'indépendant",
    date: new Date("2011-5-27"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2011/11-05-27_L_Independant.jpg",
    thumbnailDescription:
      "Revue de presse du 27 Mai 2011 : Le Chœur d'hommes du Bon Pays pour une 1ère",
    lastPressReview: false,
  },
  {
    title: "Le Chœur du Bon Pays recherche des chanteurs",
    journal: "La Voix du Jura",
    date: new Date("2011-1-27"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2011/11-01-27_La_Voix_du_Jura.jpg",
    thumbnailDescription:
      "Revue de presse du 27 Janvier 2011 : Le Chœur du Bon Pays recherche des chanteurs",
    lastPressReview: false,
  },
  {
    title: "Le Chœur du Bon Pays",
    journal: "Le Progrès",
    date: new Date("2011-1-20"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2011/11-01-20_Le_progres.jpg",
    thumbnailDescription:
      "Revue de presse du 20 Janvier 2011 : Le Chœur du Bon Pays",
    lastPressReview: false,
  },
  {
    title: "Mâles, au choeur !",
    journal: "Le Progrès",
    date: new Date("2010-9-14"),
    city: "Cousance",
    thumbnail:
      "/Users/matthieu/Code/Web/siteChorale/Revue_de_presse/2010/10-09-14_Le_progres.jpg",
    thumbnailDescription:
      "Revue de presse du 14 Septembre 2010 : Mâles, au choeur !",
    lastPressReview: false,
  },
];

async function uploadPressReview(pressReview) {
  // Dynamically import node-fetch
  const fetch = (await import("node-fetch")).default;

  const formData = new FormData();

  // Use path module to resolve file paths
  const thumbnailFilePath = path.resolve(pressReview.thumbnail);
  const thumbnailFileExtension = path.extname(pressReview.thumbnail);

  // Ensure files exist before creating read streams
  if (!fs.existsSync(thumbnailFilePath)) {
    console.error(`Thumbnail file does not exist: ${thumbnailFilePath}`);
    return;
  }
  //  else {
  //   console.error(`Thumbnail file exists: ${thumbnailFilePath}`);
  // }

  formData.append("thumbnailFromFront", fs.createReadStream(thumbnailFilePath));
  formData.append("title", pressReview.title);
  formData.append("journal", pressReview.journal);
  formData.append("city", pressReview.city);
  formData.append("thumbnailDescription", pressReview.thumbnailDescription);
  formData.append("pressReviewDate", pressReview.date.toISOString());
  formData.append("token", "iG3PywQUOeAX-fslH9LqhZwg83No3yl_");
  formData.append("lastPressReview", pressReview.lastPressReview.toString());
  formData.append("thumbnailExtension", thumbnailFileExtension);

  // console.log("formData: ", formData);

  try {
    const response = await fetch(`${BACKEND_ADDRESS}/pressReviews/upload`, {
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

async function uploadAllPressReviews() {
  for (const pressReview of pressReviews) {
    await uploadPressReview(pressReview);
  }
}

uploadAllPressReviews();
