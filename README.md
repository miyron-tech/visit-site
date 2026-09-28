# Vlad Zakalyuzhnyy - портфолио

Сайт-визитка

Стек: React, TypeScript, Tailwind CSS, Vite, NestJS, Apollo GraphQL, Prisma, SQLite, Docker.

## Запуск в Docker

```sh
docker compose up --build -d
```

- Сайт: http://localhost:4300
- GraphQL: http://localhost:4300/graphql
- Healthcheck: http://localhost:4300/health

При старте применяются миграции и данные из `backend/prisma/profile.json`. База хранится в volume `profile-data`.

## Локальная разработка

Нужен Node.js 22+.

```sh
npm ci
npm --prefix backend ci
cp backend/.env.example backend/.env
npm run build
npm run api:build
npm run api:start
```

В отдельном терминале:

```sh
npm run dev
```

Vite поднимается на http://localhost:5173 и проксирует `/graphql` и `/health` на API (порт 4300).

## Пример запроса

```graphql
query {
  profile {
    name
    description
    links { label url }
    skills { name category }
    experience { company position period achievements }
    projects { name url description }
  }
}
```

## Структура

- `src/` - фронтенд
- `backend/src/` - API 
- `backend/prisma/` - схема данных
- `public/media/` - статика для сайта
