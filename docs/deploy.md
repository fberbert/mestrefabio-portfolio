# Publicação do portfólio

Este procedimento atende quem opera o portfólio e cobre preparação, ativação, verificação e recuperação. O cliente exporta um commit Git limpo; o servidor instala dependências, compila e executa essa mesma versão. Não é necessário fazer push para publicar um commit local.

## Contrato e pré-condições

| Configuração | Valor padrão |
| --- | --- |
| Host SSH | `two` |
| Raiz das publicações | `/home/fabio/apps/mestrefabio` |
| Versões | `releases/<commit>-<identificador aleatório>` dentro da raiz |
| Ponteiro ativo | `current` dentro da raiz |
| Checkout legado | `/home/fabio/projetos/mestrefabio-portfolio` |
| Origem das variáveis | `.env.local` do checkout legado |
| Processo PM2 | `mestrefabio` |
| Porta HTTP | `3010` |
| Node do build e runtime | `22.21.0`, fixado em `.node-version` |

No cliente, são necessários Python 3.12 ou superior, Git, SSH e rsync. A extração usa o filtro `data` de `tarfile`. Node local não participa do deploy. A exportação temporária usa `~/.cache/mestrefabio-deploy` por padrão; se `TMPDIR` estiver definido, usa esse diretório. Reserve espaço para o snapshot nesse local. O SSH usa autenticação não interativa e exige acesso previamente configurado ao host.

No servidor, são necessários Linux, Python 3.9 ou superior, rsync, Node **22.21.0**, npm e PM2 disponíveis no `PATH` da sessão SSH não interativa. A versão exata do Node é verificada antes da preparação; build e processo usam o mesmo executável. O usuário SSH deve conseguir gravar a raiz de publicações e administrar seu processo PM2.

O processo `mestrefabio` deve estar online e seu diretório deve corresponder ao checkout legado na primeira migração, ou à release apontada por `current` nas seguintes. O processo deve usar uma única instância em modo fork, sem watch nem reinício por cron, para permitir restaurar sua configuração com segurança. Um estado diferente interrompe a operação para investigação. O fluxo normal não cria um processo de produção do zero; a opção interna de criação existe somente para testes isolados.

Forneça `RESEND_API_KEY` de forma segura no `.env.local` remoto, como arquivo regular legível pelo usuário SSH. O preparador copia esse arquivo para a release com permissão `0600`; não transfere o `.env.local` local. O checkout legado continua sendo a origem das variáveis nas publicações seguintes. Alterações de credenciais exigem procedimento próprio, e não devem ser registradas no Git, em comandos com valores literais ou em logs.

O runtime contém código, `public/`, configurações, `.next` e `node_modules` da mesma revisão. A aplicação usa `next start`; não há pacote standalone. A especificação PM2 está em [`../ecosystem.config.cjs`](../ecosystem.config.cjs). O ativador deriva dela uma configuração temporária com diretório e interpretador absolutos verificados; use o cliente de deploy para iniciar a versão.

## Preparar o cliente

O comando pessoal deve executar o launcher versionado em [`../scripts/build-mestrefabio`](../scripts/build-mestrefabio). Ele localiza o repositório por caminho explícito e não muda o diretório do shell chamador. É possível selecionar outro checkout com `MESTREFABIO_REPO`.

Antes de publicar, revise e faça commit de todos os arquivos da versão. O cliente recusa alterações rastreadas e arquivos novos não ignorados; arquivos ignorados não entram no pacote. O snapshot é gerado por `git archive HEAD`, sem links e sem arquivos `.env` potencialmente secretos versionados. O manifesto registra commit, versão do Node e hash SHA-256 do lockfile.

Valide a exportação sem conexão remota:

```bash
~/bin/build-mestrefabio --check
```

Também é possível chamar `python3 scripts/deploy.py` na raiz do repositório, com as mesmas opções. Para apontar outro destino, existem `--host`, `--root` e `--legacy-dir`; use caminhos absolutos dedicados. Esses parâmetros mudam o destino real da operação.

## Limite de CPU local

O launcher `~/bin/build-mestrefabio` executa toda a árvore de processos locais em um scope do systemd com `CPUQuota=50%`, `CPUWeight=10` e prioridade `nice 10`. A quota padrão equivale a **metade de um núcleo**, compartilhada por Python, Git, rsync, SSH e seus filhos; não é 50% de todos os núcleos da máquina. A quota é por execução do comando.

