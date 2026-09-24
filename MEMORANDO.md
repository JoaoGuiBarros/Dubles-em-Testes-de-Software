# Memorando Técnico

**Disciplina:** Testes de Software II · Unidade I
**Estudante: Álvaro Kayc; João Guilherme**

---

### 1. Depois das refatorações, sua suíte ficou mais próxima da escola clássica ou da mockista?

Ficou mais próxima da escola clássica. A gente tirou o foco de ficar fiscalizando se cada função interna foi chamada e passou a checar o retorno e o estado final do objeto, como `resultado.status` e `resultado.vencimento`. Isso fez os testes ficarem muito mais resistentes à refatoração, tanto que no experimento de renomear `salvar` pra `persistir` na etapa 3 a suíte refatorada teve 0 testes quebrados

### 2. O que essa aproximação custou? Cite um caso concreto do seu código.

Custou ter que montar um setup com mais dublês em volta (stubs e dummies) só pra conseguir rodar a função inteira até o final, mesmo quando eu só queria testar uma coisa específica

Caso concreto do código: no teste P1 da `minhaSuite.test.js` (e no T2 da refatorada), onde o objetivo era só ver se a data somava os 30 dias pra frente, eu tive que passar obrigatoriamente o `gatewayStub`, o `repositorioDummy` e o `notificadorDummy`. Se não passasse esses colaboradores com as funções necessárias, a execução do caminho feliz da `renovarAssinatura` quebrava com erro no meio antes de chegar no cálculo

### 3. Sobrou algum teste que quebraria numa refatoração puramente interna? Ele se justifica? Defenda.

Sim, sobrou o teste que verifica o envio da notificação pro cliente (o P2 da `minhaSuite.test.js` e a asserção mantida no T1 da refatorada), onde a gente usa o spy/mock no `notificador.enviar`

Defesa: ele se justifica totalmente porque o envio de e-mail é uma ação pro mundo externo e não altera nada no estado do objeto da assinatura. Como o retorno da função não mostra o texto da mensagem, a única forma de garantir a regra de negócio e checar se o e-mail foi disparado com a data certa pro cliente é verificando a chamada e os argumentos recebidos pelo notificador