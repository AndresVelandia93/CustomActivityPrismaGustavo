define(['postmonger'], function (Postmonger) {
    const connection = new Postmonger.Session();

    let payload = {};
    let eventDefinitionKey;
    let schema;
    let dataExtension;


    document.addEventListener('DOMContentLoaded', function() {
        onRender();
    });


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
        if (data) {
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
        schema = data.schema;

        var columns = schema.map(function (column) {
            return column.key.split('.').pop();
        });

        var SelectContacto = document.getElementById('SelectContacto');
        empty(SelectContacto);

        //Cargar Selectores con campos de extensiones de datos
        columns.forEach(function (column) {
            var newOption = new Option(column, column);
            var selectElement = document.getElementById('SelectContacto');
            selectElement.appendChild(newOption);
        });
        
        //Cargar la interface con los datos ya diligenciados
        var inArgs = payload["arguments"].execute.inArguments;
        for(var i = 0; i < inArgs.length; i++) {
			var inArg = inArgs[i];
			var inArgKey = Object.keys(inArg)[0];
            if(inArgKey == 'SelectContacto'){
                var selectContacto = document.getElementById('SelectContacto');
                selectContacto.value = inArgs[i][inArgKey].split('.').pop().replace('}}', '');
            }else{
                if(document.getElementById(inArgKey)){
                    var inputObject = document.getElementById(inArgKey);
                    inputObject.value = inArgs[i][inArgKey];
                }
            }
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
        var selectElement_n1 = document.getElementById('SelectContacto');
        var SelectContacto = selectElement_n1.value;

        var selectElement_n2 = document.getElementById('IdCampana');
        var IdCampana = selectElement_n2.value;

        var selectElement_n3 = document.getElementById('TimeToLive');
        var TimeToLive = selectElement_n3.value;

        var selectElement_n4 = document.getElementById('Categoria');
        var Categoria = selectElement_n4.value;

        var selectElement_n5 = document.getElementById('Title');
        var Title = selectElement_n5.value;

        var selectElement_n6 = document.getElementById('ShortDescription');
        var ShortDescription = selectElement_n6.value;

        var selectElement_n7 = document.getElementById('LongDescription');
        var LongDescription = selectElement_n7.value;

        var selectElement_n8 = document.getElementById('CallToAction');
        var CallToAction = selectElement_n8.value;

        var selectElement_n9 = document.getElementById('CallToActionLabel');
        var CallToActionLabel = selectElement_n9.value;
        
        var selectElement_n10 = document.getElementById('SecondaryCallToAction');
        var SecondaryCallToAction = selectElement_n10.value;
        
        var selectElement_n11 = document.getElementById('SecondaryCallToActionLabel');
        var SecondaryCallToActionLabel = selectElement_n11.value;
        
        var selectElement_n12 = document.getElementById('Nombre');
        var Nombre = selectElement_n12.value;

        var selectElement_n13 = document.getElementById('Modulo');
        var Modulo = selectElement_n13.value;
        
        var GrupoControlador = 'Grupo_Controlador_Push';
     
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

        var inArguments = [];

        inArguments.push({ "SelectContacto": schemaMap[SelectContacto] });
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
        inArguments.push({ "GrupoControlador": schemaMap[GrupoControlador] });

        // Actualiza payload
        payload['arguments'].execute.inArguments = inArguments;
        payload['metaData'].isConfigured = true;

        // Muestra payload en la consola
        //console.log('Payload:', JSON.stringify(payload));

        // Atualiza la atividad con el payload
        connection.trigger('updateActivity', payload);
    }

    function empty(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }
});