import requests

# Lista de códigos (ya corregidos como enteros)
codigos = [
    247920

]

# URL del endpoint
url = "https://funcy.duckdns.org/api/register"

# Headers si tu API requiere
headers = {
    "Content-Type": "application/json"
}

# Recorremos los códigos para registrar
for codigo in codigos:
    payload = {
        "username": str(codigo),
        "password": "Esan2025",
        "email": f"{codigo}@gmail.com",
        "empresa_id": "2",
        "role_id": "4"
    }

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code == 200 or response.status_code == 201:
        print(f"✅ Usuario {codigo} registrado correctamente.")
    else:
        print(f"❌ Error con {codigo}: {response.status_code} - {response.text}")
