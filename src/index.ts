import { config } from 'dotenv'
config()
import app from './app'
import database from './config/database'


async function main (): Promise<void> {
  try {
    const PORT = process.env.PORT ?? 4000
    //sincronizacion de base de datos
    
    await database.sync()
    // Inicialización del servidor
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Error during application initialization:', error)
    process.exit(1) // Salir del proceso si ocurre un error crítico
  }
}
main()