/* global: kjs.urlParams **/
/* global: kjs.guiObjects **/
function kjs() {
    this.guiObjects = [];
    this.urlParams = [];
    this.cacheKeys = [];
}

$(window).on('popstate',function(event) {
    if(window.history.state != null){
        if(window.history.state["info"] != './.'){
            var href = window.history.state["info"];
            kjs.get_view(href);
        }
    }
});

kjs.error = function(code, additional){
    alert('Error: '+code+' - '+additional);
}

kjs.set_style = function(url){
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

kjs.get_url_params = function(paramString) {
    if(paramString.indexOf("#/") > 0){
        paramString = paramString.split("#/").pop();
        var paramList = paramString.split("/");
        var paramArray = [];
        for (var i = 0; i < paramList.length; i++) {
            paramArray.push(paramList[i])
        }
        return paramArray;
    } else {
        window.history.pushState({info: './.'}, '../.', './.');
    }
}

kjs.replace_all = function(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

kjs.set_compdir = function(data, path){
    if(path.slice(-1) == "/" || path.slice(-1) == "\\"){
        path = path.slice(0, -1);
    }
    return kjs.replace_all(data, '#COMPDIR#', path);
}

kjs.locate_file = function(urls, callback, i) {
    if(!i){var i = 0};
    $.ajax({
          url: urls[i],
          converters: {'text script': function (text) {return text;}},
          success: function(data){
              var compdir = (urls[i].split('/'));
              compdir.pop();
              compdir = compdir.join('/');
              correctDir = kjs.set_compdir(data, compdir);
              callback([urls[i], correctDir]);
          },
          error: function(){
              if(i+1<urls.length){
                  kjs.locate_file(urls, callback, i+1);
              } else {
                  kjs.error('e.0001.e', 'Provided URLs not found ('+urls[i]+'...).');
              }
          }
    });
}

kjs.exists = function(object){
    if(typeof object !== 'undefined' && object != null && object.length > 0){
        return true;
    } else {
        return false;
    }
}

kjs.install = function(type, dataArray){

    if(type == 'view'){

        $('body').append(dataArray['content']);
        var href = dataArray['name'];

        if(!kjs.exists(window.history.state['info']) || window.history.state['info'] != href){
            window.history.pushState({info: href}, href, "#/"+href);
        }

    } else  if(type == 'components'){

        var newGuiObjects = dataArray.sort(function(a, b){
            a = a['id'];
            b = b['id'];
            if(a < b) return -1;
            if(a > b) return 1;
            return 0;
        });

        var componentDivs = 0;
        if(kjs.exists(kjs.guiObjects)){
            if(newGuiObjects.length > kjs.guiObjects.length){
                componentDivs = newGuiObjects.length;
            } else if(newGuiObjects.length < kjs.guiObjects.length){
                componentDivs = kjs.guiObjects.length;
            } else if(newGuiObjects.length == kjs.guiObjects.length){
                componentDivs = kjs.guiObjects.length;
            }
        } else {
            kjs.guiObjects = [];
            componentDivs = newGuiObjects.length;
        }

        var i = 0;
        while(i<componentDivs){

            if(kjs.guiObjects[i] != null && kjs.guiObjects[i]['name'] != 0 && i<newGuiObjects.length){
                kjs.guiObjects[i]['name'] = newGuiObjects[i]['name'];
                kjs.guiObjects[i]['content'] = newGuiObjects[i]['content'];
            } else {
                if(i >= newGuiObjects.length){
                    kjs.guiObjects.splice(i, 1);
                } else {
                    kjs.guiObjects.push(newGuiObjects[i]);
                }
            }

            i++;

        }

        for(var i=0;i<componentDivs;i++){
            if(kjs.guiObjects[i]){
                if($('#e_view_'+kjs.guiObjects[i]['id']).length){
                    $('#e_view_'+kjs.guiObjects[i]['id']).attr('component',kjs.guiObjects[i]['name']).html(kjs.guiObjects[i]['content']);
                } else {
                    $('body').append('<div id="e_view_'+kjs.guiObjects[i]['id']+'" component="'+kjs.guiObjects[i]['name']+'">'+kjs.guiObjects[i]['content']+'</div>');
                }
            } else {
                $('#e_view_'+i).remove();
            }
        }

    }
}

kjs.get_once = function(keyParam, callback){
    if(!kjs.exists(kjs.cacheKeys)){
        kjs.cacheKeys = [];
    }
    if(kjs.cacheKeys.indexOf(keyParam, this.length - keyParam.length) == -1){
        kjs.cacheKeys.push(keyParam);
        callback();
    }
}

kjs.get_view = function(view, callback){
    var checkPaths = [
        'app/view/'+view+'/'+view+'.min.js',
        'app/view/'+view+'/'+view+'.html',
        'app/view/'+view+'/'+view+'.js',
    ];
    kjs.get_file(checkPaths, function(data){
        if (typeof callback === 'function') {
            callback('view',{'name':view, 'content':data});
        } else if (callback != false){
            kjs.install('view',{'name':view, 'content':data});
        } else {
            return data;
        }
    });
}

kjs.get_components = function(componentList, callback){

    var contents = [];
    var countComponents = 1;

    for (var i = 0; i < componentList.length; i++){

        kjs.get_component(componentList[i][1], i, componentList[i][0], function(data){
            if (typeof data != "undefined") {

                contents.push(data);
                if(countComponents >= componentList.length){
                    if (typeof callback === 'function') {
                        callback('components',contents);
                    } else if (callback != false){
                        kjs.install('components',contents);
                    } else {
                        return contents;
                    }
                }
                countComponents++;
            }
        });
    }
}

kjs.get_component = function(component, newPos, set, callback){
    var name = component;
    var path = component + '/' + component;
    if(typeof set === 'string' && set.length){
        path = set + '/' + path;
        var name = set + '.' + component;
    };
    var checkPaths = [
        'app/component/'+path+'.html',
        'app/component/'+path+'.min.js',
        'app/component/'+path+'.js'
    ];

    var currentObj;
    if(kjs.exists(kjs.guiObjects)){
        kjs.guiObjects.filter(function(obj){
            if(obj['name'] == name){
                currentObj = obj;
            }
         });
    };

    if(currentObj){
        var content = $('#e_view_'+currentObj['id']).html();
        callback({'id':newPos, 'name':currentObj['name'], 'content':content});
    } else {
        kjs.get_file(checkPaths, function(data){
            callback({'id':newPos, 'name':name, 'content':data});
        });
    }
}

kjs.get_file = function(checkPaths, callback){
    kjs.locate_file(checkPaths, function(array,opt) {
        if(array[0]){
            if(array[0].indexOf('.js', this.length - '.js'.length) !== -1){
                content = '<script type="text/javascript">' +array[1]+ '</script>';
            } else {
                content = array[1];
            }
            callback(content);
        }
    });
}

kjs.urlParams = kjs.get_url_params(window.location.href);
$.getScript('app/start.min.js').fail(function(){
    $.getScript('app/start.js').fail(function(){
        kjs.error('e.0002.e', arguments[2].toString());
    });
});
