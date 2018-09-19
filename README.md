# KachasiJS
Framework made in Vanilla JS (plain old JavaScript) and JQuery. Works with views and components while being extremly lightweight.

Use per RawGit CDN:
```html
<script type="text/javascript" src="https://cdn.rawgit.com/eliareutlinger/KachasiJS/master/Engine/engine.min.js"></script>
```

## Default Setup
Everything needed to run KachasiJS is a simple **Apache-Server** (for `window` functions).

You can use the Template provided with this repo or create your own basic structure:

### Basic Directory Structure

```
index.html
App/
├── start.min.js
├── component/
│   └── exampleComponent/
│       ├── exampleComponent.html
│       ├── js/
│       │   ├── functions.js
│       │   └── execute.js
│       └── css/
│           └── style.css
└── view/
    └── exampleView/
        ├── exampleView.js
        └── exampleView.min.js
```

### Important Files
Make sure to have the following files configured correctly, while having them in the same spot as listed above.

#### index.html
```html
<!DOCTYPE html>
<html lang="en">
<script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/eliareutlinger/KachasiJS/master/Engine/engine.min.js"></script>
</html>
```
This should be the first file called by a client. It gets all dependencies (JQuery&KachasiJS) from CDNs (default conf).

#### start.js / start.min.js
```javascript
// Global Params
var g_appName = 'KachasiJS';
var g_appCreator = 'Elia Reutlinger';
var g_navLinks = [
    {title:'Main', view:'main'},
    {title:'Description', view:'description'},
    {title:'Features', view:'features'},
    {title:'Docs', view:'docs'}
];

// Individual startup
if(postParams){
    e_load_view(postParams[0]);
} else {
    e_load_view('main');
}

//Stylesheets
e_set_style('bootstrap');

```
Here you can configure the settings and default behaviour of your App when starting. So this will be the first Script called after loading all dependencies from `index.html`.

## Framework Functions
There are a few functions defined which you can use to speed up your App.

### Example (TODO)
