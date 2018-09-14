// Global Params
var g_appName = 'KachasiJS';
var g_appCreator = 'Elia Reutlinger';
var g_navLinks = [
    {title:'Main', view:'main'},
    {title:'Features', view:'features'},
    {title:'Description', view:'description'},
    {title:'Docs', view:'docs'}
];

// Individual startup
if(postParams['p']){
    e_load_view(postParams['p']);
} else {
    e_load_view('main');
}

//Stylesheets
e_use_style('bootstrap');
e_use_style('fontawesome');
