# Plano de implementação do deploy

Escopo aprovado: os 11 itens de deploy de `TODO.md`. Formulário, atualização de dependências e rotação de credenciais ficam nas suas próprias pendências.

## Desenho

O launcher `~/bin/build-mestrefabio` chama o código versionado do repositório. O cliente exporta um commit Git limpo para um diretório temporário, adiciona um manifesto e envia esse diretório com rsync para uma release exclusiva. Não há `git pull` remoto. O servidor instala dependências com `npm ci` e compila dentro da release usando o mesmo executável Node fixado para o PM2. Essa escolha elimina a dependência do Node local para publicar.

O helper remoto valida o manifesto e caminhos, impede concorrência, prepara a release e só então altera o processo `mestrefabio`. A ativação confere tanto PM2 quanto HTTP e a identidade da versão. Falhas restauram a versão anterior. Segredos permanecem no servidor e não entram no artefato nem nos diagnósticos.

## Sequência e evidência

1. Escrever testes do cliente antes da implementação: checkout sujo, falhas SSH/rsync, exportação de arquivos ocultos, manifesto, argumentos e caminhos com espaços.
2. Implementar `scripts/deploy.py` e o launcher estrito; executar os testes e ShellCheck.
3. Escrever testes do helper remoto antes da implementação: instalação/build, Node divergente, PM2, HTTP e recuperação. Implementar `scripts/deploy_remote.py` e `ecosystem.config.cjs`.
4. Exercitar integração com filesystem, Git e rsync reais; testar processo/HTTP e rollback em ambiente isolado.
5. Validar build real com Node fixado, revisar segurança e correção com agente independente, corrigir achados e executar novamente os testes afetados.
6. Registrar comandos, requisitos e evidências em `docs/deploy.md`; atualizar os 11 itens do TODO conforme a evidência, distinguindo implementação de ativação em produção.

## Limite operacional

A implementação e testes isolados estão autorizados. Alterar o processo de produção é uma etapa de publicação separada: preparar o resultado concreto antes de solicitar essa autorização, caso ainda não esteja explícita. Nenhuma validação local será descrita como deploy de produção executado.
