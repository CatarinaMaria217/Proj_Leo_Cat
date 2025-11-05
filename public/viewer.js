// viewer.js

// 1️⃣ Declare global variables
let viewer;
let accessToken;
let urn; // you can set this later or fetch from backend/user input

// 2️⃣ Initialize Forge Viewer
async function initializeViewer() {
  try {
    if (!accessToken) {
      console.error("Access token not available. Cannot initialize viewer.");
      return;
    }

    const options = {
      env: 'AutodeskProduction',
      accessToken: accessToken
    };

    Autodesk.Viewing.Initializer(options, () => {
      const htmlDiv = document.getElementById('viewerContainer');
      viewer = new Autodesk.Viewing.GuiViewer3D(htmlDiv);
      const startedCode = viewer.start();

      if (startedCode > 0) {
        console.error('Falha ao iniciar o viewer: ' + startedCode);
        return;
      }

      console.log('Viewer iniciado.');
    });
  } catch (error) {
    console.error('Erro ao inicializar o viewer:', error);
  }
}

// 3️⃣ Load model into viewer
async function loadModel() {
  if (!viewer || !accessToken || !urn) {
    console.error("Viewer, accessToken, or URN is missing!");
    return;
  }

  const documentId = `urn:${urn}`;
  Autodesk.Viewing.Document.load(
    documentId,
    (doc) => {
      const defaultModel = doc.getRoot().getDefaultGeometry();
      viewer.loadDocumentNode(doc, defaultModel);
      console.log('Model loaded.');
    },
    (error) => {
      console.error('Error loading model:', error);
    }
  );
}

// 4️⃣ Check authentication status and initialize viewer
async function checkAuthStatus() {
  try {
    const response = await fetch('/auth/token');
    const data = await response.json();

    if (response.ok) {
      accessToken = data.access_token;
      console.log('Access token received:', accessToken);
      initializeViewer();
    } else {
      console.error('Authentication failed:', data);
    }
  } catch (error) {
    console.error('Error checking auth status:', error);
  }
}

// 5️⃣ Hook events
document.addEventListener('DOMContentLoaded', checkAuthStatus);

// Hook the "Load Model" button
document.getElementById('loadModelBtn').addEventListener('click', loadModel);