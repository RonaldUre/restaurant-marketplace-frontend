// Creamos una referencia mutable que contendrá el AbortController
export let apiController = new AbortController();

// Función para abortar todas las peticiones y crear un nuevo controller
export function resetApiController() {
  apiController.abort(); // Cancela las peticiones asociadas al controller actual
  apiController = new AbortController(); // Crea uno nuevo para futuras peticiones
}