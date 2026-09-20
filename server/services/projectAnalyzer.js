function analyzeDependencies(importantFiles) {
  const packageFiles = importantFiles.filter((file) =>
    file.path.endsWith("package.json")
  );

  const dependencies = new Set();
  const devDependencies = new Set();

  for (const file of packageFiles) {
    if (!file.content) continue;

    try {
      const packageJson = JSON.parse(file.content);

      Object.keys(packageJson.dependencies || {}).forEach((dep) =>
        dependencies.add(dep)
      );

      Object.keys(packageJson.devDependencies || {}).forEach((dep) =>
        devDependencies.add(dep)
      );
    } catch (error) {
      console.log(`Could not parse ${file.path}`);
    }
  }

  return {
    dependencies: [...dependencies],
    devDependencies: [...devDependencies],
  };
}

function detectArchitecture(filePaths) {
  const architecture = {
    routes: [],
    controllers: [],
    models: [],
    middleware: [],
    components: [],
    pages: [],
    services: [],
    hooks: [],
    schemas: [],
  };

  for (const filePath of filePaths) {
    const path = filePath.toLowerCase();

    if (path.includes("/routes/")) {
      architecture.routes.push(filePath);
    }

    if (path.includes("/controllers/")) {
      architecture.controllers.push(filePath);
    }

    if (
      path.includes("/models/") ||
      path.includes("/model/")
    ) {
      architecture.models.push(filePath);
    }

    if (path.includes("/middleware/")) {
      architecture.middleware.push(filePath);
    }

    if (path.includes("/components/")) {
      architecture.components.push(filePath);
    }

    if (path.includes("/pages/")) {
      architecture.pages.push(filePath);
    }

    if (path.includes("/services/")) {
      architecture.services.push(filePath);
    }

    if (path.includes("/hooks/")) {
      architecture.hooks.push(filePath);
    }

    if (path.includes("/schemas/")) {
      architecture.schemas.push(filePath);
    }
  }

  return architecture;
}

function detectProjectFlow(filePaths) {
  const flow = [];

  const hasFrontend = filePaths.some((file) => {
    const path = file.toLowerCase();

    return (
      path.includes("/src/") ||
      path.includes("/components/") ||
      path.includes("/pages/")
    );
  });

  const hasRoutes = filePaths.some((file) =>
    file.toLowerCase().includes("/routes/")
  );

  const hasControllers = filePaths.some((file) =>
    file.toLowerCase().includes("/controllers/")
  );

  const hasModels = filePaths.some((file) => {
    const path = file.toLowerCase();

    return (
      path.includes("/model/") ||
      path.includes("/models/")
    );
  });

  const hasDatabase = filePaths.some((file) => {
    const path = file.toLowerCase();

    return (
      path.includes("schema") ||
      path.includes("model") ||
      path.includes("mongoose") ||
      path.includes("mongodb")
    );
  });

  if (hasFrontend) {
    flow.push({
      step: flow.length + 1,
      layer: "Frontend",
      description:
        "The user interacts with the frontend application and starts an operation.",
    });
  }

  if (hasRoutes) {
    flow.push({
      step: flow.length + 1,
      layer: "Routes",
      description:
        "The request reaches the appropriate backend route.",
    });
  }

  if (hasControllers) {
    flow.push({
      step: flow.length + 1,
      layer: "Controller",
      description:
        "The controller handles the request and executes the application logic.",
    });
  }

  if (hasModels) {
    flow.push({
      step: flow.length + 1,
      layer: "Model",
      description:
        "The model manages application data and database operations.",
    });
  }

  if (hasDatabase) {
    flow.push({
      step: flow.length + 1,
      layer: "Database",
      description:
        "The database stores or retrieves the required data.",
    });
  }

  if (flow.length > 0) {
    flow.push({
      step: flow.length + 1,
      layer: "Response",
      description:
        "The result is returned to the frontend and displayed to the user.",
    });
  }

  return flow;
}

