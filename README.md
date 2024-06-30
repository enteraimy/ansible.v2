Привет, меня зовут Евгений и я автор этого кода.
Согласно ТЗ был настроен плейбук для разворачивания докеризированного веб приложения.

Для создания контейнеров использовался docker-compose.yml.j2 шаблон - на основе которого создается образ.
При старте плея Ансибл принимает пользовательские параметры через модуль vars_prompt, который объявляет переменные на основе вводимых значений.
Затем эти значения подстваляются в соответствующие секции шаблонов:
{{variable}}
После чего конфигурация пулится на удаленный хост.
Для возможности обработки нескольких файлов шаблонов в роле template_dock есть закоментированная таска, которая создает список файлов шаблонов и через цикл пулит их на узлы.

В директории /config/ansible/roles находятся следующие роли:
git - загрузка файлов сайта (.php, sites.conf, Dockerfile) на удаленный узел.
Загрузка происходит из репозитория по адресу:
https://github.com/enteraimy/php/

docker_install - установка докера из официальных репозиториев с необходимыми пакетами на OC Ubuntu.

nginx - настройка шаблона конфигурационного файла nginx.conf.
Здесь выбираются дополнительные опции, такие как файловый обмен и режим сжатия gzip.
(По умолчанею опции закоменчены переменной, хранящей символ '#')
При выгрузке готового файла на сервер происходит проверка версий:
если конфигурации старого и нового файлов различаются, то в переменной out параметр changed=true
в таком случае происходит перезапуск контейнеров посредством модуля community.docker.docker_compose_v2

template_dock - конфигурация compose файла: открытие внешних портов и выбор виртуальных хостов.
При вызове данной роли происходит ребилд образов. Однако это можно перехватить, если записать результат команды генерации шаблона в переменную (как для nginx).
Однако я не стал добавлять эту опцию, так как количество compose файлов может отличаться. Поэтому перед загрузкой compose файлов
происходит чистка директории для удаления остаточных файлов предыдущих шаблонов.

В шаблоне compose объявлены контейнеры nginx, php, mysql и phpadmin. Для связи с вебсайтами используется сеть proxy,
для подключения бэкенда используется сеть backend - таким образом достигается разграничение сетевого пространства.
Также в compose присутствует закоменченный сервис nginx-proxy, который я не добавил из-за того, что он продолжает занимать внешний порт при
отключении контейнеров - то есть продолжает работать. Для его остановки необходимо было явно его отключить, указав его название.
Это можно реализовать с помощью docker модуля и указания статического имени контейнера.

В разработанном примере реализована генерация конфигурационных файлов, перезапуск служб на основе разницы в версиях,
ввод пользовательских значений, сборка контейнеров по необходимости, установка докера.

При применении данной конфигурации на вебсервере будет работать 3 страницы:
http://localhost:80 - статус подключения php к БД
http://localhost:80/hello.php - информация о установленном php
http://127.0.0.1:80 - панель phpadmin для работы с БД.

Также вы можете ознакомится с другой моей работой - настройка роутеров Mikrotik с Ansible на кластере k3s и вебом AWX:
https://github.com/enteraimy/test
