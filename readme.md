# Backend del proyecto FNL

Este proyecto es un backend desarrollado para FNL en Node.js utilizando TypeScript y Express.

## Requisitos Previos

- **Docker**: [Instalar Docker](https://docs.docker.com/get-docker/)

## Estructura de Archivos

- `Dockerfile`: Configuración de Docker para construir la imagen del backend.
- `docker-compose.yml`: Configuración para levantar los servicios en el entorno de desarrollo.
- `docker-compose.prod.yml`: Configuración para levantar los servicios en el entorno de producción.

---

## Instrucciones

### Entorno de Desarrollo

1. **Clona este repositorio**:

   ```bash
   git clone https://github.com/PaulPPS632/SWAGGER-FNL-BACK.git
   cd SWAGGER-FNL-BACK

2. **Crea un .env con los siguientes datos**:

    - JWT_SECRET
    - OPENAI_API_KEY
    - GEMINI_API_KEY='{"keys":["",""]}'
    - DB_NAME
    - DB_USER
    - DB_PASSWORD
    - DB_HOST
    - DB_DIALECT=mysql
    - DB_PORT=3306
    - EMAIL=paulyeffertperezsanjinez@gmail.com
    - EMAIL_PASSWORD=""
    - ALTER=true #true si construyes por primera vez cambia a false despues

3. **Levanta los servicios en el entorno de desarrollo**:

   ```bash
   docker-compose up --build

4. **Levanta los servicios en el entorno de producción**:

   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d

## Notas

1. **Para detener los contenedores y eliminar las instancias creadas, usa:**:

    ```bash
    docker-compose down

2. **Para ver la documentacion de la api ve a la siguiente ruta**:

    - **Documentacion**: [DOCUMENTACION](http://localhost:3000/documentation)

3. **Para generar las Actividades**:

    - **Repositorio Generar Actividades**: [GENERAR_ACTIVIDADES](https://github.com/PaulPPS632/combinatoria-tags)
      
