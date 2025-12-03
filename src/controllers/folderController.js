exports.getfolderContents = async (req, res) => {
  const { hub_id, project_id, folder_id } = req.params;

  try {
    const tokenResponse = await fetch(process.env.FORGE_AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.FORGE_CLIENT_ID,
        client_secret: process.env.FORGE_CLIENT_SECRET,
        grant_type: 'client_credentials',
        scope: 'data:read'
      })
    });

    const { access_token } = await tokenResponse.json();

    const folderResponse = await fetch(
      `https://developer.api.autodesk.com/data/v1/projects/${project_id}/folders/${folder_id}/contents`,
      {
        headers: { Authorization: `Bearer ${access_token}` }
      }
    );

    const folderContents = await folderResponse.json();
    res.json(folderContents);
  } catch (error) {
    console.error("Error loading folder contents:", error);
    res.status(500).json({ error: "Error loading folder contents" });
  }
};
