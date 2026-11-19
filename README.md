# 🍕 Pizzaria Peranzza — projeto Java (Spring Boot)

**Projeto com código-fonte organizado, sem banco de dados.**

O servidor Java lê o catálogo e o conteúdo configurável de arquivos JSON, entrega as páginas e responde às rotas REST. O navegador usa HTML, CSS e JavaScript para interface, carrinho, cálculo de preço e abertura do WhatsApp. Java NÃO substitui o HTML/CSS/JavaScript necessários para mostrar o site no navegador.

## Estrutura

```text
Peranzza_Java_SpringBoot/
├── pom.xml                          # Maven / Spring Boot
├── Dockerfile                       # Hospedagem Java com Docker
├── src/main/java/br/com/peranzza/
│   ├── PeranzzaApplication.java     # Inicialização
│   ├── model/                       # Tipos Produto, Borda, Catálogo, Configuração
│   ├── service/                     # Leitura e validação dos JSONs
│   └── controller/                  # GET /api/catalogo, /api/configuracao, /api/status
├── src/main/resources/
│   ├── application.properties       # Porta HTTP
│   ├── dados/
│   │   ├── cardapio.json            # EDITAR PRODUTOS, TAMANHOS E PREÇOS AQUI
│   │   └── configuracao.json        # EDITAR HISTÓRIA, FOTO E WHATSAPP AQUI
│   └── static/
│       ├── index.html               # Estrutura visual da página
│       └── assets/
│           ├── css/estilo.css       # Cores, tipografia, layout retrô
│           ├── js/catalogo.js       # Filtros, tamanhos e carrinho
│           ├── js/pedido-whatsapp.js# Prepara pedido e abre o WhatsApp
│           ├── js/interacoes.js     # Aplica história e foto
│           ├── js/efeitos.js        # Fumaça e aproximação do fundo
│           └── img/                 # LOGO, FUNDO e foto-pizzaria.jpg
└── src/test/                        # Testes de integridade do catálogo/config
```

## Rodar no VS Code/Windows

1. Instale **JDK 21** e **Maven 3.9+**. Configure `JAVA_HOME`, se necessário.
2. Abra no VS Code a pasta que contém `pom.xml`.
3. No terminal integrado: `mvn spring-boot:run`.
4. Abra **http://localhost:8080**. Não abra `src/main/resources/static/index.html` diretamente: os dados são servidos pelo Java.
5. Para encerrar, `Ctrl+C`.

**Gerar .jar:**

```bash
mvn clean package
java -jar target/peranzza-cardapio-1.0.0.jar
```

**Testes:** `mvn test`.

## Editar a história

Abra `src/main/resources/dados/configuracao.json` e edite o campo `historia`. Você pode inserir parágrafos usando `\n\n` dentro da string JSON. Edite também `apresentacao` e `whatsapp`, se necessário. O WhatsApp já está em **5581998828250**. Salve e reinicie/republique a aplicação.

## Colocar foto da pizzaria

Copie a foto verdadeira para:

`src/main/resources/static/assets/img/foto-pizzaria.jpg`

Não precisa alterar o código: o arquivo `dados/configuracao.json` já aponta para esse nome. **A foto não está incluída**, pois você ainda vai escolhê-la. Faça o build novamente e publique o novo pacote.

## Alterar preços e ingredientes

Edite `src/main/resources/dados/cardapio.json`, por exemplo:

```json
{
  "id": 1,
  "cat": "Tradicionais",
  "name": "ALHO E ÓLEO",
  "desc": "mussarela, alho frito, parmesão, tomate e orégano",
  "prices": {"P": 30, "M": 34, "G": 38},
  "kind": "pizza"
}
```

Este é apenas um exemplo de um produto dentro da lista. **Não substitua o JSON inteiro pelo exemplo**.

## Como o pedido funciona

O cliente escolhe pizzas, tamanho, meio a meio, bordas, bebidas e sobremesas. O carrinho fica na memória do navegador (não é armazenado em servidor). Após preencher nome, entrega ou retirada, endereço, bairro, pagamento, troco e observações, o botão **Enviar pedido completo pelo WhatsApp** abre uma conversa com **5581998828250** e a mensagem pré-preenchida. O cliente ainda precisa tocar em **Enviar** no WhatsApp. Taxa de entrega é confirmada pela pizzaria.

## APIs Java

- `GET /api/catalogo`: produtos, preços e bordas do arquivo JSON.
- `GET /api/configuracao`: história, foto e WhatsApp configurados.
- `GET /api/configuracao.js`: mesma configuração pronta para o navegador.
- `GET /api/status`: resposta simples para verificar se o servidor está online.

## Hospedagem gratuita

**Opção que executa Java:** Render Web Service com `Language: Docker` e `Instance Type: Free`. Publique esta pasta em um repositório GitHub e conecte no Render. A plataforma compila o `Dockerfile`. As instâncias gratuitas do Render entram em suspensão após 15 minutos sem visitas e podem levar cerca de 1 minuto para iniciar novamente; por isso a opção grátis **não é ideal para o cardápio de um comércio em produção**. Leia `PUBLICACAO.md`.

**Alternativa para site rápido:** Cloudflare Pages, GitHub Pages e Render Static Site não executam Java/Spring Boot; precisam de versão apenas HTML/CSS/JS. Este projeto foi feito em Java conforme solicitado.

**Importante:** antes de divulgar, revise preços, ingredientes e disponibilidade dos 125 produtos.
