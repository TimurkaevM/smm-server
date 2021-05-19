Доступны следующие ресурсы на сервере http://185.20.226.95/smm :

| Ресурс | Назначение | Обязательные значения |
|-|-|-|
| POST/login | авторизация | username(String), password(String)   |
| POST/autologin | проверка токена | - |
| GET/users | получить список пользователей | - |
| GET/users/id | получить пользователя по ID | - |
| POST/users | регистрация нового пользователя(админ) | username(String), password(String), name(String), surname(String), mail(String) |
| PATCH/users/id | изменение данных пользователя по ID(админ) | - |
| DELETE/users/id | удаление пользователя по ID(админ) | - |
| GET/posts | получение списка постов | - |
| POST/posts | добавление нового поста(работник) | text(String), title(String) |
| GET/posts/id | получение поста по ID | - |
| PATCH/posts/id | изменение поста по ID(работник) | - |
| DELETE/posts/id | удаление поста по ID | - |
| GET/posts/:postID/comments | получение комментариев | - |
| POST/posts/:postID/comments | добавление комментария | message(String) |
| PATCH/posts/:postID/comments/:id | изменение комментария | - |
| DELETE/posts/:postID/comments/:id | удаление комментария | - |
| GET/tasks | получение всех задач(админ) | - |
| GET/users/:userID/tasks | получение всех задач одного работника  | - |
| POST/users/:userID/tasks | добавление задачи(админ) | message(String), time(Number) |
| PATCH/tasks/:id | изменение задачи(админ)  | - |
| PATCH/users/:userID/tasks/:id | изменение задачи(работник) | inWOrk(Boolean), completed(Boolean) |
| DELETE/tasks/:id | удаление задачи(админ) | - |
