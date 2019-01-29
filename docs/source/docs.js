var app = {
    
    init: function() {

        var converter = new showdown.Converter(),
            markdownElement = document.getElementById('markdown-content'),
            text      = markdownElement.innerHTML,
            html      = converter.makeHtml(text);
        
        markdownElement.innerHTML = html;
        markdownElement.style.visibility = 'visible';

    },
    
}

app.init();