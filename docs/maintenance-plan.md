# Dependências, testes e metadados

Escopo: os três itens de dependências e manutenção do TODO. A cobertura solicitada depende de correções mínimas do contato para validar rejeições, falhas do Resend, estado pendente e limitação de envios; não inclui rotação de credenciais ou publicação em produção.

1. Auditar dependências e confirmar patches nas fontes oficiais. Migrar Next.js 14 para a última correção da linha 15 em manutenção, com React e ferramentas compatíveis; renovar o lockfile e eliminar ocorrências também nas dependências de desenvolvimento.
2. Criar testes antes das correções dos fluxos de contato: validação, retorno de erro/exceção do provedor, ausência de confirmação, sucesso, limite de envios e formulário pendente. Isolar a fronteira Resend para não enviar emails nos testes.
3. Consolidar o título e a descrição em metadados tipados usados pelo layout. Remover o head legado e o favicon inexistente/duplicado, preservando o ícone gerado.
4. Adicionar Vitest/Testing Library para unidade e integração, com limiar de 80% nos módulos críticos de contato/metadados. Manter os testes Python do deploy. Adicionar Playwright para verificar HTML real e submissão pela Server Action com provedor simulado fora do código da aplicação.
5. Executar auditoria completa, TypeScript, lint, cobertura, build de produção e E2E; revisar correção/segurança e registrar evidências no TODO e documentação. Comandos pesados usam cgroup com quota local de CPU.

Referências: [suporte Next.js](https://nextjs.org/support-policy), [migração para Next.js 15](https://nextjs.org/docs/app/guides/upgrading/version-15) e [correções de agosto de 2026](https://nextjs.org/blog/august-2026-security-release). A linha 15.5.25 selecionada inclui as correções publicadas em 15.5.24.

## Resultado

Concluído em 8 de setembro de 2026. Evidências e pendências restantes em [TODO.md](TODO.md); comandos, cobertura e limites operacionais em [testing.md](testing.md). Testes de contato foram escritos antes das correções, mas a execução inicial só foi possível após instalar e ajustar o novo runner; não houve validação de uma fase RED funcional. A suíte final validou os cenários descritos.
