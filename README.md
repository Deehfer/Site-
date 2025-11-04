# Site — Sistema de Tickets Ambientais
O repositório apresenta o front-end de um sistema de tickets ambientais, com foco em permitir o registro, acompanhamento e compartilhamento de ocorrências relacionadas ao meio ambiente.
Este módulo será acoplado a outros componentes complementares, formando uma arquitetura distribuída completa, alinhada aos conceitos abordados na disciplina.

-- Ajustes para rodar a AI
- Instalar o npm caso nao tenha (tudo rodando em linux a partir daqui)
$ sudo apt install npm -y
$ npm -v
$ sudo npm install -g n
$ sudo n 20
$ node -v

- Instalar o n8n
$ sudo npm install -g n8n
$ n8n ( assim rodamos o servidor )
    ira aparecer algo assim no terminal se tudo certo:
    "Editor is now accessible via: http://localhost:5678/"
$ o ( para abrir o painel )

- Com o painel aberto 
-> clique em "Create Worckflow"
-> nas opções clique em "Import from File"
-> e selecione arquivo "AgenteSustentabilidade.json", que acompanha esse projeto
-> salve e posteriormente, marque-o como "Active"

PARA RODAR EM LOCALHOST, NO MESMO COMPUTADOR QUE RODA O FRONT ->
Dentro do agente clique em "When chat messages recieves"
Copie a URL que for gerada em "Chat URL"
No arquivo "site-chat.js"
    -> na função sendMessage()
       -> no fetch('...')
       -> substirua a URL que lá se encontra, pela nova url
Rode o front novamente