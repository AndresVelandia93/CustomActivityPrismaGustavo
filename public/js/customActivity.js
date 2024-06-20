define(['postmonger'], (Postmonger) => {
    const connection = new Postmonger.Session();

    let payload = {};
    let eventDefinitionKey;
    let schema;
    let dataExtension;


    $(window).ready(onRender);


    connection.on('initActivity', initialize);

    connection.on('requestedInteraction', onRequestInteraction);

    connection.on('requestedTriggerEventDefinition', onRequestEventDefinition);

    connection.on('requestedSchema', onRequestSchema);

    connection.on('clickedNext', onClickedNext);

    connection.on('clickedBack', onClickedBack);


    //This function executes on render the page
    function onRender() {
        connection.trigger('ready');
        connection.trigger('requestInteraction');
    }

    
    function initialize(data) {
        //Funcion que carga todo el payload de la custom activity en una variable
        if (data && data['arguments'] && data['arguments'].execute.inArguments.length > 0) {
            payload = data;
        }
    }

    function onRequestInteraction(settings){
        eventDefinitionKey = settings.triggers[0].metaData.eventDefinitionKey;
        connection.trigger('requestSchema');
        connection.trigger('requestTriggerEventDefinition');
    }

    function onRequestEventDefinition(eventDefinition) {
        if(eventDefinition){
            dataExtension = eventDefinition.dataExtensionName;
        } 
    }


    function onRequestSchema(data) {
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
    }

    function onClickedNext() {
        save();
    }

    function onClickedBack() {
        connection.trigger('prevStep');
    }
    

    //Function for finish process and save Set Up
    function save() {
        /*
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
        }*/
        //var v_AccountID = SelectContacto.split('.').pop().replace("}}", '');
        //var v_GrupoControlador = GrupoControlador.split('.').pop().replace("}}", '');

        var inArguments = [];

        inArguments.push({ "SelectContacto": "Contacto" });
        inArguments.push({ "IdCampana": "Contacto" });
        inArguments.push({ "TimeToLive": "Contacto" });
        inArguments.push({ "Categoria": "Contacto" });
        inArguments.push({ "Title": "Contacto" });
        inArguments.push({ "ShortDescription": "Contacto" });
        inArguments.push({ "LongDescription": "Contacto" });
        inArguments.push({ "CallToAction": "Contacto" });
        inArguments.push({ "CallToActionLabel": "Contacto" });
        inArguments.push({ "SecondaryCallToAction": "Contacto" });
        inArguments.push({ "SecondaryCallToActionLabel": "Contacto" });
        inArguments.push({ "Nombre": "Contacto" });
        inArguments.push({ "Modulo": "Contacto" });
        inArguments.push({ "ExtensionDatos": "Contacto" });
        inArguments.push({ "GrupoControlador": "Grupo"});

        console.log('Payload:', JSON.stringify(inArguments));
        //console.log('schemaMap:', JSON.stringify(schemaMap));

        // Atualiza o payload
        payload['arguments'] = payload['arguments'] || {};
        payload['arguments'].execute = payload['arguments'].execute || {};
        payload['arguments'].execute.inArguments = inArguments;
        payload['metaData'] = payload['metaData'] || {};
        payload['metaData'].isConfigured = true;

        // Transforma o payload em JSON
        var jsonPayload = JSON.stringify(payload);

        // Exibe o payload no console
        console.log('Payload:', jsonPayload);

        // Atualiza a atividade com o payload
        connection.trigger('updateActivity', payload);
    }
});