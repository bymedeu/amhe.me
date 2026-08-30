import { githubRepositoryPath, githubRepositoryUrl } from "../../site.config.js";

const academic = (project) => ({
  type: "academic",
  repository: { access: "school-restricted", url: null },
  ...project,
});

export const projects = [
  {
    id: "mystarceiling",
    name: "MyStarCeiling",
    description: {
      en: "A planned tool for exploring the night sky from anywhere and at any time.",
      fr: "Un outil en préparation pour explorer le ciel nocturne depuis n’importe quel lieu et à n’importe quelle date.",
    },
    context: {
      en: "A personal astronomy project currently in its design phase.",
      fr: "Un projet personnel d’astronomie actuellement en phase de conception.",
    },
    implementation: {
      en: ["Location- and time-based night-sky exploration", "Project architecture and data sources are still being designed"],
      fr: ["Exploration du ciel selon le lieu et la date", "L’architecture et les sources de données sont encore en cours de conception"],
    },
    type: "personal", status: "planned", duration: null, teamSize: 1,
    repository: { access: "private", url: githubRepositoryUrl("mystarceiling") },
    linkedinUrl: null,
    tags: ["cpp", "research", "mathematics", "web"], art: "stars",
  },
  {
    id: "aurora",
    name: "Aurora",
    description: {
      en: "Rebuilds machine-learning components from numerical foundations through autograd, attention, and transformers, with each milestone documented and tested.",
      fr: "Reconstruit les composants du machine learning, des fondations numériques jusqu’à l’autograd, l’attention et les transformers, avec chaque étape documentée et testée.",
    },
    context: {
      en: "A personal research project used to study the mathematics, implementation choices, and failure modes behind modern ML frameworks.",
      fr: "Un projet de recherche personnel consacré aux mathématiques, aux choix d’implémentation et aux modes de défaillance des frameworks de ML modernes.",
    },
    implementation: {
      en: ["Mathematical notes and milestone reports", "From-scratch implementations of core ML mechanisms", "Tests and comparisons with production-grade tools"],
      fr: ["Notes mathématiques et rapports d’étape", "Implémentations depuis zéro des mécanismes fondamentaux du ML", "Tests et comparaisons avec les outils de production"],
    },
    type: "personal", status: "active", duration: null, teamSize: 1,
    repository: { access: "public", url: githubRepositoryUrl("aurora") },
    linkedinUrl: null,
    tags: ["ai", "research", "python", "ml", "mathematics"], art: "aurora",
  },
  academic({
    id: "word-search-ocr",
    name: { en: "OCR Word-Search Solver", fr: "Solveur OCR de mots mêlés" },
    description: {
      en: "Turns a photographed word-search puzzle into a reconstructed character grid, then finds its words automatically in C.",
      fr: "Transforme la photographie d’une grille de mots mêlés en grille de caractères reconstruite, puis recherche automatiquement les mots en C.",
    },
    context: {
      en: "Second-year capstone project completed by a team of four.",
      fr: "Projet de fin de deuxième année réalisé en équipe de quatre.",
    },
    implementation: {
      en: ["Image-to-grid optical character recognition pipeline", "Grid reconstruction and automated word-search resolution", "Implemented in C as a six-month team project"],
      fr: ["Chaîne de reconnaissance optique de l’image vers la grille", "Reconstruction de la grille et résolution automatique", "Implémentation en C sur six mois en équipe"],
    },
    contribution: {
      en: "Led the four-person team and took primary responsibility for the image-preprocessing pipeline.",
      fr: "Pilotage de l’équipe de quatre personnes et responsabilité principale de la chaîne de prétraitement d’image.",
    },
    duration: { en: "6 months", fr: "6 mois" }, teamSize: 4, linkedinUrl: null,
    repository: { access: "school-restricted", url: githubRepositoryUrl("epita-OCR-Word-Search-Solver") },
    tags: ["c", "vision", "algorithms", "teamwork"], art: "vision",
  }),
  academic({
    id: "multiplayer-game",
    name: "Castle of Demise",
    description: {
      en: "Delivers first-person multiplayer gameplay in C# and Godot, combining a pixel-art visual direction with networked game systems.",
      fr: "Propose un gameplay multijoueur en vue subjective avec C# et Godot, associant une direction pixel art à des systèmes de jeu en réseau.",
    },
    context: {
      en: "A year-long team project completed by five students.",
      fr: "Un projet d’un an réalisé par une équipe de cinq étudiants.",
    },
    implementation: {
      en: ["First-person gameplay implemented with Godot", "Game systems written in C#", "Multiplayer development in a five-person team"],
      fr: ["Gameplay en vue subjective implémenté avec Godot", "Systèmes de jeu écrits en C#", "Développement multijoueur en équipe de cinq"],
    },
    contribution: {
      en: "Contributed to gameplay and game-system implementation within a five-person development team.",
      fr: "Contribution à l’implémentation du gameplay et des systèmes de jeu au sein d’une équipe de cinq personnes.",
    },
    duration: { en: "1 year", fr: "1 an" }, teamSize: 5, linkedinUrl: null,
    tags: ["csharp", "godot", "game", "teamwork"], art: "game",
  }),
  academic({
    id: "c-piscine",
    name: { en: "C / Unix Piscine", fr: "Piscine C / Unix" },
    description: {
      en: "An intensive two-week workshop covering C, Unix tooling, memory, data structures, and low-level programming through daily exercises and rushes.",
      fr: "Un atelier intensif de deux semaines couvrant C, Unix, mémoire, structures de données et programmation bas niveau par des exercices quotidiens et des rushes.",
    },
    context: {
      en: "Two weeks, Monday to Saturday, from 08:00 to midnight. Individual exercises are grouped here; rushes are listed separately.",
      fr: "Deux semaines, du lundi au samedi, de 8 h à minuit. Les exercices individuels sont regroupés ici ; les rushes sont présentés séparément.",
    },
    implementation: {
      en: ["Manual memory management and pointer-based data structures", "Unix compilation, debugging, and command-line workflows", "Daily constrained programming exercises"],
      fr: ["Gestion manuelle de la mémoire et structures de données à pointeurs", "Compilation, débogage et outils Unix", "Exercices quotidiens sous contraintes"],
    },
    duration: { en: "2 intensive weeks", fr: "2 semaines intensives" }, teamSize: null, linkedinUrl: null,
    repository: { access: "school-restricted", url: githubRepositoryUrl("epita-c-piscine") },
    tags: ["c", "systems", "unix", "workshop"], art: "terminal",
  }),
  academic({
    id: "tinyprintf", name: "TinyPrintf",
    description: {
      en: "A compact C implementation of formatted output, including variadic arguments, strings, characters, and integer conversion across several bases.",
      fr: "Une implémentation compacte de l’affichage formaté en C, avec arguments variadiques, chaînes, caractères et conversion d’entiers dans plusieurs bases.",
    },
    context: {
      en: "A standalone C project completed alongside the intensive C workshop.",
      fr: "Un projet C autonome réalisé en parallèle de la piscine intensive de C.",
    },
    implementation: {
      en: ["Variadic format-string processing", "Signed, unsigned, hexadecimal, and octal conversion", "Criterion-based automated tests"],
      fr: ["Traitement variadique des chaînes de format", "Conversion signée, non signée, hexadécimale et octale", "Tests automatisés avec Criterion"],
    },
    duration: null, teamSize: 1, linkedinUrl: null,
    repository: { access: "school-restricted", url: githubRepositoryPath("epita-c-piscine", "projects/tinyprintf") },
    tags: ["c", "systems", "testing"], art: "terminal",
  }),
  academic({
    id: "evalexpr", name: "EvalExpr",
    description: {
      en: "A command-line arithmetic-expression evaluator supporting conventional notation and reverse Polish notation.",
      fr: "Un évaluateur d’expressions arithmétiques en ligne de commande, compatible avec la notation classique et la notation polonaise inversée.",
    },
    context: {
      en: "A standalone parsing project completed alongside the intensive C workshop.",
      fr: "Un projet autonome d’analyse syntaxique réalisé en parallèle de la piscine intensive de C.",
    },
    implementation: {
      en: ["Expression lexer and token model", "Shunting-yard conversion to reverse Polish notation", "Stack-based RPN evaluation"],
      fr: ["Lexer d’expressions et modèle de jetons", "Conversion en notation polonaise inversée par l’algorithme shunting-yard", "Évaluation de la RPN au moyen d’une pile"],
    },
    duration: null, teamSize: 1, linkedinUrl: null,
    repository: { access: "school-restricted", url: githubRepositoryPath("epita-c-piscine", "projects/evalexpr") },
    tags: ["c", "algorithms", "parsing"], art: "compiler",
  }),
  academic({
    id: "minimake", name: "MiniMake",
    description: { en: "Reimplements the essential Make workflow in C: parse rules and variables, resolve the dependency graph, and execute only the required commands.", fr: "Réimplémente en C le fonctionnement essentiel de Make : analyser règles et variables, résoudre le graphe de dépendances et n’exécuter que les commandes nécessaires." },
    context: { en: "A systems-programming mini-project written in C.", fr: "Un mini-projet de programmation système écrit en C." },
    implementation: { en: ["Makefile-style parsing", "Dependency graph resolution", "Incremental command execution"], fr: ["Analyse d’une syntaxe de type Makefile", "Résolution du graphe de dépendances", "Exécution incrémentale des commandes"] },
    repository: { access: "school-restricted", url: githubRepositoryUrl("epita-minimake") },
    duration: { en: "2 weeks", fr: "2 semaines" }, teamSize: 1, linkedinUrl: null, tags: ["c", "systems", "parsing", "algorithms"], art: "build",
  }),
  academic({
    id: "memory-allocator", name: { en: "Memory Allocator", fr: "Allocateur mémoire" },
    description: { en: "A custom dynamic-memory allocator exploring pages, blocks, alignment, allocation strategies, and recycling.", fr: "Un allocateur de mémoire dynamique explorant pages, blocs, alignement, stratégies d’allocation et recyclage." },
    context: { en: "A low-level C systems mini-project.", fr: "Un mini-projet système bas niveau en C." },
    implementation: { en: ["Block metadata and alignment", "Allocation and release strategies", "Memory reuse and fragmentation concerns"], fr: ["Métadonnées de blocs et alignement", "Stratégies d’allocation et de libération", "Réutilisation et fragmentation de la mémoire"] },
    repository: { access: "school-restricted", url: githubRepositoryUrl("epita-memory-allocator") },
    duration: { en: "1 week", fr: "1 semaine" }, teamSize: 1, linkedinUrl: null, tags: ["c", "systems", "unix", "performance"], art: "memory",
  }),
  academic({
    id: "http-server", name: { en: "HTTP Server", fr: "Serveur HTTP" },
    description: { en: "A compact HTTP server implemented in C, covering sockets, requests, responses, configuration, and concurrency.", fr: "Un serveur HTTP compact implémenté en C, couvrant sockets, requêtes, réponses, configuration et concurrence." },
    context: { en: "A networking and systems mini-project.", fr: "Un mini-projet de réseau et de programmation système." },
    implementation: { en: ["TCP socket lifecycle", "HTTP request parsing and response generation", "Configuration and concurrent connection handling"], fr: ["Cycle de vie des sockets TCP", "Analyse des requêtes HTTP et génération des réponses", "Configuration et gestion des connexions concurrentes"] },
    repository: { access: "school-restricted", url: githubRepositoryUrl("epita-http-server") },
    duration: { en: "1 week", fr: "1 semaine" }, teamSize: 1, linkedinUrl: null, tags: ["c", "systems", "networking", "web"], art: "network",
  }),
  academic({
    id: "21sh", name: "21sh",
    description: {
      en: "A focused shell-development project exploring process pipelines, redirections, and the foundations later combined in a larger POSIX shell.",
      fr: "Un projet ciblé de développement d’un shell, consacré aux pipelines, aux redirections et aux fondations ensuite réunies dans un shell POSIX plus complet.",
    },
    context: {
      en: "A preparatory systems project preceding 42sh.",
      fr: "Un projet système préparatoire réalisé avant 42sh.",
    },
    implementation: {
      en: ["Unix process creation and execution", "Pipe-based inter-process communication", "Input and output redirections"],
      fr: ["Création et exécution de processus Unix", "Communication interprocessus au moyen de pipes", "Redirections des entrées et sorties"],
    },
    duration: null, teamSize: null, linkedinUrl: null,
    repository: { access: "school-restricted", url: githubRepositoryUrl("epita-21sh") },
    tags: ["c", "systems", "unix"], art: "terminal",
  }),
  academic({
    id: "42sh", name: "42sh",
    description: { en: "Implements a POSIX-oriented shell in C, from tokenization and recursive parsing to expansions, pipelines, redirections, control flow, and built-ins.", fr: "Implémente en C un shell orienté POSIX, de la tokenisation et l’analyse récursive jusqu’aux expansions, pipelines, redirections, structures de contrôle et commandes internes." },
    context: { en: "A team systems project focused on POSIX shell behavior and robust testing.", fr: "Un projet système en équipe centré sur le comportement d’un shell POSIX et des tests robustes." },
    implementation: { en: ["Layered lexer, parser, and abstract syntax tree", "Process execution, pipes, redirections, and built-ins", "Unit and functional test suites"], fr: ["Lexer, parseur et arbre syntaxique en couches", "Exécution des processus, pipes, redirections et built-ins", "Tests unitaires et fonctionnels"] },
    contribution: {
      en: "Led the four-person team, implemented the lexer, and integrated its token stream with the recursive parsing pipeline.",
      fr: "Pilotage de l’équipe de quatre personnes, implémentation du lexer et intégration de son flux de jetons à la chaîne d’analyse récursive.",
    },
    duration: { en: "1 month", fr: "1 mois" }, teamSize: 4, linkedinUrl: null,
    repository: { access: "school-restricted", url: githubRepositoryUrl("epita-42sh") },
    monogram: ">_",
    tags: ["c", "systems", "unix", "parsing", "teamwork"], art: "terminal",
  }),
  academic({
    id: "cpp-piscine", name: { en: "C++ Piscine", fr: "Piscine C++" },
    description: { en: "An intensive one-week workshop on modern C++, generic programming, the STL, memory ownership, and design patterns.", fr: "Un atelier intensif d’une semaine sur le C++ moderne, la programmation générique, la STL, la gestion de la mémoire et les patrons de conception." },
    context: { en: "One week, Monday to Saturday, from 08:00 to midnight. Exercises are grouped as a single workshop entry.", fr: "Une semaine, du lundi au samedi, de 8 h à minuit. Les exercices sont regroupés en une seule entrée." },
    implementation: { en: ["Templates, concepts, iterators, and containers", "Ownership and exception safety", "Design patterns and modern C++ tooling"], fr: ["Templates, concepts, itérateurs et conteneurs", "Propriété mémoire et sécurité des exceptions", "Patrons de conception et outils C++ modernes"] },
    duration: { en: "1 intensive week", fr: "1 semaine intensive" }, teamSize: null, linkedinUrl: null, tags: ["cpp", "systems", "workshop"], art: "compiler",
    repository: { access: "school-restricted", url: githubRepositoryUrl("epita-cpp-piscine") },
  }),
  academic({
    id: "image-library", name: { en: "Generic Image Library", fr: "Bibliothèque d’images générique" },
    description: { en: "Uses C++20 concepts to expose one generic image interface across reusable algorithms, including morphological erosion, with correctness tests and benchmarks.", fr: "Utilise les concepts de C++20 pour proposer une interface d’image unique à des algorithmes réutilisables, dont l’érosion morphologique, avec tests de correction et benchmarks." },
    context: { en: "An academic modern-C++ project.", fr: "Un projet académique de C++ moderne." },
    implementation: { en: ["Concept-constrained generic image interface", "Reusable image algorithms including erosion", "Correctness tests and performance benchmarks"], fr: ["Interface d’image générique contrainte par concepts", "Algorithmes réutilisables dont l’érosion", "Tests de correction et benchmarks"] },
    contribution: {
      en: "Led the four-person team, defined the concept-constrained architecture, and implemented most of the generic library.",
      fr: "Pilotage de l’équipe de quatre personnes, définition de l’architecture contrainte par concepts et implémentation de la majeure partie de la bibliothèque générique.",
    },
    duration: { en: "3 weeks", fr: "3 semaines" }, teamSize: 4, linkedinUrl: null,
    repository: { access: "school-restricted", url: githubRepositoryUrl("epita-generic-image-library") },
    tags: ["cpp", "vision", "algorithms", "testing", "performance"], art: "pixels",
  }),
  academic({
    id: "tiger", name: { en: "Tiger Compiler", fr: "Compilateur Tiger" },
    description: { en: "Extends a supplied C++ compiler codebase across the full pipeline: parsing, AST transformations, binding, type checking, optimization, and LLVM translation.", fr: "Étend une base de compilateur C++ fournie sur toute la chaîne : analyse, transformations d’AST, liaison, typage, optimisation et traduction LLVM." },
    context: { en: "A large C++ compiler project built on a supplied codebase.", fr: "Un projet de compilateur C++ construit sur une base de code fournie." },
    implementation: { en: ["Lexer, parser, and typed abstract syntax tree", "Binding, desugaring, inlining, and type checking", "LLVM translation and runtime components"], fr: ["Lexer, parseur et arbre syntaxique typé", "Liaison, désugarisation, inlining et vérification des types", "Traduction LLVM et composants d’exécution"] },
    contribution: {
      en: "Led the four-person team and implemented the largest share of the compiler passes and their integration.",
      fr: "Pilotage de l’équipe de quatre personnes et implémentation de la plus grande part des passes du compilateur et de leur intégration.",
    },
    duration: { en: "2 months", fr: "2 mois" }, teamSize: 4, linkedinUrl: null,
    repository: { access: "school-restricted", url: githubRepositoryUrl("epita-tiger") },
    tags: ["cpp", "compilers", "parsing", "systems", "teamwork"], art: "compiler",
  }),
  academic({
    id: "java-piscine", name: { en: "Java Piscine", fr: "Piscine Java" },
    description: { en: "An intensive one-week workshop covering Java, object-oriented design, streams, concurrency, testing, and common design patterns.", fr: "Un atelier intensif d’une semaine couvrant Java, conception objet, streams, concurrence, tests et patrons de conception courants." },
    context: { en: "One week, Monday to Saturday, from 08:00 to midnight. Exercises are grouped here; the rush is separate.", fr: "Une semaine, du lundi au samedi, de 8 h à minuit. Les exercices sont regroupés ici ; le rush est séparé." },
    implementation: { en: ["Object-oriented modeling and collections", "Streams, threading, and synchronization", "Testing, logging, and design patterns"], fr: ["Modélisation objet et collections", "Streams, threads et synchronisation", "Tests, journalisation et patrons de conception"] },
    duration: { en: "1 intensive week", fr: "1 semaine intensive" }, teamSize: null, linkedinUrl: null, tags: ["java", "systems", "workshop"], art: "service",
    repository: { access: "school-restricted", url: githubRepositoryUrl("epita-java-piscine") },
  }),
  academic({
    id: "rush-creeps", name: "Rush Creeps",
    description: { en: "A Java strategy client that manages units, buildings, resources, and commands against a provided game server.", fr: "Un client de stratégie en Java qui gère unités, bâtiments, ressources et commandes face à un serveur de jeu fourni." },
    context: { en: "A short Java rush project, separate from the workshop exercises.", fr: "Un court projet rush en Java, distinct des exercices de la piscine." },
    implementation: { en: ["HTTP communication with the provided simulation server", "Domain model for units and buildings", "Automated resource and action strategy"], fr: ["Communication HTTP avec le serveur de simulation fourni", "Modèle métier pour unités et bâtiments", "Stratégie automatisée de ressources et d’actions"] },
    duration: { en: "2 days", fr: "2 jours" }, teamSize: 1, linkedinUrl: null,
    repository: { access: "school-restricted", url: githubRepositoryPath("epita-java-piscine", "projects/creeps") },
    tags: ["java", "algorithms", "game"], art: "game",
  }),
  academic({
    id: "jws", name: "JWS",
    description: { en: "A Java web-services project built with Quarkus, REST APIs, persistence, migrations, and a tested layered architecture.", fr: "Un projet de services web Java construit avec Quarkus, des API REST, de la persistance, des migrations et une architecture en couches testée." },
    context: { en: "An academic backend project developed through multiple services and a larger game API.", fr: "Un projet backend académique développé à travers plusieurs services et une API de jeu plus complète." },
    implementation: { en: ["Quarkus REST resources and JSON contracts", "Hibernate/Panache persistence with database migrations", "Service, repository, converter, and test layers"], fr: ["Ressources REST Quarkus et contrats JSON", "Persistance Hibernate/Panache avec migrations", "Couches service, repository, conversion et tests"] },
    duration: { en: "4 days", fr: "4 jours" }, teamSize: 1, linkedinUrl: null,
    repository: { access: "school-restricted", url: githubRepositoryUrl("epita-jws") },
    tags: ["java", "web", "testing", "database"], art: "service",
  }),
  academic({
    id: "ping", name: { en: "Ping / 42zer", fr: "Ping / 42zer" },
    description: {
      en: "A collaborative music application where several people join a room, build a shared queue, and listen in sync.",
      fr: "Une application musicale collaborative où plusieurs personnes rejoignent un salon, construisent une file d’attente commune et écoutent en synchronisation.",
    },
    context: {
      en: "A one-month full-stack project delivered by a team of five, presented as one product across its backend and frontend.",
      fr: "Un projet full-stack d’un mois livré par une équipe de cinq personnes, présenté comme un produit unique pour son backend et son frontend.",
    },
    implementation: {
      en: ["Quarkus and Java backend with PostgreSQL persistence", "React, TypeScript, and Vite frontend", "REST and WebSocket communication for rooms, chat, queues, search, and synchronized playback"],
      fr: ["Backend Quarkus et Java avec persistance PostgreSQL", "Frontend React, TypeScript et Vite", "Communication REST et WebSocket pour les salons, le chat, les files, la recherche et la lecture synchronisée"],
    },
    contribution: {
      en: "Coordinated the five-person team and built the Java backend architecture supporting rooms, queues, chat, and synchronized playback.",
      fr: "Coordination de l’équipe de cinq personnes et développement de l’architecture backend Java pour les salons, files d’attente, chat et lecture synchronisée.",
    },
    duration: { en: "1 month", fr: "1 mois" }, teamSize: 5, linkedinUrl: null,
    repository: { access: "school-restricted", url: githubRepositoryUrl("epita-ping") },
    tags: ["java", "typescript", "react", "web", "fullstack", "realtime", "database"], art: "network",
  }),
  academic({
    id: "javascript-piscine", name: { en: "JavaScript Piscine", fr: "Piscine JavaScript" },
    description: { en: "An intensive one-week workshop covering modern JavaScript, asynchronous execution, browser APIs, testing, and frontend patterns.", fr: "Un atelier intensif d’une semaine couvrant JavaScript moderne, exécution asynchrone, API navigateur, tests et patrons frontend." },
    context: { en: "One week, Monday to Saturday, from 08:00 to midnight. Exercises are grouped as one workshop entry.", fr: "Une semaine, du lundi au samedi, de 8 h à minuit. Les exercices sont regroupés en une seule entrée." },
    implementation: { en: ["Modern language features and modular code", "Promises, event loops, and asynchronous communication", "DOM interfaces and automated tests"], fr: ["Fonctionnalités modernes du langage et code modulaire", "Promesses, boucle d’événements et communication asynchrone", "Interfaces DOM et tests automatisés"] },
    duration: { en: "1 intensive week", fr: "1 semaine intensive" }, teamSize: null, linkedinUrl: null, tags: ["javascript", "web", "workshop"], art: "language",
    repository: { access: "school-restricted", url: githubRepositoryUrl("epita-javascript-piscine") },
  }),
  academic({
    id: "eplace", name: "Eplace",
    description: { en: "A real-time collaborative pixel-canvas client with rooms, chat, authentication, notifications, and rate-limit handling.", fr: "Un client de canevas pixel collaboratif en temps réel avec salons, chat, authentification, notifications et gestion des limites de requêtes." },
    context: { en: "An academic JavaScript frontend project connected to a specified backend API.", fr: "Un projet frontend JavaScript académique connecté à une API backend spécifiée." },
    implementation: { en: ["Vite-based modular frontend", "Socket.IO real-time canvas and chat updates", "Authentication, room state, notifications, and API rate limits"], fr: ["Frontend modulaire basé sur Vite", "Mises à jour temps réel du canevas et du chat avec Socket.IO", "Authentification, état des salons, notifications et limites API"] },
    duration: { en: "2 days", fr: "2 jours" }, teamSize: 1, linkedinUrl: null,
    repository: { access: "school-restricted", url: githubRepositoryPath("epita-javascript-piscine", "projects/eplace") },
    tags: ["javascript", "web", "realtime"], art: "pixels",
  }),
  academic({
    id: "libzork", name: "LibZork",
    description: { en: "A C++ interactive-fiction engine with branching stories, variables, conditions, actions, and multiple runners.", fr: "Un moteur de fiction interactive en C++ avec histoires à embranchements, variables, conditions, actions et plusieurs modes d’exécution." },
    context: { en: "An academic C++ library and command-line application.", fr: "Une bibliothèque C++ académique accompagnée d’une application en ligne de commande." },
    implementation: { en: ["Graph-based story nodes and choices", "Variable, condition, and action system", "Interactive, smart, choice, and HTML runners"], fr: ["Nœuds et choix d’histoire organisés en graphe", "Système de variables, conditions et actions", "Modes interactif, intelligent, choix et HTML"] },
    duration: { en: "2 days", fr: "2 jours" }, teamSize: 1, linkedinUrl: null,
    repository: { access: "school-restricted", url: githubRepositoryPath("epita-cpp-piscine", "projects/libzork") },
    tags: ["cpp", "algorithms", "game", "parsing"], art: "graph",
  }),
  academic({
    id: "snow-plow", name: { en: "Snow Plow Optimizer", fr: "Optimiseur de chasse-neige" },
    description: { en: "A route-optimization system using OpenStreetMap graphs to assign streets, minimize completion time, calculate costs, and generate maps.", fr: "Un système d’optimisation d’itinéraires utilisant OpenStreetMap pour affecter les rues, réduire le temps total, calculer les coûts et générer des cartes." },
    context: { en: "An operations-research and graph-algorithm project based on Montreal road networks.", fr: "Un projet de recherche opérationnelle et d’algorithmes de graphes fondé sur le réseau routier de Montréal." },
    implementation: { en: ["OpenStreetMap acquisition and graph transformation", "Road assignment, pathfinding, cost, and completion-time optimization", "Interactive Folium visualization and statistics"], fr: ["Acquisition OpenStreetMap et transformation du graphe", "Affectation des rues, recherche de chemins, coûts et optimisation du temps", "Visualisation Folium interactive et statistiques"] },
    contribution: {
      en: "Led the four-person team and wrote roughly 90% of the application, from graph transformation and route optimization to statistics and map generation.",
      fr: "Pilotage de l’équipe de quatre personnes et écriture d’environ 90 % de l’application, de la transformation du graphe et l’optimisation des itinéraires jusqu’aux statistiques et à la génération de cartes.",
    },
    duration: { en: "6 weeks", fr: "6 semaines" }, teamSize: 4, linkedinUrl: null,
    repository: { access: "school-restricted", url: githubRepositoryUrl("epita-ero1") },
    tags: ["python", "algorithms", "graphs", "optimization", "teamwork"], art: "route",
  }),
  academic({
    id: "comments-platform", name: { en: "Comments Platform", fr: "Plateforme de commentaires" },
    description: { en: "A Docker-focused infrastructure exercise built around containerizing, connecting, and observing a small comments platform.", fr: "Un exercice d’infrastructure centré sur Docker, consistant à conteneuriser, connecter et superviser une petite plateforme de commentaires." },
    context: { en: "The application services were provided; my work focused on packaging and operating them as a coherent multi-container environment.", fr: "Les services applicatifs étaient fournis ; mon travail a porté sur leur empaquetage et leur exploitation dans un environnement multi-conteneurs cohérent." },
    implementation: { en: ["Docker images for the provided application services", "Docker Compose networking, dependencies, and service lifecycle", "Redis persistence and Prometheus observability"], fr: ["Images Docker pour les services applicatifs fournis", "Réseau, dépendances et cycle de vie des services avec Docker Compose", "Persistance Redis et observabilité avec Prometheus"] },
    contribution: { en: "Focused on containerization and infrastructure configuration; the provided Go application code was not part of my implementation.", fr: "Travail centré sur la conteneurisation et la configuration de l’infrastructure ; le code applicatif Go fourni ne faisait pas partie de mon implémentation." },
    duration: { en: "Approximately 10 hours over 3 weeks", fr: "Environ 10 heures réparties sur 3 semaines" }, teamSize: 1, linkedinUrl: null,
    repository: { access: "school-restricted", url: githubRepositoryUrl("epita-comments-platform") },
    monogram: "▦", tags: ["systems", "redis", "docker"], art: "containers",
  }),
  {
    id: "cs50-ai", name: "CS50 AI",
    description: { en: "Independent completion of Harvard’s CS50 Introduction to Artificial Intelligence projects, kept outside the EPITA curriculum.", fr: "Réalisation indépendante des projets du cours CS50 Introduction to Artificial Intelligence de Harvard, hors du cursus EPITA." },
    context: { en: "Independent coursework stored alongside academic work for convenience; it is not an EPITA assignment.", fr: "Travail personnel rangé avec les projets académiques par commodité ; il ne fait pas partie du cursus EPITA." },
    implementation: { en: ["Search, logic, probability, and optimization", "Machine learning, neural networks, and computer vision", "Natural-language processing and transformer attention"], fr: ["Recherche, logique, probabilités et optimisation", "Apprentissage automatique, réseaux de neurones et vision", "Traitement du langage et attention des transformers"] },
    type: "independent", status: "completed", duration: { en: "2 months", fr: "2 mois" }, teamSize: 1,
    repository: { access: "private", url: githubRepositoryUrl("cs50-ai") }, linkedinUrl: null,
    tags: ["python", "ai", "ml", "vision", "nlp"], art: "attention",
  },
  {
    id: "leetcode", name: { en: "LeetCode Practice", fr: "Pratique LeetCode" },
    description: {
      en: "A growing collection of algorithm and data-structure solutions, used to practice precise problem solving and compare implementation trade-offs.",
      fr: "Une collection évolutive de solutions d’algorithmique et de structures de données, utilisée pour travailler la résolution rigoureuse et comparer les choix d’implémentation.",
    },
    context: {
      en: "Independent practice outside the EPITA curriculum.",
      fr: "Entraînement personnel hors du cursus EPITA.",
    },
    implementation: {
      en: ["Solutions organized by problem", "Emphasis on data structures and algorithmic complexity", "Public history of iterative practice"],
      fr: ["Solutions organisées par problème", "Accent sur les structures de données et la complexité algorithmique", "Historique public d’une pratique régulière"],
    },
    type: "independent", status: "active", duration: null, teamSize: 1,
    repository: { access: "public", url: githubRepositoryUrl("leetcode-problems") }, linkedinUrl: null,
    tags: ["algorithms", "testing"], art: "graph",
  },
];

export function getProjectName(project, language) {
  return typeof project.name === "string" ? project.name : project.name[language];
}

export function getLocalized(value, language) {
  if (value == null || typeof value === "string") return value;
  return value[language];
}

export function getProjectById(id) {
  return projects.find((project) => project.id === id);
}

export function getAllTags() {
  return [...new Set(projects.flatMap((project) => project.tags))];
}

export const projectLanguageTags = Object.freeze([
  "c",
  "cpp",
  "csharp",
  "java",
  "javascript",
  "typescript",
  "python",
]);

export function isProjectLanguageTag(tag) {
  return projectLanguageTags.includes(tag);
}

export function getTopicTags() {
  return getAllTags().filter((tag) => !isProjectLanguageTag(tag));
}
