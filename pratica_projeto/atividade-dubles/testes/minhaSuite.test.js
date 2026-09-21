import { test, expect, vi } from 'vitest';

import { renovarAssinatura } from '../src/renovarAssinatura.js';
import { AssinaturaCanceladaError } from '../src/erros.js';
import { assinaturaAtiva, assinaturaCancelada } from './fixtures.js';

vi.mock('@sendgrid/mail', () => ({
    default: {
        setApiKey: vi.fn(),
        send: vi.fn(),
    },
}));

// Segui a mesma linha de raciocínio do relogioFixo do teste anterior.
const relogioFixo = { hoje: () => new Date('2026-03-01T00:00:00Z') }; 

test('T1 - Vencimento da assinatura é 30 dias após a data corrente', async () => {
    // Dummy: não faz nada, só utilizo para passar no parâmetro da função
    const repositorioDummy = { salvar: vi.fn() };

    /* Stub: Aqui eu utilizo um stub com valor pré-definido pra simular o
    gateway e fazer o caminho "correto" da função */
    const gatewayStub = { cobrar: vi.fn().mockResolvedValue({ status: 'aprovado' }) };

    // Dummy: não faz nada, também só utilizo para passar no parâmetro da função
    const notificadorDummy = { enviar: vi.fn() }; //

    const resultado = await renovarAssinatura(
        assinaturaAtiva(), repositorioDummy, gatewayStub, notificadorDummy, relogioFixo
    );

    /*Resultado esperado: vencimento da assinatura exatamente 30 dias após a data
    atual (2026-03-01) no relogioFixo (Stub)*/
    expect(resultado.vencimento).toEqual(new Date('2026-03-31T00:00:00Z'));
});

test('T2 - Cliente é notificado com a data correta dentro da mensagem', async () => {

    // Dummy: não faz nada, só utilizo para passar no parâmetro da função
    const repositorioDummy = { salvar: vi.fn() };

    /* Stub: Aqui eu utilizo um stub com valor pré-definido pra simular o
    gateway e fazer o caminho "correto" da função */
    const gatewayStub = { cobrar: vi.fn().mockResolvedValue({ status: 'aprovado' }) };

    /* Spy: Aqui eu acredito que o ideal seja utilizar um spy tanto pra verificar
    se a função está sendo chamada, quanto para verificar os argumentos
    que ela é chamada*/
    const notificadorSpy = { enviar: vi.fn() };

    const assinaturaResultado = await renovarAssinatura(
        assinaturaAtiva(), repositorioDummy, gatewayStub, notificadorSpy, relogioFixo
    );

    expect(notificadorSpy.enviar).toHaveBeenCalledTimes(1);
    expect(notificadorSpy.enviar).toHaveBeenCalledWith(
        assinaturaResultado.email,
        expect.stringContaining('31/03/2026') // Verificação com a data correta
    );
});

test('T3 - Assinatura cancelada é rejeitada sem chamar outros serviços', async () => {
    // Aqui eu utilizo os colaboradores como dummys, evito verificar se eles não são chamados e se forem dá erro.
    const relogioDummy = null;
    const repositorioDummy = null;
    const gatewayDummy = null;
    const notificadorDummy = null;

    // Crio uma assinatura cancelada para passar como parâmetro da função
    const assinatura = assinaturaCancelada();

    // Aqui eu verifico se a função é rejeitada com o erro esperado.
    await expect(
        renovarAssinatura(assinatura, repositorioDummy, gatewayDummy, notificadorDummy, relogioDummy)
    ).rejects.toThrow(AssinaturaCanceladaError);

});