# Correções pendentes

Levantamento de 8 de setembro de 2026. Os 11 itens de deploy foram implementados e validados em ambiente isolado; a primeira publicação em produção foi concluída em 8 de setembro de 2026 (commit `6f24333`). O estado de manutenção foi revisto em 8 de setembro de 2026; veja as evidências abaixo. Evidências e operação: [deploy.md](deploy.md).

## Deploy — `~/bin/build-mestrefabio`

- [x] **Alta — Corrigir o nome do processo PM2.** O script usa `mestrefabio.com`, mas o processo consultado no servidor `two` se chama `mestrefabio`. Definir o nome explicitamente e confirmar sua existência antes de publicar.
  - Validação: a configuração aponta para o processo correto e uma implantação autorizada reinicia a aplicação esperada.
- [x] **Alta — Interromper em qualquer falha.** Adotar tratamento estrito de erros, como `set -Eeuo pipefail`, verificar pré-condições e só anunciar sucesso depois de concluir todas as etapas.
  - Validação: simular falhas de build, mudança de diretório, SSH, rsync e PM2; nenhuma delas pode permitir etapas posteriores ou terminar com sucesso.
- [x] **Alta — Garantir a mesma revisão no build e no servidor.** Substituir o `git pull` independente por um fluxo que publique exatamente o commit compilado. Definir uma política para alterações locais não commitadas e registrar o commit implantado.
  - Validação: o commit associado ao artefato corresponde ao código da versão publicada; divergências interrompem o deploy.
- [x] **Alta — Sincronizar dependências com o lockfile.** Preparar as dependências da nova versão com `npm ci`, ou empacotar um runtime autocontido validado. Não atualizar apenas o código mantendo dependências antigas.
  - Validação: uma alteração de dependência é refletida no runtime publicado e a aplicação inicia com o lockfile da mesma revisão.
- [x] **Alta — Preparar versões separadas e permitir rollback.** Evitar sobrescrever a `.next` usada pelo processo ativo. Preparar e validar uma nova versão antes da ativação, preservando a anterior para recuperação.
  - Validação: falhas na preparação mantêm a versão atual disponível; falhas após a ativação permitem restaurar a versão anterior.
- [x] **Média — Corrigir a origem e as opções do rsync.** Usar um diretório de origem explícito com barra final em vez de `*`, revisar os filtros de `-C` e delimitar cuidadosamente o destino de `--delete`.
  - Validação: em diretórios temporários, arquivos ocultos necessários são copiados e arquivos obsoletos na raiz são removidos, sem atingir arquivos externos à versão.
- [x] **Média — Usar caminhos explícitos e argumentos entre aspas.** Separar diretório local, diretório remoto e nome PM2 em variáveis. Evitar depender de `$(pwd)` após sucessivos `cd`.
  - Validação: ShellCheck sem avisos pendentes relevantes; caminhos com espaços são tratados corretamente em testes isolados.
- [x] **Baixa — Remover o uso de `PWD` como cópia do diretório inicial.** Bash altera essa variável a cada `cd`. Usar uma variável própria, caso o retorno seja necessário; em execução como processo separado, o diretório do shell chamador não muda.
  - Validação: executar a partir de outro diretório funciona conforme o contrato documentado.
- [x] **Média — Alinhar a versão do Node.** Fixado Node 22.21.0 em `.node-version`, `.nvmrc` e `engines`. O deploy compila e executa no servidor usando o mesmo executável verificado, sem depender do Node local.
  - Validação: preparação, build e inicialização passam com a versão escolhida nos dois ambientes.
- [x] **Alta — Verificar a aplicação após ativar a versão.** Conferir estado do processo e resposta HTTP com timeout; retornar erro se a aplicação não estiver saudável.
  - Validação: uma aplicação que falha ao iniciar não produz mensagem de deploy concluído; o procedimento de recuperação é exercitado.
- [x] **Média — Documentar o contrato de publicação.** Versionar a configuração PM2 sem segredos e registrar host, caminhos, porta 3010, variáveis exigidas, preparação, ativação e rollback. O modelo atual usa `next start`, sem `output: "standalone"`; `.next` isolada não representa todo o runtime. Incluir `public/`, configuração e dependências da mesma versão.
  - Validação: uma instalação limpa pode ser preparada seguindo a documentação, incluindo `RESEND_API_KEY` fornecida de forma segura.

## Formulário de contato

- [x] **Alta — Tratar erros retornados pelo Resend.** A ação verifica `error`, exceções e presença de `data.id`. Somente entrega confirmada retorna sucesso; as falhas preservam os campos.
  - Validação: erro retornado pelo provedor e exceção exibem falha e preservam os campos; apenas um envio confirmado exibe sucesso e limpa o formulário.
- [x] **Média — Corrigir `useFormStatus`.** O botão agora é descendente do `<form>` e usa `useFormStatus` nesse contexto.
  - Validação: durante uma submissão pendente, o botão fica desabilitado e mostra o indicador de envio; após a conclusão, volta ao estado normal.
