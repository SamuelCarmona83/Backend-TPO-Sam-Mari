# Backend-TPO-Sam-Mari


## Getting Started

This project is a backend application for managing users, projects, expenses, and debts. It provides a set of RESTful API routes to handle various operations such as user authentication, project management, expense tracking, and debt management. The application is built using Node.js and requires JWT for authentication on protected routes.

## API Routes

### Usuarios
- `GET /api/usuarios/` - Obtener todos los usuarios.
- `GET /api/usuarios/:id` - Obtener un usuario por ID.
- `POST /api/usuarios/login` - Iniciar sesión de usuario.
- `POST /api/usuarios/registrarse` - Registrar un nuevo usuario.
- `POST /api/usuarios/recuperarContra` - Recuperar contraseña de usuario.
- `POST /api/usuarios/modificarUsuario` - Modificar un usuario (requiere JWT).
- `POST /api/usuarios/buscarUsuario` - Buscar usuario por nombre (requiere JWT).
- `POST /api/usuarios/cambiarClave/:id` - Cambiar la clave de un usuario.

### Proyectos
- `GET /api/proyectos/proyectosUsuario/:usuarioId` - Obtener proyectos de un usuario (requiere JWT).
- `GET /api/proyectos/getProyecto/:id` - Obtener un proyecto por ID (requiere JWT).
- `POST /api/proyectos/crearProyecto` - Crear un nuevo proyecto (requiere JWT).
- `POST /api/proyectos/editarProyecto/:id` - Editar un proyecto (requiere JWT).
- `DELETE /api/proyectos/eliminarProyecto/:id` - Eliminar un proyecto (requiere JWT).
- `GET /api/proyectos/participantesDelProyecto/:id` - Obtener participantes de un proyecto (requiere JWT).
- `POST /api/proyectos/agregarParticipante/:id` - Agregar un participante a un proyecto (requiere JWT).

### Gastos
- `POST /api/gastos/crearGasto` - Crear un nuevo gasto (requiere JWT).
- `DELETE /api/gastos/eliminarGasto/:gastoID` - Eliminar un gasto (requiere JWT).
- `GET /api/gastos/obtenerGastosUsuario/:proyectoID/:usuarioID` - Obtener gastos de un usuario por proyecto.
- `GET /api/gastos/gastosProyecto/:proyectoID` - Obtener gastos de un proyecto (requiere JWT).

### Deudas
- `POST /api/deudas/crearDeuda` - Crear una nueva deuda (requiere JWT).
- `DELETE /api/deudas/eliminarDeuda/:deudaID` - Eliminar una deuda (requiere JWT).
- `POST /api/deudas/cambiarImagen/:deudaID` - Cambiar imagen de una deuda (requiere JWT).
- `POST /api/deudas/deudasEntreUsuarios` - Obtener deudas entre usuarios (requiere JWT).
- `POST /api/deudas/pagarDeuda/:deudaID` - Marcar una deuda como pagada (requiere JWT).
- `GET /api/deudas/deudasUsuarioPorProyecto/:proyectoId/:usuarioId` - Obtener deudas de un usuario por proyecto (requiere JWT).
- `GET /api/deudas/deudasDelProyecto/:proyectoId` - Obtener deudas de un proyecto (requiere JWT).

1. **Clone the repository**:
    ```sh
    git clone https://github.com/yourusername/Backend-TPO-Sam-Mari.git
    cd Backend-TPO-Sam-Mari
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Run the application**:
    ```sh
    npm start
    ```


## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License.