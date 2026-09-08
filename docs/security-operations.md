# Proteção do contato e diagnóstico operacional

## Decisão e validação — 8 de setembro de 2026

A proteção combina a quota da Server Action (3 tentativas/email e 20 globais por janela de 10 minutos) com limite no Nginx por endereço de conexão: média de 6 POST/minuto e rajada adicional de 3. GET e HEAD não consomem quota. Corpos acima de 64 KiB recebem 413; excesso de POST recebe 429 antes de chegar à aplicação. `X-Forwarded-For` fornecido pelo cliente não define a identidade do limitador.

O Nginx efetivo não tinha `real_ip_header`, `set_real_ip_from` nem zonas de limitação. Na amostra dos últimos 2.000 registros de acesso havia predominância de GET e redirecionamentos, sem evidência suficiente de abuso do contato que justificasse um CAPTCHA externo. Por isso a decisão inicial é usar as duas quotas, sem acrescentar desafio visual ou dependência de terceiros. Reavaliar se houver entregas abusivas apesar dos limites. Usuários atrás do mesmo IP compartilham a quota do proxy; reiniciar Nginx limpa sua zona, enquanto reload a preserva. Mudanças futuras na cadeia de proxies exigem revisar a origem confiável do IP.

O `next start` passa a escutar somente `127.0.0.1:3010`, evitando acesso direto que contorne o proxy. O helper de deploy e a configuração PM2 versionada fixam esse endereço; alterações só entram no runtime na publicação.

## Configuração Nginx

- `ops/nginx/mestrefabio-contact-http.conf` → `/etc/nginx/conf.d/mestrefabio-contact.conf`, no contexto `http`.
- `ops/nginx/mestrefabio-contact-location.conf` → `/etc/nginx/snippets/mestrefabio-contact.conf`, incluído exclusivamente em `location /` do virtual host `/etc/nginx/sites-available/016-mestrefabio.com`.
- O limite anterior de 50 MiB do virtual host foi removido. Outros sites não usam a nova zona.
- Antes de aplicar: cópia privada do virtual host, `nginx -t`; depois de escrever: novo `nginx -t` e `systemctl reload nginx`. Em falha, restaurar o virtual host e remover os dois includes novos antes de validar/recarregar.
- Backup da aplicação inicial: `/var/backups/mestrefabio-security-20260908T113754Z/016-mestrefabio.com`, diretório 0700 e arquivo 0600, acessível via sudo.

Para desfazer esta proteção no proxy, restaurar o arquivo do backup, remover os dois arquivos de configuração adicionados e validar/recarregar Nginx. Não restaure o binding público da porta 3010: o proxy continua funcionando com loopback.

`python3 tests/e2e_proxy.py` exercita Nginx real com configuração temporária e upstream fictício local. O teste foi executado de forma isolada no servidor, sem publicar nem enviar emails: GET livre antes/depois da quota, rajada de POST, bloqueio de XFF falso, corpo no limite e acima dele, confirmação de que requisições rejeitadas não chegam ao upstream. A variante `--without-guard` falhou como esperado antes de ativar os snippets.

## Diagnóstico sem segredos

```bash
python3 scripts/diagnose.py --host two
```

A consulta lê PM2 internamente, filtra no servidor e valida novamente no cliente. Retorna somente nome, status permitido, diretório de release reconhecido, PID numérico e presença booleana de chave OpenAI. Erros não imprimem saída remota, ambiente ou detalhes de exceções. Nove testes cobrem valores maliciosos e falhas contendo segredos.

O diretório remoto `~/.pm2` foi restringido a 0700; `dump.pm2` e `dump.pm2.bak`, a 0600. Isso não muda processos nem remove dados de recuperação. O diagnóstico confirmou `mestrefabio` sem chave OpenAI. O launcher de deploy já usa ambiente permitido explicitamente, evitando herdar chaves do shell.

O arquivo local da sessão que recebeu a exposição foi identificado e restringido a 0600, preservando o registro. Essa mudança não apaga cópias, compartilhamentos ou registros do serviço que hospeda a conversa. Nenhuma chave, parte da chave ou hash foi copiado para esta documentação.

## Situação da credencial

A chave exata do registro foi comparada somente em memória e testada em `GET /v1/models`: a OpenAI respondeu **401, `invalid_api_key`**. Ela não autentica atualmente; isso não revela quando ou por quem foi invalidada. Não foi criada nem revogada uma chave por esta manutenção.

A mesma credencial antiga aparece no ambiente de quatro processos externos ao portfólio: `automatizando.dev`, `rabugento.app`, `strike-festas` e `yt-resume`. Presença no ambiente não comprova consumo. O primeiro projeto contém referências de código a `OPENAI_API_KEY`; é necessário confirmar sua configuração efetiva e consumidores antes de substituir/remover variáveis ou reiniciá-los.

Não há credencial administrativa OpenAI nos ambientes consultados. A conclusão da rotação e revisão de uso exige identificar a organização/projeto no painel, confirmar a chave invalidada e, se necessário, fornecer substitutas por canal seguro aos consumidores legítimos. Não enviar valores pela conversa. Esta etapa permanece aberta no TODO; o pedido do usuário já autoriza a correção, falta acesso/contexto da conta.

Referências: [limites do Nginx](https://nginx.org/en/docs/http/ngx_http_limit_req_module.html) e [administração de chaves OpenAI](https://platform.openai.com/docs/api-reference/admin-api-keys).
