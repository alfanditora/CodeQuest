function showModule(moduleId) {
    var modules = document.getElementsByClassName('module');
    for (var i = 0; i < modules.length; i++) {
        modules[i].style.display = 'none';
    }

    document.getElementById(moduleId).style.display = 'block';
}
