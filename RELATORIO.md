## ETAPA 3

### Medição dos testes quebrados (rename de salvar para persistir)

- Medição inicial (suíte legada): 2 testes quebraram (T1 e T2)
- Medição final (suíte refatorada): 0 testes quebraram

### Justificativa da asserção sobrevivente

A asserção que teve que sobreviver foi a de notificação no T1 (`expect(notificadorMock.enviar).toHaveBeenCalledTimes(1)`)

Ela precisou ficar porque o envio de e-mail é um efeito colateral externo que faz parte da regra de negócio da renovação, e como não dá pra verificar isso só olhando o retorno do estado da assinatura ela continua sendo necessária