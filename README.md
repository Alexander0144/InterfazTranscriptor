# InterfazTranscriptor

Esta aplicacion es la **Interfaz de transcripcion Automatica**
desarrollada para que el usuario pueda subir archivos de audio y
descargar la transcripcion en forma de un archivo.

Este proyecto esta siendo desarrollado para CentroGeo para utilizar los
datos generados en proyectos futuros.

## Instalación

Para poder correr el programa de transcipcion en su servidor local puede descargue una copia de los archivos o clone el repositorio.
_Descarga directa:_ [Arichivo comprimido ZIP](https://github.com/Alexander0144/InterfazTranscriptor.git)

Una ves descargados los archivos del programa entre a la carpeta raiz y ejecute el comando de Node.js `npm install`
Esto instalara todas las dependencias del proyecto.
El registro de las dependencias y la version del programa estan contenidas dentro del archivo `package.json`

En caso de no contar con Node.js instalado en su maquina local lo puede descargar de la [pagina oficial](https://nodejs.org/es/)

## Pasos para ejecutar

Una vez que cuente con el proyecto en su maquina local puede seguir los siguientes pasos:

1. Entre en la carpeta raiz del proyecto

2. Abra la carpeta en una terminal del sistema

3. Ejecute el archivo app.js con el comando node(ej. "node app.js")

4. Alternativamente puede ejecutar el el comando `npm init` para iniciar el servidor con **nodemon**

5. Acceda a su servicor local desde su navegador de referencia, la app
   estara corriendo en el puerto 3000 en **localhost:3000**

### Nota

Debe contar tambien con el cliente de google cloud plataform para poder
correr la aplicación en su maquina local

## Formatos de archivo aceptados

La aplicacion actualmente solo acepta archivos WAV con las siguientes caracteristicas:

- Tipo de muestreo: 16-bit PCM

- Velocidad de muestreo: 16000 Hz (16kHz)

- Un solo canal de audio: 1 (mono)

- Idioma: es-MX (Español Mexicano)
