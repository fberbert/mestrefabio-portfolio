# Correções pendentes

Levantamento de 8 de setembro de 2026. Os 11 itens de deploy foram implementados e validados em ambiente isolado; a produção ainda não foi migrada. Os demais itens continuam pendentes. Evidências e operação: [deploy.md](deploy.md).

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

- [ ] **Alta — Tratar erros retornados pelo Resend.** Em `actions/sendEmail.ts`, examinar o campo `error` da resposta do SDK, além de exceções. Atualmente a resposta inteira fica dentro de `data`, enquanto `components/contact.tsx` verifica apenas o erro externo.
  - Validação: erro retornado pelo provedor e exceção exibem falha e preservam os campos; apenas um envio confirmado exibe sucesso e limpa o formulário.
- [ ] **Média — Corrigir `useFormStatus`.** Mover o botão de envio para um componente descendente do `<form>` e chamar o hook nele. Atualmente o hook está no componente que renderiza o próprio formulário.
  - Validação: durante uma submissão pendente, o botão fica desabilitado e mostra o indicador de envio; após a conclusão, volta ao estado normal.
- [ ] **Alta — Adicionar proteção contra abuso.** Implementar limitação no servidor e avaliar proteção anti-bot proporcional ao formulário público. Não depender apenas do bloqueio do botão no navegador.
  - Validação: submissões acima do limite são rejeitadas antes de chamar o Resend, sem impedir o uso normal. Confirmar também eventuais controles já existentes no proxy.
- [ ] **Média — Fortalecer a validação no servidor.** Validar formato do email, normalizar espaços e rejeitar mensagens vazias ou compostas apenas por espaços, preservando limites de tamanho. Não confiar somente nos atributos HTML.
  - Validação: email inválido, campos ausentes, valores que não sejam strings e conteúdo acima do limite são rejeitados sem envio.
- [ ] **Média — Não devolver erros internos ao cliente.** Substituir o retorno direto de `getErrorMessage(error)` por uma mensagem apropriada ao usuário. Registrar detalhes úteis no servidor com remoção de segredos e dados pessoais desnecessários.
  - Validação: respostas de falha não expõem configuração, credenciais ou detalhes internos do provedor.

## Dependências, testes e manutenção

- [ ] **Alta — Analisar e corrigir vulnerabilidades de dependências.** O `npm audit --omit=dev` apontou 19 ocorrências: 13 altas, 5 moderadas e 1 baixa. Avaliar a aplicabilidade, priorizar dependências expostas em runtime e atualizar com revisão do lockfile. Não aplicar atualizações maiores automaticamente sem verificar compatibilidade.
  - Validação: repetir a auditoria após as atualizações e registrar pendências justificadas; executar TypeScript, lint, build e testes dos fluxos afetados.
- [ ] **Média — Criar cobertura automatizada dos fluxos críticos.** Não foi encontrada suíte de testes. Cobrir validação, falhas do provedor, sucesso de envio, estado pendente, proteção contra abuso e controle de falhas do deploy, usando serviços simulados para não enviar emails nem publicar durante os testes.
  - Validação: testes unitários, de integração e E2E relevantes passam; atingir a cobertura mínima de 80% estabelecida pelas instruções do projeto.
- [ ] **Baixa — Consolidar metadados do App Router.** Revisar `app/head.tsx` e `app/layout.tsx`, remover definições redundantes ou inertes e corrigir o erro de digitação no título legado.
  - Validação: o HTML entregue contém título e metadados esperados, sem duplicação conflitante.

## Credencial exposta na consulta operacional

- [ ] **Alta — Revogar e substituir a chave exibida pelo PM2.** A consulta `pm2 describe` exibiu inesperadamente uma variável `OPENAI_API_KEY` herdada pelo processo. Não registrar o valor neste documento, no repositório ou em novos logs. A alteração da credencial deve ocorrer em uma ação explicitamente autorizada.
  - Validação: a chave antiga está revogada; consumidores legítimos, se houver, usam a substituta; revisar uso inesperado no período da exposição.
- [ ] **Alta — Reduzir exposição de segredos em diagnósticos.** Revisar a necessidade dessa variável no processo do portfólio e preferir consultas que selecionem apenas campos operacionais permitidos, sem imprimir o ambiente completo. Revisar o acesso ao registro que recebeu a saída.
  - Validação: diagnósticos de nome, status e diretório do processo não exibem credenciais.

## Evidências e limites do levantamento

- TypeScript (`tsc --noEmit --incremental false`) e `npm run lint` passaram.
- A sintaxe Bash passou; ShellCheck apontou problemas de tratamento de `cd`, expansão e aspas.
- Os checkouts local e remoto estavam no commit `ff899ab`; ambos tinham Next.js 14.2.33 instalado.
- O PM2 remoto apresentou `mestrefabio` online, executando `npm start` na raiz do projeto. Isso não substitui validação HTTP.
- Não foi executado build nem deploy durante a avaliação. Os dados operacionais acima são um retrato da consulta, não garantias permanentes.

Referências: [deploy do Next.js 14](https://nextjs.org/docs/14/app/building-your-application/deploying) e [useFormStatus](https://react.dev/reference/react-dom/hooks/useFormStatus).
