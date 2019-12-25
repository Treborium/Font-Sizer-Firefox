# Font Sizer

A simple browser extension to easily change the current font size of a website. 

## Installation

To install the extension in Firefox simply enter `about:debugging` in the url bar and hit enter.
Click on `This Firefox` (only in newer versions) and then click `Load temporary Add-on…` and select any file in the folder.  

## Building and Auto Reload

During development it's more convenient to use the command line tool [`web-ext`](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/).
The tool can be installed via npm with the following command: 

```bash
npm install -g web-ext
```

The extension can then be tested by using the following command inside the extension folder:

```bash 
web-ext run
```

The `run` command watches your source files and tells firefox to reload the extension whenever they change. A manual reload can be triggered by pressing the `r` key inside the terminal session where `web-ext` is running. 