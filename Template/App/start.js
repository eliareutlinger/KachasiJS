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
if(kjs.exists(kjs.urlParams)){
    kjs.get_view(kjs.urlParams[0]);
} else {
    kjs.get_view('main');
}

//Stylesheets
kjs.set_style('bootstrap');
kjs.set_style('fontawesome');
