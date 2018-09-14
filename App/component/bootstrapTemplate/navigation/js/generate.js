var navItem = [];

for(var i=0; i<g_navLinks.length;i++){
    if(navItem[i]){
        alert('yey');
    }
    navItem[i] = $('.nav-item:first').clone();
    navItem[i].children('a').attr('onclick', 'e_load_view("'+g_navLinks[i]['view']+'")').html(g_navLinks[i]['title']);
    $('.navbar-nav').append(navItem[i]);
    //navItem[i].delay((200-((i+1)*1*40/1))).fadeIn('slow');

}
$('.navbar-brand').html(g_appName);
