/* global: postParams **/
/* global: currentGuiObjects **/
var currentGuiObjects = [];
var postParams = [];

$(window).on('popstate',function(event) {

    var href = window.history.state["info"];
    e_load_view(href);

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
    if(paramString.charAt(0) == '?'){paramString = paramString.substr(1);}
    var paramList = paramString.split("&");
    var paramArray = [];
    for (var i = 0; i < paramList.length; i++) {
        var key = (paramList[i].split("="))[0];
        var value = (paramList[i].split("="))[1];
        paramArray[key] = value;
    }
    return paramArray;
}

postParams = getUrlParams(window.location.search);

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
              fetchData(urls, callback, i+1);
          }
    });

}

function e_install(type, dataArray){

    if(type == 'view'){

        $('body').append(dataArray['content']);
        var href = dataArray['name'];
        window.history.pushState({info: href}, href, "?p="+href);

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

                if(currentGuiObjects[i]['name'] != newGuiObjects[i]['name']){
                    currentGuiObjects[i]['name'] = newGuiObjects[i]['name'];
                    currentGuiObjects[i]['content'] = newGuiObjects[i]['content'];
                }

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
        for(i=0;i<currentGuiObjects.length;i++){
            console.log(currentGuiObjects[i]['name']);
            buildView += '<div id="e_view_'+currentGuiObjects[i]['id']+'" component="'+currentGuiObjects[i]['name']+'">'+currentGuiObjects[i]['content']+'</div>';
        }

        $('body').html('<body id="page-top">' + buildView + '</body>');

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

function e_load_components(componentList, set, callback){

    var contents = [];
    var countComponents = 1;

    for (var i = 0; i < componentList.length; i++){

        e_load_component(componentList[i], i, set, function(data){
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
        if(obj['name'] == component){
            return obj;
        } else {
            return false;
        }
     });
    if(currentObj){

        callback({'id':newPos, 'name':currentObj['name'], 'content':currentObj['content']});

    } else {
        e_load(checkPaths, function(data){
            callback({'id':newPos, 'name':name, 'content':data});
        });
    }
}

function e_load(checkPaths, callback){

    var content = '';
    fetchData(checkPaths, function(array) {
        if(array[0]){
            if(array[0].endsWith('.js')){
                content = '<script type="text/javascript">' +array[1]+ '</script>';
            } else {
                content = array[1];
            }
            callback(content);
        } else {
            e_error('e.0001.e', content + checkPaths);
            return;
        }

    });

}
$.getScript("app/js/start.js");
