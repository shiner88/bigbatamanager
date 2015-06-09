Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
};

Date.prototype.toStringDate = function()
{
    return [
            (this.getMonth() + 1).padLeft(),
            this.getDate().padLeft(),
            this.getFullYear()
        ].join('/') + ' ' +
        [
            this.getHours().padLeft(),
            this.getMinutes().padLeft(),
            this.getSeconds().padLeft()
        ].join(':');
};

var ProjectCtrl =
{

    getData : function (content) {
        var json = JSON.parse(content);
        var $table = $('#tableProjects');

        $table.bootstrapTable('load', json);

    },

    /**
     * Funzione per formattare la colonna open
     * @param value
     * @param row - riga del json passato come parametro
     *              - row.projectName: nome del progetto
     *              - row.userProject: utente proprietario del progetto
     * @returns {string} - Html da inserire nella cella
     */
    openColumnFormatter : function (value, row) {

        //'id="' + row.projectName +'">' +

        return '<button type="button" class="btn btn-success btn-open">' +
            '<span class="glyphicon glyphicon-ok" aria-hidden="true" ' +
                  'project="' + row.projectName + '"' +
            'onclick="ProjectCtrl.openProject_Click(\'' + row.projectName + '\')"/>' +
            '</button>';

    },

    deleteColumnFormatter : function (value, row) {
        return '<button type="button" class="btn btn-danger btn-open">' +
            '<span class="glyphicon glyphicon-remove" aria-hidden="true" ' +
            'project="' + row.projectName + '"' +
            'onclick="ProjectCtrl.deleteProject_Click(\'' + row.projectName + '\')"/>' +
            '</button>';
    },



    dateCreationFormatter : function (value, row) {
        var d = new Date(value);
        return d.toStringDate();
    },

    dateLastUpdateFormatter : function (value, row) {
        var d = new Date(value);
        return d.toStringDate();
    },

    deleteProject_Click : function (projectName)
    {

        bootbox.confirm("Are you sure?", function(result) {
            if(result)
                ProjectCtrl.deleteProject(projectName);
        });
    },

    deleteProject : function(projectName)
    {
        /**
         *      success message:
         *      {
         *          status: 0 | >0   0:OK  >0:Error
         *          message: info
         *      }
         */

        var html = "";

        $.ajax({
            type: "POST",
            crossDomain:true,
            dataType: "json",
            url: "http://localhost:8080/delproject",
            data: { projectName: projectName } ,
            success: function(msg)
            {
                if(msg.status == 0)
                {
                    html =
                        '<div class="alert alert-success">' +
                            "Project has been removed" + '<br>' +
                            'Deleted: ' + msg.deletedCount + " items" +
                        '</div>';

                        bootbox.alert(html, function() {
                            window.location.reload();
                        });
                }
                else
                {
                    html = '<div class="alert alert-danger">' + msg.message + '</div>';
                    bootbox.alert(html, function() {
                        window.location.reload();
                    });
                }
            },
            error: function(xhr, status, error)
            {
                console.error("ERR: openProject_Click: " + status + " " + xhr.status + "\n" + error);
                window.location.reload();
            }
        });
    },

    openProject_Click : function (projectName)
    {

        console.log(projectName);

        $.ajax({
            type: "POST",
            crossDomain:true,
            dataType: "json",
            url: "http://localhost:8080/setproject",
            data: { projectName: projectName } ,
            success: function(msg)
            {
                if(msg.status == 200)
                {
                    location.reload();
                }
            },
            error: function(xhr, status, error)
            {
                console.error("ERR: openProject_Click: " + status + " " + xhr.status + "\n" + error);
            }
        });
    }

};
