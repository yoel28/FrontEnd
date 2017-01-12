jQuery.fn.tableToCSV = function() {

    var clean_text = function(text){
        text = text.replace(/"/g, '\\"').replace(/'/g, "\\'");
        return '"'+text+'"';
    };

    $(this).each(function(){
        var table = $(this);
        var caption = $(this).find('caption').text();
        var title = [];
        var rows = [];

        $(this).find('tr').each(function(){
            var data = [];
            $(this).find('th').each(function(){
                //var text = clean_text($(this).text());
                var text = $(this)[0].innerText;
                title.push(text.trim().replace(',','-'));
            });
            $(this).find('td').each(function(){
                //var text = clean_text($(this).text());
                var text = $(this)[0].innerText;
                data.push(text.trim().replace(',','-'));
            });
            data = data.join(";");
            rows.push(data);
        });
        title = title.join(";");
        rows = rows.join("\n");

        var csv = title + rows;
        var uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        var download_link = document.createElement('a');
        download_link.href = uri;
        var ts = new Date().getTime();
        if(caption==""){
            download_link.download = ts+".csv";
        } else {
            download_link.download = caption+"-"+ts+".csv";
        }
        document.body.appendChild(download_link);
        download_link.click();
        document.body.removeChild(download_link);
    });

};
