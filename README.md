# Transcriptor

Este proyecto es una aplicación que esta siendo desarrolloada para el _Centro de Investigación
en Ciencias de Información Geoespacial_, tambien conocido como **CentroGeo**, bajo el nombre de
**_Interfaz de transcripción Automatica_**.
La función principla de esta aplicación es el permitir al usuario subir archivos de audio, para poder
convertirlos a texto y posteriormente descargar la transcripción en forma de un archivo **JSON**.

Este **_Transcriptor_** esta siendo desarrollado para **CentroGeo** con el fin de utilizar
los datos generados en proyectos futuros de Inteligencia Artificiál.

## Requerimientos

Para poder ejecutar el servidro de la interfaz en su servidor local debera de contar
con las siguientes dependenicas instaladas:

- Sistema operativo Ubuntu
- Interprete para el lenguaje de programacion Python
  - Entre 3.5 y 3.7 para **Python 3**
  - Version 2.7.9 para **Python 2**
- Entorno de ejecucuón de JavaScript **Node.js;** version 12.18.1 en adelante
- Manejador de paquetes **npm;** version 6.14.5 en adelante
- SDK de Google Cloud

## Instalacion de requerimientos

La instalación de las dependencias del sistema (necesarias para poder correr la aplicación), se
lleva a cabo a traves de la terminal. Para instalar **Node.js** junto con **npm** ejecute
las siguientes instrucciones en la linea de comandos:

**Actualizacion de repositorios de apt**

```bash
$ sudo apt-get update
$ sudo apt-get upgrade
```

**Instalacion de Node.js y npm**

```bash
$ sudo apt-get install nodejs
$ sudo apt-get install npm
```

La instalacion del SDK de Google Cloud se realiza a traves de la terminal, utilizando el
gestor de paquetes "snap". Para instalar el paquete snap requerido ejecute el siguiente comando:

```bash
$ sudo snap install google-cloud-sdk --classic
```

## Configuracion de herramientas de desarrollo de Google Cloud

Despues de instalar el paquete snap correspondiente a las herramientas de desarrollo de
Google Cloud, debera configurar el proyecto de Google Cloud para integrarlo en la aplicación de transcripción.

- Para verificar la instalación del SDK ejecute el comando: `gcloud --version`

- Para seleccionar el proyecto de Google Cloud que se integrara con la aplicación, ejecute
  el comando: `gcloud init`

- Finalmente, en caso de no contar con un archivo de **JSON** de autenticación para el proyecto seleccionado,
  debera de generarlo desde la consola de Google Cloud.
  Despues de descargar el _JSON_ de autenticacion, debera agregar la siguiente linea en el archivo `.bashrc`
  que se encuentra en el directorio `/home/` de su usuario:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="[NOMBRE_DEL_ARCHIVO].json"
```

## Instalación de la aplicación

Para poder correr la aplicación de transcipción en su servidor local, debe descargar una copia
de los archivos en el repositorio o clonar el repositorio con el comando `git clone`.
_Descarga directa:_ [Arichivo comprimido ZIP](https://github.com/Alexander0144/InterfazTranscriptor/archive/master.zip)

Una vez descargados los archivos del repositorio, entre a la carpeta raíz y ejecute el comando `npm install`,
esto instalara todas las dependencias locales del proyecto (las librerias utilizadas en la aplicación).
El registro de las dependencias y la versión del proyecto están contenidas dentro del archivo `package.json`

## Ejecución

Una vez que cuente con el proyecto en su maquina local, puede seguir los siguientes pasos para ejecutar la aplicación:

1. Entre en la carpeta raiz del proyecto

2. Abra la carpeta en una terminal del sistema

3. Ejecute el archivo app.js con el comando node(`node app.js`)

4. Alternativamente puede ejecutar el el comando `npm init` para iniciar el servidor con **[nodemon](https://nodemon.io/)**

5. Acceda a su servidor local desde su navegador de preferencia, la app estará corriendo en el puerto 4000 (**127.0.0.1:4000**)

### Nota

A la hora de ejecutar la aplicacion en el navegador
usando la ruta **localhost:4000** se han observado problemas con el cliente, en caso de ser necesario el ejecutar la aplicacion en esa direccion asegurese de refrescar la cache antes de cada corrida, alternativamente ejecute la aplicacion en las direcciones `127.0.0.1` o `0.0.0.0`.

En caso de presentarse problemas adicionales en el desarrollo o modificacion de la aplicacion, intente usar los puertos 3000 o 5000.
Notese que a la hora de pasar a la fase de produccion, a aplicacion debera de
escuchar en uno de los puertos determinados para protocolos de transferencia de hypertexto. Ya sea el puerto _80_ para el protocolo "http" o el puerto _443_ para el protocolo "https"

## Formatos de archivo aceptados

La aplicación actualmente solo acepta archivos WAV con las siguientes especificaciones:

- Tipo de muestreo: 16-bit PCM

- Velocidad de muestreo: 16000 Hz (16kHz)

- Un solo canal de audio: 1 (mono)

- Idioma: es-MX (Español Mexicano)
