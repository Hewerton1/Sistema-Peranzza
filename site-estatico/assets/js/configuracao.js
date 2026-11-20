/* Carregamento da configuração sem servidor Java.
   Para editar história, foto e WhatsApp, altere apenas dados/configuracao.json.
*/
window.PERANZZA_CONFIG_READY = fetch('dados/configuracao.json', { cache: 'no-store' })
  .then(resposta => {
    if (!resposta.ok) throw new Error('Não foi possível carregar a configuração: HTTP ' + resposta.status);
    return resposta.json();
  })
  .then(configuracao => {
    window.PERANZZA_CONFIG = configuracao;
    return configuracao;
  })
  .catch(erro => {
    console.error('Falha ao carregar a configuração da Peranzza:', erro);
    // Mantém o atendimento disponível se o arquivo de configuração falhar.
    window.PERANZZA_CONFIG = { historia: 'A história da Pizzaria Peranzza estará disponível em breve.',
      apresentacao: 'Conheça nosso cardápio e escolha seus favoritos.',
      foto: '', whatsapp: '5581998828250' };
    return window.PERANZZA_CONFIG;
  });
