# InterfazTranscriptor

Esta aplicación es la **Interfaz de transcripción Automatica**
desarrollada para que el usuario pueda subir archivos de audio, convertir los arvhivos a texto y
descargar la transcripción en forma de un archivo JSON.

Este proyecto esta siendo desarrollado para CentroGeo con el fin de utilizar
los datos generados en proyectos futuros.

## Instalación

Para poder correr la aplicación de transcipción en su servidor local, debe descargar una copia
de los archivos en el repositorio o clonar el repositorio con el comando `git clone`.
_Descarga directa:_ [Arichivo comprimido ZIP](https://github.com/Alexander0144/InterfazTranscriptor/archive/master.zip)

Una vez descargados los archivos del repositorio, entre a la carpeta raíz y ejecute el comando de Node.js `npm install`
Esto instalara todas las dependencias del proyecto.
El registro de las dependencias y la versión del proyecto están contenidas dentro del archivo `package.json`

En caso de no contar con Node.js instalado en su maquina local lo puede descargar de la [pagina oficial](https://nodejs.org/es/)

## Ejecución

Una vez que cuente con el proyecto en su maquina local, puede seguir los siguientes pasos para ejecutar la aplicación:

1. Entre en la carpeta raiz del proyecto

2. Abra la carpeta en una terminal del sistema

3. Ejecute el archivo app.js con el comando node(`node app.js`)

4. Alternativamente puede ejecutar el el comando `npm init` para iniciar el servidor con **[nodemon](https://nodemon.io/)**

5. Acceda a su servidor local desde su navegador de preferencia, la app estará corriendo en el puerto 4000 (**localhost:4000**)

### Nota

Debe contar con el cliente de google cloud plataform para poder
correr la aplicación en su maquina local

## Formatos de archivo aceptados

La aplicación actualmente solo acepta archivos WAV con las siguientes especificaciones:

- Tipo de muestreo: 16-bit PCM

- Velocidad de muestreo: 16000 Hz (16kHz)

- Un solo canal de audio: 1 (mono)

- Idioma: es-MX (Español Mexicano)
