exports.handler = async (event) => {
  const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

  const { usuario, itens, limite } = JSON.parse(event.body);

  const token = process.env.GITHUB_TOKEN;
  const repo = "lista-compras";
  const owner = "reissondesigner-lang";
  const path = `dados/${usuario}.json`;

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  const conteudo = Buffer.from(JSON.stringify({ itens, limite }, null, 2)).toString('base64');

  // pegar SHA se existir
  const atual = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
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
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: `Salvando lista de ${usuario}`,
      content: conteudo,
      sha
    })
  });

  return { statusCode: 200, body: "ok" };
};
