# DTI

## Install the dependencies

First of all make sure you have  

```bash
Node,
Vs Code,
Power shell / cmd / git bash 
```
### Requirements

Please make sure you use the node’s LTS version which is recommended by the official node site and not the one with the latest features or previous versions. Our project is not tested to work with other Node versions.

### Important!

Before installing the node_modules, make sure you have files starting with a dot(.eslintrc, .env etc..). It mostly happens when hidden files are not enabled on your machine and you try to copy our template at some other place on your system.

### Instructions

After downloading zip, copy this zip to your desired location and then unzip it. Do not unzip first and then copy files to another location, it may not be able to run the template due to missing hidden files not copied over.

In uncompressed folder you will find ts-version / js-version folders which contains full-version & starter-kit folders. Unzip the one you want to get started with and open this folder in your console/terminal.

### Installation
If you decide to use npm, make sure you use following command
```bash
npm install --legacy-peer-deps
```

## Available Scripts
### After installing the modules run your project with following command:

```bash
npm start
# or
yarn start
```
### Lint the files

```bash
npm lint
# or
yarn run lint
```

### Format the files

```bash
npm format
# or
yarn run format
```

### Build the app for production

```bash
npm run build
# or
yarn run build
```