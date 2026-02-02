const https = require('https');

exports.handler = async (event) => {
  const { usuario, itens, limite } = JSON.parse(event.body);

  const token = process.env.GITHUB_TOKEN;
  const owner = "reissondesigner-lang";
  const repo = "lista-compras";
  const path = `dados/${usuario}.json`;

  const conteudo = Buffer.from(JSON.stringify({ itens, limite }, null, 2)).toString('base64');

  const optionsGet = {
    hostname: 'api.github.com',
    path: `/repos/${owner}/${repo}/contents/${path}`,
    method: 'GET',
    headers: {
      'User-Agent': 'netlify-function',
      'Authorization': `Bearer ${token}`
    }
  };

  function request(options, body = null) {
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, data }));
      });
      req.on('error', reject);
      if (body) req.write(body);
      req.end();
    });
  }

  const atual = await request(optionsGet);
  let sha = null;

  if (atual.status === 200) {
    const json = JSON.parse(atual.data);
    sha = json.sha;
  }

  const optionsPut = {
    hostname: 'api.github.com',
    path: `/repos/${owner}/${repo}/contents/${path}`,
    method: 'PUT',
    headers: {
      'User-Agent': 'netlify-function',
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  const bodyPut = JSON.stringify({
    message: `Salvando lista de ${usuario}`,
    content: conteudo,
    sha
  });

  await request(optionsPut, bodyPut);

  return {
    statusCode: 200,
    body: "ok"
  };
};
