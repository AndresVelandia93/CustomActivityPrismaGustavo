define(function (require) {
    var Postmonger = require('postmonger');
    var $ = require('jquery');
    var connection = new Postmonger.Session();
    var payload = {};
    var eventDefinitionKey;
    var schema;
    var dataExtension;
 

  
    $(window).ready(function () {
        connection.trigger('ready');
        connection.trigger('requestInteraction');
    });

    connection.on('initActivity', function (data) {
        if (data && data['arguments'] && data['arguments'].execute.inArguments.length > 0) {
            payload = data;
        }
    });

    connection.on('requestedInteraction', function (settings) {
        eventDefinitionKey = settings.triggers[0].metaData.eventDefinitionKey;
        connection.trigger('requestSchema');
    });

    connection.on('requestedSchema', function (data) {
        //Funcion que permite obtener el esquema de la fuente de datos del Journey
        schema = data['schema'];
        $('#SelectContacto').empty();

        schema.forEach(element => {              
            var option = {value: "{{" + element.key + "}}", text: element.name};
            $('#SelectContacto').append($('<option>', option));
        });

        var inArgs = payload["arguments"].execute.inArguments;
        for(var i = 0; i < inArgs.length; i++) {
			var inArg = inArgs[i];
			var inArgKey = Object.keys(inArg)[0];
			if(document.getElementById(inArgKey)) $('#' + inArgKey).val(inArgs[i][inArgKey]); 
		} 

    });
    
    connection.trigger('requestTriggerEventDefinition');
    connection.on('requestedTriggerEventDefinition',
        function(eventDefinitionModel) {
            if(eventDefinitionModel){
                dataExtension = eventDefinitionModel.dataExtensionName;
            }    
    });

    connection.on('clickedNext', function () {
        save(); 
    });

    connection.on('clickedBack', function () {
        connection.trigger('prevStep');
    });

    function save() {
        var SelectContacto = $('#SelectContacto').val();
        var IdCampana = $('#IdCampana').val();
        var TimeToLive = $('#TimeToLive').val();
        var Categoria = $('#Categoria').val();
        var Title = $('#Title').val();
        var ShortDescription = $('#ShortDescription').val();
        var LongDescription = $('#LongDescription').val();
        var CallToAction = $('#CallToAction').val();
        var CallToActionLabel = $('#CallToActionLabel').val();
        var SecondaryCallToAction = $('#SecondaryCallToAction').val();
        var SecondaryCallToActionLabel = $('#SecondaryCallToActionLabel').val();
        var Nombre = $('#Nombre').val();
        var Modulo = $('#Modulo').val();
        var GrupoControlador = '{{Event.' + eventDefinitionKey + '.Grupo_Controlador}}';
     
        var schemaMap = {};

        schema.forEach(function (column) {
            var columnName = column.key.split('.').pop();    
            var columnValue = '{{Event.' + eventDefinitionKey + '.' + columnName + '}}';    
            schemaMap[columnName] = columnValue;    
        });
  
        // Replace all placeholders in the message
        for (var key in schemaMap) {
            if (schemaMap.hasOwnProperty(key)) {
                    IdCampana = IdCampana.replace(new RegExp('{{' + key + '}}', 'g'), schemaMap[key]);
                    TimeToLive = TimeToLive.replace(new RegExp('{{' + key + '}}', 'g'), schemaMap[key]);
                    Categoria = Categoria.replace(new RegExp('{{' + key + '}}', 'g'), schemaMap[key]);
                    Title = Title.replace(new RegExp('{{' + key + '}}', 'g'), schemaMap[key]);
                    ShortDescription = ShortDescription.replace(new RegExp('{{' + key + '}}', 'g'), schemaMap[key]);
                    LongDescription = LongDescription.replace(new RegExp('{{' + key + '}}', 'g'), schemaMap[key]);
                    CallToAction = CallToAction.replace(new RegExp('{{' + key + '}}', 'g'), schemaMap[key]);
                    CallToActionLabel = CallToActionLabel.replace(new RegExp('{{' + key + '}}', 'g'), schemaMap[key]);
                    SecondaryCallToAction = SecondaryCallToAction.replace(new RegExp('{{' + key + '}}', 'g'), schemaMap[key]);
                    SecondaryCallToActionLabel = SecondaryCallToActionLabel.replace(new RegExp('{{' + key + '}}', 'g'), schemaMap[key]);
                    Nombre = Nombre.replace(new RegExp('{{' + key + '}}', 'g'), schemaMap[key]);
                    Modulo = Modulo.replace(new RegExp('{{' + key + '}}', 'g'), schemaMap[key]);
            }
        }
        var v_AccountID = SelectContacto.split('.').pop().replace("}}", '');
        var v_GrupoControlador = GrupoControlador.split('.').pop().replace("}}", '');

        var inArguments = [];

        inArguments.push({ "SelectContacto": schemaMap[v_AccountID] });
        inArguments.push({ "IdCampana": IdCampana });
        inArguments.push({ "TimeToLive": TimeToLive });
        inArguments.push({ "Categoria": Categoria });
        inArguments.push({ "Title": Title });
        inArguments.push({ "ShortDescription": ShortDescription });
        inArguments.push({ "LongDescription": LongDescription });
        inArguments.push({ "CallToAction": CallToAction });
        inArguments.push({ "CallToActionLabel": CallToActionLabel });
        inArguments.push({ "SecondaryCallToAction": SecondaryCallToAction });
        inArguments.push({ "SecondaryCallToActionLabel": SecondaryCallToActionLabel });
        inArguments.push({ "Nombre": Nombre });
        inArguments.push({ "Modulo": Modulo });
        inArguments.push({ "ExtensionDatos": dataExtension });
        inArguments.push({ "GrupoControlador": schemaMap[v_GrupoControlador] });

        console.log('Payload:', JSON.stringify(inArguments));
        console.log('SelectContacto:', SelectContacto);
        console.log('SelectContacto V2:', v_AccountID);
        console.log('GrupoControlador:', v_GrupoControlador);
        console.log('schemaMap:', JSON.stringify(schemaMap));

        // Atualiza o payload
        payload['arguments'] = payload['arguments'] || {};
        payload['arguments'].execute = payload['arguments'].execute || {};
        payload['arguments'].execute.inArguments = inArguments;
        payload['metaData'] = payload['metaData'] || {};
        payload['metaData'].isConfigured = true;

        // Transforma o payload em JSON
        var jsonPayload = JSON.stringify(payload);

        // Exibe o payload no console
        //console.log('Payload:', jsonPayload);

        // Atualiza a atividade com o payload
        connection.trigger('updateActivity', payload);
    }

});
