#!/bin/bash

# Detener todas las instancias de Docker activas
echo "Deteniendo contenedores activos..."
docker stop $(docker ps -q)

# Limpiar el sistema Docker (eliminar contenedores detenidos, imágenes no usadas, volúmenes no utilizados, etc.)
echo "Limpiando el sistema Docker..."
docker system prune -a --volumes -f

# Reconstruir y levantar los servicios con docker-compose
echo "Reconstruyendo y levantando los servicios con docker-compose..."
docker-compose up --build -d

echo "Proceso completado."