/*
  Convert import path into possible repository paths.

  Example:

  "../controllers/authController"

  can point to:

  backend/controllers/authController.js
  backend/controllers/authController.jsx
  backend/controllers/authController/index.js
*/
function resolveImportPath(currentFile, importPath, allFiles) {
  if (!importPath.startsWith(".")) {
    return null;
  }

  const currentParts = currentFile.split("/");
  currentParts.pop();

  const importParts = importPath.split("/");

  for (const part of importParts) {
    if (part === ".") continue;

    if (part === "..") {
      currentParts.pop();
    } else {
      currentParts.push(part);
    }
  }

  const basePath = currentParts.join("/");

  const possiblePaths = [
    basePath,
    `${basePath}.js`,
    `${basePath}.jsx`,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    `${basePath}.json`,
    `${basePath}/index.js`,
    `${basePath}/index.jsx`,
    `${basePath}/index.ts`,
    `${basePath}/index.tsx`,
  ];

  for (const possiblePath of possiblePaths) {
    const match = allFiles.find(
      (file) => file.toLowerCase() === possiblePath.toLowerCase()
    );

    if (match) {
      return match;
    }
  }

  // Fallback: match filename
  const importedName = importPath
    .split("/")
    .pop()
    .toLowerCase();

  const fallback = allFiles.find((file) => {
    const fileName = file
      .split("/")
      .pop()
      .replace(/\.(js|jsx|ts|tsx|json)$/i, "")
      .toLowerCase();

    return fileName === importedName;
  });

  return fallback || null;
}

