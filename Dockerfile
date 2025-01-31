# Usa Node.js 22 como base
FROM node:22

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia todo el código fuente al contenedor
COPY . .

# Expone el puerto 3000 para la aplicación
EXPOSE 3000

# Ejecuta la aplicación
CMD ["sh", "-c", "npm run tsc && npm run start"]
#CMD ["npm","run","dev"]