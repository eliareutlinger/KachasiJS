# KachasiJS
Framework made in Vanilla JS (plain old JavaScript) and JQuery. Works with views and components while being extremly lightweight.

Use per RawGit CDN:
```html
<script type="text/javascript" src="https://cdn.rawgit.com/eliareutlinger/KachasiJS/master/Engine/engine.min.js"></script>
```

## Default Setup
Everything needed to run KachasiJS is a simple **Apache-Server** (for `window` functions) like it comes with XAMPP.

You can use the [Template](https://github.com/eliareutlinger/KachasiJS/tree/master/Template) provided with this Repo or create your own basic structure. Make sure you have all Paths set up like listed below. KachasiJS works by using 


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
<script type="text/javascript" src="https://cdn.rawgit.com/eliareutlinger/KachasiJS/master/Engine/kachasi.min.js"></script>
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

// Individual startup --> Here it looks for given url-Params and loads the appropriate view.
if(kjs.exists(kjs.urlParams)){
    kjs.get_view(kjs.urlParams[0]);
} else {
    kjs.get_view('main');
}

//Stylesheets
kjs.set_style('bootstrap'); //Loads Bootstrap 4.0 including it's JS-Scripts from cdn.
kjs.set_style('fontawesome'); //Loads Fontawsome from CDN
```
Here you can configure the settings and default behaviour of your App when starting. So this will be the first Script called after loading all dependencies from `index.html`.

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
The 

## Framework Variables
There are a few pre-defined Variables as well as Placeholders to make your development easier.
(Work in progress)

## Framework Functions
There are a few functions defined which you can use while scripting your App.
(Work in progress)
