// DESCRIPTION
// In here you can define the startup of your App (What should happen before
// something will be displayed as well as what it should display in the beginning
// and so on). This is how you COULD design this File:

// This Var can be used to update the clients cache if there are changes. If you
// edit this number, all scripts will be reloaded & cached at the client.
kjs.appVers = 1.1;

// Global fixed Params to be used in other scripts
const g_appName = 'KachasiJS';
const g_appCreator = 'Elia Reutlinger';

// Global Params which could be changed by another script
var g_navLinks = [
    {title:'Main', view:'main'},
    {title:'Description', view:'description'},
    {title:'Features', view:'features'},
    {title:'Docs', view:'docs'}
];

// Loading the View
if(typeof kjs.urlParams !== 'undefined' && kjs.urlParams[0]){

    //If there's something submitted in the URL it will use it
    kjs.get_view(kjs.urlParams[0]);

} else {

    //Otherwise it'll load the 'main' View
    kjs.get_view('main');

}

// Load Pre-Defined Stylesheets (from CDN)
kjs.use_style('bootstrap');
kjs.use_style('fontawesome');
// (To load a foreign Style just use it's Path).
