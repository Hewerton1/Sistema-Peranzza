# Hospedar este projeto Java fora do Netlify

## Render (Java de verdade) — opção gratuita com limitações

1. Crie uma conta no **GitHub** e um repositório novo, por exemplo `peranzza-cardapio-java`.
2. No seu computador, extraia este ZIP e envie ao repositório **o conteúdo da pasta que contém `pom.xml` e `Dockerfile`**.
3. Entre em https://dashboard.render.com/ e clique em `New > Web Service`.
4. Conecte o repositório GitHub. Selecione `Language: Docker` (Java requer Docker no Render).
5. Se disponível, escolha `Instance Type: Free`. O Render fará o build pelo `Dockerfile`.
6. Ao terminar, abra a URL fornecida, geralmente terminada em `.onrender.com`.
7. Verifique também `/api/status`.

**Atenção:** o plano gratuito pode hibernar após 15 minutos sem tráfego, ficar lento para a primeira visita, ser reiniciado e ter limites mensais. Verifique as condições atuais antes de usar para receber pedidos reais.

## Atualizações

Para mudar foto, história, cardápio ou preços, altere os arquivos do projeto e envie as mudanças ao GitHub. O Render fará um novo deploy. Não armazene arquivos no disco da instância do Render porque o armazenamento não é persistente.

## Sem custo de servidor Java para site comercial

Se a prioridade for um site que abra instantaneamente para clientes, considere hospedar uma versão estática (HTML/CSS/JS) no Cloudflare Pages ou GitHub Pages. **Esses serviços não executam Spring Boot**.

Referências: https://render.com/docs/docker e https://render.com/docs/free
