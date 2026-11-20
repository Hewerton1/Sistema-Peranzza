/* Pedido concluído diretamente pelo WhatsApp. Sem banco de dados. */
window.PERANZZA_CONFIG_READY.then(()=>{
 'use strict';
 const cfg=window.PERANZZA_CONFIG||{};
 const phone=String(cfg.whatsapp||'5581998828250').replace(/\D/g,'');
 const byId=id=>document.getElementById(id);
 const checkout=byId('checkout'),send=byId('sendWhatsApp'),payment=byId('payment');
 const orderType=byId('orderType'),result=byId('checkoutResult');
 const changeWrap=byId('trocoWrap');
 payment.addEventListener('change',()=>{changeWrap.hidden=payment.value!=='Dinheiro'});
 orderType.addEventListener('change',()=>{byId('addressWrap').hidden=orderType.value!=='Entrega'});
 function msg(){
  const name=byId('customerName').value.trim();
  const address=byId('address').value.trim(),district=byId('bairro').value.trim(),reference=byId('referencia').value.trim();
  const delivery=orderType.value==='Entrega';
  if(!cart.length){alert('Adicione ao menos um produto ao carrinho.');return null}
  if(!name){alert('Informe seu nome para identificar o pedido.');byId('customerName').focus();return null}
  if(delivery&&(!address||!district)){alert('Para entrega, informe rua, número e bairro.');(!address?byId('address'):byId('bairro')).focus();return null}
  const formatted=cart.map((item,i)=>`${i+1}. ${item.qty}× ${item.name}\n   ${item.details}\n   ${money(item.unit)} cada — ${money(item.qty*item.unit)}`);
  const lines=[
   '🍕 *PEDIDO • PIZZARIA PERANZZA*',
   '',
   ...formatted.flatMap(item=>[item,'']),
   '*SUBTOTAL DOS PRODUTOS:* '+money(cart.reduce((s,x)=>s+x.unit*x.qty,0)),
   '*Taxa de entrega:* a confirmar',
   '',
   '*DADOS DO CLIENTE*',
   '*Nome:* '+name,
   '*Modalidade:* '+(delivery?'Entrega':'Retirada na pizzaria')
  ];
  if(delivery){lines.push('*Endereço:* '+address,'*Bairro:* '+district);if(reference)lines.push('*Referência:* '+reference)}
  lines.push('*Pagamento:* '+payment.value);
  const change=byId('troco').value.trim();
  if(payment.value==='Dinheiro')lines.push('*Troco:* '+(change?'para R$ '+change:'não informado'));
  const notes=byId('notes').value.trim();lines.push('*Observações:* '+(notes||'Nenhuma'));
  lines.push('','Aguardo a confirmação e o valor final da pizzaria. Obrigado!');
  return lines.join('\n');
 }
 // Substitui a ação do protótipo antigo: um clique abre o WhatsApp com o texto completo.
 checkout.onclick=()=>{
  const message=msg();if(!message)return;
  if(phone.length!==13){alert('O número da pizzaria precisa ser conferido no arquivo dados/configuracao.json.');return}
  const url='https://wa.me/'+phone+'?text='+encodeURIComponent(message);
  byId('message').value=message;
  send.href=url;send.hidden=false;
  result.hidden=false;
  // Acionamento direto por clique, sem abrir WhatsApp antes da escolha dos dados.
  const opened=window.open(url,'_blank','noopener,noreferrer');
  // Caso o navegador bloqueie pop-ups, o link fica à vista para tocar novamente.
  if(!opened){checkout.textContent='Abrir WhatsApp com o pedido ↗'}
 };
});