Para reduzir o limite a um quarto de núcleo:

```bash
MESTREFABIO_CPU_QUOTA=25 ~/bin/build-mestrefabio
```

Aceita inteiros de 1 a 100, sem `%`; o padrão é 50. Um limite menor pode aumentar o tempo de preparação e transferência. É necessário systemd 254 ou superior, sessão de usuário acessível e cgroups v2 com controle de CPU. Se o gerenciador ou a configuração falhar, o comando termina com erro, sem repetir a execução sem limite. A configuração vale para novas execuções, não modifica processos já em andamento.

O build Next.js ocorre no servidor; essa quota cobre somente o trabalho **local**. Ela não limita carga de outros programas nem o build remoto. Chamar `python3 scripts/deploy.py` diretamente contorna o launcher e seu limite; use `~/bin/build-mestrefabio` nas operações normais.

Teste local com dois processos filhos e medição da quota real, sem rede nem deploy:

```bash
python3 tests/e2e_cpu_limit.py
```

Validação em 8 de setembro de 2026: 54 testes passaram; no teste real, dois filhos compartilharam `cpu.max=50000 100000` e consumiram juntos 2,01 segundos de CPU em 4,03 segundos de execução.

## Publicar

```bash
~/bin/build-mestrefabio
```

O cliente cria um diretório novo e exclusivo no servidor e usa rsync com origem terminada em `/`, incluindo arquivos ocultos do snapshot. `--delete` fica restrito a esse diretório novo; nunca é aplicado ao checkout legado nem à versão em uso. Não existe `git pull` remoto.

Dentro da release, o servidor executa `npm ci --no-audit --no-fund` e `npm run build`. Dependências e build não são reutilizados de outra versão. Falhas de exportação, SSH, transferência, instalação ou build encerram o comando com erro. Antes da ativação, a versão atual permanece atendendo.

Para compilar sem ativar:

```bash
~/bin/build-mestrefabio --prepare-only
```

Guarde o identificador completo mostrado na saída. Para ativar essa preparação posteriormente:

```bash
~/bin/build-mestrefabio --activate IDENTIFICADOR_DA_RELEASE
```

O modo de ativação verifica manifesto, versão do Node, lockfile, marcador de preparação e `BUILD_ID`; não recompila a versão. Ativação e rollback usam a versão do Node declarada no manifesto da release escolhida, independentemente da versão fixada no checkout local atual.

## Ativação e verificação

A ativação troca atomicamente o link `current`, remove o processo PM2 anterior e inicia o processo `mestrefabio` no diretório absoluto da release. **Há uma breve interrupção entre a remoção e a inicialização do processo; este fluxo não oferece zero downtime.**

O sucesso exige processo PM2 online no diretório esperado, HTTP 200 em `http://127.0.0.1:3010/` e commit correto em `/deploy-version.json`. As tentativas são limitadas e cada requisição possui timeout. Somente depois dessas verificações é executado `pm2 save` e anunciado sucesso.

Essa verificação comprova a aplicação na porta local do servidor. Depois de uma publicação, confira também o acesso público pelo proxy e os fluxos relevantes do site; o teste HTTP interno não valida DNS, TLS nem envio real de email.

## Rollback e interrupções

Se a ativação ou sua verificação falhar, o helper tenta restaurar o link anterior e o processo correspondente, verifica HTTP e salva o estado PM2. O comando continua retornando erro mesmo quando a recuperação funciona. Na primeira migração, o destino anterior é o checkout legado.

Para retornar voluntariamente a uma release preparada e preservada:

```bash
~/bin/build-mestrefabio --activate IDENTIFICADOR_DA_RELEASE_ANTERIOR
```

Releases preparadas e anteriores são preservadas, inclusive quando uma preparação falha. Não há limpeza automática; monitore espaço em disco. Não remova o destino de `current`, uma versão necessária ao rollback ou qualquer versão referenciada pelo journal de ativação.

Uma ativação deixa `.activation-journal.json` enquanto está em andamento. Interrupções não recuperáveis, como `SIGKILL` ou queda do servidor, podem preservar esse arquivo. Nesse estado, novas operações são bloqueadas. Para restaurar o estado anterior registrado:

```bash
~/bin/build-mestrefabio --recover IDENTIFICADOR_DA_RELEASE_INTERROMPIDA
```

