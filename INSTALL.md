# Jack The SIPper -- Installation

1. Download the sources from github, e.g.,

   ```git clone https://github.com/SfS-ASCL/JackTheSIPper.git ```

2. Enter the directory LRSwitchboard, and perform

   ```npm install ```

and

   ```webpack ```
   

to build the build directory.

3. In the main directory, call

   ```make ```

This command will build a docker image that includes the entire content of the build directory.  It
runs nginx as web server. It uses supervisord to spawn/control the various processes.

Note that the nginx has a number of reverse proxies, see docker/nginx.conf. In particular, it gives access to
the file storage server (a local Nextcloud instance). All reverse-proxing aims at addressing CORS-related issues.

You can run the Docker image with

   ```docker run --name JackTheSIPper -d -p 9001:9001 -p 9998:9998 -p 80:80 clauszinn/jackthesipper ```

Open

   ```http://localhost ```

in your browser to get access to the JackTheSIPper.