function extractImports(content) {
  const imports = new Set();

  // CommonJS:
  // require("../controllers/authController")
  const requireRegex =
    /require\s*\(\s*["']([^"']+)["']\s*\)/g;

  let match;

  while ((match = requireRegex.exec(content))) {
    imports.add(match[1]);
  }

  // ES module:
  // import x from "../controllers/authController"
  const importRegex =
    /import\s+(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']/g;

  while ((match = importRegex.exec(content))) {
    imports.add(match[1]);
  }

  return [...imports];
}

function analyzeRealCodeFlow(allFiles, importantFiles) {
  const codeFlow = [];

  const routeFiles = importantFiles.filter((file) =>
    file.path.toLowerCase().includes("/routes/")
  );

  const controllerFiles = importantFiles.filter((file) =>
    file.path.toLowerCase().includes("/controllers/")
  );

  const modelFiles = importantFiles.filter((file) => {
    const path = file.path.toLowerCase();

    return (
      path.includes("/model/") ||
      path.includes("/models/")
    );
  });

  const schemaFiles = importantFiles.filter((file) =>
    file.path.toLowerCase().includes("/schemas/")
  );

  // Route -> Controller
  for (const routeFile of routeFiles) {
    if (!routeFile.content) continue;

    const imports = extractImports(routeFile.content);

    for (const importPath of imports) {
      const relatedController = resolveImportPath(
        routeFile.path,
        importPath,
        allFiles
      );

      if (
        relatedController &&
        relatedController.toLowerCase().includes("controller")
      ) {
        codeFlow.push({
          type: "Route → Controller",
          from: routeFile.path,
          to: relatedController,
        });
      }
    }
  }

  // Controller -> Model / Schema
  for (const controllerFile of controllerFiles) {
    if (!controllerFile.content) continue;

    const imports = extractImports(controllerFile.content);

    for (const importPath of imports) {
      const relatedFile = resolveImportPath(
        controllerFile.path,
        importPath,
        allFiles
      );

      if (!relatedFile) continue;

      const lowerPath = relatedFile.toLowerCase();

      if (
        lowerPath.includes("/model/") ||
        lowerPath.includes("/models/")
      ) {
        codeFlow.push({
          type: "Controller → Model",
          from: controllerFile.path,
          to: relatedFile,
        });
      }

      if (lowerPath.includes("/schemas/")) {
        codeFlow.push({
          type: "Controller → Schema",
          from: controllerFile.path,
          to: relatedFile,
        });
      }
    }
  }

  return codeFlow;
}

function analyzeProject(repository, files, importantFiles) {
  const dependencyInfo = analyzeDependencies(importantFiles);

  const filePaths = files.map((file) =>
    typeof file === "string" ? file : file.path
  );

  const fileText = filePaths.join(" ").toLowerCase();

  const detected = {
    languages: [],
    frameworks: [],
    libraries: [],
    frontend: [],
    backend: [],
    database: [],
    projectType: "Unknown",
  };

  // Languages
  if (fileText.includes(".js")) {
    detected.languages.push("JavaScript");
  }

  if (
    fileText.includes(".jsx") ||
    fileText.includes(".tsx")
  ) {
    detected.languages.push("JavaScript / JSX");
  }

  if (fileText.includes(".ts")) {
    detected.languages.push("TypeScript");
  }

  if (fileText.includes(".py")) {
    detected.languages.push("Python");
  }

  if (fileText.includes(".java")) {
    detected.languages.push("Java");
  }

  // Frontend
  if (
    fileText.includes(".jsx") ||
    fileText.includes(".tsx") ||
    fileText.includes("react")
  ) {
    detected.frontend.push("React");
    detected.frameworks.push("React");
  }

  if (fileText.includes("vite.config")) {
    detected.frontend.push("Vite");
  }

  if (fileText.includes("next.config")) {
    detected.frontend.push("Next.js");
    detected.frameworks.push("Next.js");
  }

  if (fileText.includes(".html")) {
    detected.frontend.push("HTML");
  }

  if (fileText.includes(".css")) {
    detected.frontend.push("CSS");
  }

  // Backend
  if (
    fileText.includes("express") ||
    fileText.includes("server.js") ||
    fileText.includes("backend/")
  ) {
    detected.backend.push("Node.js");
    detected.backend.push("Express.js");
    detected.frameworks.push("Express.js");
  }

  // Libraries
  if (
    fileText.includes("axios") ||
    dependencyInfo.dependencies.includes("axios")
  ) {
    detected.libraries.push("Axios");
  }

  if (
    fileText.includes("mongoose") ||
    dependencyInfo.dependencies.includes("mongoose")
  ) {
    detected.libraries.push("Mongoose");
  }

  if (
    fileText.includes("react-router") ||
    dependencyInfo.dependencies.includes("react-router-dom")
  ) {
    detected.libraries.push("React Router");
  }

  // Database
  if (
    fileText.includes("mongoose") ||
    fileText.includes("mongodb") ||
    dependencyInfo.dependencies.includes("mongoose") ||
    dependencyInfo.dependencies.includes("mongodb")
  ) {
    detected.database.push("MongoDB");
  }

  if (
    fileText.includes("mysql") ||
    dependencyInfo.dependencies.includes("mysql") ||
    dependencyInfo.dependencies.includes("mysql2")
  ) {
    detected.database.push("MySQL");
  }

  if (
    fileText.includes("postgres") ||
    dependencyInfo.dependencies.includes("pg")
  ) {
    detected.database.push("PostgreSQL");
  }

  // Project type
  if (
    detected.frontend.length > 0 &&
    detected.backend.length > 0
  ) {
    detected.projectType = "Full Stack Web Application";
  } else if (detected.frontend.length > 0) {
    detected.projectType = "Frontend Web Application";
  } else if (detected.backend.length > 0) {
    detected.projectType = "Backend Application";
  }

  const architecture = detectArchitecture(filePaths);

  const projectFlow = detectProjectFlow(filePaths);

  const realCodeFlow = analyzeRealCodeFlow(
    filePaths,
    importantFiles
  );

  return {
    ...detected,
    dependencies: dependencyInfo.dependencies,
    devDependencies: dependencyInfo.devDependencies,
    architecture,
    projectFlow,
    realCodeFlow,
  };
}

module.exports = {
  analyzeProject,
};