/**
 * ┌────────────────────────────────────────────────────────────────────┐
 * │  SUÍTE REFATORADA — ETAPA 3                                        │
 * │                                                                    │
 * └────────────────────────────────────────────────────────────────────┘
 */

import { expect, test, vi } from 'vitest';

import { AssinaturaCanceladaError } from '../src/erros.js';
import { renovarAssinatura } from '../src/renovarAssinatura.js';
import { assinaturaAtiva, assinaturaCancelada } from './fixtures.js';


const relogioFixo = { hoje: () => new Date('2026-03-01T00:00:00Z') };

// ── T1 ─────────────────────────TERMINADO───────────────────────────────────
// Refatoração: Retirei as verificações chamadas das funções de dublês de teste
// e compara apenas o resultado final da função 'renovarAssinatura', o 
// vencimento e se a notificação foi enviada (regras de negócio).
test('T1 — renova uma assinatura ativa', async () => {
  const repositorioDummy = { salvar: vi.fn() };
  const gatewayStub = { cobrar: vi.fn().mockResolvedValue({ status: 'aprovado' }) };
  const notificadorMock = { enviar: vi.fn() };

  const resultado = await renovarAssinatura(
    assinaturaAtiva(), repositorioDummy, gatewayStub, notificadorMock, relogioFixo
  );

  expect(notificadorMock.enviar).toHaveBeenCalledTimes(1);
  expect(resultado.status).toBe('ATIVA')
  expect(resultado.vencimento).toEqual(new Date('2026-03-31T00:00:00Z'));

});

// ── T2 ─────────────────────────TERMINADO───────────────────────────────────
// Refatoração: Retirei as verificações chamadas das funções de dublês de teste
// e compara apenas o resultado final da função 'renovarAssinatura', o 
// vencimento e se a notificação foi enviada (regras de negócio).
test('T2 — calcula o novo vencimento', async () => {
  const repositorioDummy = { salvar: vi.fn() };
  const gatewayStub = { cobrar: vi.fn().mockResolvedValue({ status: 'aprovado' }) };
  const notificadorDummy = { enviar: vi.fn() };

  const resultado = await renovarAssinatura(
    assinaturaAtiva(), repositorioDummy, gatewayStub, notificadorDummy, relogioFixo
  );

  expect(resultado.vencimento).toEqual(new Date('2026-03-31T00:00:00Z')
  );
});


// ── T3 ───────────────────────────────────────────────────────────────
test('T3 — cartão recusado marca a assinatura como inadimplente', async () => {
  const repositorio = { salvar: vi.fn() };
  const gateway = {
    cobrar: vi.fn().mockResolvedValue({ status: 'recusado', motivo: 'saldo' }),
  };
  const notificador = { enviar: vi.fn() };

  const resultado = await renovarAssinatura(
    assinaturaAtiva(), repositorio, gateway, notificador, relogioFixo
  );

  expect(resultado.status).toBe('INADIMPLENTE');
});

// ── T4 ───────────────────────────────────────────────────────────────
test('T4 — não notifica quando a cobrança é recusada', async () => {
  const repositorio = { salvar: vi.fn() };
  const gateway = { cobrar: vi.fn().mockResolvedValue({ status: 'recusado' }) };
  const notificador = { enviar: vi.fn() };

  await renovarAssinatura(
    assinaturaAtiva(), repositorio, gateway, notificador, relogioFixo
  );

  expect(notificador.enviar).not.toHaveBeenCalled();
});

// ── T5 ───────────────────────────────────────────────────────────────
test('T5 — assinatura cancelada é rejeitada', async () => {
  const repositorio = { salvar: vi.fn() };
  const gatewayDummy = { cobrar: vi.fn() };
  const notificadorDummy = { enviar: vi.fn() };

  await expect(
    renovarAssinatura(
      assinaturaCancelada(), repositorio, gatewayDummy, notificadorDummy, relogioFixo
    )
  ).rejects.toThrow(AssinaturaCanceladaError);
});

// ── T6 ───────────────────────────────────────────────────────────────
test('T6 — envia o e-mail de confirmação', async () => {
  const repositorioDummy = { salvar: vi.fn() };
  const gatewayStub = { cobrar: vi.fn().mockResolvedValue({ status: 'aprovado' }) };
  const notificadorSpy = { enviar: vi.fn() };

  await renovarAssinatura(
    assinaturaAtiva(), repositorioDummy, gatewayStub, notificadorSpy, relogioFixo
  );

  expect(notificadorSpy.enviar).toHaveBeenCalledTimes(1);
  expect(notificadorSpy.enviar).toHaveBeenCalledWith(
    'ana@exemplo.com',
    'Assinatura renovada até 31/03/2026'
  );
});
