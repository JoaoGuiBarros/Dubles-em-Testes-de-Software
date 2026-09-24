# Relatório

**Disciplina:** Testes de Software II · Unidade I
**Estudante: João Guilherme Barros dos Santos**

---

## ETAPA 1

### Tabela de Testes

| Teste | Colaborador | Tipo | Adequado | Justificativa |
|---|---|---|---|---|
| **T1** | `relogioFixo` | stub | sim | Isola o não-determinismo do tempo, tornando o cálculo de dias previsível.
| **T1** | `repositorio` | mock/spy | não | O teste não verifica se os argumentos recebidos contêm a nova data de vencimento calculada corretamente.
| **T1** | `gateway` | stub, mock/spy | não | O teste não valida se o valor cobrado e o cartão passados como argumento estão corretos.
| **T1** | `notificador` | mock/spy | não | O teste omite a validação da mensagem enviada, ignorando se a formatação da data ocorreu como esperado.
| **T2** | `relogioFixo` | stub | sim | Fixa o tempo não-determinístico, garantindo que a data calculada seja exata e previsível.
| **T2** | `repositorio` | mock | sim | Utiliza toHaveBeenCalledWith para verificar de forma rigorosa se o sistema calculou e tentou guardar a data correta.
| **T2** | `gateway` | stub | sim | Apenas simula o sucesso da cobrança, permitindo que a execução chegue à lógica da data sem desviar o foco do teste.
| **T2** | `notificador` | dummy | sim | Serve apenas para preencher os parâmetros da função e evitar erros, já que validar o envio de emails não é o objetivo deste teste.
| **T3** | `relogioFixo` | Stub | Sim | É um bom exemplo de preenchimento seguro, pois a recusa de cobrança interrompe a função antes do cálculo de tempo, e ele não interfere.
| **T3** | `repositorio` | Dummy | Não | O teste apenas avalia o retorno em memória, omitindo a verificação crucial de que o estado 'INADIMPLENTE' foi efetivamente guardado no banco.
| **T3** | `gateway` | Stub | Sim | É um bom exemplo de indução de fluxo, injetando a resposta de falha ({status: 'recusado' }) para testar o caminho alternativo.
| **T3** | `notificador` | Dummy | Sim | É um bom exemplo de isolamento, visto que preenche os parâmetros sem desviar a atenção, num fluxo onde não deve atuar.
| **T4** | `relogioFixo` | Stub | Sim | Apenas satisfaz a assinatura da função silenciosamente num cenário de falha onde a data não é calculada.
| **T4** | `repositorio` | Dummy | Sim | É adequado ignorá-lo aqui, pois o teste foca-se exclusivamente em provar um comportamento do notificador (foco numa única responsabilidade).
| **T4** | `gateway` | Stub | Sim | É um bom exemplo de configuração prévia para forçar o sistema a entrar no bloco de código de recusa.
| **T4** | `notificador` | Mock/Spy | Sim | É um excelente exemplo de verificação negativa, utilizando not.toHaveBeenCalled() para garantir a ausência de um efeito colateral indesejado.
| **T5** | `relogioFixo` | Stub | Sim | Está adequado pois não é invocado (a exceção ocorre logo no início), servindo apenas para compilar e executar o teste.
| **T5** | `repositorio` | Dummy | Sim | É um bom exemplo de preenchimento estrutural para um teste que apenas exige a validação do lançamento de um erro imediato.
| **T5** | `gateway` | Dummy | Sim | Adequado, pois o código aborta na primeira linha da regra de negócio, logo este dublê cumpre puramente o seu papel de evitar erros de sintaxe ou referência.
| **T5** | `notificador` | Dummy | Sim | Tal como o gateway, é um bom exemplo de dummy, não interferindo num teste de falha prematura.
| **T6** | `notificador` | Stub, Mock/Spy | Sim | Atua como stub para isolar o teste da rede, e como mock para verificar rigorosamente se o adaptador construiu e repassou o payload correto (destinatário e assunto) para a API terceira.

### Experimento obrigatório (troca de 30 para 45 dias)

Resultado: Só o teste T2 falhou, o T1 e todos os outros passaram direto; T1 não verifica nada que importe pro cliente final, só se a função tá sendo chamada, o que faz o propósito do teste "renova uma assinatura ativa" não fazer sentido.