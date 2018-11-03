# KachasiJS
Framework made in Vanilla JS (plain old JavaScript) and JQuery. Works with views and components while being extremely lightweight.

Use per RawGit CDN:
```html
<script type="text/javascript" src="https://cdn.rawgit.com/eliareutlinger/KachasiJS/master/Engine/kachasi.min.js"></script>
```

## Default Setup
Everything needed to run KachasiJS is a simple **Apache-Server** (for `window` functions) like it comes with XAMPP.

You can use the [Template](https://github.com/eliareutlinger/KachasiJS/tree/master/Template) provided with this Repository or create your own basic structure. Make sure you have all Paths set up like listed below.


### Basic Directory Structure
KachasiJS is based on file paths so you'll have to keep the following structure. I recommend to use minified Scripts only
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

## Important Files
Make sure to have the following files configured correctly, while having them in the same spot as listed above.

#### index.html
```html
<!DOCTYPE html>
<html lang="en">
<script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/eliareutlinger/KachasiJS/master/Engine/kachasi.min.js"></script>
</html>
```
This should be the first file called by a client. It gets all dependencies (JQuery&KachasiJS) from their CDN (if you use the default configuration from the [Template](https://github.com/eliareutlinger/KachasiJS/tree/master/Template)).

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

// Individual startup --> Here it looks for given url-Params and loads the appropriate view.
if(kjs.exists(kjs.urlParams)){
    kjs.get_view(kjs.urlParams[0]);
} else {
    kjs.get_view('main');
}

//Stylesheets
kjs.use_style('bootstrap'); //Loads Bootstrap 4.0 including it's JS-Scripts from cdn.
kjs.use_style('fontawesome'); //Loads Fontawsome from CDN
```
Here you can configure the settings and default behavior of your App when starting. So this will be the first Script called after loading all dependencies from `index.html`.

#### Views
A View-Script is used to define view-specific variables and the components used in this view. The minimal setup contains the `kjs.get_components()` function, which tells the engine which components have to be used.
```javascript
// Global Params
var v_title = "Main"; //Used in Title and title-tag.
var v_subtitle = "This is the Subtitle used in the Header and meta-description tag.";

//Get Components of this View
kjs.get_components([
    ['','default-head'],
    ['bootstrapTemplate','navigation'],
    ['bootstrapTemplate','header'],
    ['bootstrapTemplate','title'],
    ['bootstrapTemplate','footer'],
]);
```

## Framework Variables
There are a few pre-defined global Variables as well as Placeholders to make your development easier. (Work in progress)

###  #COMPDIR#
This Placeholder can be used in components and views of every type (html, css & js) to get the current directory path. As well as a path it could be used as a unique identifier for every component and view.
```javascript
kjs.get_once('#COMPDIR#', function(){ //Used as identifier in get_once()
	kjs.use_script('#COMPDIR#/js/generate.js'); //Used as Path
});
kjs.use_script('#COMPDIR#/js/animations.js'); //Used as Path
```
###  kjs.guiObjects
This Array contains the currently used components. They are saved as Objects and used when loading a new view. `id` defines the position of the component. `name` contains the components name. If it's loaded from a set, it will be something like `set.component`. The content of the component is written into `content`.
```javascript
{id: 0, name: "default-head", content: "<component-content type='html or js'></component-content>"}
```
###  kjs.urlParams
This array contains the Parameters provided by the URL. They are splittet by every `/`.
E.g. `www.yourApp.com/#/description/another/parameter` will give you the following array:
```javascript
kjs.urlParams = [
	'description',
    'another',
    'parameter'
];
```
###  kjs.chacheKeys
This array saves all identifiers provided to `kjs.get_once()`.

## Framework Functions
There are a few functions defined which you can use while scripting your App. (Work in Progress)

### kjs.error()

### kjs.use_style()

### kjs.get_url_params()

### kjs.replace_all()

### kjs.set_compdir()

### kjs.exists()

### kjs.install_components()

### kjs.install()

### kjs.get_once()

### kjs.get_view()

### kjs.get_component()

### kjs.get_components()

### kjs.get_file()
