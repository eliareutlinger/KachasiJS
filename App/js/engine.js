/* global: postParams **/
/* global: currentGuiObjects **/
var currentGuiObjects = [];
var postParams = [];

$(window).on('popstate',function(event) {

    if(window.history.state != null){
        if(window.history.state["info"] != './.'){
            var href = window.history.state["info"];
            e_load_view(href);
        }
    }

});

function e_error(code, additional){
    alert('Error: '+code+' - '+additional);
}

function e_use_style(url){
    if(url == 'bootstrap'){
        var params = {
            rel: 'stylesheet',
            integrity: 'sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO',
            crossorigin: 'anonymous',
            href: 'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'
        };
        $.getScript('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.bundle.min.js');
    } else if (url == 'fontawesome'){
        var params = {
            rel: 'stylesheet',
            integrity: 'sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU',
            crossorigin: 'anonymous',
            href: 'https://use.fontawesome.com/releases/v5.3.1/css/all.css'
        };
    } else {
        var params = {
            rel: 'stylesheet',
            href: url
        };
    }
    $('<link/>', params).appendTo('head');
}

function getUrlParams(paramString) {
    if(paramString.includes("#/")){
        paramString = paramString.split("#/").pop();
        var paramList = paramString.split("/");
        var paramArray = [];
        for (var i = 0; i < paramList.length; i++) {
            paramArray.push(paramList[i])
        }
        console.log(paramArray);
        return paramArray;
    }
}

postParams = getUrlParams(window.location.href);

window.history.pushState({info: './.'}, '../.', './.');

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function fetchData(urls, callback, i) {

    if(!i){var i = 0};
    $.ajax({
          url: urls[i],
          converters: {'text script': function (text) {return text;}},
          success: function(data){
              var compdir = (urls[i].split('/'));
              compdir.pop();
              compdir = compdir.join('/');
              correctDir = replaceAll(data, '#COMPDIR#', compdir);
              callback([urls[i], correctDir]);
          },
          error: function(){
              if(i+1<urls.length){
                  fetchData(urls, callback, i+1);
              } else {
                  e_error('e.0001.e', 'Provided URLs not found ('+urls[i]+'...).');
              }
          }
    });

}

function e_install(type, dataArray){

    if(type == 'view'){

        $('body').append(dataArray['content']);
        var href = dataArray['name'];

        if(window.history.state["info"] != href){
            window.history.pushState({info: href}, href, "#/"+href);
        }

    } else  if(type == 'components'){

        var i = 0;
        var newGuiObjects = dataArray.sort(function(a, b){
            a = a['id'];
            b = b['id'];
            if(a < b) return -1;
            if(a > b) return 1;
            return 0;
        });

        while(i<currentGuiObjects.length || i<newGuiObjects.length){

            if(currentGuiObjects[i] != null && currentGuiObjects[i]['name'] != 0 && i<newGuiObjects.length){

                currentGuiObjects[i]['name'] = newGuiObjects[i]['name'];
                currentGuiObjects[i]['content'] = newGuiObjects[i]['content'];

            } else {

                if(i >= newGuiObjects.length){
                    currentGuiObjects.splice(i, 1);
                    i -= 1;
                } else {
                    currentGuiObjects.push(newGuiObjects[i]);
                }

            }

            i++;
        }

        var buildView = "";
        var i = 0;
        //$('body').html('<body id="page-top">');
        for(i=0;i<currentGuiObjects.length;i++){
            if($('#e_view_'+currentGuiObjects[i]['id']).length){
                $('#e_view_'+currentGuiObjects[i]['id']).attr('component',currentGuiObjects[i]['name']).html(currentGuiObjects[i]['content']);
            } else {
                $('body').append('<div id="e_view_'+currentGuiObjects[i]['id']+'" component="'+currentGuiObjects[i]['name']+'">'+currentGuiObjects[i]['content']+'</div>');
            }
        }

        //$('body').append('</body>');

    }
}

var loaded_scripts = [];
function e_load_once(keyParam, callback){
    if(!loaded_scripts.includes(keyParam)){
        loaded_scripts.push(keyParam);
        callback();
    }
}

function e_load_view(view, callback){
    var checkPaths = [
        'app/view/'+view+'/'+view+'.min.js',
        'app/view/'+view+'/'+view+'.html',
        'app/view/'+view+'/'+view+'.js',
    ];
    e_load(checkPaths, function(data){
        if (typeof callback === 'function') {
            callback('view',{'name':view, 'content':data});
        } else if (callback != false){
            e_install('view',{'name':view, 'content':data});
        } else {
            return data;
        }
    });
}

function e_load_components(componentList, callback){

    var contents = [];
    var countComponents = 1;

    for (var i = 0; i < componentList.length; i++){

        e_load_component(componentList[i][1], i, componentList[i][0], function(data){
            if (typeof data != "undefined") {

                contents.push(data);
                if(countComponents >= componentList.length){
                    if (typeof callback === 'function') {
                        callback('components',contents);
                    } else if (callback != false){
                        e_install('components',contents);
                    } else {
                        return contents;
                    }
                }
                countComponents++;

            }
        });
    }
}

function e_load_component(component, newPos, set, callback){
    var name = component;
    var path = component + '/' + component;
    if(typeof set === 'string'){
        path = set + '/' + path;
        var name = set + '.' + component;
    };
    var checkPaths = [
        'app/component/'+path+'.html',
        'app/component/'+path+'.min.js',
        'app/component/'+path+'.js'
    ];

    var currentObj = currentGuiObjects.find(function(obj){
        if(obj['name'] == name){
            return obj;
        } else {
            return false;
        }
     });

    if(currentObj){
        var content = $('#e_view_'+currentObj['id']).html();
        callback({'id':newPos, 'name':currentObj['name'], 'content':content});
    } else {
        e_load(checkPaths, function(data){
            callback({'id':newPos, 'name':name, 'content':data});
        });
    }
}

function e_load(checkPaths, callback){

    fetchData(checkPaths, function(array,opt) {
        if(array[0]){
            if(array[0].endsWith('.js')){
                content = '<script type="text/javascript">' +array[1]+ '</script>';
            } else {
                content = array[1];
            }
            callback(content);
        }
    });

}
$.getScript("app/js/start.js");
