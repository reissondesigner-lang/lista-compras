exports.handler = async (event) => {
  try {
    const { usuario, itens, limite } = JSON.parse(event.body);

    const token = process.env.GITHUB_TOKEN;
    const owner = "reissondesigner-lang";
    const repo = "lista-compras";
    const path = `dados/${usuario}.json`;

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

    const conteudo = Buffer.from(
      JSON.stringify({ itens, limite }, null, 2)
    ).toString("base64");

    // Verifica se já existe
    const atual = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": "netlify-function"
      }
    });

    let sha = null;
    if (atual.status === 200) {
      const data = await atual.json();
      sha = data.sha;
    }

    await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "netlify-function"
      },
      body: JSON.stringify({
        message: `Salvando lista de ${usuario}`,
        content: conteudo,
        sha
      })
    });

    return { statusCode: 200, body: "ok" };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};
