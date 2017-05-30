ready(function(){
    var boards = document.querySelectorAll('#wrapper > ul > li > ul'),
        dropzones = [];

    boards.forEach(function(el, i){
        var columns = el.childNodes

        columns.forEach(function(el, i){
            var dropzone = el.querySelector('ul')

            if(!dropzone) {
                dropzone = document.createElement('ul')
                el.append(dropzone)
            }

            dropzones.push(dropzone)
        })
    })

    dragula(dropzones).on('drop', function (el) {
        var data = {
            'item': el.dataset.path,
            'target': el.parentNode.parentNode.dataset.path,
            'action': 'move'
        }

        var request = new XMLHttpRequest();

        request.onreadystatechange = function() {
            if (request.readyState == 4) {
                el.dataset.path = request.responseText;
            }
        }

        request.open('POST', '/', true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send(serialize(data));
    })

    var columns = document.querySelectorAll('#wrapper > ul > li > ul > li > span')

    columns.forEach(function(el){
        el.addEventListener('click', function(){
            var path = this.parentNode.dataset.path,
                list = this.parentNode.querySelector('ul'),
                label = prompt('label for the new item', '');

            var data = {
                'label': label,
                'target': path,
                'action': 'add'
            }

            var request = new XMLHttpRequest();

            request.onreadystatechange = function() {
                if (request.readyState == 4) {
                    var item = document.createElement('li')
                    item.innerHTML = label
                    item.dataset.path = request.responseText
                    item.addEventListener('click', function(){
                        delete_item(this)
                    })
                    list.appendChild(item)
                }
            }

            request.open('POST', '/', true);
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            request.send(serialize(data));
        })
    })

    var items = document.querySelectorAll('#wrapper > ul > li > ul > li > ul > li')

    items.forEach(function(el){
        el.addEventListener('click', function(){
            delete_item(this)
        })
    })
})

function delete_item(item){
    var del = confirm('delete item?')

    if(del){
        var path = item.dataset.path

        var data = {
            'target': path,
            'action': 'delete'
        }

        var request = new XMLHttpRequest();

        request.onreadystatechange = function() {
            if (request.readyState == 4) {
                item.parentNode.removeChild(item)
            }
        }

        request.open('POST', '/', true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send(serialize(data));
    }
}

function ready(fn) {
    document.readyState != 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn);
}

function serialize(obj) {
    var str = [];
    for(var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}