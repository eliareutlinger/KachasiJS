/*! KachasiJS v0.1.0.2 (Alpha) | https://github.com/eliareutlinger/KachasiJS | */
/* global: kjs.urlParams **/
/* global: kjs.viewCompCache **/
/* global: kjs.cacheKeys **/
/* global: kjs.pendingCalls **/
function kjs(){

}

kjs.viewCompCache = [];
kjs.urlParams = [];
kjs.cacheKeys = [];
kjs.pendingCalls = [];

$(window).on('popstate',function() {
    if(window.history.state !== null && window.history.state["current_view"] !== './.'){
        var href = window.history.state["current_view"];
        kjs.get_view(href);
    }
});

kjs.push_url = function(type, data){
    if(type == 'view'){

        var tmpAttr = [];
        var tmpUrl = data + '/';

        if(window.history.state == null || window.history.state['current_view'] == null){

            if(kjs.urlParams[1]){
                for(var i=1; i<kjs.urlParams.length; i++){
                    tmpAttr.push(kjs.urlParams[i]);
                    tmpUrl += kjs.urlParams[i] + '/';
                }
            }
            window.history.replaceState({current_view: data, attributes: tmpAttr}, data, "#/"+tmpUrl);

        } else if(window.history.state['current_view'] != data){
            window.history.pushState({current_view: data, attributes: null}, data, "#/"+tmpUrl);
        }

        kjs.urlParams = kjs.get_url_params(window.location.href);

    } else if(type == 'attribute'){

        var tmpAttr = '';
        if(typeof data.isArray === 'undefined'){
            for(var i=0; i<data.length; i++){
                tmpAttr += data[i] + '/';
            }
        } else {
            tmpAttr = data + '/';
        }

        var view = window.history.state['current_view'];
        var tmpUrl = view +'/'+ tmpAttr;

        if(window.history.state['attributes'] != tmpAttr){
            window.history.pushState({current_view: view, attributes: tmpAttr}, view, "#/"+tmpUrl);
        }

    }
}

kjs.error = function(code, additional){
    $('body').append('<div id="e_view_error" style="text-align:center; background-color:#dc3545; padding:20px; color: white;">Error "'+code+'" occured: '+additional+'</div>');
}

kjs.use_script = function(url, dontUseMinified){
    if(!url.endsWith('.min.js') && !dontUseMinified){
        url = url.replace('.js', '.min.js');
    }
    $.getScript({url:url,cache:true}).fail(function(){
        $.getScript({url:url.replace('.min.js', '.js'),cache:true});
    });
}

kjs.use_style = function(url, dontUseMinified){
    var params;
    if(url == 'bootstrap'){
        params = {
            rel: 'stylesheet',
            integrity: 'sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO',
            crossorigin: 'anonymous',
            href: 'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'
        };
        kjs.use_script('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.bundle.min.js');
    } else if (url == 'fontawesome'){
        params = {
            rel: 'stylesheet',
            integrity: 'sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU',
            crossorigin: 'anonymous',
            href: 'https://use.fontawesome.com/releases/v5.3.1/css/all.css'
        };
    } else {
        if(!url.endsWith('.min.css') && !dontUseMinified){
            url = url.replace('.css', '.min.css');
        }
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
            if(paramList[i].length > 0){
                paramArray.push(paramList[i]);
            }
        }
        return paramArray;
    }
    return undefined;
}

kjs.replace_all = function(str, find, replace) {
    var wasObject = false;
    if(typeof str === 'object'){
        str = str.prop('outerHTML');
        wasObject = true;
    }
    str = str.replace(new RegExp(find, 'g'), replace);
    if(wasObject){
        return $(str);
    } else {
        return str;
    }
}

kjs.set_compdir = function(data, path){
    if(path.slice(-1) == "/" || path.slice(-1) == "\\"){
        path = path.slice(0, -1);
    }
    return kjs.replace_all(data, '#COMPDIR#', path);
}

kjs.get_file = function(urls, callback, i){
    if(!i){var i = 0};
    if(kjs.pendingCalls.indexOf(urls[i]) < 0){
        kjs.pendingCalls.push(urls[i]);
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
        }).always(function() {
            kjs.pendingCalls.splice(kjs.pendingCalls.indexOf(urls[i]), 1);;
        });
    }
}

kjs.exists = function(object){
    if(typeof object !== 'undefined' && object !== null && object.length > 0){
        return true;
    }
    return false;
}

kjs.install_components = function(newGuiObjects){

    var componentDivs = 0;
    if(newGuiObjects.length > kjs.viewCompCache.length){
        componentDivs = newGuiObjects.length;
    } else if(newGuiObjects.length < kjs.viewCompCache.length){
        componentDivs = kjs.viewCompCache.length;
    } else {
        componentDivs = kjs.viewCompCache.length;
    }

    for(var i = 0;i<componentDivs;i++){
        if(i<newGuiObjects.length){
            if(kjs.viewCompCache[i] !== undefined){
                kjs.viewCompCache[i] = newGuiObjects[i];
                $('#e_view_'+newGuiObjects[i]['id']).attr('component',newGuiObjects[i]['name']).html(newGuiObjects[i]['content']);
            } else {
                kjs.viewCompCache[i] = (newGuiObjects[i]);
                $('body').append('<div id="e_view_'+newGuiObjects[i]['id']+'" component="'+newGuiObjects[i]['name']+'">'+newGuiObjects[i]['content']+'</div>');
            }
        } else if(i>=newGuiObjects.length){
            kjs.viewCompCache[i] = undefined;
            $('#e_view_'+i).remove();
        }
    }

}

kjs.install = function(type, dataArray){
    if(type == 'view'){
        var href = dataArray['name'];
        kjs.push_url('view', href);
        $('body').append(dataArray['content']);
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

    if(newPos){
        for(var i = 0; i < kjs.viewCompCache.length; i++){
            if(kjs.viewCompCache[i] !== undefined && kjs.viewCompCache[i]['name'] === component){
                callback({'id':newPos, 'name':kjs.viewCompCache[i]['name'], 'content':$('#e_view_'+kjs.viewCompCache[i]['id']).html()});
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
kjs.use_script('app/start.js');
