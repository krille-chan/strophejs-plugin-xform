/*
This programm is free software under CC creative common licence!
Author: Christian Pauly
*/

/**
* File: strophe.jsonize.js
*/

(function () {

	Strophe.addConnectionPlugin('xform', {
		_connection: null,

		init: function (conn) {
			this._connection = conn;
			Strophe.addNamespace('DATA-FORMS', 'jabber:x:data');
		},


		jsonize: function  ( xml ) {
			var jsonOutput = {};

			// First add all top level attributes
			for ( var i = 0; i < xml.attributes.length; i++ ) {
				jsonOutput [ xml.attributes[i].name ] = xml.attributes[i].value;
			}

			// Check for children with the same name:
			var sameName = {};
			for ( var c1 = 0; c1 < xml.children.length; c1++ ) {
				for ( var c2 = c1+1; c2 < xml.children.length; c2++ ) {
					if ( xml.children[c1].tagName == xml.children[c2].tagName) {
						sameName[xml.children[c2].tagName] = true;
					}
				}
			}

			if ( xml.children.length > 0 ) {
				// Make recursive for the children
				for ( var c = 0; c < xml.children.length; c++ ) {
					var tagName = xml.children[c].tagName;
					if( tagName in sameName ) {

						// Group the children with the same name in an array
						var group = [];
						for ( var i = 0; i < xml.children.length; i++ ) {
							if ( xml.children[i].tagName == tagName ) {
								group.push ( this.jsonize ( xml.children[i] ) );
							}

						}
						jsonOutput [ tagName + "s" ] = group;

					}
					else {
						var attrlist = this.jsonize ( xml.children[ c ] );
						for ( var attr in attrlist ) {
							var newTagName = tagName + "_" + attr;
							while ( newTagName in jsonOutput ) {
								newTagName += ">";
							}
							jsonOutput[ tagName + "_" + attr ] = attrlist [ attr ];
						}
					}
				}
			}
			else if ( xml.innerHTML != "" ){
				// Add the text
				var key = "text";
				while ( key in jsonOutput ) key += ">";
				jsonOutput [ key ] = xml.innerHTML;
			}

			return jsonOutput;
		},



		fieldsToHtml: function ( form ) {
			var formStr = "";
			for( i=0; i < from.length; i++ ) {
				formStr += this.fieldToInput( form[i] );
			}
			return formStr;
		},


		xmlToHtml: function ( iq ) {
			var xmlFields = iq.querySelectorAll("field");
			var fields = [];
			for(i=0; i<xmlFields.length;i++) {
				fields.push({
					"name": xmlFields[i].getAttribute("var"),
					"type": xmlFields[i].getAttribute("type"),
					"label": xmlFields[i].getAttribute("label"),
					"value": this.GetFieldValue(xmlFields[i])
				});
			}
			return this.fieldsToHtml ( fields );
		},


		htmlToXml: function ( labels ) {
			var xmlForm = [];
			for(var i=0; i<labels.length; i++) {
				var name;
				var value;

				if(labels[i].querySelector("input")) {
					name = labels[i].querySelector("input").getAttribute("name");

					if(labels[i].querySelector("input").getAttribute("type") == "checkbox") {
						value = labels[i].querySelector("input").checked;
					}
					else {
						value = labels[i].querySelector("input").value;
						if ( value == undefined || value == null ) value = "";
					}
				}
				else if(labels[i].querySelector("select")) {
					name = labels[i].querySelector("select").getAttribute("name");
					value = labels[i].querySelector("select").value;
				}
				var xml = $.parseXML("<field var='" +
				name +
				"'><value>" +
				value +
				"</value></field>").firstChild;
				xmlForm.push(xml);
			}

			return xmlForm;
		},


		fieldToInput: function(field) {
			var inputStr = "";
			switch(field.type) {
				case "boolean":
				inputStr = '<label>' + field.label + '<select name="' + field.name + '" ><option value="1" ';
				if(field.value == "1") inputStr += 'selected';
				inputStr += '>Ja</option><option value="0" ';
				if(field.value == "0") inputStr += 'selected';
				inputStr += '>Nein</option></select></label>';
				break;
				case "text-single":
				inputStr = '<label>' + field.label + '<input type="text" name="' + field.name + '" value="' + field.value + '"></label>';
				break;
				case "list-single":
				inputStr = '<label>' + field.label + '<select name="' + field.name + '" >';
				for(var i=0; i<field.value.options.length; i++) {
					if(field.value.options[i] == field.value.current)
					inputStr += '<option selected>' + field.value.options[i] + '</option>';
					else
					inputStr += '<option>' + field.value.options[i] + '</option>';
				}
				inputStr += '</select></label>';
				break;
				case "list-multi":
				if(field.value == "") break;
				inputStr = '<label>' + field.label + '<select name="' + field.name + '" >';
				for(var i=0; i<field.value.options.length; i++) {
					if(field.value.options[i] == field.value.current)
					inputStr += '<option selected>' + field.value.options[i] + '</option>';
					else
					inputStr += '<option>' + field.value.options[i] + '</option>';
				}
				inputStr += '</select></label>';
				break;
				default: break;
			}
			return inputStr;
		},



		GetFieldValue: function (field){
			var value = "";
			switch(field.getAttribute("type")){
				case "list-single":
				var options = [];
				var optionElems = field.querySelectorAll("option");
				for(var i=0; i<optionElems.length; i++)
				options.push(optionElems[i].querySelector("value").innerHTML);
				return {
					current: field.lastChild.innerHTML,
					options: options
				}
				case "list-multi":
				var options = [];
				var optionElems = field.querySelectorAll("option");
				if(optionElems.length == 0) return "";
				for(var i=0; i<optionElems.length; i++)
				options.push(optionElems[i].querySelector("value").innerHTML);
				return {
					current: field.lastChild.innerHTML,
					options: options
				}
				default:
				if(field.querySelector("value"))
				return field.querySelector("value").innerHTML;
				else
				return "";
			}
		},

	});
})();
