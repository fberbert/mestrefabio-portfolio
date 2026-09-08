# Validação de manutenção

Use Node **22.21.0**, conforme `.node-version`. Instale com `npm ci`. Os comandos locais pesados devem respeitar a preferência de CPU do projeto:

```bash
systemd-run --user --scope --quiet --expand-environment=no \
  -p CPUQuota=50% -p CPUWeight=10 -- nice -n 10 npm run test:coverage
```

O Node correto deve estar no `PATH` antes da execução. A quota vale para o comando e seus descendentes; execute as validações sequencialmente para limitar o consumo agregado.

## Comandos

```bash
npm ci
npm audit
npm run typecheck
npm run lint
npm run test:coverage
npm run test:deploy
npm run test:e2e
```

Aplique o wrapper de CPU aos comandos acima. O E2E exige Chrome em `/usr/bin/google-chrome`, ou o caminho definido em `PLAYWRIGHT_CHROME_PATH`. O comando gera um build de produção novo e inicia o servidor na porta local 43113, encerra esse servidor ao terminar e recusa reutilizar um servidor existente. Não publica o projeto.

Vitest cobre a Server Action real com o SDK Resend simulado, validação de entrada, concorrência e expiração do limitador, confirmação/erro/exceção do provedor e o formulário com `useFormStatus` real. O limiar de 80% considera explicitamente `actions/sendEmail.ts`, `lib/contact/`, `lib/site-metadata.ts`, `components/contact-form.tsx` e `components/contact-submit-button.tsx`; não representa cobertura de toda a interface. Relatório em `coverage/index.html` e resumo em `coverage/coverage-summary.json`.

Playwright usa navegador e Server Actions reais. O preload `tests/support/resend-mock.cjs`, carregado apenas pelo servidor de testes, intercepta a fronteira HTTP do Resend, exige uma chave fictícia e bloqueia outros destinos externos. Não há desvio de teste no código de produção e nenhum email real é enviado. Os testes verificam HTML/metadados/ícone/política, envio pendente, sucesso, preservação de campos após falhas e limitação de tentativas.

Os testes Python de publicação continuam separados; o E2E isolado de PM2/rollback e a cobertura Python estão documentados em [deploy.md](deploy.md).

## Limites operacionais do contato

O servidor permite **3 tentativas por email normalizado e 20 no total em cada janela de 10 minutos**, reservadas antes de aguardar o provedor. Falhas de entrega também consomem quota; entradas inválidas não a consomem. Identidades ficam em memória como hashes e a quantidade é limitada pelo orçamento global.

O limitador atende à implantação atual de um processo PM2. Reinícios apagam as quotas; múltiplos processos teriam quotas independentes. Janelas fixas permitem até duas quotas próximas de uma fronteira. Não identifica uma pessoa pelo email nem substitui controle de tráfego no proxy; não usa `X-Forwarded-For` sem uma cadeia de confiança. Uma futura mudança para múltiplas instâncias exige armazenamento compartilhado. Os controles existentes do proxy e a necessidade de desafio anti-bot ainda precisam de avaliação operacional.

A atualização usa Next.js 15.5.25, React 19.2.8, Resend 6.26.0 e Sharp 0.35.4. O override de PostCSS mantém as dependências transitivas na linha 8 corrigida. ESLint 9 permanece por compatibilidade com `eslint-config-next` 15; sua linha está fora de suporte e deve acompanhar a futura migração do framework/configuração. A auditoria npm é uma fotografia dos avisos publicados, não garantia de ausência de vulnerabilidades.
