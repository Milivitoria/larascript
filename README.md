# Larascript

Projeto Laravel 13 mantendo a estrutura padrão do framework, com assets frontend em **TypeScript** via Vite.

## Estrutura adotada

- Backend continua no Laravel (rotas, controllers, migrations, etc.).
- Frontend segue padrão Laravel em `resources/`.
- Entrada TypeScript principal: `resources/js/app.ts`.
- Bundling continua com Vite + `laravel-vite-plugin`.
- Biome é a ferramenta padrão de lint/format para o código TS.

## Desenvolvimento

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
```

Executar aplicação Laravel e Vite em terminais separados:

```bash
php artisan serve
npm run dev
```

## Qualidade

```bash
npm run lint
npm run typecheck
npm run build
php artisan test
```

## CI

O workflow executa:

- testes PHP do Laravel
- quality gates Node (Biome, TypeScript e build Vite)
