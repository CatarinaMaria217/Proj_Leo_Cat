exports.getProjectContents = async (req, res) => {
  console.log(req.params)
  const { hub_id, project_id } = req.params;

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

    const contentsResponse = await fetch(
      `https://developer.api.autodesk.com/project/v1/hubs/${hub_id}/projects/${project_id}/topFolders`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    const contents = await contentsResponse.json();
    console.log(contents)
    res.json(contents);
  } catch (error) {
    console.error('Erro ao buscar conteúdos:', error);
    res.status(500).json({ error: 'Erro ao buscar conteúdos' });
  }
};