# Wagner Giraud — Portfólio

Aplicação Angular 22, TypeScript 6, Node.js 22.22.3 ou superior da série 22.

## Desenvolvimento

```bash
npm ci
npm start
npm test -- --watch=false --browsers=ChromeHeadless
npm run build
```

## Identificação automática de builds

O script `scripts/generate-build-info.mjs` gera o arquivo TypeScript `src/app/core/generated/build-info.ts` durante a instalação e antes dos comandos de build, desenvolvimento e testes. O arquivo gerado é ignorado pelo Git.

O identificador combina o instante UTC (ano, mês, dia, hora, minuto, segundo e milissegundo) com o SHA curto do commit. A data visível é formatada no horário de São Paulo. O commit é obtido de `VERCEL_GIT_COMMIT_SHA`, `GITHUB_SHA` ou do Git local, nessa ordem.

No Vercel, `vercel.json` usa `npm run build`, então cada novo build regenera os dados automaticamente. Não é necessário alterar o package.json a cada deploy nem realizar commits automáticos. Um rollback retorna os metadados do build restaurado; promover um build existente não altera a data de compilação.

## Deploy

1. Abra uma branch feature e faça as alterações.
2. Abra PR para develop e valide o Angular CI.
3. Abra PR de develop para main e valide o CI antes do merge.
4. O Vercel publica automaticamente a main quando o deploy está autorizado.

O rodapé mostra a identificação do build e o horário da última compilação.
