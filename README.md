<h1 align="center"><a href="https://github.com/xsolla/xsolla-school-backend-2021">Xsolla School 2021 Backend Test</a></h1>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

## Содержание

- [Описание](#about)
- [Реализовано](#working)
- [Требования](#requirments)
- [Установка](#installation)
- [Использование](#usage)
- [Настройка](#configuration)
- [Зависимости](#dependencies)
- [Тестирование](#tests)

## 🧐 Описание <a name = "about"></a>

Тестовое задание для Xsolla School 2021 Backend


## Реализованные задания <a name = "working"></a>

<ul>
    <li> <h4>Получение каталога товаров</h4>
        <ul>
            <li>Список товаров возвращается страницами</li>
            <li>Доступны фильтры
                <ul>
                    <li>Тип товара - указывается список типов в результирующей выборке</li>
                    <li>Стоимость товара - необходимо указать минимальную и максимальную стоимость товара.</li>
                </ul>
            </li>
        </ul>
    </li>
    <li> <h4>Получение информации о товаре по его идентификатору или SKU</h4></li>
    <li> <h4>Создание товара</h4>
        <ul>
            <li>Уникальный идентификатор - следующее число последовательности (sequense) в базе данных</li>
        </ul>
    </li>
    <li> <h4>Редактирование всех данных товара  по его идентификатору или SKU</h4></li>
    <li> <h4>Удаление товара по его идентификатору или SKU</h4></li>
    <li> <h4>Документация OpenAPI 3.0 в <a href="docs/api.json">docs/api.json</a></h4></li>
    <li> <h4>Документация в README.md</h4></li>
</ul>


## Требования <a name = "requirments"></a>

- Nodejs v.14.17.3 и выше
- npm v.6.5 и выше
- PostgreSQL v.12 и выше

## Установка  <a name = "installation"></a>

Перед запуском необходимо скачать зависимости для проекта. Чтобы это сделать выполните команду 

```npm i -s```

В качестве хранилища данных используется PostgreSQL. Для работы программы необходимо создать базу данных и пользователя, например как <a href="src/db/create-user-and-db.sql">здесь</a>. 

Для хранения товаров нужно создать таблицу <i>products(id, sku, name, type, price)</i>, например как <a href="src/db/create-tables.sql">здесь</a>

В случае если вам не удалось создать базу, пользователя, у вас отличный от стандартного порт работы PostgreSQL или вы желаете изменить настройки работы сервера (адрес, порт) инструкция находится [здесь](#configuration)

//Comment - Возможно в будущем для проверки установки запустить тесты и попробовать сбилдить проект через тайпсприпт

//Comment - Сюда же добавить докер в будущем

## Использование <a name = "usage"></a>

Для запуска сервера воспользуйтесь командой 

```npm run start```

## Настройка <a name = "configuration"></a>

Для настройки некоторых параметров используется файл .env
- <b>PGUSER</b> - пользователь СУБД
- <b>PGPASSWORD</b> - пароль пользователя
- <b>PGDATABASE</b> - название используемой базы данных
- <b>PGHOST</b> - адрес базы данных postgres
- <b>PGPORT</b> - порт работы postgres
- <b>SERVER_HOST</b> - адрес работы сервера
- <b>SERVER_PORT</b> - порт работы сервера

## Тестирование <a name = "tests"></a>

Команда запуска тестов

```npm run test```

## Зависимости <a name = "dependencies"></a>

- [Express](https://github.com/expressjs/express)
- [Node Postgres](https://github.com/brianc/node-postgres)
- [SQL Template Strings](https://github.com/felixfbecker/node-sql-template-strings)
- [Dotenv](https://github.com/motdotla/dotenv)
- [Typescript](https://github.com/Microsoft/TypeScript)