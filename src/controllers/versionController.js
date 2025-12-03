exports.getItemVersions = async (req, res) => {
  const { project_id, item_id } = req.params;

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

    const versionsResponse = await fetch(
      `https://developer.api.autodesk.com/data/v1/projects/${project_id}/items/${item_id}/versions`,
      {
        headers: { Authorization: `Bearer ${access_token}` }
      }
    );

    const versions = await versionsResponse.json();
    res.json(versions);
  } catch (error) {
    console.error("Error loading versions:", error);
    res.status(500).json({ error: "Error loading versions" });
  }
};