exports.handler = async (event) => {
  try {
    const usuario = event.queryStringParameters.usuario;

    const owner = "reissondesigner-lang";
    const repo = "lista-compras";
    const path = `dados/${usuario}.json`;

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

    const res = await fetch(url, {
      headers: { "User-Agent": "netlify-function" }
    });

    if (res.status !== 200) {
      return {
        statusCode: 200,
        body: JSON.stringify({ itens: [], limite: 0 })
      };
    }

    const data = await res.json();
    const conteudo = JSON.parse(
      Buffer.from(data.content, "base64").toString()
    );

    return {
      statusCode: 200,
      body: JSON.stringify(conteudo)
    };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};
