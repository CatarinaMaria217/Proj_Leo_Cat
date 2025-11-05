// viewer.js

// 1️⃣ Declare global variables
let viewer;
let accessToken;

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
  const input = document.getElementById('modelUrn');
  if (!input || !input.value) {
    console.error("Please enter a model URN in the input field.");
    return;
  }

  const urn = input.value.trim();

  if (!viewer || !accessToken || !urn) {
    console.error("Viewer, accessToken, or URN is missing!");
    return;
  }

  // Base64 encode and make URL-safe
  const encoUrn = btoa(urn).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const documentId = `urn:${encoUrn}`;

  Autodesk.Viewing.Document.load(
    documentId,
    (doc) => {
      const defaultModel = doc.getRoot().getDefaultGeometry();
      viewer.loadDocumentNode(doc, defaultModel);
      console.log('Model loaded successfully.');
    },
    (error) => {
      console.error('Failed to load model:', error);
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

// 5️⃣ Hook events after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  checkAuthStatus();

  const loadBtn = document.getElementById('loadModelBtn');
  if (loadBtn) {
    loadBtn.addEventListener('click', loadModel);
  } else {
    console.warn('Load Model button not found in the DOM.');
  }
});