- [ ] **Alta — Adicionar proteção contra abuso.** Limitação no servidor implementada e testada: 3 tentativas/email e 20 globais por janela de 10 minutos, no processo atual. **Pendente:** confirmar controles do proxy e avaliar proteção anti-bot proporcional. Limites e comportamento em reinícios: [testing.md](testing.md).
  - Validação: submissões acima do limite são rejeitadas antes de chamar o Resend, sem impedir o uso normal. Confirmar também eventuais controles já existentes no proxy.
- [x] **Média — Fortalecer a validação no servidor.** Validar formato do email, normalizar espaços e rejeitar mensagens vazias ou compostas apenas por espaços, preservando limites de tamanho. Não confiar somente nos atributos HTML.
  - Validação: email inválido, campos ausentes, valores que não sejam strings e conteúdo acima do limite são rejeitados sem envio.
- [x] **Média — Não devolver erros internos ao cliente.** A ação retorna códigos públicos traduzidos; logs registram somente categorias de falha de entrega, sem mensagens do provedor, emails ou credenciais.
  - Validação: respostas de falha não expõem configuração, credenciais ou detalhes internos do provedor.

## Dependências, testes e manutenção

- [x] **Alta — Analisar e corrigir vulnerabilidades de dependências.** Atualizados Next.js 15.5.25, React 19.2.8, Resend 6.26.0 e Sharp 0.35.4, com renovação das transitivas e ajuste das ferramentas. `npm ci` e auditoria completa: **zero vulnerabilidades**, contra as 19 ocorrências iniciais. Compatibilidade verificada por build, lint, tipos e testes; ESLint 9 mantido por compatibilidade e documentado em [testing.md](testing.md).
  - Validação: repetir a auditoria após as atualizações e registrar pendências justificadas; executar TypeScript, lint, build e testes dos fluxos afetados.
- [x] **Média — Criar cobertura automatizada dos fluxos críticos.** 26 testes Vitest de unidade/integração, 7 E2E Playwright e 54 testes Python de deploy passaram. Cobertura de 100% nos módulos críticos de contato/metadados selecionados, com limiar mínimo de 80%; os serviços de email são simulados e nenhum deploy ocorre nos testes. Comandos e escopo da métrica: [testing.md](testing.md).
  - Validação: testes unitários, de integração e E2E relevantes passam; atingir a cobertura mínima de 80% estabelecida pelas instruções do projeto.
- [x] **Baixa — Consolidar metadados do App Router.** Fonte tipada única em `lib/site-metadata.ts`, usada pelo layout; removidos head legado e ícone duplicado. O navegador confirmou um título, uma descrição e um favicon funcional.
  - Validação: o HTML entregue contém título e metadados esperados, sem duplicação conflitante.

## Credencial exposta na consulta operacional

- [ ] **Alta — Revogar e substituir a chave exibida pelo PM2.** A consulta `pm2 describe` exibiu inesperadamente uma variável `OPENAI_API_KEY` herdada pelo processo. Não registrar o valor neste documento, no repositório ou em novos logs. A correção foi autorizada. A chave identificada já retorna **401 / invalid_api_key**; não foi revogada por esta manutenção. **Pendente:** acesso ao painel da organização para revisar uso e confirmar/substituir consumidores legítimos. A chave antiga ainda aparece em quatro outros processos; veja [security-operations.md](security-operations.md).
  - Validação: a chave antiga está revogada; consumidores legítimos, se houver, usam a substituta; revisar uso inesperado no período da exposição.
- [x] **Alta — Reduzir exposição de segredos em diagnósticos.** Processo do portfólio confirmado sem chave OpenAI. Helper `scripts/diagnose.py` filtra dados nos dois lados do SSH, com 9 testes. Diretório PM2 0700, dumps 0600 e registro local da exposição 0600. Limites sobre cópias externas e operação: [security-operations.md](security-operations.md).
  - Validação: diagnósticos de nome, status e diretório do processo não exibem credenciais.

## Validação da manutenção — 8 de setembro de 2026

- Instalação limpa com `npm ci`, auditoria completa zerada, lint e checagem TypeScript do build aprovados.
- Build de produção Next.js 15.5.25 aprovado; HTML e envio pela Server Action verificados no Chrome.
- 26 testes unitários/de integração, 7 E2E de navegador e 54 testes Python passaram. Cobertura JavaScript: 100% de linhas, funções, branches e statements nos módulos selecionados.
- Validações locais com quota de CPU de 50% de um núcleo. Nenhum deploy executado nesta manutenção.
- Revisão de código/segurança sem achados graves; comando E2E ajustado para sempre gerar um build novo.

## Evidências históricas do levantamento inicial

- TypeScript (`tsc --noEmit --incremental false`) e `npm run lint` passaram.
- A sintaxe Bash passou; ShellCheck apontou problemas de tratamento de `cd`, expansão e aspas.
- Os checkouts local e remoto estavam no commit `ff899ab`; ambos tinham Next.js 14.2.33 instalado.
- O PM2 remoto apresentou `mestrefabio` online, executando `npm start` na raiz do projeto. Isso não substitui validação HTTP.
- Não foi executado build nem deploy durante a avaliação. Os dados operacionais acima são um retrato da consulta, não garantias permanentes.

Referências: [deploy do Next.js 14](https://nextjs.org/docs/14/app/building-your-application/deploying) e [useFormStatus](https://react.dev/reference/react-dom/hooks/useFormStatus).
