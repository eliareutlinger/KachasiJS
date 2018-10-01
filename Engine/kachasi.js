/* global: kjs.urlParams **/
/* global: kjs.guiObjects **/
/* global: kjs.cacheKeys **/
function kjs() {
    this.guiObjects = [];
    this.urlParams = [];
    this.cacheKeys = [];
}

$(window).on('popstate',function() {
    if(window.history.state !== null && window.history.state["info"] !== './.'){
        var href = window.history.state["info"];
        kjs.get_view(href);
    }
});

kjs.error = function(code, additional){
    $('body').append('<div id="e_view_error" style="text-align:center; background-color:#dc3545; padding:20px; color: white;">Error "'+code+'" occured: '+additional+'</div>');
}

kjs.set_style = function(url){
    var params;
    if(url == 'bootstrap'){
        params = {
            rel: 'stylesheet',
            integrity: 'sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO',
            crossorigin: 'anonymous',
            href: 'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'
        };
        $.getScript('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.bundle.min.js');
    } else if (url == 'fontawesome'){
        params = {
            rel: 'stylesheet',
            integrity: 'sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU',
            crossorigin: 'anonymous',
            href: 'https://use.fontawesome.com/releases/v5.3.1/css/all.css'
        };
    } else {
        params = {
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
    }
    window.history.pushState({info: './.'}, '../.', './.');
    return undefined;
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

kjs.get_file = function(urls, callback, i) {
    if(!i){var i = 0};
    $.ajax({
          url: urls[i],
          converters: {'text script': function (text) {return text;}},
          success: function(data){
              var compdir = (urls[i].split('/'));
              compdir.pop();
              compdir = compdir.join('/');
              compdir = kjs.set_compdir(data, compdir);
              if(urls[i].indexOf('.js', this.length - '.js'.length) !== -1){
                  compdir = '<script type="text/javascript">' +compdir+ '</script>';
              }
              callback(compdir);
          },
          error: function(){
              if(i+1<urls.length){
                  kjs.get_file(urls, callback, i+1);
              } else {
                  kjs.error('e.0001.e', 'Provided URLs not found ('+urls[i]+'...).');
              }
          }
    });
}

kjs.exists = function(object){
    if(typeof object !== 'undefined' && object !== null && object.length > 0){
        return true;
    }
    return false;
}

kjs.install_components = function(newGuiObjects){

    var componentDivs = 0;
    if(kjs.exists(kjs.guiObjects)){
        if(newGuiObjects.length > kjs.guiObjects.length){
            componentDivs = newGuiObjects.length;
        } else if(newGuiObjects.length < kjs.guiObjects.length){
            componentDivs = kjs.guiObjects.length;
        } else {
            componentDivs = kjs.guiObjects.length;
        }
    } else {
        kjs.guiObjects = [];
        componentDivs = newGuiObjects.length;
    }

    for(var i = 0;i<componentDivs;i++){
        if(i<newGuiObjects.length){
            if(kjs.guiObjects[i] !== undefined){
                kjs.guiObjects[i] = newGuiObjects[i];
                $('#e_view_'+newGuiObjects[i]['id']).attr('component',newGuiObjects[i]['name']).html(newGuiObjects[i]['content']);
            } else {
                kjs.guiObjects[i] = (newGuiObjects[i]);
                $('body').append('<div id="e_view_'+newGuiObjects[i]['id']+'" component="'+newGuiObjects[i]['name']+'">'+newGuiObjects[i]['content']+'</div>');
            }
        } else if(i>=newGuiObjects.length){
            kjs.guiObjects[i] = undefined;
            $('#e_view_'+i).remove();
        }
    }

}

kjs.install = function(type, dataArray){

    if(type == 'view'){
        var href = dataArray['name'];
        $('body').append(dataArray['content']);
        if(!kjs.exists(window.history.state['info']) || window.history.state['info'] != href){
            window.history.pushState({info: href}, href, "#/"+href);
        }
    } else if(type == 'components'){

        var newGuiObjects = dataArray.sort(function(a, b){
            a = a['id'];
            b = b['id'];
            if(a < b){return -1};
            if(a > b){return 1};
            return 0;
        });

        kjs.install_components(newGuiObjects);

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
        'app/view/'+view+'/view.min.js',
        'app/view/'+view+'/view.js',
        'app/view/'+view+'/view.html',
    ];
    kjs.get_file(checkPaths, function(data){
        if (typeof callback === 'function') {
            callback('view',{'name':view, 'content':data});
            return undefined;
        } else if (callback !== false){
            kjs.install('view',{'name':view, 'content':data});
            return undefined;
        }
        return data;
    });
}

kjs.get_components = function(componentList, callback){

    var contents = [];
    var countComponents = 1;

    for (var i = 0; i < componentList.length; i++){

        kjs.get_component(componentList[i][0], componentList[i][1], function(data){
            if (typeof data !== "undefined") {
                contents.push(data);
            }
            if(countComponents >= componentList.length){
                if (typeof callback === 'function') {
                    callback('components',contents);
                    return undefined;
                } else if (callback !== false){
                    kjs.install('components',contents);
                    return undefined;
                } else {
                    return contents;
                }
            }
            countComponents++;
        }, i);
    }
}

kjs.get_component = function(set, component, callback, newPos){

    var path = component;
    if(kjs.exists(set)){
        path = set + '/' + path;
        component = set + '.' + component;
    }

    if(kjs.exists(kjs.guiObjects) && newPos){
        for(var i = 0; i < kjs.guiObjects.length; i++){
            if(kjs.guiObjects[i] !== undefined && kjs.guiObjects[i]['name'] === component){
                callback({'id':newPos, 'name':kjs.guiObjects[i]['name'], 'content':$('#e_view_'+kjs.guiObjects[i]['id']).html()});
                return undefined;
            }
        };
    };

    var checkPaths = [
        'app/component/'+path+'/component.html',
        'app/component/'+path+'/component.min.js',
        'app/component/'+path+'/component.js'
    ];

    kjs.get_file(checkPaths, function(data){
        if(typeof newPos !== 'undefined'){
            callback({'id':newPos, 'name':component, 'content':data});
        } else {
            callback(data);
        }
    });

}

kjs.urlParams = kjs.get_url_params(window.location.href);
$.getScript('app/start.min.js').fail(function(){
    $.getScript('app/start.js').fail(function(){
        kjs.error('e.0002.e', arguments[2].toString());
    });
});
