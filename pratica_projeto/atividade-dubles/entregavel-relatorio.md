# Relatório

**Disciplina:** Testes de Software II · Unidade I
**Estudante: Álvaro Kayc**

---

## ETAPA 1

### Tabela de Testes

| Teste | Colaborador | Qual dublê é, de fato | Está adequado? | Se não, qual o problema? |
|---|---|---|---|---|
| **T1** | `relogio` | **Stub** | **Sim** |  |
| **T1** | `repositorio` | **Mock** | **Não** | Basicamente serve apenas pra verificar se o teste foi chamado e não verifica nada de fato com relação ao propósito do teste, como o resultado final da assinatura ou o status, talvez seja superespecificado |
| **T1** | `gateway` | **Mock** *(com retorno de Stub)* | **Não** | Mesma coisa do anterior, é um "fiscal de trânsito" sem propósito com a proposta do teste |
| **T1** | `notificador` | **Mock** | **Não** | Não verifica nada relacionado a assinatura, relacionado a interação com a assinatura, é superespecificado, etc |
| **T2** | `relogio` | **Stub** | **Sim** |  |
| **T2** | `gateway` | **Stub** | **Sim** |  |
| **T2** | `notificador` | **Dummy** | **Sim** |  |
| **T2** | `repositorio` | **Mock** | **Não** | Se a função interna for alterada o teste falha mesmo sem haver erros, considero esse teste ruim, válido porém ruim, o repositório deveria ser só um dummy e o expect deveria checar o valor final da função |
| **T3** | `relogio` | **Stub** / **Dummy** | **Sim** |  |
| **T3** | `gateway` | **Stub** | **Sim** |  |
| **T3** | `repositorio` | **Dummy** | **Sim** |  |
| **T3** | `notificador` | **Dummy** | **Sim** |  |
| **T4** | `relogio` | **Stub** / **Dummy** | **Sim** |  |
| **T4** | `gateway` | **Stub** | **Sim** |  |
| **T4** | `repositorio` | **Dummy** | **Sim** |  |
| **T4** | `notificador` | **Mock** | **Sim** |  |
| **T5** | `relogio` | **Stub** | **Não** | Tem um valor pré-definido, com função e chamado, está inadequado, o correto seria um dummy nulo ou vazio |
| **T5** | `gateway` | **Dummy** | **Não** | Considero inadequado, apesar de cumprir o próprosito de preencher o parâmetro, ele abre portas pra uma execução silenciosa numa possível refatoração do teste ou algo assim, acredito que se fosse "null" ou apenas "{ }" faria mais sentido na teoria e na prática de um dummy |
| **T5** | `repositorio` | **Dummy** | **Não** | Considero inadequado, apesar de cumprir o próprosito de preencher o parâmetro, ele abre portas pra uma execução silenciosa numa possível refatoração do teste ou algo assim, acredito que se fosse "null" ou apenas "{ }" faria mais sentido na teoria e na prática de um dummy |
| **T5** | `notificador` | **Dummy** | **Não** | Considero inadequado, apesar de cumprir o próprosito de preencher o parâmetro, ele abre portas pra uma execução silenciosa numa possível refatoração do teste ou algo assim, acredito que se fosse "null" ou apenas "{ }" faria mais sentido na teoria e na prática de um dummy |
| **T6** | `@sendgrid/mail` (`sgMail`) | **Mock** | **Não** | Viola a diretriz de "Don't mock what you don't own", tá mockando um serviço externo que pode mudar a qualquer momento em vez de testar um contrato nosso |

### Experimento obrigatório (troca de 30 para 45 dias)

Mudei o `DIAS_DO_CICLO` de 30 pra 45 em `src/renovarAssinatura.js` e rodei o `npm test`

Resultado: só o teste T2 falhou, o T1 e todos os outros passaram direto

Isso responde sozinho a pergunta da etapa sobre o T1: ele não verifica nada que importe pro cliente final, só se a função tá sendo chamada, o que faz o propósito do teste "renova uma assinatura ativa" não fazer sentido

---

## ETAPA 3

### Medição dos testes quebrados (rename de salvar para persistir)

- Medição inicial (suíte legada): 2 testes quebraram (T1 e T2)
- Medição final (suíte refatorada): 0 testes quebraram

### Justificativa da asserção sobrevivente

A asserção que teve que sobreviver foi a de notificação no T1 (`expect(notificadorMock.enviar).toHaveBeenCalledTimes(1)`)

Ela precisou ficar porque o envio de e-mail é um efeito colateral externo que faz parte da regra de negócio da renovação, e como não dá pra verificar isso só olhando o retorno do estado da assinatura ela continua sendo necessária