A recuperação exige que release, raiz, nome e porta correspondam ao journal. Usa a configuração original do PM2 preservada em `.rollback.config.json`, incluindo seu interpretador, verifica a aplicação restaurada e só então remove os registros. Não exige que o Node atual do `PATH` corresponda ao da release interrompida. Esse snapshot contém o comando e o ambiente originais: fica exclusivamente no servidor, com permissão `0600`, fora do repositório e dos logs. Não o imprima, compartilhe nem remova para contornar uma falha. Se a recuperação falhar, mantenha os registros para investigação e consulte somente campos operacionais permitidos. Um snapshot privado órfão, sem journal, é validado e removido automaticamente na próxima operação normal.

## Diagnóstico sem segredos

Evite `pm2 describe`, `pm2 env` e saída bruta de `pm2 jlist`, pois podem mostrar variáveis sensíveis. O helper consulta PM2 internamente e seleciona somente status e diretório; não imprime o ambiente nem a saída capturada de comandos que falham. Uma falha informa a etapa ou a categoria do erro. Investigue logs da aplicação apenas com cuidado para não reproduzir credenciais ou dados pessoais.

## Verificação local da implementação

Na raiz do repositório:

```bash
python3 -m unittest discover -s tests -p 'test_*.py'
shellcheck scripts/build-mestrefabio
```

O exercício E2E requer Node 22.21.0 e PM2 no `PATH`:

```bash
python3 tests/e2e_deploy.py
```

Esse exercício cria um `HOME` temporário, um daemon PM2 separado, uma porta livre e uma aplicação HTTP de teste. Exercita instalação/build reais via npm, preparação sem ativação, identidade HTTP, falhas e rollback; encerra seu daemon ao terminar. Ele não publica o portfólio nem comprova o funcionamento do formulário. A validação do build real do projeto e uma publicação de produção devem ter suas evidências registradas separadamente.

## Evidências de implementação — 8 de setembro de 2026

O launcher pessoal foi substituído pelo launcher versionado, mantendo uma cópia do script anterior em `~/bin/build-mestrefabio.backup-20260908T084009Z`. Ele foi verificado a partir de outros diretórios e com repositório inexistente; Bash e ShellCheck passaram.

A instalação limpa e o build do portfólio completo passaram com Node 22.21.0 em um diretório isolado. A aplicação compilada também iniciou em PM2 isolado na porta 43110 e passou pelas verificações HTTP de página e commit. Foi usada uma chave fictícia apenas para permitir o build; não houve teste de envio de email.

Na validação inicial do deploy, a suíte tinha **50 testes passando**, com **91% de cobertura de linhas** dos scripts Python (99% cliente, 88% helper remoto). O teste E2E com npm, PM2 e HTTP reais passou por preparação, ativação, diretórios com espaços, falha de build, rollback automático, retorno manual, restauração de comando/ambiente legado e recuperação após `SIGKILL`. Testes de rede usam fronteiras simuladas para SSH; Git e rsync são exercitados em diretórios reais temporários.

Para medir a cobertura, instale `coverage` em um ambiente Python separado e execute:

```bash
coverage run --source=scripts -m unittest discover -s tests -p 'test_*.py'
coverage report --fail-under=80
```

A auditoria de dependências continua com 19 ocorrências (13 altas, 5 moderadas e 1 baixa). A mudança do deploy não atualizou bibliotecas: o lockfile recebeu apenas o requisito da versão Node. Essas correções continuam no TODO próprio.

Essas evidências são locais. Nenhuma versão foi ativada no servidor de produção durante esta implementação. A migração de produção usa o procedimento de publicação descrito acima.

## Primeira publicação em produção — 8 de setembro de 2026

- Commit publicado: `6f24333c16197c0eb1427ab78ae09a63976a9537`.
- Release ativa: `6f24333c16197c0eb1427ab78ae09a63976a9537-7eae0255d1a4`.
- Publicação pelo launcher com quota local de 50% de um núcleo; instalação, build e ativação concluídos no servidor `two`.
- PM2 `mestrefabio` online, com diretório correspondente ao link `current`; `BUILD_ID` e marcador de preparação presentes, sem journal ou snapshot de recuperação pendente.
- Domínio público: `/`, `/whereisluiza.html` e `/deploy-version.json` responderam HTTP 200. A identidade pública corresponde ao commit publicado, e o HTML da política corresponde integralmente ao arquivo local por SHA-256.

Este registro atualiza o estado operacional após a validação local descrita anteriormente. Nenhum push Git foi necessário para a publicação.
