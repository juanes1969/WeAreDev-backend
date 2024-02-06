# Proyecto TypeScript del lado del servidor

Este es un proyecto desarrollado en TypeScript para las necesidades de wearedev crece

## Instalación

Para comenzar a trabajar con este proyecto, asegúrese de tener instalado Node.js y Yarn en su sistema. Luego, siga estos pasos:

1. Clone este repositorio en su máquina local:

    ```bash
    git clone <https://github.com/juanes1969/WeAreDev-backendo>
    ```

2. Navegue al directorio del proyecto:

    ```bash
    cd <carpeta a la que quiera navegar>
    ```

3. Instale las dependencias utilizando Yarn:

    ```bash
    yarn install
    ```

## Uso

Para ejecutar el proyecto, puede utilizar los scripts proporcionados en el archivo `package.json`. A continuación se presentan algunos comandos útiles:

- `yarn start`: Inicia el servidor en modo de desarrollo.
- `yarn build`: Compila el proyecto TypeScript en JavaScript para producción.
- `yarn test`: Ejecuta los tests del proyecto.

Asegúrese de configurar los scripts y las opciones de compilación en el archivo `tsconfig.json` según sus necesidades.

## Estructura del Proyecto

La estructura del proyecto puede variar según las necesidades específicas, pero aquí se proporciona una vista general de la estructura típica de un proyecto TypeScript del lado del servidor:

├── src/ # Archivos fuente TypeScript
│ ├── controllers/ # Controladores de la lógica de negocio
│ ├── models/ # Definiciones de modelos de datos
│ ├── routes/ # Rutas y endpoints de la API
│ └── index.ts # Punto de entrada principal
├── tests/ # Tests unitarios y de integración
├── .gitignore # Archivos y directorios ignorados por git
├── package.json # Archivo de configuración de Yarn
├── tsconfig.json # Archivo de configuración de TypeScript
└── README.md # Documentación del proyecto

## Autor

Este proyecto fue desarrollado por [Juan Esteban Olaya](#) - Puede contactarme en [juan.olaya@wearedev.co](juan.olaya@wearedev.co).
