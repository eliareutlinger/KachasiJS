var v_title = "Docs";
var v_subtitle = "";

kjs.get_components([
    ['','default-head'],
    ['bootstrapTemplate','navigation'],
    ['bootstrapTemplate','title'],
    ['','documentation'], //Will give an Error, since the component is not in html but js. Still it will be loaded.
    ['bootstrapTemplate','footer'],
]);
