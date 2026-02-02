const https = require('https');

exports.handler = async (event) => {
  const usuario = event.queryStringParameters.usuario;

  const owner = "reissondesigner-lang";
  const repo = "lista-compras";
  const path = `dados/${usuario}.json`;

  function request(options) {
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, data }));
      });
      req.on('error', reject);
      req.end();
    });
  }

  const options = {
    hostname: 'api.github.com',
    path: `/repos/${owner}/${repo}/contents/${path}`,
    method: 'GET',
    headers: {
      'User-Agent': 'netlify-function'
    }
  };

  const resposta = await request(options);

  if (resposta.status !== 200) {
    return {
      statusCode: 200,
      body: JSON.stringify({ itens: [], limite: 0 })
    };
  }

  const json = JSON.parse(resposta.data);
  const conteudo = JSON.parse(Buffer.from(json.content, 'base64').toString());

  return {
    statusCode: 200,
    body: JSON.stringify(conteudo)
  };
};
