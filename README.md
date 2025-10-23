
# 🥗 DietMenuProject — Backend (Django + PostgreSQL + Docker)

Бекенд для проєкту формування дієтичного добового раціону.

**Технології:** **Python 3.11**, **Django**, **Django REST Framework**, **PostgreSQL**, **Docker / Docker Compose**.

---

## 🚀 Швидкий старт (локально, Docker)

1.  Клонувати репозиторій і перейти в папку бекенду:
    ```bash
    git clone https://github.com/AndreyFortus/DietMenuProject.git
    cd DietMenuProject/backend
    ```

2.  Скопіювати `.env` з мінімальними налаштуваннями в корінь проєкту.

3.  Підняти контейнери:
    ```bash
    docker-compose up --build -d
    ```

4.  Застосувати міграції:
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

API буде доступне за адресою: `http://localhost:8000`

---

## 🧩 Корисні команди

* **Створити суперюзера:**
    ```bash
    web python manage.py createsuperuser
    ```
* **Запустити тести:**
    ```bash
    python manage.py test
    ```
* **Дивитись логи (в реальному часі):**
    ```bash
    docker-compose logs -f web
    ```